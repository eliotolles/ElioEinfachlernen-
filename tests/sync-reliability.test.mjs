import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
const source=fs.readFileSync('public/js/session.js','utf8');
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
function fixture(){
 const writes=[];
 const context={structuredClone,crypto:webcrypto,navigator:{onLine:true},location:{pathname:'/index.html'},localStorage:{setItem(){},removeItem(){}},document:{getElementById:()=>null,querySelectorAll:()=>[],dispatchEvent(){}},Event:class{},setTimeout:()=>0,clearTimeout(){},AccountCache:{write:async(k,v)=>{writes.push([k,structuredClone(v)]);},read:async(k,f)=>f}};
 vm.createContext(context);vm.runInContext(source.slice(0,source.indexOf('async function restoreAccountSnapshot'))+';this.account=Account;',context);
 const a=context.account;a.profile={id:'alice',role:'user'};a.loaded=true;a.request=async()=>({user:a.profile,records:{},shared:{},config:{}});
 return {a,context,writes};
}
test('a late refresh cannot replace the new account or expose the old account records',async()=>{
 const {a}=fixture(),network=deferred();a.request=()=>network.promise;
 const refresh=a.refresh();a.profile={id:'bob'};a.records={drafts:{value:'Bob',version:1}};
 network.resolve({user:{id:'alice'},records:{drafts:{value:'Alice',version:1}},shared:{},config:{}});await refresh;
 assert.equal(a.current(),'bob');assert.equal(a.records.drafts.value,'Bob');
});
test('overlapping refreshes cannot regress a record or resurrect a deleted record',async()=>{
 const {a}=fixture(),first=deferred(),second=deferred();let calls=0;a.request=()=>++calls===1?first.promise:second.promise;
 a.records={drafts:{value:'old',version:1}};const old=a.refresh(),newer=a.refresh();
 second.resolve({user:a.profile,records:{drafts:{value:'new',version:3}},shared:{},config:{}});await newer;
 first.resolve({user:a.profile,records:{drafts:{value:'stale',version:2}},shared:{},config:{}});await old;
 assert.equal(a.records.drafts.value,'new');
});
test('an older refresh cannot remove a record acknowledged while it was in flight',async()=>{
 const {a}=fixture(),network=deferred();a.request=()=>network.promise;
 const refresh=a.refresh();a.records.drafts={value:'saved',version:1};
 network.resolve({user:a.profile,records:{},shared:{},config:{}});await refresh;assert.equal(a.records.drafts.value,'saved');
});
test('overlapping flush callers wait for the same save and retain edits typed during the request',async()=>{
 const {a}=fixture(),network=deferred();let calls=0;a.lastRefresh=Date.now();a.refresh=async()=>{};
 a.request=async()=>{calls++;return network.promise;};a.set('drafts',{text:'first'});
 let secondFinished=false;const first=a.flush(),second=a.flush().then(()=>{secondFinished=true;});await Promise.resolve();assert.equal(secondFinished,false);
 a.set('drafts',{text:'second'});network.resolve({version:1});await Promise.all([first,second]);
 assert.equal(calls,1);assert.equal(a.pending.drafts.value.text,'second');assert.equal(a.pending.drafts.version,1);
});
test('an old account save response never changes the new account pending data',async()=>{
 const {a}=fixture(),network=deferred();a.refresh=async()=>{};a.request=()=>network.promise;a.set('drafts',{text:'Alice'});const saving=a.flush();
 a.profile={id:'bob'};a.pending={drafts:{name:'drafts',value:{text:'Bob'},version:0,stamp:'bob'}};a.records={};
 network.resolve({version:7});await saving;assert.equal(a.pending.drafts.version,0);assert.equal(a.records.drafts,undefined);
});
test('offline snapshots are persisted in call order even when storage is slow',async()=>{
 const {a,context}=fixture(),gate=deferred(),stored=new Map();let started=0;
 context.AccountCache.write=async(key,value)=>{if(++started===1)await gate.promise;stored.set(key,structuredClone(value));};
 a.pending={drafts:{value:'first'}};const first=a.persist();await Promise.resolve();a.pending={drafts:{value:'second'}};const second=a.persist();gate.resolve();await Promise.all([first,second]);
 assert.equal(stored.get('elio:alice:pending').drafts.value,'second');
});

