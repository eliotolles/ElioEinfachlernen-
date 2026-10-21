import {test,before} from 'node:test';import assert from 'node:assert/strict';import {DatabaseSync} from 'node:sqlite';import worker,{passwordHash,passwordMatches} from '../worker/index.js';
const db=new DatabaseSync(':memory:');const env={ADMIN_EMAILS:'owner@example.com,owner2@example.com',ADMIN_INITIAL_PASSWORD:'Test-pass-493!',AI_ENCRYPTION_KEY:'test-secret-long-value',TEST_DB:async(q,args=[])=>{const stmt=db.prepare(q);if(/^SELECT/i.test(q.trim()))return {rows:stmt.all(...args),changes:0};const result=stmt.run(...args);return {rows:[],changes:Number(result.changes)};}};
async function call(path,method='GET',data=null,cookie=''){const req=new Request('https://elio.test'+path,{method,headers:{Origin:'https://elio.test',Cookie:cookie,...(data?{'Content-Type':'application/json'}:{})},body:data?JSON.stringify(data):undefined});const r=await worker.fetch(req,env);return {status:r.status,body:await r.json(),cookieHeader:r.headers.get('Set-Cookie'),cookie:r.headers.get('Set-Cookie')?.split(';')[0]};}
let owner,alice,bob;
before(async()=>{owner=await call('/api/auth/login','POST',{email:'owner@example.com',password:env.ADMIN_INITIAL_PASSWORD});alice=await call('/api/auth/register','POST',{email:'alice@example.com',password:'Alice-Test-493!'});bob=await call('/api/auth/register','POST',{email:'bob@example.com',password:'Bob-Test-493!'});});
test('salted hashes and password matching',async()=>{const a=await passwordHash('different-password');const b=await passwordHash('different-password');assert.notEqual(a,b);assert(await passwordMatches('different-password',a));assert(!await passwordMatches('wrong',a));});
test('email auth, roles, cookie and restricted admin registration',async()=>{assert.equal(owner.status,200);assert.equal(owner.body.user.role,'super_admin');assert.equal(alice.body.user.role,'user');assert.equal((await call('/api/auth/me','GET',null,alice.cookie)).body.user.id,alice.body.user.id);assert.equal((await call('/api/state','GET',null,alice.cookie)).status,200);assert(owner.cookie.startsWith('elio_session='));assert.match(owner.cookieHeader,/SameSite=None; Partitioned/);assert.match(owner.cookieHeader,/HttpOnly; Secure/);assert.equal((await call('/api/auth/register','POST',{email:'owner2@example.com',password:'Fake-493!'})).status,400);assert.equal((await call('/api/admin/users','GET',null,alice.cookie)).status,403);assert.equal((await call('/api/state')).status,401);const bad=await worker.fetch(new Request('https://elio.test/api/state',{method:'PUT',headers:{Origin:'https://evil.test',Cookie:owner.cookie},body:'{}'}),env);assert.equal(bad.status,403);});
test('private records isolated and cross-device version conflicts',async()=>{const a=await call('/api/state','PUT',{name:'drafts',value:{a:'Ich lerne.'},version:0},alice.cookie);assert.equal(a.status,200);assert.equal((await call('/api/state','GET',null,bob.cookie)).body.records.drafts,undefined);const second=await call('/api/auth/login','POST',{email:'alice@example.com',password:'Alice-Test-493!'});assert.equal((await call('/api/state','GET',null,second.cookie)).body.records.drafts.value.a,'Ich lerne.');const conflict=await call('/api/state','PUT',{name:'drafts',value:{a:'old'},version:0},second.cookie);assert.equal(conflict.status,409);assert.equal(conflict.body.latest.version,1);});
test('admin materials shared, users cannot change or remove originals',async()=>{assert.equal((await call('/api/shared','PUT',{name:'materials',value:[{id:'shared1',name:'Admin PDF',type:'grammar',items:[]}],version:0},owner.cookie)).status,200);assert.equal((await call('/api/shared','PUT',{name:'materials',value:[],version:1},alice.cookie)).status,403);await call('/api/state','PUT',{name:'materials',value:[{id:'shared1',name:'tampered'},{id:'mine',name:'Private'}],version:0},alice.cookie);const a=(await call('/api/state','GET',null,alice.cookie)).body,b=(await call('/api/state','GET',null,bob.cookie)).body;assert.equal(a.records.materials.value.length,1);assert.equal(a.records.materials.value[0].id,'mine');assert.equal(b.records.materials,undefined);assert.equal(b.shared.materials.value[0].name,'Admin PDF');});
test('AI keys encrypted, never returned; priority and retry fallback',async()=>{const added=await call('/api/admin/ai','POST',{label:'first',provider:'gemini',model:'gemini-2.5-flash',key:'secret-first',priority:1,vision:true},owner.cookie);assert.equal(added.status,200);await call('/api/admin/ai','POST',{label:'second',provider:'groq',model:'llama-3.3-70b-versatile',key:'secret-second',priority:2},owner.cookie);const key=db.prepare('SELECT secret FROM app_ai WHERE id=?').get(added.body.id).secret;assert(!key.includes('secret-first'));assert(!JSON.stringify((await call('/api/admin/ai','GET',null,owner.cookie)).body).includes('secret-first'));assert.equal((await call('/api/admin/ai','GET',null,alice.cookie)).status,403);const original=globalThis.fetch;let urls=[];globalThis.fetch=async url=>{urls.push(url);return url.includes('googleapis')?new Response('{}',{status:429,headers:{'Retry-After':'15'}}):Response.json({choices:[{message:{content:'{"ok":true}'}}]});};try{const ai=await call('/api/ai','POST',{prompt:'Check'},alice.cookie);assert.equal(ai.status,200);assert.equal(ai.body.provider,'groq');assert.equal(urls.length,2);assert.match(db.prepare('SELECT status FROM app_ai WHERE id=?').get(added.body.id).status,/^HTTP 429/);}finally{globalThis.fetch=original;}});
test('blocked accounts and expired passwords rejected server-side; change revokes sessions',async()=>{await call('/api/admin/users','PATCH',{id:bob.body.user.id,blocked:true},owner.cookie);assert.equal((await call('/api/state','GET',null,bob.cookie)).status,401);db.prepare('UPDATE app_users SET password_changed=? WHERE id=?').run(Date.now()-91*86400000,alice.body.user.id);assert.equal((await call('/api/state','GET',null,alice.cookie)).status,428);const fresh=await call('/api/auth/password','POST',{currentPassword:'Alice-Test-493!',newPassword:'Alice-New-493!'},alice.cookie);assert.equal(fresh.status,200);assert.equal((await call('/api/state','GET',null,alice.cookie)).status,401);assert.equal((await call('/api/state','GET',null,fresh.cookie)).status,200);assert.equal((await call('/api/auth/password','POST',{currentPassword:'Alice-New-493!',newPassword:'Alice-New-493!'},fresh.cookie)).status,400);});

