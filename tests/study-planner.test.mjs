import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const ctx=vm.createContext({structuredClone,crypto,Date});vm.runInContext(fs.readFileSync('public/js/study-planner.js','utf8')+';globalThis.C=StudyPlannerCore',ctx);const C=ctx.C;
const p={exam:'Goethe',current:'A0',target:'B1',date:'',minutes:45,days:[1,3,5],weak:['listening']};
test('calendar respects days off, horizon and daily time budget',()=>{const plan=C.build(p,new Date(2026,9,30));assert.equal(plan.weeks,12);for(let i=0;i<90;i++){const d=new Date(2026,9,30+i),date=C.day(d),tasks=C.tasks(plan,date);if(i>=84||!p.days.includes(d.getDay()))assert.equal(tasks.length,0);else{assert.equal(tasks.reduce((n,t)=>n+t.minutes,0),45);assert.ok(tasks.some(t=>t.kind==='listening'));assert.equal(new Set(tasks.map(t=>t.id)).size,tasks.length);}}});
test('minimum daily budget remains valid; no automatic passing claim',()=>{const plan=C.build({...p,minutes:15});const d=new Date(plan.start+'T00:00:00');while(d.getDay()!==1)d.setDate(d.getDate()+1);assert.equal(C.tasks(plan,C.day(d)).reduce((s,t)=>s+t.minutes,0),15);assert.match(plan.warning,/kiểm tra|Kiểm tra/);});
test('rejects impossible level pairs and unsupported TestDaF targets',()=>{assert.throws(()=>C.build({...p,current:'C1',target:'A1'}));assert.throws(()=>C.build({...p,exam:'TestDaF',target:'A1'}));assert.throws(()=>C.build({...p,days:[]}));assert.throws(()=>C.build({...p,date:'2020-01-01'}));});
test('partial AI response is rejected instead of replacing saved plan',()=>{const plan=C.build(p);assert.throws(()=>C.normalizeAI({weeks:[{week:1,topic:'x',goal:'y'}]},plan));assert.equal(plan.source,'basic');assert.equal(C.normalizeAI({weeks:plan.weekly.map(w=>({...w,topic:'Perfekt',goal:'Đặt 5 câu'}))},plan).length,12);});
test('private plan included in backup and server allowlist; preserves grader',()=>{assert.match(fs.readFileSync('public/js/session.js','utf8'),/STUDY_BACKUP_KEYS=\['studyPlan'/);assert.match(fs.readFileSync('worker/index.js','utf8'),/DATA_KEYS=new Set\(\['studyPlan'/);assert.match(fs.readFileSync('public/js/study-planner.js','utf8'),/Account.refresh\(\['studyPlan'\]\)/);});

test('planner feature is accepted by backend routing and rejects unknown features',()=>{
 const source=fs.readFileSync('worker/index.js','utf8');
 const start=source.indexOf('const AI_FEATURES=');const end=source.indexOf('function aiCompatible',start);
 const backend=vm.createContext({error:(status,message)=>Object.assign(new Error(message),{status})});
 vm.runInContext(source.slice(start,end)+';globalThis.route=aiFeatureInput;',backend);
 assert.equal(backend.route({feature:'study.plan',prompt:'Plan'}).task,'text');
 assert.equal(backend.route({feature:'writing.feedback'}).task,'text');
 assert.throws(()=>backend.route({feature:'unknown.feature'}),/Công việc AI không hợp lệ/);
});
