import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
function fixture(request){
 const stored=new Map(),events=[],listeners={};
 const c={Auth:{user:'alice'},App:{explain:()=> 'vi'},Account:{request},localStorage:{getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,v),removeItem:k=>stored.delete(k)},document:{dispatchEvent:e=>events.push(e.detail),addEventListener:(n,fn)=>listeners[n]=fn},CustomEvent:class{constructor(type,{detail}){this.detail=detail;}},setTimeout:fn=>fn(),$:()=>({})};
 vm.createContext(c);vm.runInContext(fs.readFileSync('public/js/ai.js','utf8')+';this.run=serverAI;',c);return {c,stored,events,listeners};
}
test('identical simultaneous AI tasks share one request',async()=>{
 let resolve,calls=0;const {c}=fixture(()=>{calls++;return new Promise(r=>resolve=r);});
 const a=c.run('same'),b=c.run('same');assert.equal(a,b);assert.equal(calls,1);resolve({text:'{"ok":true}',truncated:false});assert.equal(await a,await b);
});
test('simultaneous failed continuations keep independent checkpoints and resume without repeating prefixes',async()=>{
 const calls=[];let phase='partial';const {c,stored}=fixture(async(path,method,data)=>{
  calls.push({...data});if(phase==='partial'){if(data.continuation)throw Error('offline');return {text:'{"'+data.prompt+'":',truncated:true};}
  return {text:'true}',truncated:false};
 });
 await Promise.allSettled([c.run('first'),c.run('second')]);assert.equal(stored.size,2);
 assert.deepEqual([...stored.values()].map(v=>JSON.parse(v).prompt).sort(),['first','second']);phase='resume';
 const result=await Promise.all([c.run('first'),c.run('second')]);assert.deepEqual(result,['{"first":true}','{"second":true}']);assert.equal(stored.size,0);
 assert.equal(calls.at(-1).continuation,'{"second":');
});
test('task and explanation language changes do not resume an unrelated checkpoint',async()=>{
 let phase=0;const seen=[];const {c,stored}=fixture(async(p,m,d)=>{seen.push(d);if(!phase){if(d.continuation)throw Error('offline');return {text:'{"old":',truncated:true};}return {text:'{"fresh":true}',truncated:false};});
 await assert.rejects(c.run('same',[],{language:'vi',task:'text'}));phase=1;
 await c.run('same',[],{language:'en',task:'image'});assert.equal(seen.at(-1).continuation,'');assert.equal(stored.size,1);
});
test('a response delivered after changing accounts is rejected before any checkpoint or result is accepted',async()=>{
 let resolve;const {c,stored}=fixture(()=>new Promise(r=>resolve=r));const work=c.run('one');c.Auth.user='bob';resolve({text:'{"private":true}',truncated:false});await assert.rejects(work,/tài khoản/);assert.equal(stored.size,0);
});

test('legacy attachment checkpoints resume with the old signature without losing received content',async()=>{
 const attachment={mimeType:'image/png',data:'YQ=='},prefix='{"kept":';let hash=2166136261;for(const ch of attachment.data)hash=Math.imul(hash^ch.charCodeAt(0),16777619);
 let received;const {c,stored}=fixture(async(p,m,data)=>{received=data;return {text:'true}',truncated:false};});
 stored.set('dt:alice:ai-continuation',JSON.stringify({prompt:'legacy',attachmentSignature:'image/png:4:'+(hash>>>0),text:prefix}));
 assert.equal(await c.run('legacy',[attachment]),'{"kept":true}');assert.equal(received.continuation,prefix);assert.equal(stored.size,0);
});
test('completing one job does not hide another active job progress',()=>{
 const {c,listeners}=fixture(async()=>{}),status={hidden:true,textContent:''};c.document.getElementById=()=>status;
 const send=(jobId,message)=>listeners['ai-progress']({detail:{user:'alice',jobId,message}});
 send('a','First');send('b','Second');assert.equal(status.hidden,false);assert(status.textContent.includes('First'));assert(status.textContent.includes('Second'));
 send('a','');assert.equal(status.hidden,false);assert.equal(status.textContent,'Second');send('b','');assert.equal(status.hidden,true);
});
