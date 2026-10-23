import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function fixture(){
 const handlers=new Map();
 class Element{
  constructor(tag){this.tag=tag;this.children=[];this.attrs={};this.value='';this.textContent='';}
  append(...nodes){for(const node of nodes){node.parent=this;this.children.push(node);}}
  before(node){const i=this.parent.children.indexOf(this);node.parent=this.parent;this.parent.children.splice(i,0,node);}
  replaceChildren(...nodes){this.children=[];this.append(...nodes);}
  setAttribute(k,v){this.attrs[k]=v;}
  get options(){return this.children;}
  querySelector(selector){return selector===':scope > summary'?this.children.find(n=>n.tag==='summary'):null;}
  dispatchEvent(event){this.onchange?.(event);for(const fn of handlers.get(event.type)||[])fn({...event,target:this});}
  click(){this.onclick?.();}
  focus(){}
 }
 const root=new Element('main');
 const descendants=(node=root)=>[node,...node.children.flatMap(n=>descendants(n))];
 const doc={createElement:t=>new Element(t),createTextNode:t=>Object.assign(new Element('#text'),{textContent:t}),getElementById:id=>descendants().find(n=>n.id===id),addEventListener:(event,fn)=>handlers.set(event,[...(handlers.get(event)||[]),fn])};
 const make=(tag,id,parent=root)=>{const e=new Element(tag);e.id=id;parent.append(e);return e;};
 const setup=make('details','exam-setup');make('summary','',setup);
 const field=(id,values,value)=>{const e=make('select',id,setup);for(const v of values)e.append(Object.assign(new Element('option'),{value:v,text:v}));e.value=value;return e;};
 const fields={exam:field('sim-exam',['Goethe','Telc','ÖSD'],'Goethe'),level:field('sim-level',['A1','A2','B1','B2'],'B1'),folder:field('sim-folder',['samples','personal'],'samples'),mode:field('sim-mode',['module','part','full'],'module'),skill:field('sim-skill',['reading','writing'],'reading'),part:field('sim-part',['all','1','2'],'all')};
 const calls=[];make('button','sim-start').onclick=()=>calls.push(Object.fromEntries(Object.entries(fields).map(([k,e])=>[k,e.value])));
 const profile={modules:[{key:'reading',name:'Lesen',parts:[{teil:1,name:'Matching'},{teil:2,name:'Text'}]},{key:'writing',name:'Schreiben',parts:[{teil:1,name:'Brief'}]}],blocks:[{name:'Lesen',minutes:65},{name:'Schreiben',minutes:60}]};
 const queue=[];
 const context={Account:{project:(_name,select)=>select([])},document:doc,App:{settings:()=>({language:'vi'})},examProfile:()=>profile,Event:class{constructor(type){this.type=type;}},queueMicrotask:fn=>queue.push(fn),MutationObserver:class{observe(){}}};
 vm.runInNewContext(fs.readFileSync(new URL('../public/js/exam-catalog-ui.js',import.meta.url),'utf8'),context);
 const click=text=>{const b=descendants().find(n=>n.tag==='button'&&n.textContent===text);assert.ok(b,`Visible action: ${text}`);b.click();while(queue.length)queue.shift()();};
 const open=()=>{const head=descendants().find(n=>n.className==='exam-catalog-head');head.click();};
 return {fields,calls,descendants,click,open};
}
test('all three catalog activities are exposed and browsing tabs preserves the default exam controls',()=>{
 const f=fixture();const before=Object.fromEntries(Object.entries(f.fields).map(([k,e])=>[k,e.value]));f.open();
 for(const label of ['Bộ đề','Luyện kỹ năng','Thi thử'])f.click(label);
 assert.deepEqual(Object.fromEntries(Object.entries(f.fields).map(([k,e])=>[k,e.value])),before);
 assert.equal(f.calls.length,0);
});
test('skill and full mock actions delegate the explicit selection to the original start handler',()=>{
 const f=fixture();f.open();f.click('Luyện kỹ năng');f.click('Teil 2 · Text ↗');
 assert.deepEqual(f.calls[0],{exam:'Goethe',level:'B1',folder:'samples',mode:'part',skill:'reading',part:'2'});
 f.click('Thi thử');f.click('Bắt đầu thi thử →');assert.equal(f.calls[1].mode,'full');
});

test('collection editing checks permissions and keeps original task identities and metadata',()=>{
 const old={id:'shared-test',type:'exam',name:'Đề gốc',exam:'Goethe',level:'B1',ownerId:'admin',items:[{id:'task-1',title:'Bài viết',content:'Nội dung gốc',skill:'writing',teil:1,sourcePage:4,questions:[{id:'q1',prompt:'Old',answer:'A'}]}]};
 let records=[structuredClone(old)],allowed=false,writes=0;
 const context=vm.createContext({Auth:{user:'admin',get:()=>records,set:(_,next)=>{writes++;records=next;}},Account:{canEdit:()=>allowed},document:{getElementById:()=>null,dispatchEvent:()=>{}},Event:class{}});
 vm.runInContext(fs.readFileSync(new URL('../public/js/exam-catalog-ui.js',import.meta.url),'utf8'),context);
 const api=vm.runInContext('ExamCollectionEdits',context),expected=JSON.stringify(old),patch={name:'Đề đã sửa',items:[{...old.items[0],title:'Tiêu đề mới',content:'Nội dung mới',questions:[{id:'q1',prompt:'New',answer:'B'}]}]};
 assert.throws(()=>api.save(old.id,patch,expected,'admin'),/quyền/);assert.equal(writes,0);
 allowed=true;api.save(old.id,patch,expected,'admin');assert.equal(records[0].items[0].id,'task-1');assert.equal(records[0].items[0].sourcePage,4);assert.equal(records[0].ownerId,'admin');assert.equal(records[0].items[0].questions[0].answer,'B');
 assert.throws(()=>api.save(old.id,patch,expected,'admin'),/đã thay đổi/);assert.equal(writes,1);
 assert.throws(()=>api.save(old.id,patch,JSON.stringify(records[0]),'another-account'),/quyền/);
});