test('admin sees actual 404, can list supported Gemini models and update without exposing keys',async()=>{
 const id=db.prepare("SELECT id FROM app_ai WHERE provider='gemini'").get().id;const original=globalThis.fetch;
 globalThis.fetch=async url=>String(url).includes(':generateContent')?Response.json({error:{message:'private-key-should-not-leak'}},{status:404}):Response.json({models:[{name:'models/current-flash',displayName:'Current Flash',supportedGenerationMethods:['generateContent']},{name:'models/embedding',supportedGenerationMethods:['embedContent']}]});
 try{const failed=await call('/api/admin/ai/test','POST',{id},owner.cookie);assert.equal(failed.status,503);assert.match(failed.body.error,/HTTP 404/);assert(!JSON.stringify(failed.body).includes('private-key-should-not-leak'));const models=await call('/api/admin/ai/models','POST',{id},owner.cookie);assert.deepEqual(models.body.items,[{id:'current-flash',name:'Current Flash'}]);assert.equal((await call('/api/admin/ai/models','POST',{id},bob.cookie)).status,401);assert.equal((await call('/api/admin/ai','PATCH',{id,model:'current-flash'},owner.cookie)).status,200);const row=db.prepare('SELECT model,status,cooldown FROM app_ai WHERE id=?').get(id);assert.equal(row.model,'current-flash');assert.equal(row.cooldown,0);assert.equal(row.status,'Chưa kiểm tra');}finally{globalThis.fetch=original;}
});

