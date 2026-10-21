import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
test('voice waits for explicit finish, retains pauses and does not duplicate recognition results',()=>{
 const nodes=new Map();const node=k=>{if(!nodes.has(k))nodes.set(k,{value:'',classList:{add(){},remove(){}},setAttribute(){},dispatchEvent(){}});return nodes.get(k);};
 const instances=[];class Recognition{constructor(){instances.push(this);}start(){}abort(){this.onend?.();}}
 const sent=[],timers=[];const ctx={voiceCapture:null,recognition:null,chatBusy:false,generation:1,Auth:{user:'a',require:()=>true},App:{settings:()=>({language:'vi'})},window:{SpeechRecognition:Recognition,addEventListener(){}},$:node,stopSpeech(){},sendConversation:t=>sent.push(t),Event:class{},setTimeout:f=>{timers.push(f);return timers.length;},clearTimeout(){}};
 vm.createContext(ctx);const source=fs.readFileSync('public/js/conversation.js','utf8');vm.runInContext(source.slice(source.indexOf('function setupVoiceCapture()')),ctx);
 node('#microphone').onclick();const rec=instances[0];assert.equal(rec.continuous,true);assert.equal(rec.interimResults,true);
 rec.onresult({results:[[{transcript:'Ich möchte'}]]});assert.equal(sent.length,0);
 rec.onresult({results:[[{transcript:'Ich möchte Deutsch lernen.'}]]});assert.equal(sent.length,0);
 rec.onend();assert.equal(sent.length,0);timers.shift()();instances[1].onresult({results:[[{transcript:'Und arbeiten.'}]]});
 node('#microphone').onclick();assert.deepEqual(sent,['Ich möchte Deutsch lernen. Und arbeiten.']);assert.equal(ctx.voiceCapture,null);
});