test('a late unauthorized response does not log out the newly selected account',async()=>{
 const {a,context}=fixture(),network=deferred();context.fetch=()=>network.promise;
 // Restore the real request implementation instead of the fixture transport.
 const start=source.indexOf(' async request('),end=source.indexOf('\n async hash',start);
 a.request=vm.runInNewContext('({'+source.slice(start,end).trim().replace(/,$/,'')+'})',context).request;
 a.redirectToLogin=()=>assert.fail('must not redirect Bob');const work=a.request('/api/state');a.profile={id:'bob'};
 network.resolve({ok:false,status:401,json:async()=>({error:'Expired Alice session'})});await assert.rejects(work);assert.equal(a.current(),'bob');
});
test('newer deletion remains deleted when an older refresh finishes afterward',async()=>{
 const {a}=fixture(),first=deferred(),second=deferred();let calls=0;a.request=()=>++calls===1?first.promise:second.promise;a.records={drafts:{value:'old',version:1}};
 const old=a.refresh(),current=a.refresh();second.resolve({user:a.profile,records:{},shared:{},config:{}});await current;
 first.resolve({user:a.profile,records:{drafts:{value:'old',version:1}},shared:{},config:{}});await old;assert.equal(a.records.drafts,undefined);
});
test('study backup includes listening and pending edits, preserves scopes and excludes configuration secrets',()=>{
 const {a}=fixture();a.config={apiKey:'secret'};a.records={listeningV2:{value:{videos:[{id:'v',cues:[{start:44,end:46,text:'Hallo'}]}]},version:4},ai:{value:'secret'}};a.shared={vocab:{value:[{id:'common'}],version:7}};a.pending={drafts:{name:'drafts',value:'unsaved',shared:false,version:2},secret:{name:'apiKey',value:'secret'}};
 const backup=a.createStudyBackup();assert.equal(backup.schemaVersion,4);assert.equal(backup.records.listeningV2.version,4);assert.equal(backup.shared.vocab.version,7);assert.equal(backup.pending.drafts.value,'unsaved');assert(!JSON.stringify(backup).includes('secret'));backup.records.listeningV2.value.videos[0].id='changed';assert.equal(a.records.listeningV2.value.videos[0].id,'v');
});
test('restore plan never promotes admin private vocabulary to shared or permits a user to restore shared rows',()=>{
 const {a}=fixture();a.profile.role='super_admin';a.records={vocab:{value:[{id:'private',level:'B1'}],version:2}};a.shared={vocab:{value:[{id:'common'}],version:9}};
 const backup=a.createStudyBackup(),plan=a.planStudyRestore(backup);assert.equal(plan.length,2);assert.equal(plan.find(j=>!j.shared).value[0].id,'private');assert.equal(plan.find(j=>j.shared).value[0].id,'common');
 a.profile.role='user';const own=a.planStudyRestore(backup);assert.equal(own.length,1);assert.equal(own[0].shared,false);
 backup.userId='bob';assert.throws(()=>a.planStudyRestore(backup),/tài khoản/);
});
test('restore snapshots current data first and uses current versions instead of the backup versions',async()=>{
 const {a,writes}=fixture();a.records={drafts:{value:'backup',version:1}};const backup=a.createStudyBackup();a.records={drafts:{value:'current',version:8}};a.refresh=async()=>true;a.flush=async()=>{};
 await a.restoreStudyBackup(backup);const saved=writes.find(([key])=>key.includes(':restore-backup:'));assert(saved);assert.equal(saved[1].records.drafts.value,'current');assert.equal(a.pending.drafts.version,8);assert.equal(a.pending.drafts.value,'backup');
 await assert.rejects(a.restoreStudyBackup(backup),/đang chờ/);
});
test('unresolved backup conflicts and malformed shared arrays are not silently restored',()=>{
 const {a}=fixture(),backup=a.createStudyBackup();backup.conflicts={drafts:{name:'drafts',value:'A',latest:{value:'B'}}};assert.throws(()=>a.planStudyRestore(backup),/xung đột/);
 backup.conflicts={};a.profile.role='super_admin';backup.shared={vocab:{value:{wrong:true},version:1}};assert.throws(()=>a.planStudyRestore(backup),/danh sách/);
});

test('legacy mixed backups keep admin private entries private and retain newer shared items',()=>{
 const {a}=fixture();a.profile.role='super_admin';a.shared={vocab:{value:[{id:'common',vi:'current'},{id:'new-common',vi:'new'}],version:8}};
 const backup=a.normalizeStudyBackup({app:'Elio Einfach',schemaVersion:3,data:{vocab:[{id:'common',vi:'old'},{id:'private',vi:'mine',level:'B1'}],settings:{language:'vi'}}});
 assert.equal(backup.records.vocab.value.length,1);assert.equal(backup.records.vocab.value[0].id,'private');assert.equal(backup.shared.vocab.value.length,2);assert.equal(backup.shared.vocab.value[1].id,'new-common');
 a.profile.role='user';const personal=a.normalizeStudyBackup({app:'Elio Einfach',data:{vocab:[{id:'common'},{id:'own'}]}});assert.equal(personal.shared.vocab,undefined);assert.equal(personal.records.vocab.value[0].id,'own');
});

test('session identity mismatch retains the pending draft without treating it as a record version conflict',async()=>{
 const {a}=fixture();a.request=async()=>{throw Object.assign(Error('Account changed'),{status:409,data:{code:'ACCOUNT_CHANGED'}});};a.set('drafts',{text:'Keep Alice draft'});await a.flush();
 assert.equal(a.pending.drafts.value.text,'Keep Alice draft');assert.equal(a.conflicts.drafts,undefined);assert.equal(a.pending.drafts.error,'Account changed');
});
test('restore refuses to stage data if the latest account snapshot could not be verified',async()=>{
 const {a,writes}=fixture(),backup=a.createStudyBackup();a.refresh=async()=>false;await assert.rejects(a.restoreStudyBackup(backup),/mới nhất/);assert.equal(Object.keys(a.pending).length,0);assert.equal(writes.length,0);
});
