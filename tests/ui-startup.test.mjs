import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
test('loader never reveals the old UI between core and the final presentation adapter',async()=>{
 const queue=[],removed=[],ctx={Account:{ready:Promise.resolve(),current:()=>true,profile:{}},window:{},document:{querySelector:()=>null,currentScript:{dataset:{scripts:JSON.stringify(['js/auth.js','js/core.js','js/wortschatz.js'])}},createElement:()=>({}),head:{append(){}},body:{append:node=>queue.push(node)},documentElement:{classList:{remove:c=>removed.push(c)}}}};
 vm.runInNewContext(fs.readFileSync('public/js/loader.js','utf8'),ctx);
 const tick=async()=>{await Promise.resolve();await Promise.resolve();};await tick();
 const loaded=[];while(queue.length){const node=queue.shift();loaded.push(node.src);assert.equal(removed.length,0);if(node.src==='js/book-ui.js')ctx.window.ElioBookReady=true;node.onload();await tick();}
 assert(loaded.includes('js/core.js'));assert.equal(loaded.at(-1),'js/book-ui.js');assert.equal(removed.length,1);assert.equal(removed[0],'auth-pending');
});
test('service worker removes only old Elio static caches and ignores all API requests',async()=>{
 const handlers={},deleted=[],ctx={self:{location:{origin:'https://elio.test'},addEventListener:(n,f)=>handlers[n]=f,clients:{claim:async()=>{}},skipWaiting(){}},caches:{keys:async()=>['elio-cloud-v1','elio-cloud-v3-static','other-app','account-data'],delete:async k=>deleted.push(k)},URL};vm.runInNewContext(fs.readFileSync('public/sw.js','utf8'),ctx);let activation;handlers.activate({waitUntil:p=>activation=p});await activation;assert.deepEqual(deleted,['elio-cloud-v1']);handlers.fetch({request:{url:'https://elio.test/api/state',method:'GET'},respondWith(){assert.fail('must not cache account API');}});
});
