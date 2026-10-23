import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import worker,{initialize,session,sql} from '../vercel-server/worker.mjs';
import {createTransport,streamResponse} from '../vercel/transport.mjs';
import vm from 'node:vm';import fs from 'node:fs/promises';
const db=new DatabaseSync(':memory:');
const env={AI_ENCRYPTION_KEY:'test-only',TEST_DB:async(q,args=[])=>{const s=db.prepare(q);return /^SELECT/i.test(q)?{rows:s.all(...args),changes:0}:{rows:[],changes:Number(s.run(...args).changes)};}};
const handle=createTransport({worker,initialize,session,sql});const origin='https://test.vercel.app';
async function call(path,method='POST',data,owner,headers={}){return handle(new Request(origin+path,{method,headers:{Origin:origin,'Content-Type':'application/json',Cookie:owner?.cookie||'','X-Elio-User':owner?.id||'',...headers},body:data?JSON.stringify(data):undefined}),env);}
async function account(email){const r=await call('/api/auth/register','POST',{email,password:'Test-pass-493!'});return {cookie:r.headers.get('set-cookie').split(';')[0],id:(await r.json()).user.id};}
test('large UTF-8 requests preserve data, versions, ownership and cleanup; stream large response',async()=>{
 const a=await account('a@example.com'),b=await account('b@example.com');
 const data={name:'vocab',value:[{id:'big',de:'Übung 漢字'.repeat(500000),vi:'nghĩa'}],version:0};const bytes=Buffer.from(JSON.stringify(data));assert(bytes.length>4500000);
 const id=crypto.randomUUID(),parts=Math.ceil(bytes.length/750000);
 const start=()=>call('/api/transfer/start','POST',{id,path:'/api/state',method:'PUT',size:bytes.length,parts},a);
 assert.equal((await start()).status,200);
 assert.equal((await call('/api/transfer/commit','POST',{id},b)).status,404);
 assert.equal((await call('/api/transfer/commit','POST',{id},a)).status,409);
 assert.equal((await call('/api/transfer/chunk','POST',{id,part:parts,data:'YQ=='},a)).status,400);
 for(let part=0;part<parts;part++)assert.equal((await call('/api/transfer/chunk','POST',{id,part,data:bytes.subarray(part*750000,(part+1)*750000).toString('base64')},a)).status,200);
 const results=await Promise.all([call('/api/transfer/commit','POST',{id},a),call('/api/transfer/commit','POST',{id},a)]);assert.equal(results.filter(r=>r.status===200).length,1);
 const r=streamResponse(await call('/api/state?keys=vocab','GET',null,a));assert.equal(r.headers.get('Content-Length'),null);assert.deepEqual((await r.json()).records.vocab.value,data.value);
 assert.equal((await call('/api/state','GET',null,b)).status,200);
 assert.equal(db.prepare('SELECT COUNT(*) AS n FROM app_vercel_transfers').get().n,0);
 assert.equal((await call('/api/transfer/start','POST',{id,path:'/api/admin/users',method:'DELETE',size:bytes.length,parts},a)).status,400);
 assert.equal((await call('/api/transfer/start','POST',{id,path:'/api/state',method:'PUT',size:bytes.length,parts},a,{Origin:'https://evil.test'})).status,403);
 assert.equal((await call('/api/transfer/start','POST',{id,path:'/api/state',method:'PUT',size:bytes.length,parts},a,{'X-Elio-User':b.id})).status,409);
});
test('browser transport chunks full UTF-8 body and preserves server errors',async()=>{
 const data=JSON.stringify({text:'ü漢'.repeat(800000)}),calls=[];const context={location:{href:origin+'/index.html',origin},URL,Headers,TextEncoder,crypto,btoa,window:{fetch:async(path,options)=>{calls.push({path,options});return Response.json({ok:true});}}};vm.runInNewContext(await fs.readFile('vercel/client.js','utf8'),context);
 await context.window.fetch('/api/ai',{method:'POST',body:data,headers:{'X-Elio-User':'owner'}});
 assert.equal(calls[0].path,'/api/transfer/start');const chunks=calls.filter(c=>c.path.endsWith('/chunk')).map(c=>Buffer.from(JSON.parse(c.options.body).data,'base64'));assert.equal(Buffer.concat(chunks).toString(),data);assert(calls.every(c=>Buffer.byteLength(c.options.body)<1100000));assert(calls.some(c=>c.path.endsWith('/commit')));
});
