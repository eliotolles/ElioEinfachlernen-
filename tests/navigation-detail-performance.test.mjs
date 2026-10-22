import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
test('active module detail navigation changes only the hash without resume/cloud/language refresh',()=>{
 const source=fs.readFileSync('public/js/navigation.js','utf8'),branch=source.slice(source.indexOf('    // A detail route'),source.indexOf('    if(key===ownKey)'));
 const events=[],replaced=[];const w={location:{hash:'#catalog=level'},Event:class{constructor(type){this.type=type;}},history:{replaceState(_state,_title,url){replaced.push(url);w.location.hash=url.slice(url.indexOf('#'));}},dispatchEvent:e=>events.push(e.type)};
 const view={frame:{contentWindow:w,contentDocument:{title:'Bộ từ · Elio'}}},context={key:'/wortschatz.html',current:'/wortschatz.html',ownKey:'/index.html',views:new Map([['/wortschatz.html',view]]),u:{pathname:'/wortschatz.html',search:'',hash:'#deck=a&catalog=level'},document:{title:''},lifecycle:0};vm.createContext(context);vm.runInContext('function navigate(){'+branch+'lifecycle++;}navigate();',context);
 assert.deepEqual(events,['hashchange']);assert.equal(replaced.length,1);assert.equal(context.lifecycle,0);assert.equal(context.document.title,'Bộ từ · Elio');vm.runInContext('navigate()',context);assert.deepEqual(events,['hashchange']);assert.equal(context.lifecycle,0);
});
