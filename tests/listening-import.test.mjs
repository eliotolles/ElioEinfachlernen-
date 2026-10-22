import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../public/js/listening.js',import.meta.url),'utf8');
const handler=source.slice(source.indexOf("q('#yt-add').onclick=async()=>"),source.indexOf(";q('#ed-level').onchange"));
function fixture(admin=true){
 const fields={'#yt-link':{value:'https://youtu.be/abcdefghijk'},'#yt-name':{value:'Video title'},'#yt-scope':{value:admin?'shared':'private'},'#yt-add':{disabled:false},'#yt-import-status':{textContent:''},'#ed-level':{value:'B1'}};
 const counts={metadata:0,save:0,render:0,captions:0},context={crypto,Auth:{user:'user1'},isAdmin:admin,library:{videos:[]},sharedVideos:[],videoLevelInput:{value:'B1'},collectionInput:{value:'Nicos Weg'},location:{hash:'#original'},level:'B1',selected:null,index:0,q:s=>fields[s],parseId:value=>{const u=new URL(value);return u.hostname==='youtu.be'?u.pathname.slice(1):u.searchParams.get('v');},collectionName:v=>v.collection||'Chưa phân bộ',collectionHref:(name,scope,id)=>'#'+name+':'+scope+':'+id,videoTitles:{update:async()=>counts.metadata++},draft(){},stop(){},save(){counts.save++;},render(){counts.render++;},prepareCaptions(){counts.captions++;}};
 vm.createContext(context);vm.runInContext(handler,context);return {context,fields,counts,add:()=>fields['#yt-add'].onclick()};
}
test('admin imports stay at the current form and preserve collection and level for the next video',async()=>{
 const f=fixture();await f.add();assert.equal(f.context.location.hash,'#original');assert.equal(f.context.sharedVideos.length,1);assert.equal(f.context.library.videos.length,0);assert.equal(f.context.sharedVideos[0].collection,'Nicos Weg');assert.equal(f.context.sharedVideos[0].level,'B1');assert.equal(f.context.collectionInput.value,'Nicos Weg');assert.equal(f.context.videoLevelInput.value,'B1');assert.equal(f.counts.captions,1);assert.ok(f.fields['#yt-import-status'].textContent.includes('nhập link tiếp theo'));assert.equal(f.fields['#yt-add'].disabled,false);
 f.fields['#yt-link'].value='https://youtu.be/lmnopqrstuv';await f.add();assert.equal(f.context.sharedVideos.length,2);assert.equal(f.context.location.hash,'#original');
});
test('duplicate URL formats show an inline warning without writes, navigation or caption generation',async()=>{
 const f=fixture();await f.add();const before={...f.counts};f.fields['#yt-link'].value='https://www.youtube.com/watch?v=abcdefghijk';await f.add();assert.equal(f.context.sharedVideos.length,1);assert.deepEqual(f.counts,before);assert.equal(f.context.location.hash,'#original');assert.ok(f.fields['#yt-import-status'].textContent.includes('đã có trong bộ Nicos Weg · B1'));assert.ok(f.fields['#yt-import-status'].textContent.includes('Không thêm bản trùng'));
});
test('ordinary users still open their newly added private video',async()=>{
 const f=fixture(false);await f.add();assert.equal(f.context.library.videos.length,1);assert.equal(f.context.sharedVideos.length,0);assert.equal(f.context.location.hash,'#Nicos Weg:private:'+f.context.library.videos[0].id);
});
test('account changes while title metadata loads cancel the import',async()=>{
 const f=fixture();let resolve;f.context.videoTitles.update=()=>new Promise(r=>resolve=r);const pending=f.add();f.context.Auth.user='different';resolve();await pending;assert.equal(f.context.sharedVideos.length,0);assert.equal(f.context.location.hash,'#original');assert.equal(f.counts.save,0);assert.equal(f.fields['#yt-add'].disabled,false);
});
