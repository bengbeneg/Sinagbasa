const assert=require('node:assert/strict');
const handler=require('../api/assessments.js');
// Synthetic fixture keys only. These are not assessment answers.
const keys=Object.fromEntries(['pre','post','pre_reading','post_reading'].map(type=>[type,Array.from({length:30},(_,i)=>(i+1)%4)]));
process.env.SINAGBASA_ASSESSMENT_KEYS=JSON.stringify(keys);
const originalFetch=global.fetch;
const attempt={id:'attempt-1',user_id:'student-1',exam_type:'pre',answers:{0:1,1:2,2:0},score:0,total_items:0,submitted_at:'2026-11-05T15:00:00Z'};
const calls=[];
let signedIn=true;
let rpcMode='normal';
const reply=(value,options={})=>({ok:true,status:200,text:async()=>JSON.stringify(value),...options});
global.fetch=async(url,options)=>{
  calls.push({url,options});
  if(url.endsWith('/auth/v1/user'))return reply(signedIn?{id:'student-1'}:{message:'Invalid token'},{ok:signedIn,status:signedIn?200:401});
  if(url.includes('/rest/v1/exam_attempts'))return reply([{...attempt}]);
  if(url.endsWith('/rest/v1/rpc/submit_exam')){
    const body=JSON.parse(options.body);
    if(rpcMode==='empty'){
      attempt.submitted_at='2026-11-05T15:01:00Z';attempt.answers=body.p_answers;
      return reply(null,{status:204,text:async()=>''});
    }
    if(rpcMode==='unconfirmed')return reply(null,{status:204,text:async()=>''});
    return reply({...attempt,answers:body.p_answers,score:body.p_score,total_items:body.p_total,submitted_at:'2026-11-05T15:01:00Z'});
  }
  throw new Error(`Unexpected URL ${url}`);
};
async function request(body,authorization='Bearer test-token',method='POST',origin){
  const result={};
  const res={setHeader:(key,value)=>{(result.headers??={})[key]=value;},status:status=>{result.status=status;return res;},json:value=>{result.body=value;return res;},end:()=>res};
  await handler({method,headers:{authorization,origin},body},res);
  return result;
}
(async()=>{
  for(const origin of ['http://localhost:8000','http://127.0.0.1:8000','http://[::1]:8000']){
    const preflight=await request({},'','OPTIONS',origin);
    assert.equal(preflight.status,204);
    assert.equal(preflight.headers['Access-Control-Allow-Origin'],origin);
  }
  assert.equal((await request({},'','OPTIONS','https://untrusted.example')).status,403);
  for(const type of Object.keys(keys)){
    assert.deepEqual(handler.grade(type,{}),{score:0,total_items:30});
    const answers=Object.fromEntries(keys[type].map((answer,index)=>[index,answer]));
    assert.deepEqual(handler.grade(type,answers),{score:30,total_items:30});
    assert.equal(handler.grade(type,{0:keys[type][0]}).score,1);
  }
  for(const body of ['{bad json',null,[],42,'"text"',
    {action:'submit',type:['pre'],reason:'completed',answers:{}},
    {action:'submit',type:'pre',reason:'completed',answers:{30:0}},
    {action:'submit',type:'pre',reason:'completed',answers:{'01':0}},
    {action:'submit',type:'pre',reason:'completed',answers:{0:'1'}},
    {action:'submit',type:'pre',reason:'completed',answers:{0:-1}},
    {action:'submit',type:'pre',reason:'completed',answers:{0:5}},
    {action:'submit',type:'pre',reason:'completed',answers:{0:1.5}},
    {action:'submit',type:'pre',reason:'completed',answers:{0:{value:1}}},
    {action:'submit',type:"pre' OR 1=1 --",reason:'completed',answers:{}},
    {action:'submit',type:'__proto__',reason:'completed',answers:{}},
    JSON.parse('{"action":"submit","type":"pre","reason":"completed","answers":{"__proto__":0}}')]){
    const before=calls.length;
    assert.equal((await request(body)).status,400,JSON.stringify(body));
    assert.equal(calls.length,before,'Malformed input must not reach Supabase');
  }
  assert.equal((await request({action:'results',padding:'x'.repeat(17000)})).status,413);
  assert.equal(handler.grade('pre',{19:0}).score,1);
  assert.equal(handler.grade('pre',{19:1}).score,0);
  assert.equal((await request({action:'results'},undefined,'GET')).status,405);
  assert.equal((await request({action:'results'},'')).status,401);
  signedIn=false;assert.equal((await request({action:'results'})).status,401);signedIn=true;
  const spoofStart=calls.length;
  await request({action:'submit',type:'pre',answers:{},reason:'completed',user_id:'victim-id',id:'victim-attempt',role:'teacher'});
  const spoofCalls=calls.slice(spoofStart);
  assert(spoofCalls.some(call=>call.url.includes('user_id=eq.student-1')));
  assert(!spoofCalls.some(call=>call.url.includes('victim-id')||call.url.includes('victim-attempt')),'Client object IDs must not override authenticated ownership');
  const repaired=await request({action:'results'});
  assert.equal(repaired.status,200);
  assert.deepEqual(repaired.body.results,[{id:'attempt-1',score:2,total_items:30}]);
  assert(!JSON.stringify(repaired.body).includes('answers'));
  attempt.submitted_at=null;
  for(const reason of ['completed','timeout','exit','navigation']){
    const response=await request({action:'submit',type:'pre',answers:{0:1,1:2,2:0},reason});
    assert.equal(response.status,200);
    assert.equal(response.body.result.score,2);
    assert.equal(response.body.result.total_items,30);
    const rpc=calls.filter(call=>call.url.endsWith('/rpc/submit_exam')).at(-1);
    const payload=JSON.parse(rpc.options.body);
    assert.equal(payload.p_score,2);assert.equal(payload.p_total,30);assert.equal(payload.p_reason,reason);
    assert(calls.some(call=>call.url.includes('user_id=eq.student-1')));
  }
  attempt.submitted_at='2026-11-05T15:00:00Z';
  const before=calls.filter(call=>call.url.endsWith('/rpc/submit_exam')).length;
  const repeated=await request({action:'submit',type:'pre',answers:{},reason:'completed'});
  assert.equal(repeated.body.result.score,2);
  assert.equal(calls.filter(call=>call.url.endsWith('/rpc/submit_exam')).length,before);
  attempt.submitted_at=null;rpcMode='empty';
  const emptySuccess=await request({action:'submit',type:'pre',answers:{0:1},reason:'completed'});
  assert.equal(emptySuccess.status,200);assert.equal(emptySuccess.body.result.score,1);
  attempt.submitted_at=null;rpcMode='unconfirmed';
  const unconfirmed=await request({action:'submit',type:'pre',answers:{0:1},reason:'completed'});
  assert.equal(unconfirmed.status,503);assert(unconfirmed.body.error.includes('not been confirmed'));
  delete process.env.SINAGBASA_ASSESSMENT_KEYS;
  assert.throws(()=>handler.grade('pre',{}),/Private grading configuration is unavailable/);
  process.env.SINAGBASA_ASSESSMENT_KEYS=JSON.stringify({pre:[0]});
  assert.throws(()=>handler.grade('pre',{}),/Private grading configuration is invalid/);
  process.env.SINAGBASA_ASSESSMENT_KEYS=JSON.stringify(keys);
  console.log('Private grading checks passed: empty, partial and full attempts; all submission reasons; legacy 0/0 recovery; authentication; unchanged locked attempts.');
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>{global.fetch=originalFetch;});
