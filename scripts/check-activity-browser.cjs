const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {spawn}=require('node:child_process');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const now=Date.now(),iso=ms=>new Date(now+ms).toISOString();
const profiles=[{id:'a',display_name:'Anna Reyes',role:'student'},{id:'b',display_name:'Miguel Santos',role:'student'},{id:'c',display_name:'Lara Cruz',role:'student'}];
const logs=[
 {id:1,user_id:'a',event_type:'login',page:'session/one',started_at:iso(-3600000)},
 {id:2,user_id:'a',event_type:'page_view',page:'visit/one/home',started_at:iso(-3500000),finished_at:iso(-3400000),duration_seconds:100},
 {id:3,user_id:'a',event_type:'page_view',page:'visit/one/lessons/2',started_at:iso(-3200000),finished_at:iso(-3000000),duration_seconds:200},
 {id:4,user_id:'b',event_type:'login',page:'session/two',started_at:iso(-7200000)},
 {id:5,user_id:'b',event_type:'page_view',page:'visit/two/games',started_at:iso(-7100000),finished_at:iso(-7000000),duration_seconds:100},
 {id:6,user_id:'c',event_type:'login',page:'session/three',started_at:iso(-86400000)},
 {id:7,user_id:'c',event_type:'logout',page:'session/three',finished_at:iso(-86000000)},
 {id:8,user_id:'a',event_type:'page_view',page:`presence/one/tab-a/${now-3600000}/active/exams`,started_at:iso(-3600000),finished_at:iso(-1000),duration_seconds:2},
 {id:9,user_id:'b',event_type:'page_view',page:`presence/two/tab-b/${now-7200000}/idle/home`,started_at:iso(-7200000),finished_at:iso(-1000),duration_seconds:120}
];
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/assessment-theme.css"><style>body{display:block!important;margin:0;padding:32px!important;background:#f5f7f7}main{max-width:1250px;margin:auto;min-height:0}</style><body data-page="activity-logs"><main id="main"></main><script>
const ACTIVITY_ACTIVE_MS=90000,ACTIVITY_FRESH_MS=75000;
let activityRows=${JSON.stringify(logs)},profileRows=${JSON.stringify(profiles)},teacherAttempts=[];
const isTeacherAccount=()=>true,route=()=>['activity-logs'],$=id=>document.getElementById(id);
const examEsc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
let teacherResultsPage=()=>'',bind=()=>{};
window.sinagSupabase={from(table){let presence=false;const query={select(){return query},not(){presence=false;return query},like(){presence=true;return query},gte(){return query},order(){return query},limit(){return Promise.resolve({data:activityRows.filter(row=>row.page.startsWith('presence/')===presence)})},then(resolve,reject){return Promise.resolve({data:profileRows}).then(resolve,reject)}};return query}};
</script><script src="/activity-analytics.js"></script><script>document.getElementById('main').innerHTML=teacherResultsPage('logs');bind('activity-logs');</script></body></html>`;
const server=http.createServer((req,res)=>{
 if(req.url==='/'){res.setHeader('Content-Type','text/html');return res.end(html)}
 const name=req.url.slice(1);if(!['style.css','assessment-theme.css','activity-analytics.js'].includes(name)){res.statusCode=404;return res.end()}
 res.setHeader('Content-Type',name.endsWith('.css')?'text/css':'application/javascript');res.end(fs.readFileSync(path.join(root,'SINAGBASA/dist',name)));
});
let browser,socket;
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const profile=path.join(root,'scripts/.activity-browser-profile');
 browser=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0',`--user-data-dir=${profile}`],{windowsHide:true,stdio:['ignore','ignore','pipe']});
 const wsUrl=await new Promise((resolve,reject)=>{let output='';browser.stderr.on('data',chunk=>{output+=chunk.toString();const found=output.match(/DevTools listening on (ws:\/\/[^\s]+)/);if(found)resolve(found[1])});browser.on('error',reject);setTimeout(()=>reject(new Error('Chrome startup timed out')),15000).unref();});
 const targets=await (await fetch(wsUrl.replace('ws:','http:').replace(/\/devtools\/browser\/.*/,'/json/list'))).json();
 socket=new WebSocket(targets.find(target=>target.type==='page').webSocketDebuggerUrl);
 await new Promise(resolve=>socket.addEventListener('open',resolve));
 let serial=0;const pending=new Map(),errors=[];
 socket.addEventListener('message',event=>{const value=JSON.parse(event.data);if(value.id){const item=pending.get(value.id);pending.delete(value.id);value.error?item.reject(new Error(value.error.message)):item.resolve(value.result)}if(value.method==='Runtime.exceptionThrown')errors.push(value.params.exceptionDetails.text)});
 const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++serial;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}))});
 const evaluate=async expression=>{const result=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));return result.result.value};
 await call('Page.enable');await call('Runtime.enable');await call('Emulation.setDeviceMetricsOverride',{width:1400,height:1000,deviceScaleFactor:1,mobile:false});
 await call('Page.navigate',{url:`http://127.0.0.1:${server.address().port}/`});
 await evaluate('new Promise(resolve=>{const check=()=>document.querySelectorAll("#sessionRows tr").length===3?resolve(true):setTimeout(check,50);check()})');
 assert.equal(await evaluate('document.querySelectorAll(".status-active").length'),1);
 assert.equal(await evaluate('document.querySelectorAll(".status-idle").length'),1);
 const list=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(root,'scripts/activity-session-list.png'),Buffer.from(list.data,'base64'));
 await evaluate('document.querySelector("[data-session-details]").click()');
 assert.equal(await evaluate('document.getElementById("activitySessionDialog").open'),true);
 assert.equal(await evaluate('document.querySelectorAll("#sessionTimeline li").length'),3);
 assert.equal(await evaluate('document.getElementById("activitySessionDialog").innerText.includes("Miguel Santos")'),false);
 const modal=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(root,'scripts/activity-session-details.png'),Buffer.from(modal.data,'base64'));
  assert(await evaluate('document.getElementById("sessionDetailClose").getBoundingClientRect().bottom <= window.innerHeight'));
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  assert(await evaluate('document.getElementById("activitySessionDialog").getBoundingClientRect().width <= 360'));
  assert(await evaluate('document.getElementById("sessionDetailClose").getBoundingClientRect().bottom <= window.innerHeight'));
  const mobile=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(root,'scripts/activity-session-mobile.png'),Buffer.from(mobile.data,'base64'));
  await call('Emulation.setDeviceMetricsOverride',{width:1400,height:1000,deviceScaleFactor:1,mobile:false});
 await evaluate('document.getElementById("sessionDetailSearch").value="lessons";document.getElementById("sessionDetailSearch").dispatchEvent(new Event("input"))');
 assert.equal(await evaluate('document.querySelectorAll("#sessionTimeline li").length'),1);
 await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
 await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
 assert.equal(await evaluate('!!document.getElementById("activitySessionDialog")'),false);
 assert.equal(await evaluate('document.activeElement.hasAttribute("data-session-details")'),true);
 await evaluate('document.getElementById("sessionSearch").value="Lara";document.getElementById("sessionSearch").dispatchEvent(new Event("input"))');
 assert.equal(await evaluate('document.querySelectorAll("#sessionRows tr").length'),1);
 assert.equal(errors.length,0,errors.join('\n'));
 console.log('Browser checks passed: session rows, live badges, scoped details, timeline search, Escape dismissal, focus restoration, and user filtering.');
})().catch(error=>{console.error(error);process.exitCode=1}).finally(()=>{if(socket)socket.close();if(browser)browser.kill();server.close();});