test('OpenRouter replaces OpenAI, restricts zero-cost models, supports images and skips raw PDFs',async()=>{
 assert.equal((await call('/api/admin/ai','POST',{provider:'openai',model:'gpt-6-luna',key:'unused'},owner.cookie)).status,400);
 assert.equal((await call('/api/admin/ai','POST',{provider:'openrouter',model:'deepseek/deepseek-r1',key:'unused'},owner.cookie)).status,400);
 const added=await call('/api/admin/ai','POST',{label:'Free router',provider:'openrouter',model:'openrouter/free',key:'secret-openrouter',priority:1,vision:true},owner.cookie);assert.equal(added.status,200);
 assert.equal((await call('/api/admin/ai','PATCH',{id:added.body.id,model:'openrouter/auto'},owner.cookie)).status,400);
 const original=globalThis.fetch;const requests=[];
 globalThis.fetch=async(url,options={})=>{requests.push({url,body:options.body?JSON.parse(options.body):null});if(String(url).endsWith('/models'))return Response.json({data:[{id:'good/model:free',name:'Good',pricing:{prompt:'0',completion:'0',request:'0'},supported_parameters:['response_format'],architecture:{input_modalities:['text','image'],output_modalities:['text']}},{id:'paid/model:free',pricing:{prompt:'1',completion:'0'},supported_parameters:['response_format'],architecture:{output_modalities:['text']}}]});return Response.json({choices:[{message:{content:'{"ok":true}'},finish_reason:'stop'}]});};
 try{const result=await call('/api/admin/ai/test','POST',{id:added.body.id},owner.cookie);assert.equal(result.status,200);assert.equal(result.body.text,'{"ok":true}');const req=requests.at(-1);assert.equal(req.url,'https://openrouter.ai/api/v1/chat/completions');assert.equal(req.body.max_tokens,8000);assert.equal(req.body.response_format.type,'json_object');assert.deepEqual(req.body.provider.max_price,{prompt:0,completion:0,request:0,image:0});assert.deepEqual(req.body.plugins,[]);
 const models=await call('/api/admin/ai/models','POST',{id:added.body.id},owner.cookie);assert.deepEqual(models.body.items.map(m=>m.id),['openrouter/free','good/model:free']);
 db.prepare('UPDATE app_ai SET enabled=0 WHERE id<>?').run(added.body.id);const withImage=await call('/api/ai','POST',{prompt:'Extract JSON.',attachments:[{mimeType:'image/png',data:'YQ=='}]},owner.cookie);assert.equal(withImage.status,200);assert.equal(requests.at(-1).body.messages[1].content[1].type,'image_url');
 const before=requests.length;const pdf=await call('/api/ai','POST',{prompt:'PDF',attachments:[{mimeType:'application/pdf',data:'YQ=='}]},owner.cookie);assert.equal(pdf.status,503);assert.equal(requests.length,before);
 await call('/api/admin/ai','PATCH',{id:added.body.id,model:'paid/model:free'},owner.cookie);const blocked=await call('/api/admin/ai/test','POST',{id:added.body.id},owner.cookie);assert.equal(blocked.status,503);assert.match(blocked.body.error,/không còn miễn phí/);assert.equal(requests.length,before);
 }finally{globalThis.fetch=original;}
});


