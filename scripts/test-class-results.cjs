const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const nodes={};
let teacher=true;
const context=vm.createContext({
  teacherResultsPage:()=>'',bind:()=>{},setInterval:()=>{},console,
  window:{addEventListener:()=>{}},document:{querySelector:()=>null},
  $:id=>nodes[id],isTeacherAccount:()=>teacher,route:()=>['class-results'],
  examEsc:value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])),
  examLabel:type=>({pre:'Pre-test',post:'Post-test'}[type]||type),
  examScoreText:row=>`${row.score} / ${row.total_items}`,
  profileRows:[
    {id:'a',display_name:'Same Name',role:'student'},
    {id:'b',display_name:'Same Name',role:'student'},
    {id:'c',display_name:'Student <C>',role:'student'},
    {id:'t',display_name:'Teacher',role:'teacher'}
  ],
  teacherAttempts:[
    {id:'1',user_id:'a',exam_type:'pre',language:'en',score:20,total_items:30,duration_seconds:125,started_at:'2026-11-05T16:30:00Z',submitted_at:'2026-11-05T16:32:05Z',submit_reason:'completed'},
    {id:'2',user_id:'a',exam_type:'post',language:'fil',started_at:'2026-11-06T16:30:00Z'},
    {id:'3',user_id:'b',exam_type:'pre',language:'en',score:10,total_items:30,submitted_at:'2026-11-05T16:32:05Z',submit_reason:'<unsafe>'},
    {id:'4',user_id:'t',exam_type:'pre'},
    {id:'5',user_id:'missing-profile',exam_type:'pre'}
  ]
});
vm.runInContext(fs.readFileSync('SINAGBASA/dist/activity-analytics.js','utf8'),context);
const run=code=>vm.runInContext(code,context);
assert.equal(run('classResultStudents().length'),3);
assert.equal(run('classResultStudents().find(s=>s.id==="a").attempts.length'),2);
assert.equal(run('classResultStudents().find(s=>s.id==="b").attempts.length'),1);
assert(!run('classResultStudents().some(s=>s.id==="t")'));
const page=run('teacherResultsPage("results")');
assert.equal((page.match(/data-student-results=/g)||[]).length,3);
assert(!page.includes('Student &lt;C&gt;'),'Students without assessments are hidden');
assert(run('classStudentRows([{id:"c",name:"Student <C>",attempts:[]}])').includes('Student &lt;C&gt;'));
assert(!page.includes('20 / 30'));
assert(!page.includes('<th>Assessment</th>'));
const record=run('classStudentRecord(classResultStudents().find(s=>s.id==="a"))');
for(const text of ['Pre-test','Post-test','20 / 30','2m 5s','In progress','Started (Manila)','Submitted (Manila)','Nov 6, 2026'])assert(record.includes(text),text);
assert(!record.includes('10 / 30'),'Student records must stay isolated');
assert(!record.includes('<th>Language</th>'),'Language column is hidden');
assert(!run('classResultStudents().some(s=>s.id==="c")'));
assert(run('classStudentRecord(classResultStudents().find(s=>s.id==="b"))').includes('&lt;unsafe&gt;'));
nodes.reportSearch={value:''};nodes.reportBody={};nodes.classStudentCount={};
run('bind("class-results")');
nodes.reportSearch.value='same name';nodes.reportSearch.oninput();
assert.equal(nodes.classStudentCount.textContent,'2 of 3 students');
assert(nodes.reportBody.innerHTML.includes('Same Name'));
nodes.reportSearch.value='not found';nodes.reportSearch.oninput();
assert(nodes.reportBody.innerHTML.includes('No assessment records found'));
assert(run('teacherResultsPage("results")').includes('value="not found"'),'Search survives report refresh');
teacher=false;
assert.doesNotThrow(()=>run('openClassStudent("a",null)'),'Non-teachers cannot open records');
context.window.sinagClassStudentEmails=[
  {id:'a',email:' Student@Example.com '},
  {id:'b',email:'student@example.com'},
  {id:'c',email:'other@example.com'}
];
assert.equal(run('classResultStudents().length'),2,'Matching normalized emails bundle accounts');
assert.equal(run('classResultStudents().find(s=>s.id==="a").attempts.length'),3);
assert.equal(run('classResultStudents().find(s=>s.id==="a").name'),'Same Name');
assert(!run('teacherResultsPage("results")').includes('student@example.com'),'List displays names, not emails');
context.window.sinagClassStudentEmails[1].email='different@example.com';
assert.equal(run('classResultStudents().length'),3,'Same names with different emails remain separate');
context.window.sinagClassStudentEmails=[];
assert.equal(run('classResultStudents().length'),3,'Missing emails must not merge unrelated accounts');
console.log('Class results grouping, isolation, filtering, details, and access checks passed.');
(async()=>{
  const calls=[];
  context.confirm=()=>true;
  context.window.sinagSupabase={rpc:async(name,args)=>{calls.push({name,args});return {data:2,error:null};}};
  await run('deleteClassStudentResults("a")');
  assert.equal(calls.length,0,'Non-teachers cannot delete');
  teacher=true;
  context.confirm=()=>false;
  await run('deleteClassStudentResults("a")');
  assert.equal(calls.length,0,'Cancel must not delete');
  context.confirm=()=>true;
  context.window.sinagSupabase.rpc=async()=>({error:{message:'Permission denied'}});
  await run('deleteClassStudentResults("a")');
  assert.equal(run('classResultStudents().find(s=>s.id==="a").attempts.length'),2,'Failed delete preserves records');
  assert(run('classResultsNotice').includes('Permission denied'));
  context.window.sinagSupabase.rpc=async(name,args)=>{calls.push({name,args});return {data:2,error:null};};
  await run('deleteClassStudentResults("a")');
  assert.equal(calls[0].name,'delete_class_results');
  assert.deepEqual(Array.from(calls[0].args.p_attempt_ids),['1','2']);
  assert(!run('classResultStudents().some(s=>s.id==="a")'),'Deleted students disappear from results');
  assert.equal(run('classResultStudents().find(s=>s.id==="b").attempts.length'),1,'Other students stay untouched');
  assert(run('classResultsNotice').includes('2 assessment records deleted'));
  console.log('Delete checks passed: teacher guard, cancellation, failure preservation, scoped IDs, and confirmed deletion.');
})().catch(error=>{console.error(error);process.exitCode=1;});
