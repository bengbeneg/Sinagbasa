"use strict";

const logTime=row=>new Date(row.finished_at||row.started_at||0).getTime();
const logEventLabel=value=>({login:"Login",logout:"Logout",page_view:"Page visit"})[value]||value;
const logDuration=seconds=>{const value=Math.max(0,Math.round(Number(seconds)||0));return value<60?`${value}s`:`${Math.floor(value/60)}m${value%60?` ${value%60}s`:""}`;};
const logName=id=>profileRows.find(profile=>profile.id===id)?.display_name||id;
const manilaTime=value=>value?new Intl.DateTimeFormat("en-PH",{timeZone:"Asia/Manila",year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"2-digit",second:"2-digit"}).format(new Date(value)):"—";
function logPageLabel(value){
  let page=String(value||"Unknown");
  if(page.startsWith("visit/"))page=page.split("/").slice(2).join("/");
  if(page.startsWith("session/"))return "Account session";
  return page==="login"?"Login page":page==="logout"?"Logout":page.split("/").map(part=>part.replace(/-/g," ")).join(" › ");
}
let recentPresenceRows=[],activityListState={search:"",status:"",page:1,size:25};
let activitySelectedKey=null,activityReturnFocus=null,activityRefreshBusy=false;

function buildActivitySessions(rows,presenceRows=[]){
  const sessions=new Map();
  const ensure=(user,id,startedAt)=>{
    const key=`${user}:${id}`;
    if(!sessions.has(key))sessions.set(key,{key,userId:user,sessionId:id,startedAt:startedAt||null,finishedAt:null,events:[],presence:[],lifecycle:[]});
    const session=sessions.get(key);if(!session.startedAt&&startedAt)session.startedAt=startedAt;
    return session;
  };
  for(const row of presenceRows){
    const parts=String(row.page).split("/");
    if(parts[0]!=="presence"||parts.length<6||!Number.isFinite(Number(parts[3])))continue;
    let page=parts.slice(5).join("/");try{page=decodeURIComponent(page);}catch{}
    const session=ensure(row.user_id,parts[1],new Date(Number(parts[3])).toISOString());
    session.presence.push({...row,instanceId:parts[2],state:parts[4],currentPage:page});
  }
  const ordered=[...rows].filter(row=>!String(row.page).startsWith("presence/")).sort((a,b)=>{
    const eventTime=row=>new Date(String(row.page).startsWith("resume/")?row.finished_at||row.started_at:row.event_type==="page_view"?row.started_at||row.finished_at:row.event_type==="login"?row.started_at:row.finished_at||row.started_at).getTime();
    return eventTime(a)-eventTime(b)||Number(a.id)-Number(b.id);
  });
  for(const row of ordered){
    const parts=String(row.page||"").split("/");
    const tagged=["session","visit","exit","resume"].includes(parts[0])&&parts[1];
    let session;
    if(tagged)session=ensure(row.user_id,parts[1],row.event_type==="login"?row.started_at:null);
    else if(row.event_type==="login"){
      session=[...sessions.values()].find(item=>item.userId===row.user_id&&!item.loginId&&item.startedAt&&Math.abs(Date.parse(item.startedAt)-Date.parse(row.started_at))<5000);
      if(!session)session=ensure(row.user_id,`login-${row.id}`,row.started_at);
    }else{
      const time=Date.parse(row.started_at||row.finished_at);
      session=[...sessions.values()].filter(item=>item.userId===row.user_id&&item.startedAt&&Date.parse(item.startedAt)<=time&&(!item.finishedAt||Date.parse(item.finishedAt)>=time)).sort((a,b)=>Date.parse(b.startedAt)-Date.parse(a.startedAt))[0];
      if(!session)session=ensure(row.user_id,"earlier",null);
    }
    if(row.event_type==="login"){session.startedAt=row.started_at;session.loginId=row.id;}
    if(parts[0]==="exit"||parts[0]==="resume"){
      session.lifecycle.push({...row,instanceId:parts[2],state:parts[0]});
      continue;
    }
    if(row.event_type==="logout")session.finishedAt=row.finished_at||row.started_at;
    session.events.push(row);
  }
  for(const session of sessions.values()){
    if(session.finishedAt||!session.lifecycle.length)continue;
    const instances=new Map();
    for(const event of [...session.lifecycle].sort((a,b)=>logTime(a)-logTime(b)||Number(a.id)-Number(b.id)))instances.set(event.instanceId,event);
    if([...instances.values()].every(event=>event.state==="exit")){
      const exit=[...instances.values()].sort((a,b)=>logTime(b)-logTime(a))[0];
      session.finishedAt=exit.finished_at||exit.started_at;
      session.events.push({...exit,event_type:"logout",exitReason:"Page closed or website exited"});
    }
  }
  return [...sessions.values()].sort((a,b)=>Date.parse(b.startedAt||0)-Date.parse(a.startedAt||0)||a.key.localeCompare(b.key));
}

