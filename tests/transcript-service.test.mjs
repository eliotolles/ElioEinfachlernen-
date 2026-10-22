import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import worker from '../worker/index.js';

// Use the real API and an isolated database; every external request is mocked.
const db=new DatabaseSync(':memory:');
const env={TEST_DB:async(query,args=[])=>{
 const statement=db.prepare(query);
 if(/^SELECT/i.test(query.trim()))return {rows:statement.all(...args),changes:0};
 return {rows:[],changes:Number(statement.run(...args).changes)};
}};
let cookie;
async function request(path,body){
 const response=await worker.fetch(new Request('https://elio.test'+path,{
  method:'POST',headers:{Origin:'https://elio.test','Content-Type':'application/json',Cookie:cookie||''},body:JSON.stringify(body)
 }),env);
 return {status:response.status,data:await response.json(),cookie:response.headers.get('Set-Cookie')?.split(';')[0]};
}
const transcriptHost='api.freetranscriptapi.com';
const watchPage=id=>'var ytInitialPlayerResponse = '+JSON.stringify({videoDetails:{videoId:id},captions:{playerCaptionsTracklistRenderer:{captionTracks:[{languageCode:'de',baseUrl:'https://www.youtube.com/api/timedtext?v='+id}]}}});
async function withTransport(transport,run){const original=globalThis.fetch;globalThis.fetch=transport;try{await run();}finally{globalThis.fetch=original;}}

test('timestamped service, direct fallback, cache, malformed data and quota stay isolated',async t=>{
 const login=await request('/api/auth/register',{email:'transcripts@example.test',password:'Transcript-Test-493!'});
 assert.equal(login.status,200);cookie=login.cookie;
 await t.test('German timestamps are preserved and cached without calling YouTube or AI',async()=>{
  const id='service0001';let calls=0;
  await withTransport(async(url,options)=>{
   calls++;assert.equal(new URL(url).hostname,transcriptHost);assert.equal(new URL(url).searchParams.get('lang'),'de');assert.equal(new URL(url).searchParams.get('video_url'),id);assert.equal(options.redirect,'error');
   return Response.json({language:'de',transcript:[{start:44,duration:2,text:'Guten Morgen!'}]});
  },async()=>{
   for(let i=0;i<2;i++){const result=await request('/api/listening/captions',{id});assert.equal(result.status,200);assert.equal(result.data.via,'freetranscriptapi');assert.deepEqual(result.data.cues,[{start:44,end:46,text:'Guten Morgen!'}]);}
   assert.equal(calls,1);
  });
 });
 await t.test('foreign, malformed, oversized, unavailable and failed service responses fall back to original German CC',async()=>{
  const failures=[
   ()=>Response.json({language:'en',transcript:[{start:0,duration:1,text:'Hello'}]}),
   ()=>Response.json({language:'de',transcript:[{start:0,duration:-1,text:'Hallo'}]}),
   ()=>new Response('x'.repeat(3000001)),
   ()=>new Response(null,{status:503}),
   ()=>{throw Error('service offline');}
  ];
  for(let i=0;i<failures.length;i++){
   const id='fallback00'+i,hosts=[];
   await withTransport(async url=>{
    const u=new URL(url);hosts.push(u.hostname);
    if(u.hostname===transcriptHost)return failures[i]();
    assert.equal(u.hostname,'www.youtube.com');
    return u.pathname==='/watch'?new Response(watchPage(id)):Response.json({events:[{tStartMs:44000,dDurationMs:2000,segs:[{utf8:'Hallo!'}]}]});
   },async()=>{const result=await request('/api/listening/captions',{id});assert.equal(result.status,200);assert.equal(result.data.available,true);assert.equal(result.data.via,undefined);assert.deepEqual(result.data.cues,[{start:44,end:46,text:'Hallo!'}]);assert.deepEqual(hosts,[transcriptHost,'www.youtube.com','www.youtube.com']);});
  }
 });
 await t.test('quota pauses only the optional service while direct CC continues',async()=>{
  let serviceCalls=0;
  await withTransport(async url=>{
   const u=new URL(url);
   if(u.hostname===transcriptHost){serviceCalls++;return new Response(null,{status:429,headers:{'Retry-After':'60'}});}
   assert.equal(u.hostname,'www.youtube.com');
   return u.pathname==='/watch'?new Response(watchPage(u.searchParams.get('v'))):Response.json({events:[{tStartMs:1000,dDurationMs:2000,segs:[{utf8:'Hallo!'}]}]});
  },async()=>{for(const id of ['quotatest01','quotatest02']){const result=await request('/api/listening/captions',{id});assert.equal(result.data.available,true);}assert.equal(serviceCalls,1);});
 });
 db.close();
});