test('token limit returns partial JSON and continuation includes preserved prefix for Gemini and chat providers',async()=>{
 const original=globalThis.fetch;
 try{for(const provider of ['gemini','groq','openrouter']){
 const id=db.prepare('SELECT id FROM app_ai WHERE provider=?').get(provider).id;
 if(provider==='openrouter')await call('/api/admin/ai','PATCH',{id,model:'openrouter/free'},owner.cookie);await call('/api/admin/ai','PATCH',{id,enabled:true,priority:0},owner.cookie);
 let seen;
 globalThis.fetch=async(url,options)=>{seen=JSON.parse(options.body);return Response.json(provider==='gemini'?{candidates:[{finishReason:'MAX_TOKENS',content:{parts:[{text:'{"scores":'}]}}]}:{choices:[{finish_reason:'length',message:{content:'{"scores":'}}]});};
 const partial=await call('/api/admin/ai/test','POST',{id},owner.cookie);assert.equal(partial.status,200);assert.equal(partial.body.truncated,true);assert.equal(partial.body.text,'{"scores":');
 // Restrict routing to this provider to inspect its exact follow-up request.
 db.prepare('UPDATE app_ai SET enabled=CASE WHEN id=? THEN 1 ELSE 0 END,cooldown=0').run(id);
 globalThis.fetch=async(url,options)=>{seen=JSON.parse(options.body);return Response.json(provider==='gemini'?{candidates:[{finishReason:'STOP',content:{parts:[{text:'{}}'}]}}]}:{choices:[{finish_reason:'stop',message:{content:'{}}'}}]});};
 const next=await call('/api/ai','POST',{prompt:'Return JSON',continuation:partial.body.text},owner.cookie);assert.equal(next.status,200);assert.equal(next.body.truncated,false);assert.deepEqual(JSON.parse(partial.body.text+next.body.text),{scores:{}});
 if(provider==='gemini'){assert.equal(seen.contents[1].parts[0].text,partial.body.text);assert.match(seen.systemInstruction.parts[0].text,/MUST be in Vietnamese/);}else{assert.equal(seen.messages[2].content,partial.body.text);assert.match(seen.messages[0].content,/MUST be in Vietnamese/);}
 }}finally{globalThis.fetch=original;}
});

test('online German TTS authenticates, uses audio-only Gemini, returns no credentials, rejects incomplete audio',async()=>{
 assert.equal((await call('/api/speech/tts','POST',{text:'Hallo'})).status,401);assert.equal((await call('/api/speech/tts','POST',{text:'a'.repeat(1801)},owner.cookie)).status,400);
 await call('/api/admin/ai','POST',{provider:'gemini',model:'gemini-flash-latest',key:'tts-test-secret',priority:0},owner.cookie);
 const original=globalThis.fetch;globalThis.fetch=async(url,options)=>{assert(url.endsWith('/gemini-2.5-flash-preview-tts:generateContent'));const input=JSON.parse(options.body);assert.deepEqual(input.generationConfig.responseModalities,['AUDIO']);assert.equal(input.generationConfig.speechConfig.voiceConfig.prebuiltVoiceConfig.voiceName,'Kore');assert(input.contents[0].parts[0].text.includes('Hochdeutsch'));return Response.json({candidates:[{finishReason:'STOP',content:{parts:[{inlineData:{mimeType:'audio/L16;codec=pcm;rate=24000',data:'AAA='}}]}}]});};try{const result=await call('/api/speech/tts','POST',{text:'Guten Tag!',voice:'invalid'},owner.cookie);assert.equal(result.status,200);assert.equal(result.body.data,'AAA=');assert(!JSON.stringify(result.body).includes('secret'));globalThis.fetch=async()=>Response.json({candidates:[{finishReason:'MAX_TOKENS'}]});assert.equal((await call('/api/speech/tts','POST',{text:'Hallo'},owner.cookie)).status,503);}finally{globalThis.fetch=original;}
});
test('AI fallback reaches the fifth enabled configuration and skips malformed JSON',async()=>{const previous=db.prepare('SELECT id,enabled FROM app_ai').all();db.prepare('UPDATE app_ai SET enabled=0').run();const ids=[];for(let i=0;i<5;i++){const r=await call('/api/admin/ai','POST',{label:'chain-'+i,provider:'groq',model:'llama-3.3-70b-versatile',key:'test-chain-'+i,priority:i},owner.cookie);assert.equal(r.status,200);ids.push(r.body.id);}const original=globalThis.fetch;let calls=0;globalThis.fetch=async()=>{calls++;if(calls===1)return Response.json({choices:[{message:{content:'invalid JSON'}}]});if(calls<5)return new Response('{}',{status:503});return Response.json({choices:[{message:{content:'{"ok":true}'}}]});};try{const r=await call('/api/ai','POST',{prompt:'Return JSON'},owner.cookie);assert.equal(r.status,200);assert.equal(calls,5);assert.equal(JSON.parse(r.body.text).ok,true);}finally{globalThis.fetch=original;for(const id of ids)db.prepare('DELETE FROM app_ai WHERE id=?').run(id);for(const r of previous)db.prepare('UPDATE app_ai SET enabled=? WHERE id=?').run(r.enabled,r.id);}});

