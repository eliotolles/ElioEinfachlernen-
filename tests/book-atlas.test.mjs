import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const context={};vm.createContext(context);vm.runInContext(fs.readFileSync('public/js/book-atlas.js','utf8')+';globalThis.atlas=ElioBookAtlas;',context);const A=context.atlas;
test('every learning and personal destination remains in the index with an existing page',()=>{
 const paths=new Set(A.entries.map(e=>e.url.split('#')[0]));
 for(const page of ['grammatik','wortschatz','lernen','hoeren','schreiben','sprechen','tutor','pruefung','quiz','history','settings','admin'])assert(paths.has(page+'.html'),page);
 for(const e of A.entries){assert(fs.existsSync('public/'+e.url.split('#')[0]),e.url);assert(A.groups.some(g=>g.id===e.group));assert.equal(e.title.length,3);assert.equal(e.note.length,3);}
 assert.equal(new Set(A.entries.map(e=>e.id)).size,A.entries.length);
});
test('the same navigation searches Vietnamese with or without accents and German/English',()=>{
 assert(A.search('ngu phap').some(e=>e.id==='grammar'));
 assert(A.search('giao tiep').some(e=>e.id==='tutor'));
 assert(A.search('Schreiben','de').some(e=>e.id==='writing'));
 assert(A.search('shadowing','en').some(e=>e.id==='listening'));
 assert.equal(A.search('nothing-matches-this').length,0);
});
test('admin navigation is hidden for learners without changing route authorization',()=>{
 assert(!A.search('quản trị','vi',false).some(e=>e.id==='admin'));
 assert(A.search('quản trị','vi',true).some(e=>e.id==='admin'));
 assert.equal(A.current('/hoeren.html','#view=video&video=existing-id').id,'listening');
 assert.equal(A.current('/index.html','#study').id,'study');
 assert.equal(A.current('/not-a-module.html'),null);
});
