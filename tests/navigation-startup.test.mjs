import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const source=fs.readFileSync('public/js/session.js','utf8');
test('authenticated cached startup opens before delayed cloud refresh and retains pending changes',async()=>{let finish;const refresh=new Promise(r=>finish=r),account={authPage:()=>false,current:()=>account.profile?.id,cacheKey:n=>'u:'+n,request:async()=>({user:{id:'u',role:'user'}}),refresh:()=>refresh,status(){}};const ctx={Account:account,AccountCache:{read:async k=>k.endsWith('snapshot')?{user:{id:'u'},records:{drafts:{value:'saved'}}}:k.endsWith('pending')?{drafts:{value:'unsynced'}}:{}},localStorage:{getItem:()=>null}};vm.createContext(ctx);vm.runInContext(source.slice(source.indexOf('async function restoreAccountSnapshot'),source.indexOf("window.addEventListener('online'")),ctx);await account.ready;assert.equal(account.records.drafts.value,'saved');assert.equal(account.pending.drafts.value,'unsynced');assert(account.backgroundRefresh);finish();await account.backgroundRefresh;});
test('cached startup rejects a snapshot belonging to a different account',async()=>{const account={profile:{id:'u'},current:()=> 'u',cacheKey:n=>n};const ctx={Account:account,AccountCache:{read:async()=>({user:{id:'other'},records:{secret:1}})}};vm.createContext(ctx);vm.runInContext(source.slice(source.indexOf('async function restoreAccountSnapshot'),source.indexOf('Account.ready=')),ctx);assert.equal(await ctx.restoreAccountSnapshot(),false);assert.equal(account.records,undefined);});
test('login redirects after credentials succeed without waiting for a full state download',async()=>{
 const method=source.slice(source.indexOf('async authenticate('),source.indexOf('\n destination(')).trim().replace(/,$/,'');
 const calls=[],ctx={};vm.createContext(ctx);const account=vm.runInContext('({'+method+'})',ctx);
 account.request=async(path)=>{calls.push(path);return {user:{id:'new-user',passwordExpired:false}};};
 account.refresh=()=>{throw Error('Full state must load on the destination, not on login');};
 assert.equal(await account.authenticate('learner@example.com','test-password'),'new-user');
 assert.deepEqual(calls,['/api/auth/login']);
 account.request=async()=>{throw Object.assign(Error('Unauthorized'),{status:401});};account.profile=null;
 await assert.rejects(account.authenticate('learner@example.com','wrong-password'),/Unauthorized/);assert.equal(account.profile,null);
});
test('public Google sign-in configuration does not wait for database initialization',async()=>{
 const {default:worker}=await import('../worker/index.js');
 const response=await worker.fetch(new Request('https://elio.test/api/auth/google/config'),{TEST_DB:()=>{throw Error('Database unavailable');}});
 assert.equal(response.status,200);assert.deepEqual(await response.json(),{enabled:false});
});