function activitySessionStatus(session,now=Date.now()){
  if(session.finishedAt)return {key:"logged-out",label:"Logged out"};
  const instances=new Map();
  for(const row of session.presence){const current=instances.get(row.instanceId);if(!current||logTime(row)>logTime(current)||(logTime(row)===logTime(current)&&Number(row.id)>Number(current.id)))instances.set(row.instanceId,row);}
  const fresh=[...instances.values()].filter(row=>now-logTime(row)<ACTIVITY_FRESH_MS&&logTime(row)<=now+5000);
  if(fresh.some(row=>row.state==="active"&&now-logTime(row)+(Number(row.duration_seconds)||0)*1000<ACTIVITY_ACTIVE_MS))return {key:"active",label:"Active"};
  if(fresh.some(row=>row.state!=="closed"))return {key:"idle",label:"Idle"};
  return {key:"inactive",label:"Inactive"};
}
const sessionBadge=session=>{const status=activitySessionStatus(session);return `<span class="session-status status-${status.key}"><i aria-hidden="true"></i>${status.label}</span>`;};
const allActivitySessions=()=>buildActivitySessions(activityRows,recentPresenceRows);

function activitySessionsPage(){
  return `<section class="teacher-report activity-session-page"><div class="exam-heading"><span class="assessment-heading-icon" aria-hidden="true">≡</span><p class="eyebrow">TEACHER STUDIO</p><h1>Activity logs</h1><p>Review login times and current interaction status. Open a session to see its detailed activity.</p></div><div class="report-tools session-filters"><label><span>Search user</span><input id="sessionSearch" type="search" value="${examEsc(activityListState.search)}" placeholder="Enter a name"></label><label><span>Status</span><select id="sessionStatusFilter"><option value="">All statuses</option>${[["active","Active"],["idle","Idle"],["inactive","Inactive"],["logged-out","Logged out"]].map(([value,label])=>`<option value="${value}" ${activityListState.status===value?"selected":""}>${label}</option>`).join("")}</select></label><button id="sessionRefresh" type="button" class="secondary">Refresh</button></div><p class="session-status-note">Active means interaction in a visible tab within the last 90 seconds. Status updates every 15 seconds. All times are in Manila time.</p><div class="report-table session-table"><table><thead><tr><th>User</th><th>Login time (Manila) ↓</th><th>Status</th><th class="session-details-column">Details</th></tr></thead><tbody id="sessionRows"></tbody></table><div class="session-pagination"><label>Rows per page <select id="sessionPageSize">${[10,25,50].map(size=>`<option ${size===activityListState.size?"selected":""}>${size}</option>`).join("")}</select></label><span id="sessionCount" aria-live="polite"></span><div><button class="secondary" id="sessionPrevious" type="button">Previous</button><span id="sessionPageNumber"></span><button class="secondary" id="sessionNext" type="button">Next</button></div></div></div></section>`;
}

