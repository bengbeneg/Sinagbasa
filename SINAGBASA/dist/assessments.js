"use strict";

let examAttempts = [], examSession = null, examTimer = null, teacherAttempts = [], activityRows = [], profileRows = [];
let activityPage = "", activityStarted = Date.now();
let assessmentLoadedFor = null;
let loginLoggedFor = null, reportRefreshToken = 0;
const isTeacherAccount = () => window.sinagProfile?.role === "teacher";
const examEsc = (v = "") => String(v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c]);
const examLabel = type => ASSESSMENTS[type]?.label || type;
let examStarting = false, examSubmitting = false, examToken = null, examNotice = "", examSaveQueue = Promise.resolve(), examPendingMemory = null;

async function loadAssessmentData() {
  if (!window.sinagSupabase || !window.sinagUser) return;
  const userId = window.sinagUser.id;
  await window.sinagSupabase.rpc("expire_own_exams");
  if (window.sinagUser?.id !== userId) return;
  const own = await window.sinagSupabase.from("exam_attempts").select("*").eq("user_id", window.sinagUser.id).order("started_at");
  if (window.sinagUser?.id !== userId) return;
  if (!own.error) examAttempts = own.data || [];
  if (isTeacherAccount()) {
    const [attempts, logs, profiles, emails] = await Promise.all([
      window.sinagSupabase.from("exam_attempts").select("*").order("started_at", {ascending:false}),
      window.sinagSupabase.from("activity_logs").select("*").not("page","like","presence/%").order("id", {ascending:false}).limit(1000),
      window.sinagSupabase.from("profiles").select("id,display_name,role"),
      window.sinagSupabase.rpc("class_student_emails"),
    ]);
    if (window.sinagUser?.id !== userId) return;
    if (!attempts.error) teacherAttempts = attempts.data || [];
    if (!logs.error) activityRows = (logs.data || []).sort((a,b)=>{
      const timeOf=row=>new Date(row.finished_at||row.started_at||0).getTime();
      return timeOf(b)-timeOf(a)||Number(b.id)-Number(a.id);
    });
    if (!profiles.error) profileRows = profiles.data || [];
    window.sinagClassStudentEmailError=!!emails.error;
    if (!emails.error) window.sinagClassStudentEmails=emails.data||[];
  }
  try {
    const { results } = await assessmentApi({action:"results"});
    if (window.sinagUser?.id !== userId) return;
    const scores = new Map(results.map(result=>[result.id,result]));
    const apply = attempt => scores.has(attempt.id) ? {...attempt,...scores.get(attempt.id)} : attempt;
    examAttempts=examAttempts.map(apply);teacherAttempts=teacherAttempts.map(apply);
  } catch(error) { console.error("Assessment score load failed",error); }
}
window.addEventListener("sinagbasa:signed-out",()=>{
  examAttempts=[];teacherAttempts=[];activityRows=[];profileRows=[];
  assessmentLoadedFor=null;loginLoggedFor=null;reportRefreshToken++;
  examSession=null;examToken=null;examPendingMemory=null;clearInterval(examTimer);
  window.sinagClassStudentEmails=[];
});

function examScoreText(attempt) {
  const maximum=ASSESSMENTS[attempt.exam_type]?.maximumPoints || 30;
  const score=attempt.score!=null && attempt.total_items>0 ? attempt.score : "Score unavailable";
  return `${score} / ${maximum}`;
}

