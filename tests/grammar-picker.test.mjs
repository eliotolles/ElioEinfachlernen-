import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
test('collapsed filter summary reports active filters across languages',()=>{
 const fields={'grammar-source':{value:'atlas'},'grammar-group':{value:'all'}},nodes={};
 const host={querySelector:selector=>nodes[selector]??=( {})};let language='vi';
 const ctx=vm.createContext({App:{settings:()=>({language})},document:{querySelector:()=>host,getElementById:id=>fields[id]}});
 const code=fs.readFileSync('public/js/grammar-atlas-ui.js','utf8');vm.runInContext(code.slice(code.indexOf('function grammarAtlasFilterLabels'),code.indexOf('function grammarAtlasLevelNote')),ctx);
 vm.runInContext('grammarAtlasSyncFilters()',ctx);assert.equal(nodes['[data-filter-count]'].textContent,'');assert.equal(nodes['[data-filter-reset]'].hidden,true);
 fields['grammar-source'].value='imported';fields['grammar-group'].value='verbs';vm.runInContext('grammarAtlasSyncFilters()',ctx);assert.equal(nodes['[data-filter-count]'].textContent,' · 2 đang dùng');assert.equal(nodes['[data-filter-reset]'].hidden,false);
 language='de';vm.runInContext('grammarAtlasSyncFilters()',ctx);assert.equal(nodes['[data-filter-title]'].textContent,'Weitere Filter');assert.equal(nodes['[data-filter-count]'].textContent,' · 2 aktiv');
});
test('topic rows are compact while selection and ownership controls remain available',()=>{
 const list={innerHTML:'',querySelectorAll:()=>[]},fields={'#lesson-list':list,'#grammar-level':{value:'B1'},'#grammar-source':{value:'atlas'},'#grammar-group':{value:'all'},'#grammar-search':{value:''}};
 const lesson={id:'topic',title:'Konjunktiv II',subtitle:'Repeated chapter description',levels:['B1'],level:'B1',collectionId:'elio-grammar-atlas-v1',group:'verbs'};
 const ctx=vm.createContext({ElioGrammarAtlasData:[lesson],ImportHub:{collections:()=>[]},Account:{canEdit:()=>false},Auth:{get:()=>({})},$:id=>fields[id],esc:String,App:{t:x=>x}});
 const code=fs.readFileSync('public/js/grammar.js','utf8');vm.runInContext(code.slice(0,code.indexOf('function deleteGrammarTopic')),ctx);vm.runInContext('renderLessonList()',ctx);
 assert(list.innerHTML.includes('Konjunktiv II'));assert(list.innerHTML.includes('data-id="topic"'));assert(!list.innerHTML.includes('Repeated chapter description'));assert(!list.innerHTML.includes('grammar-topic-number'));assert(!list.innerHTML.includes('data-delete-grammar'));
});
