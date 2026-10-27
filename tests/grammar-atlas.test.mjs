import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const catalogCode=fs.readFileSync('public/js/grammar-atlas-data.js','utf8');
const ctx=vm.createContext({});vm.runInContext(catalogCode,ctx);const items=JSON.parse(vm.runInContext('JSON.stringify(ElioGrammarAtlasData)',ctx));
const spec=JSON.parse(fs.readFileSync('scripts/grammar-authoring/requested-topics.json','utf8'));
test('all user requested topics occur exactly once per level without svg contamination',()=>{
 assert.equal(items.length,165);assert.equal(new Set(items.map(l=>l.id)).size,165);
 for(const [level,text]of Object.entries(spec)){const expected=[...new Set(text.split('|'))].sort();const actual=items.filter(l=>l.levels.includes(level)).map(l=>l.title).sort();assert.deepEqual(actual,expected,level);}
 assert.equal(items.reduce((n,l)=>n+l.levels.length,0),385);
 assert(!items.some(l=>l.title.endsWith('svg')));
});
test('all authored exercises have valid keys, distinct choices, reconstructible build tokens and explanations',()=>{
 assert.equal(items.reduce((n,l)=>n+l.exercises.length,0),513);
 for(const l of items){assert(l.content.startsWith('## '+l.title));assert(l.content.includes('→'));assert(l.content.includes('Bẫy'));assert(l.atlasGuide?.content.length>400,l.title);
 for(const e of l.exercises){assert(e.explanation.length>40,l.title);assert.equal(e.origin,'authored');assert(e.answers.every(a=>typeof a==='string'&&a.trim()));
 if(e.type==='quiz'){assert.equal(new Set(e.options).size,e.options.length,l.title);assert(e.answers.every(a=>e.options.includes(a)));assert(e.explanation.includes('Không chọn '+e.options[0]));assert(e.explanation.includes('Không chọn '+e.options[2]));}
 if(e.type==='build')assert.deepEqual([...e.tokens].sort(),e.answers[0].split(' ').sort(),l.title);
 }
 }
});
test('C1 topics include advanced analysis and an additional C1 exercise',()=>{
 for(const l of items.filter(l=>l.levels.includes('C1'))){assert(l.content.includes('### C1 ·'),l.title);assert.equal(l.exercises.length,4,l.title);assert(l.exercises[3].question.startsWith('C1 ·'));}
});
test('catalogue filtering keeps old IDs, all material owners and caller state unchanged; static content cannot masquerade as editable account data',()=>{
 const records=[{id:'shared',level:'C1',items:[{id:'old-c1',title:'Old private title',level:'C1'}]},{id:'mine',name:'A2 legacy',items:[{id:'old-a2',title:'Dativ'}]}];const original=JSON.stringify(records);
 const code=fs.readFileSync('public/js/grammar.js','utf8');const source=code.slice(code.indexOf('function grammarCanEdit'),code.indexOf('function renderLessonList'));
 const c=vm.createContext({ElioGrammarAtlasData:items,ImportHub:{collections:()=>records},Account:{canEdit:()=>true},$:()=>({value:'all'})});vm.runInContext(source,c);
 assert.equal(vm.runInContext('grammarItems().length',c),167);assert.equal(vm.runInContext("grammarItems().find(l=>l.id==='old-a2').collectionId",c),'mine');assert.equal(vm.runInContext("grammarItems().find(l=>l.id==='old-c1').level",c),'C1');
 assert.equal(vm.runInContext("grammarCanEdit('elio-grammar-atlas-v1')",c),false);assert.equal(vm.runInContext("grammarCanEdit('mine')",c),true);
 assert.equal(vm.runInContext("grammarAtlasFilter(grammarItems(),{level:'C1',source:'atlas'}).length",c),18);assert.equal(vm.runInContext("grammarAtlasFilter(grammarItems(),{source:'imported'}).length",c),2);
 assert(vm.runInContext("grammarAtlasFilter(grammarItems(),{query:'bi dong'}).length",c)>0);
 assert.equal(JSON.stringify(records),original);
});
test('reader loads the authored library before engines and keeps mobile chapter controls accessible',()=>{
 const html=fs.readFileSync('public/grammatik.html','utf8'),book=fs.readFileSync('public/js/book-ui.js','utf8');assert(html.includes('<option>C1</option>'));assert(html.indexOf('js/grammar-atlas-data.js')<html.indexOf('js/grammar.js'));assert(html.includes('grammar-atlas.css'));assert(book.includes("fold.open=file==='grammatik.html'||!phoneLayout.matches"));
});