function studentExamPage() {
  if (examSession) return activeExamPage();
  const card = (type, config) => {
    const attempt = examAttempts.find(row => row.exam_type === type);
    const blocked = config.prerequisite && !examAttempts.some(row => row.exam_type === config.prerequisite && row.submitted_at);
    return `<article class="exam-card"><p class="eyebrow">${examEsc(config.source)}</p><h2>${config.label}</h2><p>30 questions · ${config.maximumPoints} points maximum · ${config.seconds / 60} minutes · ${config.language === "en" ? "English" : "Filipino"}</p><ul class="exam-section-list">${config.sections.map(section=>`<li>${examEsc(section.title)} <small>(${section.questions.length})</small></li>`).join("")}</ul>${attempt?.submitted_at ? `<strong class="exam-score">${examScoreText(attempt)}</strong><p>Submitted ${new Date(attempt.submitted_at).toLocaleString()} · ${examEsc(attempt.submit_reason)}</p>` : `<p>One attempt only. Answers lock on submission. Leaving the assessment submits it automatically.</p><div class="exam-language"><button data-exam-start="${type}" data-lang="${config.language}" ${blocked || examStarting || examSubmitting ? "disabled" : ""}>${attempt ? "Continue assessment" : "Start assessment"}</button></div>${blocked ? `<small>Complete ${examLabel(config.prerequisite)} first.</small>` : ""}`}</article>`;
  };
  return `<section class="exam-page"><div class="exam-heading"><span class="assessment-heading-icon" aria-hidden="true">✓</span><p class="eyebrow">ASSESSMENTS</p><h1>Tests and reading assessments</h1><p>Results are private to you and your teacher. Go back between sections while the timer runs. Leaving, refreshing, or closing the page submits and locks your assessment.</p></div><h2>Pre-test and Post-test</h2><div class="exam-grid">${card("pre",ASSESSMENTS.pre)}${card("post",ASSESSMENTS.post)}</div><h2>Pre-reading and Post-reading</h2><div class="exam-grid">${card("pre_reading",ASSESSMENTS.pre_reading)}${card("post_reading",ASSESSMENTS.post_reading)}</div><div id="examStatus" role="status" aria-live="polite">${examEsc(examNotice)}</div><button id="examRetry" class="secondary" ${getPendingExam() ? "" : "hidden"}>Retry saving submission</button></section>`;
}

function activeExamPage() {
  const config=ASSESSMENTS[examSession.type], bank=EXAM_BANK[examSession.type][examSession.language];
  const section=config.sections[examSession.section], left=Math.max(0,Math.ceil((examSession.deadline-Date.now())/1000));
  const offset=config.sections.slice(0,examSession.section).reduce((n,s)=>n+s.questions.length,0);
  const answered=Object.keys(examSession.answers).length;
  return `<section class="exam-active"><div class="exam-active-heading"><div><p class="eyebrow">${config.label} · ${examSession.language === "fil" ? "FILIPINO" : "ENGLISH"}</p><h1>${examEsc(section.title)}</h1><p>${answered} / ${bank.length} answered · Section ${examSession.section+1} / ${config.sections.length}</p></div><div class="exam-clock" role="timer" aria-label="Time remaining"><strong id="examClock">${Math.floor(left/60)}:${String(left%60).padStart(2,"0")}</strong><small>Time remaining</small></div></div><p class="exam-warning">The timer continues between sections. Leaving, refreshing, or closing submits and locks your assessment. Unanswered questions receive zero points.</p><nav class="exam-sections" aria-label="Assessment sections">${config.sections.map((s,index)=>`<button type="button" data-exam-section="${index}" ${index===examSession.section?'aria-current="step"':""}>${index+1}. ${examEsc(s.title)}</button>`).join("")}</nav><div id="examSaveStatus" role="status" aria-live="polite"></div><article class="exam-passage" lang="${config.language}"><h2>${examEsc(section.title)}</h2><p>${examEsc(section.directions)}</p>${section.passage?`<div class="exam-reading-text">${examEsc(section.passage)}</div>`:""}</article><form id="examForm" lang="${config.language}">${section.questions.map((q,local)=>{
    const i=offset+local,item=bank[i];
    return `${item.passage?`<div class="exam-passage exam-reading-text">${examEsc(item.passage)}</div>`:""}<fieldset><legend>${config.verbatim ? "" : `${i+1}. `}${examEsc(item.question)}</legend>${item.choices.map((choice,j)=>`<label><input type="radio" name="q${i}" value="${j}" ${examSession.answers[i]===j?"checked":""}> ${config.verbatim ? "" : `${String.fromCharCode(65+j)}. `}${examEsc(choice)}</label>`).join("")}</fieldset>`;
  }).join("")}<div class="exam-actions"><button type="button" data-exam-section="${examSession.section-1}" ${examSession.section===0?"disabled":""} class="secondary">Back to previous section</button>${examSession.section<config.sections.length-1?`<button type="button" data-exam-section="${examSession.section+1}" class="primary">Next section</button>`:""}<button class="primary" type="submit">Submit and lock assessment</button><button class="secondary" id="examExit" type="button">Exit and submit</button></div></form></section>`;
}

