import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {versionAssets} from '../scripts/version-assets.mjs';
test('build versions local assets consistently and paints saved dark mode before authentication completes',()=>{
 const input={'/index.html':'<html class="auth-pending"><head><link href="book.css"><script src="js/session.js"></script><script src="https://cdn.example/a.js"></script></head><body></body></html>','/book.css':'body{}','/sw.js':"const CACHE='elio-cloud-v2-book-ui';"};const result=versionAssets(input),html=result.assets['/index.html'];assert(html.includes('book.css?v='+result.revision));assert(html.includes('js/session.js?v='+result.revision));assert(html.includes('src="https://cdn.example/a.js"'));assert(html.indexOf('loadingTheme')<html.indexOf('href="book.css'));assert(result.assets['/sw.js'].includes(result.revision));assert.notEqual(versionAssets({...input,'/book.css':'body{color:red}'}).revision,result.revision);const script=html.match(/<script>(.*?)<\/script>/)[1],ctx={localStorage:{getItem:()=> 'dark'},document:{documentElement:{dataset:{}}}};vm.runInNewContext(script,ctx);assert.equal(ctx.document.documentElement.dataset.loadingTheme,'dark');
});
test('versioned static assets are served from cache without another network round trip',async()=>{
 const handlers={},cached={status:200},ctx={self:{location:{origin:'https://elio.test'},addEventListener:(n,f)=>handlers[n]=f},caches:{open:async()=>({match:async()=>cached})},URL,fetch:()=>assert.fail('cached versioned asset must not wait for network')};vm.runInNewContext(fs.readFileSync('public/sw.js','utf8'),ctx);let response;handlers.fetch({request:{url:'https://elio.test/js/core.js?v=abc',method:'GET'},respondWith:p=>response=p});assert.equal(await response,cached);
});
