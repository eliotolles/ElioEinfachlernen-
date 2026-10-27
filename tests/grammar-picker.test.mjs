import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
test('level buttons count the restored lessons rather than the withdrawn atlas',()=>{
 const counts={A1:2,C1:12},buttons=Object.keys(counts).map(level=>({dataset:{grammarLevel:level},counter:{},setAttribute(name,value){this[name]=value;},querySelector(){return this.counter;}}));
 const ctx=vm.createContext({document:{getElementById:()=>({value:'C1'}),querySelectorAll:()=>buttons},grammarItems:()=>Object.entries(counts).flatMap(([level,count])=>Array.from({length:count},()=>({level})))});
 const code=fs.readFileSync('public/js/grammar-atlas-ui.js','utf8');vm.runInContext(code.slice(code.indexOf('function grammarAtlasSyncLevels'),code.indexOf('function grammarAtlasSelected')),ctx);vm.runInContext('grammarAtlasSyncLevels()',ctx);
 assert.equal(buttons[0].counter.textContent,2);assert.equal(buttons[1].counter.textContent,12);assert.equal(buttons[1]['aria-pressed'],'true');assert.equal(buttons[0]['aria-pressed'],'false');
});
test('topic rows are compact while selection and ownership controls remain available',()=>{
 const list={innerHTML:'',querySelectorAll:()=>[]},fields={'#lesson-list':list,'#grammar-level':{value:'B1'},'#grammar-source':{value:'all'},'#grammar-group':{value:'all'},'#grammar-search':{value:''}};
 const lesson={id:'topic',title:'Konjunktiv II',subtitle:'Repeated chapter description',levels:['B1'],level:'B1',collectionId:'old-shared-pack',group:'verbs'};
 const ctx=vm.createContext({ImportHub:{collections:()=>[{id:'old-shared-pack',items:[lesson]}]},Account:{canEdit:()=>false},Auth:{get:()=>({})},$:id=>fields[id],esc:String,App:{t:x=>x}});
 const code=fs.readFileSync('public/js/grammar.js','utf8');vm.runInContext(code.slice(0,code.indexOf('function deleteGrammarTopic')),ctx);vm.runInContext('renderLessonList()',ctx);
 assert(list.innerHTML.includes('Konjunktiv II'));assert(list.innerHTML.includes('data-id="topic"'));assert(!list.innerHTML.includes('Repeated chapter description'));assert(!list.innerHTML.includes('grammar-topic-number'));assert(!list.innerHTML.includes('data-delete-grammar'));
});
