import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import worker from '../worker/index.js';
test('an old tab cannot read, write or log out the account selected in another tab',async()=>{
 const db=new DatabaseSync(':memory:');
 const env={TEST_DB:async(q,args=[])=>{const s=db.prepare(q);return /^SELECT/i.test(q.trim())?{rows:s.all(...args),changes:0}:{rows:[],changes:Number(s.run(...args).changes)};}};
 async function call(path,method='GET',data,cookie='',user){
  const r=await worker.fetch(new Request('https://elio.test'+path,{method,headers:{Origin:'https://elio.test',Cookie:cookie,'Content-Type':'application/json',...(user?{'X-Elio-User':user}:{})},body:data?JSON.stringify(data):undefined}),env);
  return {status:r.status,data:await r.json(),cookie:r.headers.get('Set-Cookie')?.split(';')[0]};
 }
 try{
  const alice=await call('/api/auth/register','POST',{email:'alice@example.test',password:'Alice-Test-493!'}),bob=await call('/api/auth/register','POST',{email:'bob@example.test',password:'Bob-Test-493!'});
  assert.equal(alice.status,200);assert.equal(bob.status,200);
  for(const [path,method,data]of [['/api/state','GET'],['/api/state','PUT',{name:'drafts',value:'Alice private draft',version:0}],['/api/auth/logout','POST',{}]]){
   const r=await call(path,method,data,bob.cookie,alice.data.user.id);assert.equal(r.status,409);assert.equal(r.data.code,'ACCOUNT_CHANGED');assert.equal(r.data.records,undefined);
  }
  const bobState=await call('/api/state','GET',null,bob.cookie,bob.data.user.id);assert.equal(bobState.status,200);assert.equal(bobState.data.records.drafts,undefined);
  const own=await call('/api/state','PUT',{name:'drafts',value:'Bob draft',version:0},bob.cookie,bob.data.user.id);assert.equal(own.status,200);
  assert.equal((await call('/api/state','PUT',{name:'drafts',value:'stale',version:0},bob.cookie,bob.data.user.id)).status,409);
  // Existing clients without the new header still use the original session and CAS checks.
  assert.equal((await call('/api/auth/me','GET',null,bob.cookie)).status,200);
 }finally{db.close();}
});
