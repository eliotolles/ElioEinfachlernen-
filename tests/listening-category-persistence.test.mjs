import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import worker from '../worker/index.js?category-persistence';
test('server category changes preserve captions and cannot be undone by an older queue snapshot',async()=>{
 const db=new DatabaseSync(':memory:');const env={ADMIN_EMAILS:'admin@example.test',ADMIN_INITIAL_PASSWORD:'Test-pass-493!',TEST_DB:async(q,args=[])=>{const s=db.prepare(q);return s.columns().length?{rows:s.all(...args),changes:0}:{rows:[],changes:Number(s.run(...args).changes)};}};
 const call=async(path,data,cookie='',method='POST')=>{const r=await worker.fetch(new Request('https://elio.test'+path,{method,headers:{Origin:'https://elio.test',Cookie:cookie,'Content-Type':'application/json'},body:JSON.stringify(data)}),env);return {status:r.status,data:await r.json(),cookie:r.headers.get('Set-Cookie')?.split(';')[0]};};
 try{
 const admin=await call('/api/auth/login',{email:'admin@example.test',password:env.ADMIN_INITIAL_PASSWORD});assert.equal(admin.status,200);
 const viewer=await call('/api/auth/register',{email:'viewer@example.test',password:'Test-pass-493!'});
 const original=[{id:'p',kind:'collection',title:'Postcard',category:'youtube'},{id:'v',kind:'video',collectionId:'p',category:'youtube',cues:[{start:0,end:2,text:'Hallo'}]},{id:'n',kind:'collection',category:'youtube'}];
 db.prepare('INSERT INTO app_shared VALUES(?,?,?,?)').run('listeningLibraryV2',JSON.stringify(original),3,Date.now());
 assert.equal((await call('/api/admin/listening/collection-category',{collectionId:'p',category:'podcast'},viewer.cookie)).status,403);
 const changed=await call('/api/admin/listening/collection-category',{collectionId:'p',category:'podcast'},admin.cookie);assert.equal(changed.status,200);assert.equal(changed.data.count,1);
 assert.equal((await call('/api/shared',{name:'listeningLibraryV2',value:original,version:3},admin.cookie,'PUT')).status,409);
 assert.equal((await call('/api/shared',{name:'listeningLibraryV2',value:original,version:4},admin.cookie,'PUT')).status,200);
 const saved=JSON.parse(db.prepare('SELECT value FROM app_shared WHERE name=?').get('listeningLibraryV2').value);assert.equal(saved[0].category,'podcast');assert.equal(saved[1].category,'podcast');assert.deepEqual(saved[1].cues,original[1].cues);assert.equal(saved[2].category,'youtube');
 }finally{db.close();}
});