function paintActivitySessions(){
  const target=$("sessionRows");if(!target)return;
  const sessions=allActivitySessions().filter(session=>(!activityListState.search||logName(session.userId).toLowerCase().includes(activityListState.search.toLowerCase()))&&(!activityListState.status||activitySessionStatus(session).key===activityListState.status));
  const pages=Math.max(1,Math.ceil(sessions.length/activityListState.size));activityListState.page=Math.min(activityListState.page,pages);
  const start=(activityListState.page-1)*activityListState.size,shown=sessions.slice(start,start+activityListState.size);
  target.innerHTML=shown.length?shown.map(session=>`<tr><td><strong>${examEsc(logName(session.userId))}</strong></td><td>${manilaTime(session.startedAt)}</td><td>${sessionBadge(session)}</td><td class="session-details-column"><button class="session-view" type="button" data-session-details="${examEsc(session.key)}" aria-label="View session details for ${examEsc(logName(session.userId))}">View details <span aria-hidden="true">›</span></button></td></tr>`).join(""):'<tr><td colspan="4" class="session-empty">No sessions match these filters.</td></tr>';
  $("sessionCount").textContent=`Showing ${sessions.length?start+1:0}–${start+shown.length} of ${sessions.length} sessions`;
  $("sessionPageNumber").textContent=`Page ${activityListState.page} of ${pages}`;
  $("sessionPrevious").disabled=activityListState.page<=1;$("sessionNext").disabled=activityListState.page>=pages;
  updateActivityDetails();
}

function closeActivityDetails(){
  const dialog=$("activitySessionDialog");if(dialog){if(dialog.open)dialog.close();dialog.remove();}
  activitySelectedKey=null;
  if(activityReturnFocus?.isConnected)activityReturnFocus.focus();
}
function openActivityDetails(key,button){
  if(!isTeacherAccount())return;
  closeActivityDetails();activityReturnFocus=button;activitySelectedKey=key;
  const session=allActivitySessions().find(item=>item.key===key);if(!session)return;
  const role=profileRows.find(profile=>profile.id===session.userId)?.role||"Unknown";
  const dialog=document.createElement("dialog");dialog.id="activitySessionDialog";dialog.className="activity-session-dialog";dialog.setAttribute("aria-labelledby","sessionDetailTitle");
  dialog.innerHTML=`<div class="session-dialog-heading"><div><p class="eyebrow">ACTIVITY LOGS</p><h2 id="sessionDetailTitle">Session details</h2><p>${examEsc(logName(session.userId))}</p></div><button type="button" id="sessionDetailX" class="session-dialog-x" aria-label="Close session details">×</button></div><div class="session-dialog-content"><dl class="session-metadata"><div><dt>User</dt><dd>${examEsc(logName(session.userId))}</dd></div><div><dt>Role</dt><dd>${examEsc(role)}</dd></div><div><dt>Login time (Manila)</dt><dd>${manilaTime(session.startedAt)}</dd></div><div><dt>Logout time (Manila)</dt><dd id="sessionDetailLogout"></dd></div><div><dt>Status</dt><dd id="sessionDetailStatus"></dd></div><div><dt>Last interaction (Manila)</dt><dd id="sessionDetailLast"></dd></div></dl><h3>Activity timeline</h3><p class="session-status-note">Only activity from this session is shown. Status updates are kept out of the timeline.</p><div class="session-detail-tools"><label><span>Search activity</span><input type="search" id="sessionDetailSearch" placeholder="Search event or page"></label><label><span>Sort</span><select id="sessionDetailSort"><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label></div><p id="sessionDetailCount" class="report-summary" aria-live="polite"></p><ol id="sessionTimeline" class="session-timeline"></ol></div><div class="session-dialog-footer"><button type="button" id="sessionDetailClose" class="secondary">Close</button></div>`;
  document.body.append(dialog);
  $("sessionDetailX").onclick=$("sessionDetailClose").onclick=closeActivityDetails;
  dialog.addEventListener("cancel",event=>{event.preventDefault();closeActivityDetails();});
  dialog.addEventListener("click",event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeActivityDetails();}});
  $("sessionDetailSearch").oninput=$("sessionDetailSort").onchange=updateActivityDetails;
  updateActivityDetails();dialog.showModal();
}
function updateActivityDetails(){
  if(!activitySelectedKey||!$("activitySessionDialog"))return;
  const session=allActivitySessions().find(item=>item.key===activitySelectedKey);if(!session)return;
  $("sessionDetailStatus").innerHTML=sessionBadge(session);$("sessionDetailLogout").textContent=manilaTime(session.finishedAt);
  const last=Math.max(0,...session.presence.map(row=>logTime(row)-(Number(row.duration_seconds)||0)*1000));
  $("sessionDetailLast").textContent=last?manilaTime(last):"Not recorded";
  const search=$("sessionDetailSearch").value.toLowerCase(),sort=$("sessionDetailSort").value;
  const events=session.events.filter(row=>`${logEventLabel(row.event_type)} ${logPageLabel(row.page)}`.toLowerCase().includes(search)).sort((a,b)=>(logTime(b)-logTime(a))*(sort==="oldest"?-1:1));
  const timeline=$("sessionTimeline"),scroll=timeline.scrollTop;
  timeline.innerHTML=events.length?events.map(row=>`<li><strong>${examEsc(row.event_type==="page_view"?logPageLabel(row.page):logEventLabel(row.event_type))}</strong><time>${manilaTime(row.event_type==="login"?row.started_at:row.finished_at||row.started_at)}</time><span>${row.event_type==="page_view"?`Page visit · ${logDuration(row.duration_seconds)}`:examEsc(row.exitReason||logEventLabel(row.event_type))}</span></li>`).join(""):'<li class="session-empty">No activity matches this search.</li>';
  timeline.scrollTop=scroll;$("sessionDetailCount").textContent=`${events.length} matching events`;
}

