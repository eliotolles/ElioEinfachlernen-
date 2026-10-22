'use strict';
function mergeWritingFeedback(local,remote){
 const object=v=>v&&typeof v==='object'&&!Array.isArray(v);if(!object(local)||!object(remote))throw Error('Dữ liệu chữa bài không đúng định dạng; chưa gộp hay ghi đè.');
 const merged={};for(const key of new Set([...Object.keys(remote),...Object.keys(local)])){const a=local[key],b=remote[key];if(a===undefined){merged[key]=structuredClone(b);continue;}if(b===undefined){merged[key]=structuredClone(a);continue;}if(JSON.stringify(a)===JSON.stringify(b)){merged[key]=structuredClone(a);continue;}if(!object(a)||!object(b))throw Error('Có bài chữa không đúng định dạng; giữ nguyên xung đột để kiểm tra.');
 const snapshot=v=>{const {conflictVersions,...rest}=v;return rest;};const unique=values=>{const seen=new Set();return values.filter(v=>{const id=JSON.stringify(v);if(seen.has(id))return false;seen.add(id);return true;});};
 const latest=Number(a.updatedAt||0)>Number(b.updatedAt||0)?a:b;
 merged[key]={...structuredClone(latest),attempts:unique([...(b.attempts||[]),...(a.attempts||[]),...[b,a].filter(v=>v.data!==undefined).map(v=>({data:v.data,essay:v.essay||'',updatedAt:v.updatedAt||0}))]).sort((x,y)=>Number(x.updatedAt||0)-Number(y.updatedAt||0)),conflictVersions:unique([...(b.conflictVersions||[]),...(a.conflictVersions||[]),snapshot(b),snapshot(a)])};
 }return merged;
}
// Only reconcile identical libraries or a proven caption-prefix extension. Never resurrect deletions or choose between edits.
function mergeCaptionLibraries(local,remote){
 if(!Array.isArray(local)||!Array.isArray(remote)||local.length!==remote.length)return null;
 const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),result=[];
 const strip=v=>Object.fromEntries(Object.entries(v).filter(([k])=>!['cues','processedUntil','duration','transcriptionPending'].includes(k)));
 const byId=new Map(remote.map(v=>[v.id,v]));if(byId.size!==remote.length)return null;
 for(const a of local){const b=byId.get(a.id);if(!b)return null;if(same(a,b)){result.push(structuredClone(a));continue;}
  if(!same(strip(a),strip(b))||!Array.isArray(a.cues)||!Array.isArray(b.cues))return null;
  const shorter=a.cues.length<=b.cues.length?a:b,longer=shorter===a?b:a;
  if(!shorter.cues.every((c,i)=>same(c,longer.cues[i])))return null;
  const value=structuredClone(longer);value.processedUntil=Math.max(Number(a.processedUntil)||0,Number(b.processedUntil)||0);
  const duration=Math.max(Number(a.duration)||0,Number(b.duration)||0);if(duration)value.duration=duration;
  if(a.transcriptionPending!==undefined||b.transcriptionPending!==undefined)value.transcriptionPending=duration?value.processedUntil<Math.min(duration,7200):Boolean(a.transcriptionPending||b.transcriptionPending);
  result.push(value);
 }return result;
}
const parentAccount=(()=>{try{return window.parent!==window&&window.parent.ElioNavigationHost?window.parent.ElioSharedAccount:null;}catch{return null;}})();
const Account=parentAccount||{profile:null,records:{},shared:{},config:{},pending:{},conflicts:{},syncing:false,online:true,
 users(){try{return JSON.parse(localStorage.getItem('dt:_users')||'{}');}catch{return {};}},
 current(){return this.profile?.id||null;},
 displayName(){const value=this.get('settings',{}).userProfile?.name;return (typeof value==='string'&&value.trim()?value.trim().slice(0,60):this.profile?.email?.split('@')[0])||'Elio';},
 avatar(){const value=this.get('settings',{}).userProfile?.avatar;return typeof value==='string'&&value.length<=80000&&/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value)?value:'';},
 async request(path,method='GET',data){let response;try{response=await fetch(path,{method,credentials:'same-origin',headers:data?{'Content-Type':'application/json'}:{},body:data?JSON.stringify(data):undefined});}catch{const e=new Error('Mất kết nối. Thay đổi được giữ trên thiết bị.');e.offline=true;throw e;}let result;try{result=await response.json();}catch{const e=new Error('Máy chủ trả phản hồi không hợp lệ (HTTP '+response.status+'). Nội dung đã lưu được giữ nguyên.');e.status=response.ok?502:response.status;e.data={retryable:response.ok||response.status>=500,retryAfter:30};throw e;}if(!response.ok){const e=new Error(result.error||'Request failed');e.status=response.status;e.data=result;if(e.status===428&&!this.authPage())location.replace('password.html');if(e.status===401&&!this.authPage()){this.profile=null;localStorage.removeItem('elio:profile');this.redirectToLogin();}throw e;}return result;},
 async hash(value){let h=2166136261;for(const char of value)h=Math.imul(h^char.charCodeAt(0),16777619);return(h>>>0).toString(16);},
 async authenticate(email,password,register=false){const r=await this.request('/api/auth/'+(register?'register':'login'),'POST',{email,password});this.profile=r.user;if(!r.user.passwordExpired)await this.refresh();return this.profile.id;},
 destination(value){try{const url=new URL(value||'index.html',location.href),name=url.pathname.split('/').filter(Boolean).at(-1)||'index.html';if(url.origin!==new URL(location.href).origin||!['index','grammatik','wortschatz','schreiben','sprechen','pruefung','tutor','settings','admin','password','history','hoeren','quiz'].includes(name.replace(/\.html$/,'')))return 'index.html';return name+url.search+url.hash;}catch{return 'index.html';}},
 authPage(){return /(?:^|\/)(?:login|register|password)(?:\.html)?\/?$/.test(location.pathname);},
 loginURL(){return 'login.html?next='+encodeURIComponent(this.destination(location.pathname.split('/').filter(Boolean).at(-1)||'index.html'));},
 redirectToLogin(){document.documentElement.classList.add('auth-pending');location.replace(this.loginURL());},
 async logout(){try{await this.request('/api/auth/logout','POST',{});}catch(e){alert(e.message);return;}this.profile=null;localStorage.removeItem('elio:profile');localStorage.setItem('elio:logout',String(Date.now()));this.redirectToLogin();},
 cacheKey(name){return 'elio:'+this.current()+':'+name;},
 status(text){const el=document.getElementById('sync-state');if(el)el.textContent=text;for(const frame of document.querySelectorAll?.('.elio-route-frame')||[])try{const node=frame.contentDocument?.getElementById('sync-state');if(node)node.textContent=text;}catch{}},
 persist(){if(!this.current())return Promise.resolve();return Promise.all([AccountCache.write(this.cacheKey('pending'),structuredClone(this.pending)),AccountCache.write(this.cacheKey('conflicts'),structuredClone(this.conflicts))]).catch(()=>this.status('Không lưu được bản ngoại tuyến. Giữ trang mở và kiểm tra kết nối.'));},
 own(name,fallback){const p=this.pending[name];if(p&&!p.shared)return structuredClone(p.value);const conflict=this.conflicts[name];if(conflict&&!conflict.shared)return structuredClone(conflict.value);return structuredClone(this.records[name]?.value??fallback);},
 get(name,fallback){const own=this.own(name,fallback);if(['materials','wc','vocab','listeningLibrary'].includes(name)){const common=this.pending['shared:'+name]?.value??this.conflicts['shared:'+name]?.value??this.shared[name]?.value??[];const seen=new Set();return [...structuredClone(common),...(Array.isArray(own)?own:[])].filter(x=>{if(!x.id)return true;if(seen.has(x.id))return false;seen.add(x.id);return true;});}return own;},
 isShared(name,id){return (this.shared[name]?.value||[]).some(x=>x.id===id);},
 canEdit(name,id){return this.profile?.role==='super_admin'||!this.isShared(name,id);},
 setPersonal(name,value){if(!this.current())throw Error('Vui lòng đăng nhập.');if(!['materials','vocab'].includes(name)||!Array.isArray(value))throw Error('Dữ liệu từ cá nhân không hợp lệ.');const next=structuredClone(value).filter(x=>!this.isShared(name,x.id)).map(x=>({...x,id:x.id||crypto.randomUUID()}));const old=this.pending[name]||this.conflicts[name],existing=old?.value??this.records[name]?.value;if(JSON.stringify(existing)===JSON.stringify(next))return;this.pending[name]={name,value:next,version:old?.version??this.records[name]?.version??0,shared:false,stamp:crypto.randomUUID()};delete this.conflicts[name];this.persist();this.status('Đang lưu…');clearTimeout(this.timer);this.timer=setTimeout(()=>this.flush(),800);},
 set(name,value){if(!this.current())throw Error('Vui lòng đăng nhập.');const shared=['materials','wc','vocab','listeningLibrary'].includes(name)&&this.profile.role==='super_admin';const key=shared?'shared:'+name:name;let next=structuredClone(value);if(shared&&['materials','vocab'].includes(name)){const own=this.own(name,[]),personal=next.filter(x=>x.scope==='personal');if(personal.length||own.some(x=>x.scope==='personal'))this.setPersonal(name,[...own.filter(x=>x.scope!=='personal'),...personal]);next=next.filter(x=>x.scope!=='personal');}if(['materials','wc','vocab','listeningLibrary'].includes(name)){next=next.map(x=>({...x,id:x.id||crypto.randomUUID()}));if(!shared)next=next.filter(x=>!this.isShared(name,x.id));}const existing=this.pending[key]?.value??this.conflicts[key]?.value??(shared?this.shared:this.records)[name]?.value;if(JSON.stringify(existing)===JSON.stringify(next))return;const base=(shared?this.shared:this.records)[name]?.version||0;const old=this.pending[key]||this.conflicts[key];this.pending[key]={name,value:next,version:old?.version??base,shared,stamp:crypto.randomUUID()};delete this.conflicts[key];this.persist();this.status('Đang lưu…');clearTimeout(this.timer);this.timer=setTimeout(()=>this.flush(),800);},
 async reconcileCaptions(){
  const key='shared:listeningLibrary',c=this.conflicts[key];if(!c||!c.latest)return false;
  const latest=this.shared.listeningLibrary?.version>c.latest.version?this.shared.listeningLibrary:c.latest;
  const value=mergeCaptionLibraries(c.value,latest.value);if(value===null)return false;
  await AccountCache.write(this.cacheKey('conflict-backup:'+Date.now()+':'+crypto.randomUUID()),structuredClone(c));
  if(this.conflicts[key]!==c)return false;
  this.shared.listeningLibrary=structuredClone(latest);
  if(JSON.stringify(value)!==JSON.stringify(latest.value))this.pending[key]={name:c.name,value,version:latest.version,shared:true,stamp:crypto.randomUUID()};
  delete this.conflicts[key];await this.persist();return true;
 },
 async mergeCaptionVideoConflict(id){
  if(this.syncing)throw Error('Đang đồng bộ; chờ vài giây rồi thử lại.');
  await this.refresh(['listening','listeningLibrary']);const key='shared:listeningLibrary',c=this.conflicts[key];if(!c?.latest)throw Error('Không còn xung đột phụ đề.');
  const latest=this.shared.listeningLibrary?.version>c.latest.version?this.shared.listeningLibrary:c.latest;
  const a=c.value.find(v=>v.id===id),b=latest.value.find(v=>v.id===id);if(!a||!b)throw Error('Video không còn tồn tại trong cả hai bản.');
  const one=mergeCaptionLibraries([a],[b]);if(!one)throw Error('Video có chỉnh sửa khác nhau; chưa tự chọn hay ghi đè.');
  await AccountCache.write(this.cacheKey('conflict-backup:'+Date.now()+':'+crypto.randomUUID()),structuredClone(c));
  if(this.conflicts[key]!==c)throw Error('Dữ liệu đã thay đổi; kiểm tra lại trước khi gộp.');
  const value=latest.value.map(v=>v.id===id?one[0]:structuredClone(v));
  this.shared.listeningLibrary=structuredClone(latest);this.pending[key]={name:c.name,value,version:latest.version,shared:true,stamp:crypto.randomUUID()};delete this.conflicts[key];await this.persist();await this.flush();document.dispatchEvent(new Event('cloudchange'));
 },
 async refresh(names){if(!names&&this.loaded&&/(?:^|\/)hoeren(?:\.html)?$/.test(location.pathname))names=['listening','listeningLibrary','settings'];const data=await this.request('/api/state'+(names?'?keys='+encodeURIComponent(names.join(',')):''));const old=JSON.stringify([this.records,this.shared,this.config]);this.profile=data.user;if(names){for(const name of names){delete this.records[name];delete this.shared[name];}this.records={...this.records,...data.records};this.shared={...this.shared,...data.shared};}else{this.records=data.records;this.shared=data.shared;}this.config=data.config;try{localStorage.setItem('elio:profile',JSON.stringify({user:this.profile,until:Date.now()+7*86400000}));}catch{this.status('Không lưu được phiên ngoại tuyến.');}await AccountCache.write(this.cacheKey('snapshot'),{...data,records:this.records,shared:this.shared}).catch(()=>this.status('Không lưu được bản ngoại tuyến.'));if(!this.loaded){this.loaded=true;this.pending=await AccountCache.read(this.cacheKey('pending'),{});this.conflicts=await AccountCache.read(this.cacheKey('conflicts'),{});}await this.reconcileCaptions();this.online=true;this.lastRefresh=Date.now();if(old!==JSON.stringify([this.records,this.shared,this.config]))document.dispatchEvent(new Event('cloudchange'));this.status(Object.keys(this.conflicts).length?'Có xung đột · Mở Cài đặt':Object.keys(this.pending).length?(Object.values(this.pending).find(j=>j.error)?.error||'Chờ đồng bộ'):'Đã đồng bộ ✓');},
 async flush(){if(this.syncing||!this.current()||!navigator.onLine){this.status('Chờ kết nối');return;}if(!Object.keys(this.pending).length&&Date.now()-(this.lastRefresh||0)<60000)return;this.syncing=true;try{for(const [key,job]of Object.entries(this.pending)){try{const result=await this.request(job.shared?'/api/shared':'/api/state','PUT',{name:job.name,value:job.value,version:job.version});(job.shared?this.shared:this.records)[job.name]={value:job.value,version:result.version};if(this.pending[key]?.stamp===job.stamp)delete this.pending[key];else if(this.pending[key])this.pending[key].version=result.version;this.persist();}catch(e){if(e.status===409){const current=this.pending[key];const latest=e.data.latest;if(current&&JSON.stringify(current.value)===JSON.stringify(latest?.value)){(job.shared?this.shared:this.records)[job.name]=latest;delete this.pending[key];}else if(current){this.conflicts[key]={...current,latest};delete this.pending[key];await this.reconcileCaptions();}this.persist();}else{if(this.pending[key])this.pending[key].error=e.message;this.persist();this.status(e.message);if(e.offline||[401,403,428].includes(e.status))break;}}}if(!Object.keys(this.pending).length)await this.refresh();this.status(Object.keys(this.conflicts).length?'Có xung đột · Mở Cài đặt':Object.keys(this.pending).length?(Object.values(this.pending).find(j=>j.error)?.error||'Chờ đồng bộ'):'Đã đồng bộ ✓');}catch(e){this.status(e.message);}finally{this.syncing=false;}},
 async mergeFeedbackConflict(key){if(this.syncing)throw Error('Đang đồng bộ. Chờ vài giây rồi thử gộp lại.');const c=this.conflicts[key];if(!c||c.name!=='writingFeedback'||c.shared)throw Error('Chỉ hỗ trợ gộp bài chữa viết cá nhân.');const value=mergeWritingFeedback(c.value,c.latest?.value||{});await AccountCache.write(this.cacheKey('conflict-backup:'+Date.now()+':'+crypto.randomUUID()),structuredClone(c));if(this.conflicts[key]!==c)throw Error('Dữ liệu đã thay đổi. Kiểm tra lại trước khi gộp.');this.pending[key]={name:c.name,value,version:c.latest?.version||0,shared:false,stamp:crypto.randomUUID()};delete this.conflicts[key];await this.persist();await this.flush();document.dispatchEvent(new Event('cloudchange'));},
 async resolve(key,useLocal){const c=this.conflicts[key];if(!c)return;await AccountCache.write(this.cacheKey('conflict-backup:'+Date.now()),c);if(useLocal)this.pending[key]={...c,version:c.latest?.version||0,stamp:crypto.randomUUID()};else{(c.shared?this.shared:this.records)[c.name]=c.latest||{value:null,version:0};}delete this.conflicts[key];this.persist();await this.flush();document.dispatchEvent(new Event('cloudchange'));}
};
async function restoreAccountSnapshot(){
 const [snapshot,pending,conflicts]=await Promise.all([AccountCache.read(Account.cacheKey('snapshot'),null),AccountCache.read(Account.cacheKey('pending'),{}),AccountCache.read(Account.cacheKey('conflicts'),{})]);
 if(!snapshot||snapshot.user?.id!==Account.current())return false;
 Account.records=snapshot.records||{};Account.shared=snapshot.shared||{};Account.config=snapshot.config||{};
 [Account.pending,Account.conflicts]=[pending,conflicts];
 Account.loaded=true;return true;
}
Account.ready=typeof parentAccount!=='undefined'&&parentAccount?Account.ready:(async()=>{
 try{
  const me=await Account.request('/api/auth/me');Account.profile=me.user;
  if(!me.user.passwordExpired&&!Account.authPage()){
   if(await restoreAccountSnapshot()){
    // Authentication is fresh; cached content can render while cloud data refreshes.
    Account.backgroundRefresh=Account.refresh().catch(e=>{if(e.offline)Account.online=false;Account.status(e.message);});
   }else await Account.refresh();
  }
  return true;
 }catch(e){
  if(e.offline){try{const cached=JSON.parse(localStorage.getItem('elio:profile'));if(cached?.until>Date.now()){Account.profile=cached.user;if(await restoreAccountSnapshot()){Account.online=false;return true;}}}catch{}}
  return false;
 }
})();
window.addEventListener('online',()=>Account.flush());window.addEventListener('storage',e=>{if(e.key==='elio:logout'){Account.profile=null;Account.redirectToLogin();}});if(!parentAccount)setInterval(()=>{if(Account.current())Account.flush();},15000);
window.ElioSharedAccount=Account;

