const fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const files=execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,'ls-files','--cached','--others','--exclude-standard','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
const forbidden=/^(?:\.codex-tmp\/|\.env(?:\.|$)(?!example$)|SINAGBASA\/dist\/dist\/)|(?:^|\/)(?:assessment-answer-keys\.json|test-answer-key\.md|assessment-source\.json)$|\.(?:pem|key|pyc)$/i;
const errors=[];
for(const file of new Set(files)){
  if(!fs.existsSync(file)||!fs.statSync(file).isFile())continue;
  if(forbidden.test(file)){errors.push(`${file}: private or temporary file`);continue;}
  if(!/\.(?:js|cjs|json|sql|md|html|txt|ya?ml)$/.test(file))continue;
  const source=fs.readFileSync(file,'utf8');
  if(/\bsb_secret_[A-Za-z0-9_-]{12,}|\bgh[pousr]_[A-Za-z0-9]{30,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(source))errors.push(`${file}: possible credential`);
  if(file.endsWith('.sql')&&/\('[a-z_]+','(?:en|fil)',3600,'\[[0-4,-]+\]'::jsonb\)/.test(source))errors.push(`${file}: embedded assessment key seed`);
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log('Public repository check passed: no forbidden files, detected credentials, or embedded assessment key seeds.');
