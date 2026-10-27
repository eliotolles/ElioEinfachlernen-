import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
function harness(){
 let records=[],reloads=0,renders=0;
 const listeners={},select={value:'',dataset:{},set innerHTML(value){this.markup=value;this.value='';}},draft={value:'Ich arbeite sorgfältig.'},topic={};
 const ctx=vm.createContext({isSpeaking:false,Auth:{get:()=>records},esc:String,$:id=>({'#tutor-collection':select,'#tutor-topic':topic,'#chat-input':draft}[id]),TutorLibrary:{render:()=>renders++},loadConversation:()=>reloads++,document:{addEventListener:(name,fn)=>listeners[name]=fn}});
 const code=fs.readFileSync('public/js/conversation.js','utf8');vm.runInContext(code.slice(code.indexOf('function tutorCollections()'),code.indexOf('function setupTutorCollections()')),ctx);
 return {select,draft,listeners,set:v=>records=v,refresh:()=>vm.runInContext('refreshTutorCollections()',ctx),reloads:()=>reloads,renders:()=>renders};
}
const collection={id:'private-housekeeping',type:'tutor',name:'Phỏng vấn buồng phòng',items:[{question:'Warum Housekeeping?',answerDe:'Ich arbeite gern praktisch.',answerVi:'Tôi thích công việc thực hành.'}]};
test('late cloud hydration displays and selects the saved interview without an import',()=>{
 const h=harness();h.refresh();assert(!h.select.markup.includes(collection.name));h.set([collection]);h.listeners.cloudchange();assert(h.select.markup.includes(collection.name));assert.equal(h.select.value,collection.id);assert.equal(h.reloads(),1);assert(h.renders()>=2);
});
test('refreshing the selected collection keeps the draft and does not restart the chat',()=>{
 const h=harness();h.set([collection]);h.select.value=collection.id;h.listeners.cloudchange();assert.equal(h.select.value,collection.id);assert.equal(h.reloads(),0);assert.equal(h.draft.value,'Ich arbeite sorgfältig.');h.listeners.elioviewresume();assert.equal(h.reloads(),0);
});
test('an explicit free conversation stays free when collections refresh',()=>{
 const h=harness();h.set([collection]);h.select.dataset.freeConversation='true';h.listeners.cloudchange();assert.equal(h.select.value,'');assert.equal(h.reloads(),0);
});
test('empty collections are not selected and a removed selection moves to a valid set',()=>{
 const h=harness();h.set([{id:'empty',type:'tutor',items:[]},collection]);h.select.value='deleted-set';h.refresh();assert.equal(h.select.value,collection.id);assert.equal(h.reloads(),1);assert(!h.select.markup.includes('value="empty"'));
});