async function refreshActivitySessions(){
  if(activityRefreshBusy||!isTeacherAccount()||route()[0]!=="activity-logs")return;
  const userId=window.sinagUser?.id;
  activityRefreshBusy=true;
  try{
    const [logs,presence,profiles]=await Promise.all([
      window.sinagSupabase.from("activity_logs").select("*").not("page","like","presence/%").order("id",{ascending:false}).limit(1000),
      window.sinagSupabase.from("activity_logs").select("*").like("page","presence/%").gte("finished_at",new Date(Date.now()-120000).toISOString()).order("id",{ascending:false}).limit(1000),
      window.sinagSupabase.from("profiles").select("id,display_name,role")
    ]);
    if(!isTeacherAccount()||window.sinagUser?.id!==userId)return;
    if(logs.error||presence.error||profiles.error)throw logs.error||presence.error||profiles.error;
    activityRows=logs.data||[];recentPresenceRows=presence.data||[];profileRows=profiles.data||[];
    paintActivitySessions();
  }catch(error){const note=$("sessionCount");if(note)note.textContent="Status update unavailable. Showing last received records.";console.error("Activity session refresh failed",error);}
  finally{activityRefreshBusy=false;}
}

let classResultsSearch="",classStudentId=null,classStudentReturnFocus=null;
let classDeleting=false,classResultsNotice="";
function classResultStudents(){
  const students=new Map(),byAccount=new Map();
  const emails=new Map((window.sinagClassStudentEmails||[]).map(row=>[row.id,String(row.email||"").trim().toLowerCase()]));
  const ensure=(id,name)=>{
    const email=emails.get(id),key=email?`email:${email}`:`account:${id}`;
    if(!students.has(key))students.set(key,{id,name:name||id,attempts:[]});
    const student=students.get(key);byAccount.set(id,student);return student;
  };
  for(const profile of profileRows){
    if(profile.role==="student")ensure(profile.id,profile.display_name);
  }
  for(const attempt of teacherAttempts){
    if(profileRows.find(profile=>profile.id===attempt.user_id)?.role==="teacher")continue;
    const student=byAccount.get(attempt.user_id)||ensure(attempt.user_id,logName(attempt.user_id));
    student.attempts.push(attempt);
  }
  return [...students.values()].filter(student=>student.attempts.length>0).sort((a,b)=>a.name.localeCompare(b.name)||a.id.localeCompare(b.id));
}
function classStudentRows(students){
  return students.length?students.map(student=>`<tr><td><button type="button" class="session-view class-student-name" data-student-results="${examEsc(student.id)}" aria-haspopup="dialog">${examEsc(student.name)}</button></td><td><div class="class-result-actions"><button type="button" class="secondary" data-student-view="${examEsc(student.id)}" aria-label="View results for ${examEsc(student.name)}" aria-haspopup="dialog">View</button><button type="button" class="secondary class-result-delete" data-student-delete="${examEsc(student.id)}" aria-label="Delete results for ${examEsc(student.name)}" ${classDeleting||!student.attempts.length?"disabled":""}>Delete</button></div></td></tr>`).join(""):'<tr><td colspan="2" class="session-empty">No assessment records found.</td></tr>';
}
async function deleteClassStudentResults(id){
  if(!isTeacherAccount()||classDeleting)return;
  const student=classResultStudents().find(student=>student.id===id);
  if(!student?.attempts.length)return;
  if(!confirm(`Delete all ${student.attempts.length} assessment records for ${student.name}? This permanently removes scores and saved attempts and may let the student retake these assessments. This cannot be undone.`))return;
  const ids=student.attempts.map(attempt=>attempt.id);
  classDeleting=true;classResultsNotice="Deleting results?";paintClassStudents();
  try{
    const {data,error}=await window.sinagSupabase.rpc("delete_class_results",{p_attempt_ids:ids});
    if(error)throw error;
    if(!Number.isInteger(data)||data<0)throw new Error("Deletion could not be confirmed. Refresh and try again.");
    teacherAttempts=teacherAttempts.filter(attempt=>!ids.includes(attempt.id));
    classResultsNotice=`${data} assessment record${data===1?"":"s"} deleted for ${student.name}.`;
    if(classStudentId===id)closeClassStudent();
  }catch(error){classResultsNotice=`Could not delete results: ${error.message||"Please try again."}`;}
  finally{classDeleting=false;if(route()[0]==="class-results"&&$("reportBody"))paintClassStudents();}
}
function paintClassStudents(){
  const students=classResultStudents(),search=classResultsSearch.trim().toLowerCase();
  const matching=students.filter(student=>student.name.toLowerCase().includes(search));
  $("reportBody").innerHTML=classStudentRows(matching);
  if($("classResultsNotice"))$("classResultsNotice").textContent=classResultsNotice;
  $("classStudentCount").textContent=`${matching.length} of ${students.length} students`;
}
function classStudentRecord(student){
  const attempts=[...student.attempts].sort((a,b)=>new Date(b.started_at)-new Date(a.started_at));
  const reasons={completed:"Submitted",timeout:"Time limit reached",exit:"Left assessment",navigation:"Navigated away"};
  const body=attempts.map(row=>`<tr><td>${examEsc(examLabel(row.exam_type))}</td><td>${row.submitted_at?"Submitted":"In progress"}</td><td>${row.submitted_at?examEsc(examScoreText(row)):"?"}</td><td>${row.duration_seconds==null?"?":logDuration(row.duration_seconds)}</td><td>${manilaTime(row.started_at)}</td><td>${manilaTime(row.submitted_at)}</td><td>${examEsc(reasons[row.submit_reason]||row.submit_reason||"?")}</td></tr>`).join("");
  return `<p class="report-summary">${attempts.length} assessment records &middot; ${attempts.filter(row=>row.submitted_at).length} submitted</p>${attempts.length?`<div class="report-table"><table><thead><tr><th>Assessment</th><th>Status</th><th>Score</th><th>Duration</th><th>Started (Manila)</th><th>Submitted (Manila)</th><th>Submission reason</th></tr></thead><tbody>${body}</tbody></table></div>`:'<p class="session-empty">This student has not started any assessments yet.</p>'}`;
}
function closeClassStudent(){
  const dialog=$("classStudentDialog");if(dialog){if(dialog.open)dialog.close();dialog.remove();}
  classStudentId=null;
  if(classStudentReturnFocus?.isConnected)classStudentReturnFocus.focus();
  else document.querySelector("[data-student-results]")?.focus();
  classStudentReturnFocus=null;
}
function openClassStudent(id,trigger){
  if(!isTeacherAccount())return;
  const student=classResultStudents().find(student=>student.id===id);if(!student)return;
  closeClassStudent();classStudentId=id;classStudentReturnFocus=trigger;
  const dialog=document.createElement("dialog");dialog.id="classStudentDialog";dialog.className="activity-session-dialog class-student-dialog";dialog.setAttribute("aria-labelledby","classStudentTitle");
  dialog.innerHTML=`<div class="session-dialog-heading"><div><p class="eyebrow">CLASS RESULTS</p><h2 id="classStudentTitle">${examEsc(student.name)}</h2><p>Full assessment record</p></div><button type="button" class="session-dialog-x" id="classStudentX" aria-label="Close student record">?</button></div><div class="session-dialog-content" id="classStudentRecord">${classStudentRecord(student)}</div><div class="session-dialog-footer"><button type="button" class="secondary" id="classStudentClose">Close</button></div>`;
  document.body.append(dialog);
  $("classStudentX").onclick=$("classStudentClose").onclick=closeClassStudent;
  dialog.addEventListener("cancel",event=>{event.preventDefault();closeClassStudent();});
  dialog.addEventListener("click",event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeClassStudent();}});
  dialog.showModal();
}
const baseTeacherResultsPage=teacherResultsPage;
teacherResultsPage=function(kind){
  if(kind==="logs")return activitySessionsPage();
  return `<section class="teacher-report"><div class="exam-heading"><span class="assessment-heading-icon" aria-hidden="true">?</span><p class="eyebrow">TEACHER STUDIO</p><h1>Class results</h1><p>Select a student's name to view their full assessment record, scores, and duration.</p></div><div class="report-tools results-filter-tools"><label><span>Search student</span><input id="reportSearch" type="search" placeholder="Enter student name" value="${examEsc(classResultsSearch)}"></label></div><p id="classResultsNotice" role="status" aria-live="polite">${examEsc(classResultsNotice)}</p><div id="classStudentCount" class="report-summary" aria-live="polite"></div><div class="report-table"><table><thead><tr><th>Student</th><th>Actions</th></tr></thead><tbody id="reportBody">${classStudentRows(classResultStudents().filter(student=>student.name.toLowerCase().includes(classResultsSearch.trim().toLowerCase())))}</tbody></table></div></section>`;
};
const analyticsBind=bind;
bind=function(page,id){
  analyticsBind(page,id);
  if(page==="class-results"&&isTeacherAccount()){
    $("reportSearch").oninput=()=>{classResultsSearch=$("reportSearch").value;paintClassStudents();};
    $("reportBody").onclick=event=>{const button=event.target.closest("[data-student-results]");if(button)openClassStudent(button.dataset.studentResults,button);else if(event.target.closest("[data-student-view]")){const view=event.target.closest("[data-student-view]");openClassStudent(view.dataset.studentView,view);}else{const remove=event.target.closest("[data-student-delete]");if(remove)void deleteClassStudentResults(remove.dataset.studentDelete);}};
    paintClassStudents();
    if(classStudentId){const student=classResultStudents().find(student=>student.id===classStudentId);if(student&&$("classStudentRecord"))$("classStudentRecord").innerHTML=classStudentRecord(student);else closeClassStudent();}
  }
  if(page!=="activity-logs"||!isTeacherAccount())return;
  const filter=()=>{activityListState.search=$("sessionSearch").value;activityListState.status=$("sessionStatusFilter").value;activityListState.page=1;paintActivitySessions();};
  $("sessionSearch").oninput=$("sessionStatusFilter").onchange=filter;
  $("sessionPageSize").onchange=()=>{activityListState.size=Number($("sessionPageSize").value);activityListState.page=1;paintActivitySessions();};
  $("sessionPrevious").onclick=()=>{activityListState.page--;paintActivitySessions();};
  $("sessionNext").onclick=()=>{activityListState.page++;paintActivitySessions();};
  $("sessionRows").onclick=event=>{const button=event.target.closest("[data-session-details]");if(button)openActivityDetails(button.dataset.sessionDetails,button);};
  $("sessionRefresh").onclick=refreshActivitySessions;
  paintActivitySessions();void refreshActivitySessions();
};
setInterval(()=>{if(document.visibilityState==="visible")void refreshActivitySessions();},15000);
window.addEventListener("hashchange",()=>{if(route()[0]!=="activity-logs")closeActivityDetails();});

window.addEventListener("hashchange",()=>{if(route()[0]!=="class-results")closeClassStudent();});
window.addEventListener("sinagbasa:signed-out",()=>{
  closeClassStudent();closeActivityDetails();recentPresenceRows=[];
  classResultsSearch="";classResultsNotice="";
  activityListState={search:"",status:"",page:1,size:25};
});
