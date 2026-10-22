import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
test('source images accept only bounded raster data and keep audio restricted to HTTPS',()=>{
 const source=fs.readFileSync('public/js/simulator.js','utf8');const code=source.split('\n').filter(s=>s.startsWith('function validImageURL(')||s.startsWith('function validMediaURL(')).join('\n');const c={};vm.createContext(c);vm.runInContext(code,c);
 assert.equal(vm.runInContext("validImageURL('data:image/webp;base64,AAAA')",c),true);assert.equal(vm.runInContext("validImageURL('data:image/svg+xml;base64,AAAA')",c),false);assert.equal(vm.runInContext("validImageURL('javascript:alert(1)')",c),false);assert.equal(vm.runInContext("validImageURL('data:image/png;base64,'+'A'.repeat(2500000))",c),false);assert.equal(vm.runInContext("validMediaURL('data:image/webp;base64,AAAA')",c),false);assert.equal(vm.runInContext("validMediaURL('https://example.test/audio.mp3')",c),true);
});