test('listening page and private storage are open to signed-in users; public playback retains referrer',async()=>{
 const regular=await call('/api/auth/register','POST',{email:'listener@example.com',password:'Listener-493!'});
 assert.equal((await call('/hoeren.html')).status,401);
 assert.equal((await call('/api/state','PUT',{name:'listening',value:{videos:[],attempts:{}},version:0},regular.cookie)).status,200);
 assert.equal((await call('/api/state','PUT',{name:'listening',value:{videos:[],attempts:{}},version:0},owner.cookie)).status,200);
 globalThis.ASSETS={'/hoeren.html':'<main>Listening</main>'};
 try{for(const cookie of [owner.cookie,regular.cookie]){const response=await worker.fetch(new Request('https://elio.test/hoeren.html',{headers:{Cookie:cookie}}),env);assert.equal(response.status,200);assert.equal(response.headers.get('Referrer-Policy'),'strict-origin-when-cross-origin');assert.match(await response.text(),/Listening/);}}finally{delete globalThis.ASSETS;}
});

test('listening shared library is admin-owned and video transcription sends media only to Gemini',async()=>{
 const regular=await call('/api/auth/register','POST',{email:'video-user@example.com',password:'Listener-493!'});
 assert.equal((await call('/api/shared','PUT',{name:'listeningLibrary',value:[],version:0},regular.cookie)).status,403);
 const shared=[{id:'video-common',youtubeId:'abcdefghijk',level:'B1',title:'Shared',cues:[]}];
 assert.equal((await call('/api/shared','PUT',{name:'listeningLibrary',value:shared,version:0},owner.cookie)).status,200);
 const state=await call('/api/state','GET',null,regular.cookie);assert.equal(state.body.shared.listeningLibrary.value[0].title,'Shared');
 assert.equal((await call('/api/state','PUT',{name:'listeningLibrary',value:[{...shared[0],title:'overwrite'}],version:0},regular.cookie)).status,403);
 assert.equal((await call('/api/state','GET',null,regular.cookie)).body.shared.listeningLibrary.value[0].title,'Shared');
 assert.equal((await call('/api/listening/transcribe','POST',{id:'invalid'},regular.cookie)).status,400);
 assert.equal((await call('/api/listening/transcribe','POST',{id:'https://evil.test'},owner.cookie)).status,400);
 const config=await call('/api/admin/ai','POST',{provider:'gemini',model:'test-video-model',key:'test-video-key',priority:0},owner.cookie);
 const original=globalThis.fetch;let received;
 globalThis.fetch=async(url,options)=>{assert.match(String(url),/generativelanguage.googleapis.com/);received=JSON.parse(options.body);return Response.json({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify({cues:[{start:1,end:3,text:'Guten Morgen.'},{start:500,end:600,text:'Invalid range'}]})}]}}]});};
 try{const response=await call('/api/listening/transcribe','POST',{id:'abcdefghijk',start:0},owner.cookie);assert.equal(response.status,200);assert.equal(response.body.cues.length,1);const media=received.contents[0].parts.find(p=>p.fileData);assert.equal(media.fileData.fileUri,'https://www.youtube.com/watch?v=abcdefghijk');assert.equal(media.videoMetadata.endOffset,'120s');}finally{globalThis.fetch=original;}
});

