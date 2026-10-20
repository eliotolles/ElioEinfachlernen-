import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {extractInlineImages} from '../scripts/extract-inline-images.mjs';
import worker from '../worker/index.js';
test('same artwork in CSS and cover HTML shares one content URL and keeps original bytes and layout',()=>{
 const b64=Buffer.from('original-image-bytes').toString('base64'),uri='data:image/webp;base64,'+b64;
 const input={'/book.css':`a{background-image:url("${uri}");background-size:cover;opacity:.4}`, '/login.html':`<div style="--art:url(${uri})"></div>`};
 const {assets,images}=extractInlineImages(input),[url]=Object.keys(images);assert.equal(Object.keys(images).length,1);assert.match(url,/^\/images\/[a-f0-9]{24}\.webp$/);
 assert.equal(images[url].base64,b64);assert.equal(assets['/book.css'],input['/book.css'].replace(uri,url));assert(assets['/login.html'].includes(url));
 const changed=extractInlineImages({'/book.css':'a{background:url(data:image/webp;base64,'+Buffer.from('new-image').toString('base64')+')}'});assert.notEqual(Object.keys(changed.images)[0],url);
});
test('production artwork extraction retains every original image byte while reducing stylesheet payload',()=>{
 const names=['book-art.css','book-contents-art.css','book-study-art.css','login.html','register.html','home.html'],input=Object.fromEntries(names.map(n=>['/'+n,fs.readFileSync('public/'+n,'utf8')]));const {assets,images}=extractInlineImages(input);assert.equal(Object.keys(images).length,3);
 for(const name of names.filter(n=>n.endsWith('.css'))){assert(assets['/'+name].length<10000);assert(!assets['/'+name].includes('data:image/'));}
 for(const original of Object.values(input)){for(const match of original.matchAll(/data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})/g))assert(Object.values(images).some(img=>img.type==='image/'+match[1]&&img.base64===match[2]));}
});
test('image endpoint serves exact binary bytes, immutable caching, HEAD and ETag without accessing account data',async()=>{
 const bytes=Uint8Array.from([0,255,128,1,17]),path='/images/1234567890abcdef12345678.webp';globalThis.IMAGE_ASSETS={[path]:{base64:Buffer.from(bytes).toString('base64'),type:'image/webp'}};
 try{const r=await worker.fetch(new Request('https://elio.test'+path),{});assert.equal(r.status,200);assert.equal(r.headers.get('Content-Type'),'image/webp');assert.equal(r.headers.get('Cache-Control'),'public, max-age=31536000, immutable');assert.deepEqual(new Uint8Array(await r.arrayBuffer()),bytes);
 const cached=await worker.fetch(new Request('https://elio.test'+path,{headers:{'If-None-Match':r.headers.get('ETag')}}),{});assert.equal(cached.status,304);assert.equal(await cached.text(),'');
 const head=await worker.fetch(new Request('https://elio.test'+path,{method:'HEAD'}),{});assert.equal(head.headers.get('Content-Type'),'image/webp');assert.equal(await head.text(),'');
 }finally{delete globalThis.IMAGE_ASSETS;}
});
test('content-addressed artwork is reused from service worker cache without waiting for network',async()=>{
 const handlers={},cached={status:200},ctx={self:{location:{origin:'https://elio.test'},addEventListener:(n,f)=>handlers[n]=f},caches:{open:async()=>({match:async()=>cached})},URL,fetch:()=>assert.fail('must reuse immutable image')};vm.runInNewContext(fs.readFileSync('public/sw.js','utf8'),ctx);let response;handlers.fetch({request:{url:'https://elio.test/images/1234567890abcdef12345678.webp',method:'GET'},respondWith:p=>response=p});assert.equal(await response,cached);
});
