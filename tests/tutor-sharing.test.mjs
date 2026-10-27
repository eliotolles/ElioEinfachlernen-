import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const code=fs.readFileSync('public/js/conversation.js','utf8');
function setup(extra={}){const ctx=vm.createContext({structuredClone,Date,...extra});vm.runInContext(code.slice(code.indexOf('function publicTutorCopy'),code.indexOf('function setupTutorCollections')),ctx);return ctx;}
test('sharing creates a separate stable collection without learning history or source mutation',()=>{
 const source={id:'private-id',type:'tutor',scope:'personal',name:'Buồng phòng',items:[{id:'q1',number:1,question:'Warum?',answerDe:'Ich lerne gern.',answerVi:'Tôi thích học.',attempts:['PRIVATE']}],progress:{score:5}};
 const before=JSON.stringify(source),ctx=setup();ctx.source=source;const copy=JSON.parse(vm.runInContext('JSON.stringify(publicTutorCopy(source))',ctx));
 assert.equal(copy.id,'tutor-shared-private-id');assert.equal(copy.scope,'shared');assert.equal(copy.items[0].id,'q1');assert(!('attempts' in copy.items[0]));assert(!('progress' in copy));assert.equal(JSON.stringify(source),before);
 ctx.existing={id:copy.id,createdAt:1};const update=JSON.parse(vm.runInContext('JSON.stringify(publicTutorCopy(source,existing))',ctx));assert.equal(update.id,copy.id);assert.equal(update.createdAt,1);
});
test('incomplete data cannot be published and a user cannot start a shared write',async()=>{
 let called=false;const ctx=setup({Auth:{user:'u',require:()=>true},Account:{profile:{role:'user'},refresh:()=>{called=true;}},tutorCollection:()=>({id:'mine'}),$:()=>({})});
 assert.throws(()=>vm.runInContext("publicTutorCopy({type:'tutor',items:[{question:'Missing answers'}]})",ctx),/chưa đủ/);
 await vm.runInContext('publishTutorCollection()',ctx);assert.equal(called,false);
});
