import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {versionAssets} from '../scripts/version-assets.mjs';
test('editing one stylesheet does not invalidate unchanged JavaScript assets or reset the static cache',()=>{
 const input={'/index.html':'<head><script src="js/core.js"></script><link href="book.css"></head>','/js/core.js':'const stable=true;','/book.css':'a{}','/sw.js':"const CACHE='elio-cloud-v3-static';"},a=versionAssets(input),b=versionAssets({...input,'/book.css':'b{}'});const asset=(html,path)=>html.match(new RegExp(path.replaceAll('.','\\.')+'\\?v=([a-f0-9]+)'))[1];assert.equal(asset(a.assets['/index.html'],'js/core.js'),asset(b.assets['/index.html'],'js/core.js'));assert.notEqual(asset(a.assets['/index.html'],'book.css'),asset(b.assets['/index.html'],'book.css'));assert.equal(a.assets['/sw.js'],b.assets['/sw.js']);
});
test('build versions local assets consistently and paints saved dark mode before authentication completes',()=>{
 const input={'/index.html':'<html class="auth-pending"><head><link href="book.css"><script src="js/session.js"></script><script src="https://cdn.example/a.js"></script></head><body></body></html>','/book.css':'body{}','/sw.js':"const CACHE='elio-cloud-v2-book-ui';"};const result=versionAssets(input),html=result.assets['/index.html'];assert(/book.css\?v=[a-f0-9]{16}/.test(html));assert(/js\/session.js\?v=[a-f0-9]{16}/.test(html));assert(html.includes('src="https://cdn.example/a.js"'));assert(html.indexOf('loadingTheme')<html.indexOf('href="book.css'));assert.equal(result.assets['/sw.js'],input['/sw.js']);assert.notEqual(versionAssets({...input,'/book.css':'body{color:red}'}).revision,result.revision);const script=html.match(/<script>(.*?)<\/script>/)[1],ctx={localStorage:{getItem:()=> 'dark'},document:{documentElement:{dataset:{}}}};vm.runInNewContext(script,ctx);assert.equal(ctx.document.documentElement.dataset.loadingTheme,'dark');
});
test('versioned static assets are served from cache without another network round trip',async()=>{
 const handlers={},cached={status:200},ctx={self:{location:{origin:'https://elio.test'},addEventListener:(n,f)=>handlers[n]=f},caches:{open:async()=>({match:async()=>cached})},URL,fetch:()=>assert.fail('cached versioned asset must not wait for network')};vm.runInNewContext(fs.readFileSync('public/sw.js','utf8'),ctx);let response;handlers.fetch({request:{url:'https://elio.test/js/core.js?v=abc',method:'GET'},respondWith:p=>response=p});assert.equal(await response,cached);
});
