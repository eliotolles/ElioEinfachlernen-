import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {versionAssets} from '../scripts/version-assets.mjs';
test('built app starts session independently of CSS and defers home artwork without removing it',()=>{
 const input={};for(const p of ['index.html','login.html','book-art.css','book-contents-art.css','book-study-art.css','style.css','book.css','js/cloud-cache.js','js/session.js','js/guard.js','js/account-page.js','js/auth.js','js/core.js'])input['/'+p]=fs.readFileSync('public/'+p,'utf8');
 const {assets}=versionAssets(input),html=assets['/index.html'];
 assert(html.indexOf('window.ElioSessionLoaded=')<html.indexOf('href="style.css'));
 assert.match(html,/s\.src="js\/boot-app\.js\?v=[a-f0-9]{16}"/);
 assert(assets['/js/boot-app.js'].indexOf('const AccountCache')<assets['/js/boot-app.js'].indexOf('const Account='));
 assert(assets['/js/boot-app.js'].includes('Account.ready.then'));
 assert.match(html,/<meta name="elio-artwork" content="book-art.css,book-contents-art.css,book-study-art.css">/);
 assert(!html.includes('href="book-art.css'));assert(!assets['/book-art.css'].includes('@import'));
 assert.equal(assets['/book-study-art.css'],input['/book-study-art.css']);
 assert(!assets['/style.css'].includes('@import'));assert(!assets['/book.css'].includes('@import'));
 assert.match(html,/fonts\.googleapis\.com[^>]+media="print"/);
 assert.match(html,/<link rel="preload" as="script" href="js\/core.js\?v=/);
 // Account forms still have their parser-ordered session scripts before their handlers.
 assert(assets['/login.html'].indexOf('src="js/session.js?')<assets['/login.html'].indexOf('src="js/account-page.js?'));
});
test('all module downloads start together after authentication, execute in dependency order and reveal only after the final adapter',async()=>{
 let resolveSession,resolveAuth;const queue=[],removed=[];
 const ctx={window:{ElioSessionLoaded:new Promise(r=>resolveSession=r)},Account:{ready:new Promise(r=>resolveAuth=r),current:()=>true,profile:{}},document:{querySelector:()=>null,currentScript:{dataset:{scripts:'["js/auth.js","js/core.js","js/module.js"]'}},head:{append(){}},body:{append:s=>queue.push(s)},createElement:()=>({}),documentElement:{classList:{remove:c=>removed.push(c)}}}};
 vm.runInNewContext(fs.readFileSync('public/js/loader.js','utf8'),ctx);const tick=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};
 await tick();assert.equal(queue.length,0);resolveSession();await tick();assert.equal(queue.length,0);resolveAuth();await tick();
 assert.deepEqual(queue.map(s=>s.src),['js/auth.js','js/core.js','js/module.js','js/pdf-tools.js','js/cloud-ui.js','js/book-ui.js']);assert(queue.every(s=>s.async===false));
 for(const script of queue.slice(0,-1))script.onload();await tick();assert.equal(removed.length,0);
 ctx.window.ElioBookReady=true;queue.at(-1).onload();await tick();assert.deepEqual(removed,['auth-pending']);
});