test('German captions are read directly, prefer human tracks, and access failures stay explicit',async()=>{
 const original=globalThis.fetch;let urls=[];
 globalThis.fetch=async url=>{urls.push(String(url));if(String(url).includes('/watch?'))return new Response('var ytInitialPlayerResponse = '+JSON.stringify({captions:{playerCaptionsTracklistRenderer:{captionTracks:[{languageCode:'en',baseUrl:'https://www.youtube.com/api/timedtext?v=english'},{languageCode:'de',kind:'asr',baseUrl:'https://www.youtube.com/api/timedtext?v=automatic'},{languageCode:'de',baseUrl:'https://www.youtube.com/api/timedtext?v=manual'}]}}})+';');return Response.json({events:[{tStartMs:1000,dDurationMs:2000,segs:[{utf8:'Guten '},{utf8:'Morgen!'}]},{tStartMs:4000,dDurationMs:1000,segs:[{utf8:'Hallo.'}]}]});};
 try{const result=await call('/api/listening/captions','POST',{id:'abcdefghijk'},owner.cookie);assert.equal(result.status,200);assert.equal(result.body.source,'youtube');assert.equal(result.body.cues[0].text,'Guten Morgen!');assert.equal(result.body.cues[0].start,1);assert.match(urls[1],/v=manual/);assert.match(urls[1],/fmt=json3/);assert.equal(urls.length,2);
 urls=[];globalThis.fetch=async url=>{urls.push(String(url));return new Response('Consent or blocked',{status:403});};const blocked=await call('/api/listening/captions','POST',{id:'abcdefghijk'},owner.cookie);assert.equal(blocked.body.available,false);assert.equal(blocked.body.cues.length,0);assert.equal(urls.length,1);assert.match(blocked.body.reason,/403/);
 }finally{globalThis.fetch=original;}
});

test('personal listening videos stay private and each owner can delete their own uploads',async()=>{
 const a=await call('/api/auth/register','POST',{email:'listen-a@example.com',password:'Listen-A-493!'}),b=await call('/api/auth/register','POST',{email:'listen-b@example.com',password:'Listen-B-493!'});
 const value={videos:[{id:'private-video',youtubeId:'abcdefghijk',level:'A1',title:'Private'}],attempts:{}};
 assert.equal((await call('/api/state','PUT',{name:'listening',value,version:0},a.cookie)).status,200);
 assert.equal((await call('/api/state','GET',null,b.cookie)).body.records.listening,undefined);
 assert.equal((await call('/api/state','PUT',{name:'listening',value:{videos:[],attempts:{}},version:1},a.cookie)).status,200);
 assert.equal((await call('/api/state','GET',null,a.cookie)).body.records.listening.value.videos.length,0);
 assert.equal((await call('/api/shared','PUT',{name:'listeningLibrary',value:[],version:1},a.cookie)).status,403);
});

test('enriched vocabulary above 2 MB saves and round-trips while unrelated records retain their limit',async()=>{
 const original=db.prepare("SELECT * FROM app_shared WHERE name='vocab'").get();
 const words=Array.from({length:3400},(_,i)=>({id:'large-word-'+i,deckId:i<1500?'goethe':'netzwerk',deckName:i<1500?'Goethe B1':'Netzwerk B1',de:'das Wort '+i,vi:'từ vựng',en:'word',meaningDe:'Ein Wort in einem Satz.',type:'Nomen',example:'Dieses Wort steht in einem langen deutschen Beispielsatz. '.repeat(8),exampleVi:'Từ này xuất hiện trong một câu ví dụ bằng tiếng Đức.'}));
 assert(new TextEncoder().encode(JSON.stringify(words)).length>2000000);
 const version=original?.version||0;
 const saved=await call('/api/shared','PUT',{name:'vocab',value:words,version},owner.cookie);
 assert.equal(saved.status,200);assert.equal(saved.body.version,version+1);
 const state=await call('/api/state','GET',null,owner.cookie);
 assert.deepEqual(state.body.shared.vocab.value,words);
 assert.equal((await call('/api/shared','PUT',{name:'vocab',value:words,version},owner.cookie)).status,409);
 const regular=await call('/api/auth/register','POST',{email:'large-vocab-user@example.com',password:'Learner-test-493!'});assert.equal((await call('/api/shared','PUT',{name:'vocab',value:words,version:0},regular.cookie)).status,403);
 assert.equal((await call('/api/state','PUT',{name:'drafts',value:{text:'x'.repeat(1600000)},version:0},owner.cookie)).status,413);
 assert.equal((await call('/api/shared','PUT',{name:'vocab',value:[{de:'a',en:'x'.repeat(12000000)}],version:version+1},owner.cookie)).status,413);
 assert.equal(db.prepare("SELECT version FROM app_shared WHERE name='vocab'").get().version,version+1);
});
