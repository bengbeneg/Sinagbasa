const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {spawn}=require('node:child_process');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const profiles=[{id:'a',display_name:'Anna Reyes',role:'student'},{id:'b',display_name:'Miguel Santos',role:'student'}];
const attempts=[
 {user_id:'b',exam_type:'pre',language:'en',score:10,total_items:30,duration_seconds:60,started_at:'2026-11-01T09:00:00Z',submitted_at:'2026-11-01T09:01:00Z',submit_reason:'completed'},
 {user_id:'a',exam_type:'pre',language:'en',score:20,total_items:30,duration_seconds:125,started_at:'2026-11-01T10:00:00Z',submitted_at:'2026-11-01T10:02:05Z',submit_reason:'completed'},
 {user_id:'a',exam_type:'post',language:'fil',score:25,total_items:30,duration_seconds:180,started_at:'2026-11-02T10:00:00Z',submitted_at:'2026-11-02T10:03:00Z',submit_reason:'timeout'}
];
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/assessment-theme.css"><style>body{display:block!important;margin:0;padding:24px!important}main{max-width:1250px;margin:auto;min-height:0}</style><body data-page="class-results"><main id="main"></main><script>
let profileRows=${JSON.stringify(profiles)},teacherAttempts=${JSON.stringify(attempts)};
const isTeacherAccount=()=>true,route=()=>['class-results'],$=id=>document.getElementById(id);
const examEsc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const examLabel=type=>type==='pre'?'Pre-test':'Post-test',examScoreText=row=>row.score+' / '+row.total_items;
let teacherResultsPage=()=>'',bind=()=>{};
</script><script src="/activity-analytics.js"></script><script>document.getElementById('main').innerHTML=teacherResultsPage('results');bind('class-results');</script></body></html>`;
const server=http.createServer((req,res)=>{
 if(req.url==='/'){res.setHeader('Content-Type','text/html');return res.end(html)}
 const name=req.url.slice(1);if(!['style.css','assessment-theme.css','activity-analytics.js'].includes(name)){res.statusCode=404;return res.end()}
 res.setHeader('Content-Type',name.endsWith('.css')?'text/css':'application/javascript');res.end(fs.readFileSync(path.join(root,'SINAGBASA/dist',name)));
});
let browser,socket;
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const profile=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'sinagbasa-class-results-'));
 browser=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0',`--user-data-dir=${profile}`],{windowsHide:true,stdio:['ignore','ignore','pipe']});
 const wsUrl=await new Promise((resolve,reject)=>{let output='';browser.stderr.on('data',chunk=>{output+=chunk.toString();const found=output.match(/DevTools listening on (ws:\/\/[^\s]+)/);if(found)resolve(found[1])});browser.on('error',reject);setTimeout(()=>reject(new Error('Chrome startup timed out')),15000).unref();});
 const targets=await (await fetch(wsUrl.replace('ws:','http:').replace(/\/devtools\/browser\/.*/,'/json/list'))).json();
 socket=new WebSocket(targets.find(target=>target.type==='page').webSocketDebuggerUrl);
 await new Promise(resolve=>socket.addEventListener('open',resolve));
 let serial=0;const pending=new Map(),errors=[];
 socket.addEventListener('message',event=>{const value=JSON.parse(event.data);if(value.id){const item=pending.get(value.id);pending.delete(value.id);value.error?item.reject(new Error(value.error.message)):item.resolve(value.result)}if(value.method==='Runtime.exceptionThrown')errors.push(value.params.exceptionDetails.text)});
 const deadline=setTimeout(()=>{console.error('Browser verification timed out');process.exit(1)},30000);deadline.unref();
 const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++serial;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}))});
 const evaluate=async expression=>{const result=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));return result.result.value};
 await call('Page.enable');await call('Runtime.enable');await call('Emulation.setDeviceMetricsOverride',{width:1400,height:1000,deviceScaleFactor:1,mobile:false});
 const loaded=new Promise(resolve=>{socket.addEventListener('message',event=>{if(JSON.parse(event.data).method==='Page.loadEventFired')resolve()})});
 await call('Page.navigate',{url:`http://127.0.0.1:${server.address().port}/`});
 await loaded;
 await evaluate('new Promise((resolve,reject)=>{setTimeout(()=>reject(new Error(document.body.innerText)),5000);const check=()=>document.querySelectorAll("[data-student-results]").length===2?resolve(true):setTimeout(check,50);check()})');
 assert.equal(await evaluate('document.querySelectorAll("#reportBody tr").length'),2);
 await evaluate('document.querySelector("[data-student-results]").click()');
 assert.equal(await evaluate('document.getElementById("classStudentDialog").open'),true);
 assert.equal(await evaluate('document.querySelectorAll("#classStudentRecord tbody tr").length'),2);
 assert.equal(await evaluate('document.getElementById("classStudentDialog").innerText.includes("Miguel Santos")'),false);
 assert(await evaluate('document.getElementById("classStudentRecord").innerText.includes("25 / 30")'));
 assert(await evaluate('document.getElementById("classStudentClose").getBoundingClientRect().bottom <= window.innerHeight'));
 await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 assert(await evaluate('document.getElementById("classStudentDialog").getBoundingClientRect().width <= 360'));
 assert(await evaluate('document.getElementById("classStudentClose").getBoundingClientRect().bottom <= window.innerHeight'));
 assert(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'));
 await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
 await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
 assert.equal(await evaluate('!!document.getElementById("classStudentDialog")'),false);
 assert.equal(await evaluate('document.activeElement.hasAttribute("data-student-results")'),true);
 await evaluate('document.querySelectorAll("[data-student-results]")[1].click()');
 assert(await evaluate('document.getElementById("classStudentRecord").innerText.includes("10 / 30")'));
 await evaluate('document.getElementById("classStudentClose").click()');
 await evaluate('document.getElementById("reportSearch").value="Anna";document.getElementById("reportSearch").dispatchEvent(new Event("input"))');
 assert.equal(await evaluate('document.querySelectorAll("[data-student-results]").length'),1);
 assert.equal(errors.length,0,errors.join('\n'));
 console.log('Browser checks passed: student list, isolated assessment history, second student history, mobile layout, close controls, Escape, focus restoration, and search.');
})().catch(error=>{console.error(error);process.exitCode=1}).finally(()=>{if(socket)socket.close();if(browser)browser.kill();server.close();});
