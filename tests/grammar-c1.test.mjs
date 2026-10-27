import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const pack=JSON.parse(fs.readFileSync('public/data/grammar-c1-sicher.json','utf8'));
test('C1 covers all 22 source pages in 12 distinct chapters with 120 explained exercises',()=>{
 assert.equal(pack.items.length,12);assert.equal(new Set(pack.items.map(l=>l.id)).size,12);
 assert.deepEqual([...new Set(pack.items.flatMap(l=>l.sourcePages))].sort((a,b)=>a-b),Array.from({length:22},(_,i)=>i+1));
 assert.deepEqual(pack.items.map(l=>l.sourceChapter),Array.from({length:12},(_,i)=>i+1));
 assert.equal(pack.items.flatMap(l=>l.exercises).length,120);
 for(const l of pack.items){assert.equal(l.level,'C1');assert(l.content.length>2000,l.title);assert(l.content.includes('### 6.'));assert(l.content.includes('→'));assert(l.content.includes('| --- |'));assert(l.exercises.length>=10);
  for(const e of l.exercises){assert(e.explanation.length>45,e.id);assert.equal(e.answerSource,'authored');assert(e.answers.every(a=>typeof a==='string'&&a.trim()));if(e.type==='quiz'){assert(e.options.includes(e.answers[0]),e.id);assert.equal(new Set(e.options).size,e.options.length);}else assert(e.question.includes('___'),e.id);}
 }
 assert.equal(new Set(pack.items.flatMap(l=>l.exercises.map(e=>e.question))).size,120);
});
test('C1 renders tables without overflowing cell structure and explains source corrections',()=>{
 const ctx=vm.createContext({esc:v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')});
 vm.runInContext(fs.readFileSync('public/js/learning-content.js','utf8'),ctx);
 for(const lesson of pack.items){ctx.body=lesson.content;const html=vm.runInContext('LearningContent.render(body)',ctx);assert(html.includes('<table'));assert(!html.includes('undefined'));for(const block of lesson.content.match(/(?:^\|.*\|\n?)+/gm)||[]){const lines=block.trim().split('\n'),width=lines[0].split('|').length;for(const line of lines)assert.equal(line.split('|').length,width,lesson.id);}}
 assert(pack.items[6].content.includes('aus/vor + Genitiv'));assert(pack.items[6].content.includes('Dativ'));
 assert(pack.items[7].content.includes('Rezipientenpassiv'));
});
function setup(records,admin=false){const saved=structuredClone(records),ctx=vm.createContext({structuredClone,Date,Auth:{get:()=>saved,set:(_,next)=>saved.splice(0,saved.length,...next)},Account:{profile:{role:admin?'super_admin':'user'},conflicts:{},canEdit:()=>true},ImportHub:{collections:()=>saved},$:()=>({value:'all'})});vm.runInContext(fs.readFileSync('public/js/grammar-c1-data.js','utf8'),ctx);const code=fs.readFileSync('public/js/grammar.js','utf8');vm.runInContext(code.slice(0,code.indexOf('function renderLessonList')),ctx);return {ctx,saved};}
test('restored grammar preserves imported A1–B2 IDs and content; only C1 is added',()=>{
 const original=[{id:'old-pack',type:'grammar',items:[{id:'original-b1',title:'Passiv',level:'B1',content:'OLD',exercises:[{answer:'A'}]}]}],{ctx,saved}=setup(original);
 const items=JSON.parse(vm.runInContext('JSON.stringify(grammarItems())',ctx));assert.equal(items.length,13);assert.equal(items[0].id,'original-b1');assert.equal(items[0].content,'OLD');assert.deepEqual(saved,original);
 assert.equal(vm.runInContext("grammarCanEdit('elio-c1-sicher-v1')",ctx),false);
 assert(!items.some(l=>l.collectionId==='elio-grammar-atlas-v1'));
});
test('Admin C1 edits use a shared material override; deletion does not resurrect fallback',()=>{
 const {ctx,saved}=setup([{id:'old-pack',type:'grammar',items:[{id:'keep',level:'B1',content:'untouched'}]}],true);
 vm.runInContext("currentLesson=grammarItems().find(l=>l.collectionId==='elio-c1-sicher-v1');materializeGrammarC1()",ctx);
 assert.equal(saved.length,2);assert.equal(saved[0].items[0].content,'untouched');assert.equal(saved[1].items.length,12);
 saved[1].items[0].content='Admin revision';assert.equal(vm.runInContext("grammarItems().find(l=>l.id==='elio-c1-sicher-01').content",ctx),'Admin revision');
 saved[1].items=[];assert.equal(vm.runInContext("grammarItems().filter(l=>l.collectionId==='elio-c1-sicher-v1').length",ctx),0);
 vm.runInContext('materializeGrammarC1()',ctx);assert.equal(saved.length,2);
});
test('a regular user cannot materialize or modify the public C1 collection',()=>{
 const {ctx,saved}=setup([]);vm.runInContext("currentLesson=grammarItems()[0]",ctx);assert.throws(()=>vm.runInContext('materializeGrammarC1()',ctx),/quản trị/);assert.equal(saved.length,0);
});
test('runtime C1 and JSON import have identical data, and obsolete atlas is not loaded',()=>{
 const ctx=vm.createContext({});vm.runInContext(fs.readFileSync('public/js/grammar-c1-data.js','utf8'),ctx);assert.deepEqual(JSON.parse(vm.runInContext('JSON.stringify(ElioGrammarC1Pack)',ctx)),pack);
 const html=fs.readFileSync('public/grammatik.html','utf8');assert(html.includes('js/grammar-c1-data.js'));assert(!html.includes('js/grammar-atlas-data.js'));assert(!html.includes('js/grammar-level-catalogue.js'));
});
