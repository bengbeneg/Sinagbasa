const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const now=Date.parse('2026-11-05T16:30:00Z');
const iso=offset=>new Date(now+offset).toISOString();
const context=vm.createContext({
  ACTIVITY_ACTIVE_MS:90000,ACTIVITY_FRESH_MS:75000,
  teacherResultsPage:()=>'',bind:()=>{},window:{addEventListener:()=>{}},document:{visibilityState:'visible'},
  setInterval:()=>{},profileRows:[{id:'a',display_name:'Student <A>',role:'student'},{id:'b',display_name:'Student B',role:'student'}],
  activityRows:[],examEsc:value=>String(value).replaceAll('<','&lt;').replaceAll('>','&gt;'),isTeacherAccount:()=>true,
  route:()=>['activity-logs'],console
});
vm.runInContext(fs.readFileSync('SINAGBASA/dist/activity-analytics.js','utf8'),context);
const rows=[
  {id:1,user_id:'a',event_type:'login',page:'login',started_at:iso(-3600000)},
  {id:2,user_id:'a',event_type:'page_view',page:'home',started_at:iso(-3500000),finished_at:iso(-3400000),duration_seconds:100},
  {id:3,user_id:'a',event_type:'logout',page:'logout',finished_at:iso(-3300000)},
  {id:4,user_id:'a',event_type:'login',page:'session/current',started_at:iso(-120000)},
  {id:5,user_id:'a',event_type:'page_view',page:'visit/current/lessons/2',started_at:iso(-100000),finished_at:iso(-80000),duration_seconds:20},
  {id:6,user_id:'b',event_type:'login',page:'login',started_at:iso(-240000)}
];
const heartbeat=(id,user,session,instance,state,age=10000,idleSeconds=0,start=-120000)=>({id,user_id:user,event_type:'page_view',page:`presence/${session}/${instance}/${now+start}/${state}/lessons%2F2`,started_at:iso(start),finished_at:iso(-age),duration_seconds:idleSeconds});
const presence=[heartbeat(10,'a','current','tab-1','active')];
context.rows=rows;context.presence=presence;context.now=now;
const run=code=>vm.runInContext(code,context);
assert.equal(run('buildActivitySessions(rows,presence).length'),3);
assert.equal(run('buildActivitySessions(rows,presence).find(s=>s.sessionId==="current").events.length'),2);
assert.equal(run('activitySessionStatus(buildActivitySessions(rows,presence).find(s=>s.sessionId==="current"),now).key'),'active');
assert.equal(run('activitySessionStatus(buildActivitySessions(rows,presence).find(s=>s.sessionId==="login-1"),now).key'),'logged-out');
assert.equal(run('activitySessionStatus(buildActivitySessions(rows,presence).find(s=>s.userId==="b"),now).key'),'inactive');
presence.push(heartbeat(11,'a','current','tab-1','idle',5000,120));
assert.equal(run('activitySessionStatus(buildActivitySessions(rows,presence).find(s=>s.sessionId==="current"),now).key'),'idle');
presence.push(heartbeat(12,'a','current','tab-2','active',1000));
assert.equal(run('activitySessionStatus(buildActivitySessions(rows,presence).find(s=>s.sessionId==="current"),now).key'),'active');
presence.push(heartbeat(13,'a','current','tab-2','closed',0));
assert.equal(run('activitySessionStatus(buildActivitySessions(rows,presence).find(s=>s.sessionId==="current"),now).key'),'idle');
assert.equal(run('activitySessionStatus(buildActivitySessions(rows,presence).find(s=>s.sessionId==="current"),now+120000).key'),'inactive');
assert.equal(run('logPageLabel("visit/current/lessons/2")'),'lessons › 2');
assert(run('manilaTime("2026-11-05T16:30:00Z")').includes('Nov 6, 2026'));
assert(run('manilaTime("2026-11-05T16:30:00Z")').includes('12:30:00'));
assert(!run('activitySessionsPage()').includes('Activity dashboard'));
assert(run('activitySessionsPage()').includes('Login time (Manila)'));
// Presence from an already logged-in account joins its historical login by time.
context.oldPresence=[heartbeat(20,'b','resumed','tab-b','active',1000,0,-240000)];
assert.equal(run('buildActivitySessions(rows,oldPresence).filter(s=>s.userId==="b").length'),1);
assert.equal(run('buildActivitySessions(rows,oldPresence).find(s=>s.userId==="b").events.length'),1);
context.exited=[...rows,
  {id:30,user_id:'a',event_type:'page_view',page:'resume/current/doc-one',started_at:iso(-110000),finished_at:iso(-110000)},
  {id:31,user_id:'a',event_type:'logout',page:'exit/current/doc-one',finished_at:iso(-1000)}
];
assert.equal(run('activitySessionStatus(buildActivitySessions(exited,[]).find(s=>s.sessionId==="current"),now).key'),'logged-out');
assert.equal(run('buildActivitySessions(exited,[]).find(s=>s.sessionId==="current").events.at(-1).exitReason'),'Page closed or website exited');
// A reload/resume keeps the same session and cancels its provisional page exit.
context.resumed=[...context.exited,{id:32,user_id:'a',event_type:'page_view',page:'resume/current/doc-two',started_at:iso(0),finished_at:iso(0)}];
assert.equal(run('buildActivitySessions(resumed,[]).find(s=>s.sessionId==="current").finishedAt'),null);
assert.equal(run('buildActivitySessions(resumed,[]).find(s=>s.sessionId==="current").events.some(e=>e.exitReason)'),false);
context.closedAgain=[...context.resumed,{id:33,user_id:'a',event_type:'logout',page:'exit/current/doc-two',finished_at:iso(1000)}];
assert.equal(run('activitySessionStatus(buildActivitySessions(closedAgain,[]).find(s=>s.sessionId==="current"),now+2000).key'),'logged-out');
// An explicit logout remains final even if another tab sends a resume record.
context.explicit=[...context.resumed,{id:34,user_id:'a',event_type:'logout',page:'session/current',finished_at:iso(1000)}];
assert.equal(run('activitySessionStatus(buildActivitySessions(explicit,[]).find(s=>s.sessionId==="current"),now+2000).key'),'logged-out');
console.log('Activity session checks passed: session grouping, isolated histories, Manila dates, real interaction freshness, idle/logout, multiple tabs, and stale status.');
