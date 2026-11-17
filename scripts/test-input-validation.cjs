const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync('SINAGBASA/dist/content-library.js','utf8');
const context=vm.createContext({URL,TextEncoder});
vm.runInContext(source.slice(source.indexOf('const safeResourceUrl ='),source.indexOf('const formatFileSize =')),context);
const validate=payload=>{context.payload=payload;return vm.runInContext('validateTeacherContent(payload)',context);};
const valid={kind:'lesson',title_en:"O'Brien",title_fil:'Pagbasa',body_en:'Read & learn <carefully>.',body_fil:'Magbasa nang mabuti.',resource_url:'https://example.org/reading?q=1&lang=en'};
assert.doesNotThrow(()=>validate(valid),'Unicode, apostrophes and plain text are preserved');
for(const patch of [
  {kind:'unknown'},{title_en:''},{title_fil:' '.repeat(3)},
  {title_en:'x'.repeat(161)},{body_en:'x'.repeat(50001)},
  {resource_url:'javascript:alert(1)'},{resource_url:'data:text/html,<script>alert(1)</script>'},
  {resource_url:'not a URL'},{resource_url:'https://example.org/'+ 'x'.repeat(2050)},
  {game_config:{scenes:Array(33).fill({})}},
  {game_config:{scenes:[{narrative_en:'x'.repeat(132000)}]}}
])assert.throws(()=>validate({...valid,...patch}));
assert.doesNotThrow(()=>validate({...valid,title_en:"Robert'); DROP TABLE profiles;--"}),'SQL-like text stays data');
assert.equal(vm.runInContext('safeResourceUrl("javascript:alert(1)")',context),'');
console.log('Content validation checks passed: type/length limits, unsafe links, oversized games, and preservation of legitimate text.');
