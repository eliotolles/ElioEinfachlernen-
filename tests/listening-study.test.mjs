import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function fixture(){
 class Node{
  constructor(tag){this.tag=tag;this.children=[];this.attrs={};this.textContent='';this.value='';}
  get firstChild(){return this.children[0];}
  append(...nodes){for(const n of nodes){if(n.parent)n.parent.children=n.parent.children.filter(x=>x!==n);n.parent=this;this.children.push(n);}}
  after(n){n.parent=this.parent;this.parent.children.splice(this.parent.children.indexOf(this)+1,0,n);}
  replaceChildren(...nodes){this.children=[];this.append(...nodes);}
  setAttribute(k,v){this.attrs[k]=v;}
  querySelector(selector){return this.all().find(n=>selector[0]==='#'?n.id===selector.slice(1):selector[0]==='.'?n.className?.split(' ').includes(selector.slice(1)):n.tag===selector);}
  all(){return this.children.flatMap(n=>[n,...n.all()]);}
  click(){this.onclick?.();}
 }
 const document={createElement:t=>new Node(t),createTextNode:t=>Object.assign(new Node('#text'),{textContent:t})};const root=new Node('main'),side=new Node('section');side.className='ed-writing-column';const screen=new Node('div');screen.id='yt-player-wrap';const answer=new Node('textarea');answer.id='ed-answer';answer.value='Draft preserved';side.append(answer);root.append(screen,side);
 let index=0,rate=.85,playCount=0,pauseCount=0;const v={id:'v1',title:'Video',cues:[{start:0,end:2,text:'Guten Morgen.'},{start:2,end:4,text:'Wie geht es dir?'}]};const study={};let panel;
 const api={root,video:()=>v,index:()=>index,ready:()=>true,select:i=>{if(i>=0&&i<v.cues.length){index=i;panel.render();}},play:()=>playCount++,pause:()=>pauseCount++,speed:r=>r===undefined?rate:rate=r,getStudy:id=>study[id],setStudy:(id,d)=>study[id]=d};
 let aiCalls=0;const context=vm.createContext({document,structuredClone,Auth:{user:'learner'},App:{evaluate:async()=>{aiCalls++;return {vi:'Chào buổi sáng.'};}}});vm.runInContext(fs.readFileSync(new URL('../public/js/listening-study.js',import.meta.url),'utf8'),context);panel=vm.runInContext('ListeningStudy',context).mount(api);panel.render();
 return {root,side,answer,panel,api,get aiCalls(){return aiCalls;},get plays(){return playCount;},get pauses(){return pauseCount;},button:text=>root.all().find(n=>n.tag==='button'&&n.textContent===text),get index(){return index;}};
}
test('shadowing plays and pauses the selected cue, repeats only in its tab and shows the same sentence below video',()=>{
 const f=fixture();f.button('▶ Nghe câu').click();assert.equal(f.plays,1);f.panel.playback(1);f.button('Ⅱ Dừng câu').click();assert.equal(f.pauses,1);
 f.button('↻ Lặp').click();assert.equal(f.panel.loop(),true);f.button('→').click();assert.equal(f.index,1);assert.equal(f.root.querySelector('.ls-video-sentence').textContent,'Wie geht es dir?');
 f.button('Nghe chép').click();assert.equal(f.panel.loop(),false);assert.equal(f.root.querySelector('#ed-answer'),f.answer);assert.equal(f.answer.value,'Draft preserved');
});
test('tab browsing and sentence practice do not call analysis services',()=>{
 const f=fixture();for(const name of ['Phụ đề','Từ cần học','Shadowing','Nghe chép']){assert.ok(f.button(name));f.button(name).click();}assert.equal(f.answer.value,'Draft preserved');assert.equal(f.plays,0);assert.equal(f.aiCalls,0);
});


test('continuous subtitles follow timestamp boundaries and backward seeking without AI or replacing dictation drafts',()=>{const f=fixture();f.button('Phụ đề').click();assert.equal(f.panel.continuous(),true);const list=f.root.querySelector('.ls-subtitles');list.clientHeight=50;list.scrollTop=0;list.offsetTop=0;list.children.forEach((n,i)=>{n.offsetTop=i*100;n.offsetHeight=80;});f.panel.tick(2.1);assert.equal(list.children[1].attrs['aria-current'],'true');assert(list.scrollTop>0);f.panel.tick(.5);assert.equal(list.children[0].attrs['aria-current'],'true');f.panel.tick(4);assert(list.children.every(n=>n.attrs['aria-current']==='false'));f.button('Shadowing').click();assert.equal(f.panel.continuous(),false);assert.equal(f.aiCalls,0);assert.equal(f.answer.value,'Draft preserved');});
