import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {DatabaseSync} from 'node:sqlite';

execFileSync(process.execPath,['scripts/build-vercel.mjs']);
const {default:worker}=await import('../vercel-server/worker.mjs');
const config=JSON.parse(await fs.readFile('vercel.json','utf8'));
const db=new DatabaseSync(':memory:');
const env={TEST_DB:async(q,args=[])=>{const s=db.prepare(q);return /^SELECT/i.test(q.trim())?{rows:s.all(...args),changes:0}:{rows:[],changes:Number(s.run(...args).changes)};}};

test('Vercel routes keep protected listening variants ahead of static files',async()=>{
 for(const path of ['/','/home','/home.html','/hoeren','/hoeren.html','/api/state','/robots.txt','/sitemap.xml']){
  const route=config.routes.find(r=>r.src&&new RegExp('^'+r.src+'$').test(path));
  assert.equal(route?.dest,'/api/handler',path);
 }
 for(const name of ['home.html','hoeren.html'])await assert.rejects(fs.access('vercel-public/'+name));
 for(const name of ['index.html','js/session.js'])await fs.access('vercel-public/'+name);
});

test('built worker preserves origin, refuses anonymous listening and cross-origin writes',async()=>{
 const origin='https://migration-preview.vercel.app';
 const home=await worker.fetch(new Request(origin+'/'),env);
 assert.equal(home.status,200);
 const html=await home.text();
 assert(!html.includes('__ELIO_PUBLIC_ORIGIN__'));
 assert(html.includes(origin));
 for(const path of ['/hoeren','/hoeren.html','/api/state']){
  const response=await worker.fetch(new Request(origin+path),env);
  assert.equal(response.status,401,path);
 }
 const denied=await worker.fetch(new Request(origin+'/api/state',{method:'PUT',headers:{Origin:'https://untrusted.example'},body:'{}'}),env);
 assert.equal(denied.status,403);
 const robots=await worker.fetch(new Request(origin+'/robots.txt'),env);
 assert((await robots.text()).includes(origin+'/sitemap.xml'));
});
