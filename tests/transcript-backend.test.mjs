import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {createHmac} from 'node:crypto';
import {fetchElioTranscript,checkTranscriptBackend,transcriptBackendStatus} from '../worker/transcript-backend.mjs';
import {withNativeTranscript} from '../vercel/transcript.mjs';
const id='BESKw0hiZ3Q',env={TRANSCRIPT_BACKEND_URL:'https://transcript.test',TRANSCRIPT_BACKEND_TOKEN:'test-token'};
const good={available:true,videoId:id,timeUnit:'seconds',language:'de',source:'youtube-auto',via:'yt-dlp',cached:false,cues:[{start:10.2,end:16.119,text:'Hallo!'}]};
test('external backend returns seconds, uses manual redirects and keeps token out of result',async()=>{
 const before=globalThis.fetch;globalThis.fetch=async(url,options)=>{assert.equal(String(url),'https://transcript.test/v1/transcript');assert.equal(options.redirect,'manual');assert.equal(options.headers.Authorization,'Bearer test-token');return Response.json(good)};
 try{const r=await fetchElioTranscript(env,id);assert(r.available);assert.equal(r.cues[0].start,10.2);assert(!JSON.stringify(r).includes('test-token'));}finally{globalThis.fetch=before}
});
test('wrong video, wrong language, milliseconds and malformed cues never become stored captions',async()=>{
 const before=globalThis.fetch;
 try{for(const patch of [{videoId:'dC6ZGLzdaTs'},{language:'vi'},{timeUnit:'milliseconds'},{cues:[{start:3,end:1,text:'bad'}]}]){globalThis.fetch=async()=>Response.json({...good,...patch});const r=await fetchElioTranscript(env,id);assert.equal(r.available,false);assert.equal(r.allowAiFallback,false);}}
 finally{globalThis.fetch=before}
});
test('backend auth, redirects, rate limits and bot blocks remain explicit failures',async()=>{
 const before=globalThis.fetch;
 try{for(const [status,code]of[[401,'CAPTIONS_BACKEND_AUTH'],[302,'CAPTIONS_BACKEND_REDIRECT'],[429,'CAPTIONS_RATE_LIMIT']]){globalThis.fetch=async()=>new Response(null,{status});assert.equal((await fetchElioTranscript(env,id)).code,code)}
 globalThis.fetch=async()=>Response.json({available:false,code:'CAPTIONS_BLOCKED',reason:'blocked',retryable:true,cues:[]});const r=await fetchElioTranscript(env,id);assert(r.retryable);assert.equal(r.allowAiFallback,false);}
 finally{globalThis.fetch=before}
});
test('Vercel internal request is bound to the exact body with short-lived HMAC',async()=>{
 const before=globalThis.fetch;let captured;
 globalThis.fetch=async(url,options)=>{captured={url,options};return Response.json(good)};
 try{
 const runtime=withNativeTranscript(new Request('https://elio-einfach.vercel.app/api/listening/captions'),{AI_ENCRYPTION_KEY:'unit-test-app-key'});
 const r=await fetchElioTranscript(runtime,id);assert(r.available);
 assert.equal(String(captured.url),'https://elio-einfach.vercel.app/api/transcript');
 const timestamp=captured.options.headers['X-Elio-Transcript-Time'];
 assert(Math.abs(Number(timestamp)-Date.now()/1000)<5);
 const expected=createHmac('sha256','unit-test-app-key').update('elio-transcript-v1\n'+timestamp+'\n'+captured.options.body).digest('hex');
 assert.equal(captured.options.headers['X-Elio-Transcript-Signature'],expected);
 assert.equal(transcriptBackendStatus(runtime).mode,'vercel-python');
 assert(!captured.options.headers.Authorization);
 }finally{globalThis.fetch=before}
});
test('health alone does not claim a transcript is available',async()=>{
 const before=globalThis.fetch;globalThis.fetch=async()=>Response.json({ok:true,service:'elio-transcript'});
 try{const r=await checkTranscriptBackend(env);assert(r.healthy);assert.match(r.reason,/video/);assert.equal(r.cues,undefined);}finally{globalThis.fetch=before}
});
test('queue preserves old captions and does not silently invoke AI when Python fails',async()=>{
 const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync('public/js/listening-transcripts.js','utf8')+';this.api=ListeningTranscripts;',ctx);
 const rows=[{id:'old',youtubeId:'dC6ZGLzdaTs',cues:[{start:1,end:2,text:'Keep me'}]},{id:'new',youtubeId:id,cues:[]}];let calls=0,ai=0,writes=0;
 const q=ctx.api.create({videos:()=>rows,user:()=> 'u',request:async()=>{calls++;return {available:false,allowAiFallback:false,retryable:true,code:'CAPTIONS_BLOCKED',reason:'blocked'}},transcribe:async()=>{ai++;},duration:async()=>50,save:async()=>writes++,sleep:async()=>{}});
 q.enqueue(rows);await q.start();assert.equal(calls,1);assert.equal(ai,0);assert.equal(writes,0);assert.equal(rows[0].cues[0].text,'Keep me');assert.equal(q.pending,1);
});
test('VTT export preserves actual ending time',()=>{
 const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync('public/js/listening-transcripts.js','utf8')+';this.api=ListeningTranscripts;',ctx);
 assert.equal(ctx.api.toVtt(good.cues),'WEBVTT\n\n00:00:10.200 --> 00:00:16.119\nHallo!\n');
});
