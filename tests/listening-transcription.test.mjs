import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../public/js/listening.js',import.meta.url),'utf8');
const fn=source.slice(source.indexOf('async function transcribe(v=video())'),source.indexOf('\n\nconst captionsButton'));
function fixture({duration=733,failAt=-1,start=0}={}){
 const v={id:'v',youtubeId:'abcdefghijk',cues:[],processedUntil:start};const calls=[],statuses=[],controls={};let writes=0;
 const c={Auth:{user:'a'},canEditVideo:()=>true,allVideos:()=>[v],video:()=>v,selected:'v',playerReady:true,player:{getDuration:()=>duration},transcriptionBusy:false,captionsBusy:false,captionsButton:{},save:()=>writes++,render:()=>{},q:id=>controls[id]||=( {}),transcriptStatus:(_,m)=>statuses.push(m),requestAIWithRetry:async(_,data)=>{calls.push(data);if(data.start===failAt)throw Error('Unavailable');return {...data,cues:[{start:data.start,end:data.end,text:'Text'}]};}};
 vm.createContext(c);vm.runInContext(fn,c);return {v,calls,statuses,run:()=>c.transcribe(v),get writes(){return writes;}};
}
test('AI continues all chunks to the exact duration and saves every completed interval',async()=>{const f=fixture();await f.run();assert.deepEqual(f.calls.map(x=>[x.start,x.end]),[[0,120],[120,240],[240,360],[360,480],[480,600],[600,720],[720,733]]);assert.equal(f.v.processedUntil,733);assert.equal(f.v.transcriptionPending,false);assert(f.writes>=8);});
test('failed chunk preserves progress and retry resumes without skipping or duplicating',async()=>{const f=fixture({failAt:240});await f.run();assert.equal(f.v.processedUntil,240);assert.equal(f.v.cues.length,2);assert.equal(f.v.transcriptionPending,true);const g=fixture({start:240,duration:300});await g.run();assert.equal(g.calls[0].start,240);assert.equal(g.v.processedUntil,300);});
test('unknown duration sends no AI requests and does not claim completion',async()=>{const f=fixture({duration:0});await f.run();assert.equal(f.calls.length,0);assert.equal(f.writes,0);assert.match(f.statuses[0],/Chưa đọc/);});
