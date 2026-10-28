import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const server=fs.readFileSync('worker/index.js','utf8'),client=fs.readFileSync('public/js/session.js','utf8');
function backend(){
 const calls=[],big='x'.repeat(1000000),rows={records:[{name:'drafts',version:2,value:JSON.stringify({text:big})}],shared:[{name:'vocab',version:8,value:JSON.stringify([{de:'Haus',vi:big}])}]};
 const context={DATA_KEYS:new Set(['drafts','vocab']),publicUser:u=>({id:u.id}),error:(status,message)=>Object.assign(Error(message),{status}),sql:async(env,q,args=[])=>{calls.push(q);if(q.includes('app_config'))return {rows:[]};const own=q.includes('app_records'),items=rows[own?'records':'shared'];if(q.startsWith('SELECT name,version'))return {rows:items.map(({name,version})=>({name,version}))};return {rows:items.filter(r=>!q.includes(' IN (')||args.includes(r.name))};}};
 vm.createContext(context);vm.runInContext(server.slice(server.indexOf('async function state('),server.indexOf('\nfunction preserveListeningCategories')),context);return {context,calls,rows};
}
test('unchanged large records return versions/presence without reading or transmitting values',async()=>{
 const {context,calls}=backend();context.versions={records:{drafts:2},shared:{vocab:8}};const result=await vm.runInContext("state({}, {id:'alice'}, null, versions)",context);
 assert.deepEqual(Object.keys(result.records),[]);assert.deepEqual(Object.keys(result.shared),[]);assert(result.delta);assert(result.present.shared.includes('vocab'));assert(JSON.stringify(result).length<500);assert(!calls.some(q=>q.startsWith('SELECT name,value')));
});
test('a changed shared group is fetched while the unchanged private group is omitted',async()=>{
 const {context,calls}=backend();context.versions={records:{drafts:2},shared:{vocab:7}};const result=await vm.runInContext("state({}, {id:'alice'}, null, versions)",context);assert.equal(result.shared.vocab.version,8);assert(!result.records.drafts);assert(calls.some(q=>q.includes('name,value')&&q.includes('app_shared')));assert(!calls.some(q=>q.includes('name,value')&&q.includes('app_records')));
});
test('older clients receive a complete snapshot; malformed version tokens are rejected',async()=>{
 const {context}=backend();const result=await vm.runInContext("state({}, {id:'alice'})",context);assert.equal(result.records.drafts.version,2);assert.equal(result.shared.vocab.version,8);assert(!result.delta);
 for(const raw of ['null','[]','{"records":{},"shared":{"secret":1}}','{"records":{"drafts":-1},"shared":{}}']){context.raw=raw;assert.throws(()=>vm.runInContext('stateVersions(raw)',context),e=>e.status===400);}
});
function frontend(){const context={structuredClone,navigator:{onLine:true},location:{pathname:'/index.html'},localStorage:{setItem(){},removeItem(){}},document:{getElementById:()=>null,querySelectorAll:()=>[],dispatchEvent(){}},Event:class{},setTimeout:()=>0,clearTimeout(){},AccountCache:{write:async()=>{},read:async(k,f)=>f}};vm.createContext(context);vm.runInContext(client.slice(0,client.indexOf('async function restoreAccountSnapshot'))+';this.a=Account;',context);context.a.profile={id:'alice',role:'user'};context.a.loaded=true;return context.a;}
test('delta preserves unchanged cached values and offline edits, removes a deleted server record',async()=>{
 const a=frontend();a.records={drafts:{value:'cached',version:2},history:{value:[],version:1}};a.shared={vocab:{value:[{de:'Haus'}],version:8}};a.pending.drafts={name:'drafts',value:'unsaved',version:2,stamp:'p'};let request;
 a.request=async path=>{request=path;return {user:a.profile,records:{},shared:{},config:{},delta:true,present:{records:['drafts'],shared:['vocab']}};};
 await a.refresh();assert.equal(a.records.drafts.value,'cached');assert.equal(a.shared.vocab.version,8);assert(!a.records.history);assert.equal(a.pending.drafts.value,'unsaved');const token=JSON.parse(new URL(request,'https://elio.test').searchParams.get('versions'));assert.equal(token.records.drafts,2);assert.equal(token.shared.vocab,8);assert(!JSON.stringify(token).includes('unsaved'));
});
test('first load omits versions and scoped refresh does not remove unrelated data',async()=>{
 const a=frontend();a.loaded=false;a.records.history={value:[],version:4};let request;a.request=async path=>{request=path;return {user:a.profile,records:{drafts:{value:'new',version:1}},shared:{},config:{}};};await a.refresh(['drafts']);assert(!request.includes('versions='));assert.equal(a.records.history.version,4);assert.equal(a.records.drafts.value,'new');
});
