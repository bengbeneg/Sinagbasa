"use strict";

// Grading keys are deployment secrets, never repository files or browser assets.
const assessmentTypes = ["pre", "post", "pre_reading", "post_reading"];
function loadAnswerKeys() {
  let keys;
  try { keys=JSON.parse(process.env.SINAGBASA_ASSESSMENT_KEYS||""); }
  catch { throw Object.assign(new Error("Private grading configuration is unavailable"),{status:503}); }
  if(!keys||typeof keys!=="object"||assessmentTypes.some(type=>!Array.isArray(keys[type])||keys[type].length!==30||keys[type].some(value=>!Number.isInteger(value)||value < -1||value > 4)))throw Object.assign(new Error("Private grading configuration is invalid"),{status:503});
  return keys;
}
const vm = require("node:vm");
const fs = require("node:fs");
const path = require("node:path");
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../SINAGBASA/dist/supabase-config.js"), "utf8"), context);
const config = context.window.SINAGBASA_SUPABASE;
const MAX_BODY_BYTES = 16384;
const invalidInput = message => Object.assign(new Error(message), {status:400});

function validatePayload(input) {
  let encoded;
  try { encoded=typeof input==="string"?input:JSON.stringify(input); }
  catch { throw invalidInput("Invalid JSON request"); }
  if(typeof encoded!=="string")throw invalidInput("A JSON object is required");
  if(Buffer.byteLength(encoded,"utf8")>MAX_BODY_BYTES)throw Object.assign(new Error("Request is too large"),{status:413});
  let body;
  try { body=JSON.parse(encoded); } catch { throw invalidInput("Invalid JSON request"); }
  if(!body||typeof body!=="object"||Array.isArray(body))throw invalidInput("A JSON object is required");
  if(body.action==="results")return {action:"results"};
  if(body.action!=="submit"||!assessmentTypes.includes(body.type)||!["completed","timeout","exit","navigation"].includes(body.reason))throw invalidInput("Invalid submission");
  if(!body.answers||typeof body.answers!=="object"||Array.isArray(body.answers))throw invalidInput("Invalid answers");
  const answers={};
  for(const [index,value] of Object.entries(body.answers)){
    if(!/^(0|[1-9][0-9]?)$/.test(index)||Number(index)>=30||!Number.isInteger(value)||value<0||value>4)throw invalidInput("Invalid answer index or choice");
    answers[index]=value;
  }
  // Identity, roles, scores, and any other caller-supplied fields are discarded.
  return {action:"submit",type:body.type,reason:body.reason,answers};
}

function grade(type, answers = {}) {
  const answerKeys=loadAnswerKeys();
  const keys = Object.hasOwn(answerKeys,type)?answerKeys[type]:null;
  if (!keys) throw Object.assign(new Error("Unknown assessment"), { status: 400 });
  const score = keys.reduce((sum, key, index) => sum + (key === -1 || (Number.isInteger(answers[index]) && answers[index] === key) ? 1 : 0), 0);
  return { score, total_items: keys.length };
}

async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const origin=req.headers.origin;
  if(origin){
    let allowed=false;
    try{
      const url=new URL(origin);
      allowed=url.origin==="https://sinagbasa.vercel.app" || (["http:","https:"].includes(url.protocol)&&["localhost","127.0.0.1","[::1]"].includes(url.hostname));
    }catch{}
    if(!allowed)return res.status(403).json({error:"This website origin is not allowed."});
    res.setHeader("Access-Control-Allow-Origin",origin);
    res.setHeader("Vary","Origin");
    res.setHeader("Access-Control-Allow-Headers","Authorization, Content-Type");
    res.setHeader("Access-Control-Allow-Methods","POST, OPTIONS");
    res.setHeader("Access-Control-Max-Age","600");
  }
  if(req.method==="OPTIONS")return res.status(204).end();
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "POST required" }); }
  const authorization = req.headers.authorization;
  if (typeof authorization!=="string" || authorization.length>8192 || !/^Bearer\s+\S+$/i.test(authorization)) return res.status(401).json({ error: "Sign in required" });
  const headers = { apikey: config.publishableKey, Authorization: authorization, "Content-Type": "application/json" };
  const request = async (route, options = {}) => {
    const response = await fetch(`${config.url}${route}`, { ...options, headers, signal: AbortSignal.timeout(15000) });
    const text=await response.text();
    let data=null;
    try{data=text.trim()?JSON.parse(text):null;}catch{throw Object.assign(new Error("The database returned an invalid assessment response. Please retry."),{status:502});}
    if (!response.ok) throw Object.assign(new Error(data?.msg || data?.message || "Assessment service unavailable"), { status: response.status });
    return data;
  };
  try {
    const body = validatePayload(req.body);
    const user = await request("/auth/v1/user");
    if (!user?.id) return res.status(401).json({ error: "Sign in required" });
    if (body.action === "results") {
      // Supabase RLS limits this to the student's own rows, or authorized teacher rows.
      const attempts = await request("/rest/v1/exam_attempts?select=id,exam_type,answers,submitted_at,score,total_items&submitted_at=not.is.null");
      if(!Array.isArray(attempts))return res.status(502).json({error:"Assessment results could not be loaded. Please retry."});
      const results = attempts.filter(attempt => assessmentTypes.includes(attempt.exam_type)).map(attempt => ({
        id: attempt.id,
        ...(attempt.total_items > 0 && attempt.score != null ? { score: attempt.score, total_items: 30 } : grade(attempt.exam_type, attempt.answers || {}))
      }));
      return res.status(200).json({ results });
    }
    const owned = await request(`/rest/v1/exam_attempts?select=*&user_id=eq.${encodeURIComponent(user.id)}&exam_type=eq.${encodeURIComponent(body.type)}`);
    const existing = Array.isArray(owned)?owned[0]:null;
    if (!existing) return res.status(409).json({ error: "Assessment has not been started" });
    if (existing.submitted_at) return res.status(200).json({ result: { id: existing.id, ...grade(body.type, existing.answers || {}) } });
    const points = grade(body.type, body.answers);
    // Supply real server-calculated values for legacy RPCs. New RPCs independently grade.
    const result = await request("/rest/v1/rpc/submit_exam", { method: "POST", body: JSON.stringify({
      p_exam_type: body.type, p_answers: body.answers, p_score: points.score, p_total: points.total_items, p_reason: body.reason
    }) });
    let attempt = Array.isArray(result) ? result[0] : result;
    if(!attempt?.id||!attempt.submitted_at){
      // Some legacy RPCs succeed with an empty/204 response. Verify persistence.
      const saved=await request(`/rest/v1/exam_attempts?select=*&user_id=eq.${encodeURIComponent(user.id)}&exam_type=eq.${encodeURIComponent(body.type)}`);
      attempt=Array.isArray(saved)?saved[0]:null;
    }
    if(!attempt?.id||!attempt.submitted_at)return res.status(503).json({error:"Submission has not been confirmed. Your pending answers remain saved; please retry."});
    return res.status(200).json({ result: { id: attempt.id, ...grade(body.type, attempt.answers || body.answers) } });
  } catch (error) {
    return res.status(error.status >= 400 && error.status < 600 ? error.status : 503).json({ error: error.message || "Assessment service unavailable" });
  }
}

module.exports = handler;
module.exports.grade = grade;
module.exports.validatePayload = validatePayload;
