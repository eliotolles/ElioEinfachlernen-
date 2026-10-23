import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const source=fs.readFileSync('public/js/simulator.js','utf8');
function fixture(){
 const nodes=new Map(),buttons=[];const get=id=>{if(!nodes.has(id))nodes.set(id,{value:'reading',textContent:'',innerHTML:'',querySelectorAll:()=>buttons});return nodes.get(id);};
 const profile={modules:['reading','grammar','listening','writing','speaking'].map(key=>({key,name:key})),blocks:[]};
 const simulation={id:'running',exam:'Telc',level:'B1',format:profile,selection:{folder:'import:petra',mode:'module'},items:[{skill:'reading'},{skill:'grammar'}],answers:[{q6:'B'},{}],deadline:1234,finished:false};
 const c={Set,simulation,examVisibleSkill:'reading',ImportHub:{summaries:()=>[{id:'petra',exam:'Telc',level:'B1',items:[{skill:'reading'},{skill:'grammar'},{skill:'writing',level:'B1'},{skill:'speaking',level:'B2'}]}]},canonicalSkill:x=>x,canonicalExam:x=>x,$:get,document:{querySelectorAll:()=>[]},examRoomLabels:()=>({newExam:'new'}),examVisibleIndices:()=>[0,1],examProfile:()=>profile,esc:String,applyExamSkillView(){},App:{t:x=>x}};
 vm.createContext(c);vm.runInContext(source.slice(source.indexOf('function examCollectionPracticeSkills('),source.indexOf('function renderExamRoom(')),c);vm.runInContext(source.split('\n').find(l=>l.startsWith('function renderExamRoom(')),c);return {c,get,buttons,simulation};
}
test('PETRA writing remains available as separate practice while Lesen/grammar is active',()=>{
 const {c,get,simulation}=fixture(),before=JSON.stringify(simulation);c.renderExamRoom();const html=get('#exam-skill-tabs').innerHTML;
 assert.match(html,/data-exam-tab="writing"[^>]*title="Mở bài luyện riêng/);assert.match(html,/>writing ↗<\/button>/);assert.match(html,/data-exam-tab="listening"[^>]*disabled/);assert.match(html,/data-exam-tab="speaking"[^>]*disabled/);assert.equal(JSON.stringify(simulation),before);
});
test('full mock exams retain stage restrictions and missing writing is never fabricated',()=>{
 const {c,get,simulation}=fixture();simulation.selection.mode='full';c.renderExamRoom();assert.match(get('#exam-skill-tabs').innerHTML,/data-exam-tab="writing"[^>]*disabled/);
 simulation.selection.mode='module';c.ImportHub.summaries=()=>[];assert.equal(c.examCollectionPracticeSkills().size,0);
});
test('separate writing practice delegates to the existing guarded start handler without directly replacing answers',()=>{
 const {c,get,simulation}=fixture(),before=JSON.stringify(simulation);let starts=0;c.renderSimOptions=()=>{};c.renderSimParts=()=>{};get('#sim-start').onclick=()=>{starts++;};
 c.openExamSkillPractice('writing');assert.equal(starts,1);assert.equal(get('#sim-folder').value,'import:petra');assert.equal(get('#sim-mode').value,'module');assert.equal(get('#sim-skill').value,'writing');assert.equal(JSON.stringify(simulation),before);
 c.openExamSkillPractice('listening');assert.equal(starts,1);
});
