import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import worker from '../worker/index.js';
test('listening backend keeps account authorization, admin diagnostics and German transcript validation',async()=>{
 const db=new DatabaseSync(':memory:');let calls=0,serviceCalls=0;const originalFetch=globalThis.fetch;
 globalThis.fetch=async url=>{assert.equal(new URL(url).hostname,'api.freetranscriptapi.com');serviceCalls++;return new Response(null,{status:503});};
 const env={ADMIN_EMAILS:'admin@example.test',ADMIN_INITIAL_PASSWORD:'Test-pass-493!',AI_ENCRYPTION_KEY:'test-only-key',TRANSCRIPT_NATIVE_FETCH:async()=>{
  calls++;return Response.json({available:true,videoId:'BESKw0hiZ3Q',language:'de',timeUnit:'seconds',source:'youtube-auto',via:'yt-dlp',cues:[{start:10.2,end:16.119,text:'Hallo!'}]});
 },TEST_DB:async(q,args=[])=>{const statement=db.prepare(q);if(/^SELECT/i.test(q.trim()))return {rows:statement.all(...args),changes:0};return {rows:[],changes:Number(statement.run(...args).changes)};}};
 async function call(path,method='GET',data,cookie=''){const r=await worker.fetch(new Request('https://elio.test'+path,{method,headers:{Origin:'https://elio.test',Cookie:cookie,'Content-Type':'application/json'},body:data?JSON.stringify(data):undefined}),env);return {status:r.status,data:await r.json(),cookie:r.headers.get('Set-Cookie')?.split(';')[0]};}
 try{
 assert.equal((await call('/api/listening/captions','POST',{id:'BESKw0hiZ3Q'})).status,401);assert.equal(calls,0);
 const admin=await call('/api/auth/login','POST',{email:'admin@example.test',password:env.ADMIN_INITIAL_PASSWORD});
 const viewer=await call('/api/auth/register','POST',{email:'viewer@example.test',password:'Test-pass-493!'});
 assert.equal(admin.status,200);assert.equal(viewer.status,200);
 assert.equal((await call('/api/admin/listening/transcript-backend','GET',null,viewer.cookie)).status,403);
 const status=await call('/api/admin/listening/transcript-backend','GET',null,admin.cookie);
 assert.equal(status.data.mode,'vercel-python');assert.equal(status.data.configured,true);assert(!JSON.stringify(status.data).includes(env.AI_ENCRYPTION_KEY));
 const transcript=await call('/api/listening/captions','POST',{id:'BESKw0hiZ3Q'},viewer.cookie);
 assert.equal(transcript.status,200);assert.equal(transcript.data.cues[0].start,10.2);assert.equal(transcript.data.via,'yt-dlp');
 assert.equal((await call('/api/admin/listening/transcript-backend','POST',{id:'BESKw0hiZ3Q'},admin.cookie)).data.available,true);
 assert.equal(calls,1);assert.equal(serviceCalls,1); // diagnostics reuse the same durable cache as import
 assert.equal(db.prepare("SELECT COUNT(*) AS n FROM app_config WHERE name LIKE 'listening-transcript:%'").get().n,1);
 globalThis.fetch=async()=>Response.json({language:'de',transcript:[{start:2.5,duration:1.2,text:'Guten Tag!'}]});
 const hosted=await call('/api/admin/listening/transcript-backend','POST',{id:'cloudtest01'},admin.cookie);
 assert.equal(hosted.data.via,'freetranscriptapi');assert.equal(calls,1);assert.equal(hosted.data.cues[0].end,3.7);
 globalThis.fetch=async()=>{throw Error('cached import must not call upstream');};
 const reused=await call('/api/listening/captions','POST',{id:'cloudtest01'},viewer.cookie);
 assert.equal(reused.data.available,true);assert.equal(reused.data.cached,true);
 assert.equal((await call('/api/admin/listening/transcript-backend','POST',{id:'invalid'},admin.cookie)).status,400);
 assert.equal((await call('/api/state','GET',null,viewer.cookie)).data.records.listeningV2,undefined);
 }finally{globalThis.fetch=originalFetch;db.close();}
});
