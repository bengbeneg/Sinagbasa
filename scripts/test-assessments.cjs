const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const listeners={},calls=[],storage=new Map();
let confirmResult=true,renderCount=0,interval,currentPage='exams';
const sectionControls=[{dataset:{examSection:'4'}},{dataset:{examSection:'0'}}];
const client={rpc:async(name,args)=>{
  calls.push({name,args});
  if(name==='begin_exam')return {data:{id:'attempt',language:args.p_language,started_at:new Date().toISOString(),deadline_at:new Date(Date.now()+3600000).toISOString(),answers:{}}};
  return {data:null,error:null};
},auth:{getSession:async()=>({data:{session:{access_token:'test-token'}}})},from:()=>({select:()=>({eq:()=>({order:async()=>({data:[]})})})})};
const nodes={examStatus:{textContent:''},main:{innerHTML:''},examClock:{textContent:''}};
const context=vm.createContext({
  window:{sinagUser:{id:'student'},sinagProfile:{role:'student'},sinagSupabase:client,addEventListener:(name,fn)=>{(listeners[name]??=[]).push(fn);},scrollTo:()=>{},SINAGBASA_SUPABASE:{url:'https://example.test',publishableKey:'test'}},
  document:{getElementById:id=>nodes[id],querySelector:()=>null,querySelectorAll:selector=>selector==='[data-exam-section]'?sectionControls:[],body:{dataset:{}}},
  localStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)},
  location:{hash:'#exams'},history:{replaceState:()=>{}},
  header:()=>{},render:()=>{renderCount++;},bind:()=>{},route:()=>[currentPage],$:id=>nodes[id],
  confirm:()=>confirmResult,alert:()=>{},console,fetch:async(url,options)=>{
    const payload=JSON.parse(options.body);
    if(payload.action==='results')return {ok:true,text:async()=>JSON.stringify({results:[]})};
    const result=await client.rpc('submit_exam',{p_exam_type:payload.type,p_answers:payload.answers,p_reason:payload.reason});
    return {ok:!result.error,text:async()=>JSON.stringify(result.error?{error:result.error.message}:{result:{id:'attempt',score:2,total_items:30}})};
  },
  setTimeout:()=>{},clearInterval:()=>{},setInterval:fn=>{interval=fn;return 1;}
});
vm.runInContext(fs.readFileSync('SINAGBASA/dist/assessment-content.js','utf8')+'\n'+fs.readFileSync('SINAGBASA/dist/assessments.js','utf8'),context);
const run=code=>vm.runInContext(code,context);
(async()=>{
  const workingRpc=client.rpc,workingFetch=context.fetch;
  run('location.hostname="localhost"');
  assert.equal(run('assessmentEndpoint()'),'https://sinagbasa.vercel.app/api/assessments');
  run('location.hostname="127.0.0.1"');
  assert.equal(run('assessmentEndpoint()'),'https://sinagbasa.vercel.app/api/assessments');
  run('location.hostname="sinagbasa.vercel.app"');
  assert.equal(run('assessmentEndpoint()'),'/api/assessments');
  for(const type of ['pre','post','pre_reading','post_reading']){
    assert.equal(run(`EXAM_BANK.${type}[ASSESSMENTS.${type}.language].length`),30);
    assert.equal(run(`ASSESSMENTS.${type}.seconds`),3600);
    assert.equal(run(`ASSESSMENTS.${type}.maximumPoints`),30);
    assert(run(`EXAM_BANK.${type}[ASSESSMENTS.${type}.language].every(q=>!Object.hasOwn(q,"answer"))`));
  }
  assert.equal(run('testSections.length'),3);
  assert.equal(run('readingSections.length'),6);
  assert(run('readingSections.every(s=>s.passage.length>0)'));
  assert(!/paashs|gates|macginitie/i.test(run('studentExamPage()')));
  assert(!/paashs|gates|macginitie/i.test(fs.readFileSync('SINAGBASA/dist/assessment-content.js','utf8')));
  assert(run('studentExamPage()').includes('Pre-reading'));
  assert(run('studentExamPage()').includes('Post-reading'));
  assert.equal(run('examScoreText({exam_type:"pre",score:2,total_items:30})'),'2 / 30');
  assert.equal(run('examScoreText({exam_type:"pre",score:0,total_items:30})'),'0 / 30');
  assert.equal(run('examScoreText({exam_type:"pre",score:0,total_items:0})'),'Score unavailable / 30');
  await run('startExam("pre_reading","fil")');
  assert.equal(run('examSession.type'),'pre_reading');
  const deadline=run('examSession.deadline');
  run('examSession.answers[0]=1;bind("exams")');
  sectionControls[0].onclick();
  assert(run('activeExamPage()').includes('ANG PILOTO'));
  sectionControls[1].onclick();
  assert(run('activeExamPage()').includes('value="1" checked'));
  assert.equal(run('examSession.deadline'),deadline);
  run('saveExamAnswers()');await run('examSaveQueue');
  assert(calls.some(call=>call.name==='save_exam_answers'&&call.args.p_answers[0]===1));
  await run('finishExam("completed")');
  assert.equal(run('examSession'),null);
  assert.equal(run('getPendingExam()'),null);
  assert(calls.some(call=>call.name==='submit_exam'&&call.args.p_reason==='completed'));
  await run('startExam("pre","en")');
  run('examSession.deadline=Date.now()-1');interval();
  await new Promise(resolve=>setImmediate(resolve));
  assert(calls.some(call=>call.name==='submit_exam'&&call.args.p_reason==='timeout'));
  await run('startExam("pre_reading","fil")');
  run('examSession.answers[2]=3;submitExamOnPageHide()');
  assert.equal(run('getPendingExam().reason'),'exit');
  assert.equal(run('getPendingExam().answers[2]'),3);
  await run('retryExamSubmission()');
  assert.equal(run('getPendingExam()'),null);
  // Browser Back/navigation can be cancelled without losing the running attempt.
  await run('startExam("pre","en")');
  currentPage='home';confirmResult=false;
  listeners.hashchange[0]();
  assert(run('examSession'));
  confirmResult=true;listeners.hashchange[0]();
  await new Promise(resolve=>setImmediate(resolve));
  assert(calls.some(call=>call.name==='submit_exam'&&call.args.p_reason==='navigation'));
  currentPage='exams';
  // A failed submission must retain answers for an idempotent retry.
  client.rpc=async(name,args)=>name==='submit_exam'?{error:{message:'offline'}}:{data:{id:'attempt',language:args?.p_language,started_at:new Date().toISOString(),answers:{}}};
  await run('startExam("pre","en")');
  await run('finishExam("exit")');
  assert(run('getPendingExam()'));
  assert(run('examNotice').includes('waiting to sync'));
  assert.equal(run('examSubmitting'),false);
  context.fetch=async()=>({ok:true,text:async()=>''});
  await run('retryExamSubmission()');
  assert(run('getPendingExam()'));assert(run('examNotice').includes('empty response'));
  context.fetch=async()=>({ok:true,text:async()=>'<html>not an API</html>'});
  await run('retryExamSubmission()');
  assert(run('getPendingExam()'));assert(run('examNotice').includes('invalid response'));
  context.fetch=async()=>({ok:true,text:async()=>'{}'});
  await run('retryExamSubmission()');
  assert(run('getPendingExam()'));assert(run('examNotice').includes('not been confirmed'));
  context.fetch=workingFetch;client.rpc=workingRpc;
  await run('retryExamSubmission()');
  assert.equal(run('getPendingExam()'),null);
  // Sign-out must erase teacher data, and a delayed response must not restore it.
  run('teacherAttempts=[{id:"private"}];profileRows=[{id:"private"}];examToken="old-token";');
  let releaseOwn;
  client.from=()=>({select:()=>({eq:()=>({order:()=>new Promise(resolve=>{releaseOwn=resolve;})})})});
  const pendingLoad=run('loadAssessmentData()');
  await new Promise(resolve=>setImmediate(resolve));
  context.window.sinagUser=null;
  listeners['sinagbasa:signed-out'].forEach(listener=>listener());
  releaseOwn({data:[{id:'stale-private-attempt'}]});
  await pendingLoad;
  assert.equal(run('examAttempts.length+teacherAttempts.length+profileRows.length'),0);
  assert.equal(run('examToken'),null);
  console.log('Assessment checks passed: four banks, sections, navigation, answer retention, shared deadline, autosave, completion, timeout, page exit, and offline retry.');
})().catch(error=>{console.error(error);process.exitCode=1;});