const pendingExamKey=()=>`sinagbasa-exam-pending:${window.sinagUser?.id}`;
function getPendingExam(){try{return JSON.parse(localStorage.getItem(pendingExamKey())||"null") || (examPendingMemory?.userId===window.sinagUser?.id?examPendingMemory:null);}catch{return examPendingMemory?.userId===window.sinagUser?.id?examPendingMemory:null;}}
function keepPendingExam(session,reason){const pending={userId:window.sinagUser?.id,type:session.type,answers:{...session.answers},reason};examPendingMemory=pending;try{localStorage.setItem(pendingExamKey(),JSON.stringify(pending));}catch{}return pending;}
function examPayload(pending){return {action:"submit",type:pending.type,answers:pending.answers,reason:pending.reason};}
function assessmentEndpoint(){
  return ["localhost","127.0.0.1","[::1]"].includes(location.hostname)
    ? "https://sinagbasa.vercel.app/api/assessments"
    : "/api/assessments";
}
async function assessmentApi(payload){
  const {data}=await window.sinagSupabase.auth.getSession();
  examToken=data.session?.access_token;
  if(!examToken)throw new Error("Sign in to view or submit assessment scores.");
  const response=await fetch(assessmentEndpoint(),{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${examToken}`},body:JSON.stringify(payload)});
  const text=await response.text();
  let result;
  try{result=text.trim()?JSON.parse(text):null;}catch{throw new Error("The assessment service returned an invalid response. Your pending answers are still saved; try again shortly.");}
  if(!result)throw new Error("The assessment service returned an empty response. Your pending answers are still saved; try again shortly.");
  if(!response.ok)throw new Error(result.error || "Assessment service unavailable");
  if(payload.action==="results"&&!Array.isArray(result.results))throw new Error("Assessment scores could not be loaded. Try again shortly.");
  if(payload.action==="submit"&&(!result.result?.id||!Number.isInteger(result.result.score)||result.result.total_items!==30))throw new Error("Submission has not been confirmed. Your pending answers are still saved; try again shortly.");
  return result;
}
async function retryExamSubmission(){
  const pending=getPendingExam(); if(!pending||examSubmitting)return;
  examSubmitting=true;
  try{
    await assessmentApi(examPayload(pending));
    examPendingMemory=null;
    try{localStorage.removeItem(pendingExamKey());}catch{}
    examNotice=`${examLabel(pending.type)} submitted and locked.`;
    await loadAssessmentData();
  }catch(error){examNotice=`Submission is waiting to sync: ${error.message}. Reconnect and choose Retry saving submission.`;}
  finally{examSubmitting=false;render();}
}
async function startExam(type,language){
  if(examStarting||examSubmitting||examSession)return;
  if(getPendingExam()){await retryExamSubmission();if(getPendingExam())return;}
  const config=ASSESSMENTS[type];
  if(!config||config.language!==language)return;
  if(!confirm(`Start ${config.label}? You have ${config.seconds/60} minutes for all sections. You can go back between sections. Leaving, refreshing, or closing submits and permanently locks this attempt.`))return;
  examStarting=true;render();
  try{
    const {data,error}=await window.sinagSupabase.rpc("begin_exam",{p_exam_type:type,p_language:language});
    if(error)throw error;
    if(data.submitted_at){await loadAssessmentData();examNotice="This assessment was already submitted.";return;}
    const auth=await window.sinagSupabase.auth.getSession();examToken=auth.data.session?.access_token;
    examSession={type,language:data.language,attempt:data,deadline:new Date(data.deadline_at||new Date(data.started_at).getTime()+config.seconds*1000).getTime(),answers:{...data.answers},section:0};
    examNotice="";startExamClock();
  }catch(error){examNotice=error.message;}
  finally{examStarting=false;render();}
}
function saveExamAnswers(){
  if(!examSession)return;
  const session=examSession,answers={...session.answers};
  examSaveQueue=examSaveQueue.catch(()=>{}).then(async()=>{
    if(examSession!==session)return;
    const {error}=await window.sinagSupabase.rpc("save_exam_answers",{p_exam_type:session.type,p_answers:answers});
    const node=document.getElementById("examSaveStatus");
    if(node)node.textContent=error?"Answers remain on this page. Cloud save unavailable; submission will retry when connected.":"Answers saved";
  }).catch(()=>{const node=document.getElementById("examSaveStatus");if(node)node.textContent="Cloud save unavailable. Keep this page open until connected.";});
}
async function finishExam(reason="completed"){
  if(!examSession||examSubmitting)return;
  keepPendingExam(examSession,reason);
  examSession=null;clearInterval(examTimer);
  await retryExamSubmission();
}
function startExamClock(){clearInterval(examTimer);examTimer=setInterval(()=>{
  if(!examSession)return;
  const left=Math.max(0,Math.ceil((examSession.deadline-Date.now())/1000)),node=document.getElementById("examClock");
  if(node)node.textContent=`${Math.floor(left/60)}:${String(left%60).padStart(2,"0")}`;
  if(!left)finishExam("timeout");
},250);}
function submitExamOnPageHide(){
  if(!examSession)return;
  const pending=keepPendingExam(examSession,"exit");
  examSession=null;clearInterval(examTimer);
  if(examToken)fetch(assessmentEndpoint(),{method:"POST",keepalive:true,headers:{"Content-Type":"application/json",Authorization:`Bearer ${examToken}`},body:JSON.stringify(examPayload(pending))}).catch(()=>{});
}

function teacherResultsPage(kind) {
  const rows=kind==="logs"?activityRows:teacherAttempts;
  const nameOf=id=>profileRows.find(p=>p.id===id)?.display_name||id;
  const body=kind==="logs"?rows.map(r=>`<tr><td>${examEsc(nameOf(r.user_id))}</td><td>${examEsc(r.event_type)}</td><td>${examEsc(r.page)}</td><td>${r.started_at?new Date(r.started_at).toLocaleString():"—"}</td><td>${r.finished_at?new Date(r.finished_at).toLocaleString():"—"}</td><td>${r.event_type==="page_view"?`${r.duration_seconds}s`:"—"}</td></tr>`).join(""):rows.map(r=>`<tr><td>${examEsc(nameOf(r.user_id))}</td><td>${examLabel(r.exam_type)}</td><td>${r.language}</td><td>${new Date(r.started_at).toLocaleString()}</td><td>${r.duration_seconds??"—"}s</td><td>${examScoreText(r)}</td></tr>`).join("");
  return `<section class="teacher-report"><div class="exam-heading"><p class="eyebrow">TEACHER STUDIO</p><h1>${kind==="logs"?"Activity logs":"Class results"}</h1><p>${kind==="logs"?"Review discrete sign-ins, sign-outs, and completed page activity across SINAGBASA.":"Review every student's assessment status, duration, and score."}</p></div><div class="report-tools"><input id="reportSearch" type="search" placeholder="Search results"><select id="reportFilter"><option value="">All records</option>${kind==="logs"?'<option value="login">Logins</option><option value="logout">Logouts</option><option value="page_view">Page activity</option>':'<option value="Pre-test">Pre-test</option><option value="Post-test">Post-test</option><option value="Pre-reading">Pre-reading</option><option value="Post-reading">Post-reading</option>'}</select></div><div class="report-table"><table><thead><tr>${kind==="logs"?"<th>User</th><th>Event</th><th>Page</th><th>Time started</th><th>Time finished</th><th>Duration</th>":"<th>Student</th><th>Exam</th><th>Language</th><th>Started</th><th>Duration</th><th>Score</th>"}</tr></thead><tbody id="reportBody">${body}</tbody></table></div></section>`;
}

const assessmentHeader=header; header=function(){assessmentHeader();const nav=document.querySelector("header nav");if(!nav)return;const current=route()[0];nav.insertAdjacentHTML("beforeend",`<a href="#exams" title="Exams" aria-label="Exams" data-label="Exams" ${current==="exams"?'aria-current="page"':""}><span class="side-icon" aria-hidden="true">✓</span><span class="side-label">Exams</span></a>${isTeacherAccount()?`<a href="#class-results" title="Class results" aria-label="Class results" data-label="Class results" ${current==="class-results"?'aria-current="page"':""}><span class="side-icon" aria-hidden="true">▦</span><span class="side-label">Class results</span></a><a href="#activity-logs" title="Activity logs" aria-label="Activity logs" data-label="Activity logs" ${current==="activity-logs"?'aria-current="page"':""}><span class="side-icon" aria-hidden="true">≡</span><span class="side-label">Activity logs</span></a>`:""}`);};
const assessmentRender=render;
render=function(){
  const [page]=route();
  if(!["exams","class-results","activity-logs"].includes(page)) return assessmentRender();
  header(); document.body.dataset.page=page;
  const reportKind=page==="activity-logs"?"logs":"results";
  $("main").innerHTML=page==="exams"?studentExamPage():isTeacherAccount()?teacherResultsPage(reportKind):"<h1>Teacher access required</h1>";
  bind(page);
  if(page!=="exams"&&isTeacherAccount()){
    const token=++reportRefreshToken;
    setTimeout(async()=>{
      await loadAssessmentData();
      if(token!==reportRefreshToken||route()[0]!==page)return;
      $("main").innerHTML=teacherResultsPage(reportKind);
      bind(page);
    },1200);
  }
};
const assessmentBind=bind;
bind=function(page,id){
  assessmentBind(page,id);
  document.querySelectorAll("[data-exam-start]").forEach(button=>button.onclick=()=>startExam(button.dataset.examStart,button.dataset.lang));
  document.querySelectorAll("[data-exam-section]").forEach(button=>button.onclick=()=>{
    if(!examSession)return;
    const section=Number(button.dataset.examSection);
    if(section<0||section>=ASSESSMENTS[examSession.type].sections.length)return;
    if(Date.now()>=examSession.deadline)return void finishExam("timeout");
    examSession.section=section;render();window.scrollTo({top:0});
  });
  const form=$("examForm");
  if(form){
    form.onchange=event=>{
      if(!examSession||!event.target.name?.startsWith("q"))return;
      if(Date.now()>=examSession.deadline)return void finishExam("timeout");
      examSession.answers[Number(event.target.name.slice(1))]=Number(event.target.value);saveExamAnswers();
    };
    form.onsubmit=event=>{event.preventDefault();if(confirm("Submit now? Unanswered questions receive zero points. Your answers will be permanently locked."))finishExam("completed");};
    $("examExit").onclick=()=>{if(confirm("Exit and submit this assessment? Your answers will be permanently locked."))finishExam("exit");};
  }
  if($("examRetry"))$("examRetry").onclick=retryExamSubmission;
  const search=$("reportSearch"),filter=$("reportFilter");
  if(search&&filter)search.oninput=filter.onchange=()=>document.querySelectorAll("#reportBody tr").forEach(row=>row.hidden=!row.innerText.toLowerCase().includes(search.value.toLowerCase())||!row.innerText.includes(filter.value));
};
window.addEventListener("hashchange",()=>{
  if(examSession&&route()[0]!=="exams"){
    if(confirm("Leaving will submit and permanently lock this assessment. Continue?"))finishExam("navigation");
    else {history.replaceState(null,"","#exams");render();}
  }
});
window.addEventListener("beforeunload",event=>{if(examSession){event.preventDefault();event.returnValue="";}});
window.addEventListener("pagehide",submitExamOnPageHide);
window.addEventListener("pageshow",event=>{if(event.persisted)retryExamSubmission();});
window.addEventListener("online",retryExamSubmission);
window.addEventListener("sinagbasa:authenticated",async()=>{await retryExamSubmission();});
window.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&examSession&&Date.now()>=examSession.deadline)finishExam("timeout");});
async function writeActivity(eventType,page,startedAt,duration){
  if(!window.sinagSupabase||!window.sinagUser)return;
  const {error}=await window.sinagSupabase.rpc("record_activity",{p_event:eventType,p_page:window.activityLogPage?.(eventType,page)||page,p_started_at:startedAt?new Date(startedAt).toISOString():null,p_duration:Math.max(0,Math.round(duration))});
  if(error)console.error(`${eventType} activity failed`,error);
}
async function initializeActivitySession(){
  if(!window.sinagUser||assessmentLoadedFor===window.sinagUser.id)return;
  assessmentLoadedFor=window.sinagUser.id;
  await loadAssessmentData();
  if(route()[0]==="exams")render();
  activityPage=route().join("/")||"home";
  activityStarted=Date.now();
}
async function recordLoginEvent(event){
  const user=event.detail?.user||window.sinagUser;
  if(!user||loginLoggedFor===user.id)return;
  loginLoggedFor=user.id;
  await writeActivity("login","login",Date.now(),0);
}
async function recordPageTransition(){
  if(!window.sinagUser)return;
  const nextPage=route().join("/")||"home",now=Date.now();
  if(activityPage&&activityPage!==nextPage)await writeActivity("page_view",activityPage,activityStarted,(now-activityStarted)/1000);
  activityPage=nextPage;
  activityStarted=now;
}
window.addEventListener("sinagbasa:login",recordLoginEvent);
window.addEventListener("sinagbasa:authenticated",initializeActivitySession);
window.addEventListener("hashchange",recordPageTransition);
window.finishActivityForLogout=async function(){
  const now=Date.now();
  if(activityPage){
    await writeActivity("page_view",activityPage,activityStarted,(now-activityStarted)/1000);
    activityPage="";
  }
  if(examSession)await finishExam("exit");
  await writeActivity("logout","logout",null,0);
};
setTimeout(initializeActivitySession,0);
