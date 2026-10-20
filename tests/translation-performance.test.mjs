import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
test('a text mutation translates only the changed region rather than walking the entire lesson',()=>{
 const source=fs.readFileSync('public/js/core.js','utf8'),walked=[],frames=[];let callback;
 const region={nodeType:1,isConnected:true,closest:()=>false,contains:()=>false},body={nodeType:1};const text={parentElement:region,nodeValue:'Luyện viết'};
 const ctx={WeakMap,Set,App:{settings:()=>({language:'en'})},LEGACY_UI:{'Luyện viết':['Writing','Schreiben']},NodeFilter:{SHOW_TEXT:4},document:{body,addEventListener(){},createTreeWalker:scope=>{walked.push(scope);let done=false;return {nextNode:()=>{if(done)return null;done=true;return text;}};}},requestAnimationFrame:fn=>frames.push(fn),MutationObserver:class{constructor(fn){callback=fn;}observe(){}}};
 vm.runInNewContext(source.slice(source.indexOf('const originalUiText=')),ctx);walked.length=0;callback([{type:'characterData',target:text}]);assert.equal(walked.length,0);frames.shift()();assert.equal(walked.length,1);assert.equal(walked[0],region);assert.equal(text.nodeValue,'Writing');
});
