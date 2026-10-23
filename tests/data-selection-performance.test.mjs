import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
function account(){const c={structuredClone,URLSearchParams};vm.createContext(c);const s=fs.readFileSync('public/js/session.js','utf8');vm.runInContext(s.slice(0,s.indexOf('async function restoreAccountSnapshot'))+';this.account=Account;',c);return {a:c.account,c};}
test('projected reads preserve scopes, pending/conflicts, duplicate precedence and isolation',()=>{
 const {a}=account();a.profile={id:'u'};a.shared.materials={value:[{id:'same',name:'shared'},{id:'s'}]};a.records.materials={value:[{id:'same',name:'private'},{id:'p'}]};
 const ids=()=>a.project('materials',rows=>rows.map(r=>({id:r.id,name:r.name})));
 assert.equal(ids().map(r=>r.id).join(','),'same,s,p');assert.equal(ids()[0].name,'shared');
 a.pending['shared:materials']={value:[{id:'pending'}],stamp:'one'};assert.equal(ids()[0].id,'pending');delete a.pending['shared:materials'];a.conflicts['shared:materials']={value:[{id:'conflict'}]};assert.equal(ids()[0].id,'conflict');
 const result=ids();result[0].id='mutated';assert.equal(ids()[0].id,'conflict');
 a.records={};a.shared={};a.pending={};a.conflicts={};a.profile={id:'other'};assert.equal(ids().length,0);
});
test('vocabulary headers skip full exam content and nested word data before cloning',()=>{
 const {a,c}=account();a.shared.materials={value:[{id:'exam',type:'exam',get items(){assert.fail('exam payload must not be read');}},{id:'deck',type:'vocabulary',name:'B1',items:[{get de(){assert.fail('nested word payload must not be read');}}]}]};
 vm.runInContext(fs.readFileSync('public/js/vocab-catalog.js','utf8')+';this.catalog=VocabCatalog;',c);
 const headers=c.catalog.materials();assert.equal(headers.length,1);assert.equal(headers[0].id,'deck');assert.equal(headers[0].items.length,1);headers[0].name='changed';assert.equal(a.shared.materials.value[1].name,'B1');
});
test('exam summaries never clone source text/images and selected collection copies only that collection',()=>{
 const {a,c}=account();c.document={};a.shared.materials={value:[{id:'first',type:'exam',name:'PETRA',items:[{id:'r',skill:'reading',teil:2,get content(){assert.fail('summaries must not read source content');}}]},{id:'selected',type:'exam',items:[{id:'q',content:'Original',questions:[{id:'q6',answer:'B'}]}]},{id:'vocab',type:'vocabulary',get items(){assert.fail('unrelated deck must not be copied');}}]};
 vm.runInContext(fs.readFileSync('public/js/import-hub.js','utf8')+';this.hub=ImportHub;',c);
 assert.equal(c.hub.summaries('exam').length,2);const selected=c.hub.collection('selected');assert.equal(selected.items[0].questions[0].answer,'B');selected.items[0].content='Changed';assert.equal(c.hub.collection('selected').items[0].content,'Original');
});
test('same-document deck navigation emits only hashchange without refreshing modules',()=>{
 const source=fs.readFileSync('public/js/navigation.js','utf8'),start=source.indexOf('    if(key===current&&key===ownKey)'),end=source.indexOf('    if(key===ownKey)',start),events=[];
 const c={key:'vocab',current:'vocab',ownKey:'vocab',previousHash:'#catalog=level',u:{hash:'#deck=goethe&catalog=level'},window:{dispatchEvent:e=>events.push(e.type)},Event:class{constructor(type){this.type=type;}}};vm.createContext(c);vm.runInContext('function navigate(push=true){'+source.slice(start,end)+'throw Error("must stop");}navigate();',c);assert.deepEqual(events,['hashchange']);
});
