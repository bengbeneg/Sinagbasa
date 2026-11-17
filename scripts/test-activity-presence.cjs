const vm=require('node:vm');
const fs=require('node:fs');
const assert=require('node:assert/strict');
let now=Date.parse('2026-11-05T16:45:00Z');
const events={},calls=[],storage=new Map();let serial=0;
const exitRequests=[];
class ClockDate extends Date{constructor(...args){super(...(args.length?args:[now]));}static now(){return now;}}
const context=vm.createContext({Date:ClockDate,crypto:{randomUUID:()=>`id-${++serial}`},console,
  window:{sinagUser:{id:'student',last_sign_in_at:new Date(now-600000).toISOString()},SINAGBASA_SUPABASE:{url:'https://example.test',publishableKey:'test'},sinagSupabase:{auth:{getSession:async()=>({data:{session:{access_token:'token'}}})},rpc:async(name,args)=>{calls.push({name,args});return {error:null}}},addEventListener:(name,fn)=>{(events[name]??=[]).push(fn)}},
  document:{visibilityState:'visible',addEventListener:(name,fn)=>{(events[name]??=[]).push(fn)}},
  sessionStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)},
  route:()=>['lessons','2'],setTimeout:()=>{},setInterval:()=>{},fetch:async(url,options)=>{exitRequests.push({url,options,payload:JSON.parse(options.body)});}
});
vm.runInContext(fs.readFileSync('SINAGBASA/dist/activity-presence.js','utf8'),context);
const run=code=>vm.runInContext(code,context);
(async()=>{
  await run('startPresence()');
  assert.equal(calls.length,2);assert(calls.at(-1).args.p_page.includes('/active/'));
  assert.equal(calls[0].args.p_event,'page_view');assert(calls[0].args.p_page.startsWith('resume/'));
  const session=run('presenceSession.id');
  assert.equal(run('window.activityLogPage("login","login")'),`session/${session}`);
  assert.equal(run('window.activityLogPage("page_view","lessons/2")'),`visit/${session}/lessons/2`);
  now+=100000;await run('sendPresence()');assert(calls.at(-1).args.p_page.includes('/idle/'));
  const count=calls.length;now+=30000;await run('sendPresence()');assert.equal(calls.length,count);
  run('notePresenceInteraction({isTrusted:true})');await new Promise(resolve=>setImmediate(resolve));
  assert(calls.at(-1).args.p_page.includes('/active/'));
  context.document.visibilityState='hidden';await run('sendPresence()');assert(calls.at(-1).args.p_page.includes('/idle/'));
  const last=run('presenceLastInteraction');now+=10000;run('notePresenceInteraction({isTrusted:true})');assert.equal(run('presenceLastInteraction'),last);
  context.document.visibilityState='visible';now+=100000;run('notePresenceInteraction({isTrusted:false})');assert.equal(run('presenceLastInteraction'),last);
  events.pagehide[0]();
  assert.equal(exitRequests.length,2);
  assert.equal(exitRequests[0].payload.p_event,'logout');assert(exitRequests[0].payload.p_page.startsWith(`exit/${session}/`));
  assert.equal(exitRequests[0].options.keepalive,true);
  assert(exitRequests[1].payload.p_page.includes('/closed/'));
  await run('startPresence()');
  assert.equal(run('presenceSession.id'),session);
  assert(calls.at(-2).args.p_page.startsWith('resume/'));
  await run('window.finishActivityForLogout()');assert(calls.at(-1).args.p_page.includes('/closed/'));
  const afterLogout=calls.length;await run('sendPresence()');assert.equal(calls.length,afterLogout);
  console.log('Presence checks passed: authenticated heartbeats, session tags, trusted visible interaction, idle transition, hidden tabs, no repeated idle writes, and logout shutdown.');
})().catch(error=>{console.error(error);process.exitCode=1;});
