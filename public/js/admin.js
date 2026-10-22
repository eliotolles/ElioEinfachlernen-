const ADMIN_AI_HELP={image:'Đọc ảnh, PDF và nội dung video phù hợp.',speech:'Tạo âm thanh tiếng Đức; dự phòng giữa các key trong nhóm.',text:'Chấm chữa, giải thích, hội thoại và xử lý văn bản học.',general:'Bổ sung dữ liệu còn thiếu và tác vụ chung. Phân nhóm này không tự bật giám sát nền.'};
const ADMIN_AI_JOBS={image:'Ảnh & PDF',speech:'Giọng nói',text:'Chấm chữa & văn bản',general:'Giám sát & công việc chung'};
'use strict';
if(Account.profile.role!=='super_admin')location.replace('index.html');
const adminMessage=m=>$('#admin-status').textContent=m;
async function adminAction(fn){try{const result=await fn();adminMessage(typeof result==='string'?result:'Đã lưu ✓');}catch(e){adminMessage(e.message);}}
async function renderAdminAI(){const data=await Account.request('/api/admin/ai');const opened=new Set([...document.querySelectorAll('[data-ai-group][open]')].map(x=>x.dataset.aiGroup));$('#admin-ai-list').innerHTML=Object.entries(ADMIN_AI_JOBS).map(([job,label])=>{const items=data.items.filter(r=>(r.job||(r.vision?'image':'text'))===job);return `<details class="ai-work-group" data-ai-group="${job}" ${opened.has(job)?'open':''}><summary><span>${label}</span><small>${items.length} cấu hình</small></summary><div class="ai-work-children"><p class="ai-group-note">${ADMIN_AI_HELP[job]}</p>`+items.map(r=>`<details class="ai-config-card"><summary><strong>${esc(r.label)}</strong> · ${esc(r.provider)} / ${esc(r.model)}</summary><p>${r.enabled?'● Bật':'○ Tắt'} · ${esc(r.status)} · Ưu tiên <input type="number" min="0" max="999" value="${r.priority}" data-ai-priority="${esc(r.id)}" data-enabled="${r.enabled}" style="width:80px;display:inline-block">${r.cooldown>Date.now()?' · Chờ '+Math.ceil((r.cooldown-Date.now())/1000)+'s':''}</p><button class="secondary" data-ai-toggle="${esc(r.id)}" data-enabled="${r.enabled}" data-priority="${r.priority}">${r.enabled?'Tắt':'Bật'}</button> <button class="secondary" data-ai-test="${esc(r.id)}">Kiểm tra</button> <button class="secondary" data-ai-models="${esc(r.id)}" data-provider="${esc(r.provider)}" ${r.job==='speech'?'disabled title="Model TTS được quản lý riêng"':''}>Đổi model</button> <div id="ai-models-${esc(r.id)}"></div><label>Vị trí làm việc<select data-ai-job="${esc(r.id)}">${Object.entries(ADMIN_AI_JOBS).map(([key,label])=>`<option value="${key}" ${r.job===key?'selected':''}>${label}</option>`).join('')}${!r.job?'<option value="" selected>Cấu hình cũ · dùng chung tác vụ tương thích</option>':''}</select></label><button class="secondary" data-ai-delete="${esc(r.id)}">Xóa key</button></details>`).join('')+(items.length?'':'<p class="help-text">Chưa có cấu hình trong nhóm này.</p>')+`<div data-ai-extra="${job}"></div></div></details>`;}).join('');document.querySelectorAll('[data-ai-job]').forEach(select=>select.onchange=()=>adminAction(async()=>{await Account.request('/api/admin/ai','PATCH',{id:select.dataset.aiJob,job:select.value});try{const tested=await Account.request('/api/admin/ai/test','POST',{id:select.dataset.aiJob});await renderAdminAI();return 'Đã đổi và thử đúng tác vụ '+(ADMIN_AI_JOBS[tested.tested]||select.value)+' ✓';}catch(error){await renderAdminAI();throw Error('Đã đổi phân công, nhưng phép thử thất bại: '+error.message);} }));;document.querySelectorAll('[data-ai-toggle]').forEach(b=>b.onclick=()=>adminAction(async()=>{await Account.request('/api/admin/ai','PATCH',{id:b.dataset.aiToggle,enabled:b.dataset.enabled!=='1',priority:Number(b.dataset.priority)});await renderAdminAI();}));document.querySelectorAll('[data-ai-priority]').forEach(input=>input.onchange=()=>adminAction(async()=>{await Account.request('/api/admin/ai','PATCH',{id:input.dataset.aiPriority,enabled:input.dataset.enabled==='1',priority:Number(input.value)});await renderAdminAI();}));document.querySelectorAll('[data-ai-test]').forEach(b=>b.onclick=()=>adminAction(async()=>{b.disabled=true;let testMessage='';try{const result=await Account.request('/api/admin/ai/test','POST',{id:b.dataset.aiTest});testMessage=result.tested==='speech'?'Đã tạo âm thanh TTS thử thành công ✓. Không bảo đảm lượt tiếp theo còn quota.':'Đã thử '+(ADMIN_AI_JOBS[result.tested]||'văn bản')+' thành công ✓. Quota có thể thay đổi sau đó.';}finally{await renderAdminAI();b.disabled=false;}return testMessage;}));document.querySelectorAll('[data-ai-models]').forEach(b=>b.onclick=()=>adminAction(async()=>{const host=document.getElementById('ai-models-'+b.dataset.aiModels);host.replaceChildren();const input=document.createElement(['gemini','openrouter'].includes(b.dataset.provider)?'select':'input');if(['gemini','openrouter'].includes(b.dataset.provider)){const data=await Account.request('/api/admin/ai/models','POST',{id:b.dataset.aiModels});for(const model of data.items){const option=document.createElement('option');option.value=model.id;option.textContent=model.name+' · '+model.id;input.append(option);}if(!data.items.length)throw Error('Không tìm thấy model phù hợp.');}else{input.placeholder='Nhập mã model từ nhà cung cấp';const list=document.createElement('datalist');list.id='saved-models-'+b.dataset.aiModels;for(const model of AI_MODEL_SUGGESTIONS[b.dataset.provider]?.items||[]){const option=document.createElement('option');option.value=model.id;option.label=model.name;list.append(option);}input.setAttribute('list',list.id);host.append(list);}const save=document.createElement('button');save.className='secondary';save.textContent='Lưu model';save.onclick=()=>adminAction(async()=>{if(!input.value.trim())throw Error('Chọn hoặc nhập model.');await Account.request('/api/admin/ai','PATCH',{id:b.dataset.aiModels,model:input.value});try{await Account.request('/api/admin/ai/test','POST',{id:b.dataset.aiModels});await renderAdminAI();return 'Đã đổi model và thử công việc thành công ✓';}catch(error){await renderAdminAI();throw Error('Đã đổi model, nhưng phép thử công việc thất bại: '+error.message);}});const note=document.createElement('p');note.className='help-text';note.textContent='OpenRouter chỉ dùng model miễn phí; các nhà cung cấp khác tùy quota tài khoản. Lưu rồi bấm Kiểm tra.';host.append(input,save,note);}));document.querySelectorAll('[data-ai-delete]').forEach(b=>b.onclick=()=>{if(confirm('Xóa cấu hình API này?'))adminAction(async()=>{await Account.request('/api/admin/ai','DELETE',{id:b.dataset.aiDelete});await renderAdminAI();});});}
$('#admin-ai-form').onsubmit=e=>{e.preventDefault();const f=e.target.elements;adminAction(async()=>{const saved=await Account.request('/api/admin/ai','POST',{label:f.label.value,provider:f.provider.value,model:f.model.value,key:f.key.value,priority:Number(f.priority.value),vision:f.vision.checked,job:f.job.value});f.key.value='';try{const tested=await Account.request('/api/admin/ai/test','POST',{id:saved.id});await renderAdminAI();return 'Đã lưu và thử đúng tác vụ '+(ADMIN_AI_JOBS[tested.tested]||f.job.value)+' thành công ✓';}catch(error){await renderAdminAI();throw Error('Đã lưu phân công, nhưng phép thử công việc thất bại: '+error.message);} });};
$('#admin-site-form').onsubmit=e=>{e.preventDefault();adminAction(async()=>{const data=Object.fromEntries(new FormData(e.target));await Account.request('/api/admin/config','PUT',data);await Account.refresh();App.apply();});};
for(const [key,value]of Object.entries({name:'Elio Einfach',accent:'#26754b',font:'lexend',germanSpeechVoice:'Kore',germanSpeechRate:.9,germanSpeechFallbackVoice:'Kore',...Account.config})){const field=$('#admin-site-form').elements.namedItem(key);if(field)field.value=value;}
function renderAdminContent(){$('#admin-content-json').value=JSON.stringify(Account.shared[$('#admin-content-kind').value]?.value||[],null,2);}$('#admin-content-kind').onchange=renderAdminContent;$('#admin-content-save').onclick=()=>adminAction(async()=>{const name=$('#admin-content-kind').value,value=JSON.parse($('#admin-content-json').value);if(!Array.isArray(value))throw Error('Cần mảng JSON.');Account.set(name,value);await Account.flush();if(Object.keys(Account.pending).length)throw Error('Nội dung còn chờ đồng bộ. Kiểm tra trạng thái kết nối.');if(Object.keys(Account.conflicts).length)throw Error('Xung đột dữ liệu. Mở Cài đặt để xử lý.');});
let accountDeleting=false;
async function renderAdminUsers(){
 const data=await Account.request('/api/admin/users');
 $('#admin-users').innerHTML=data.items.map(u=>`<div class="admin-row"><strong>${esc(u.email)}</strong> · ${esc(u.role)} ${u.blocked?'· Khóa':''}${u.role==='user'?` <button type="button" class="secondary" data-user="${esc(u.id)}" data-blocked="${u.blocked}">${u.blocked?'Mở khóa':'Khóa'}</button>`:''} <button type="button" class="secondary" style="color:var(--danger,#b33737)" data-delete-user="${esc(u.id)}" data-email="${esc(u.email)}" ${u.canDelete===false||u.id===Account.profile.id?'disabled':''} title="${esc(u.deleteReason||'Xóa vĩnh viễn tài khoản và dữ liệu học cá nhân')}">Xóa tài khoản</button></div>`).join('');
 document.querySelectorAll('[data-user]').forEach(b=>b.onclick=()=>adminAction(async()=>{await Account.request('/api/admin/users','PATCH',{id:b.dataset.user,blocked:b.dataset.blocked!=='1'});await renderAdminUsers();}));
 document.querySelectorAll('[data-delete-user]').forEach(button=>button.onclick=async()=>{
  if(accountDeleting||button.disabled)return;
  const email=button.dataset.email,confirmation=prompt('Xóa vĩnh viễn tài khoản '+email+'?\nToàn bộ dữ liệu học cá nhân và phiên đăng nhập trên máy chủ sẽ bị xóa, không thể hoàn tác. Nội dung chung được giữ nguyên.\n\nNhập chính xác email để xác nhận:', '');
  if(confirmation===null)return;if(confirmation!==email){adminMessage('Email xác nhận không khớp. Chưa xóa tài khoản.');return;}
  accountDeleting=true;const buttons=[...$('#admin-users').querySelectorAll('button')],previous=buttons.map(b=>b.disabled);buttons.forEach(b=>b.disabled=true);
  try{await adminAction(async()=>{await Account.request('/api/admin/users','DELETE',{id:button.dataset.deleteUser,confirmEmail:confirmation});await renderAdminUsers();if(!$('#admin-manage-panel').hidden)await renderAdminRoles();return 'Đã xóa tài khoản '+email+' và dữ liệu học cá nhân trên máy chủ.';});}
  finally{buttons.forEach((b,i)=>b.disabled=previous[i]);accountDeleting=false;}
 });
}

const roleForm=$('#admin-role-form'),roleStatus=$('#admin-role-status');
function resetAdminRoleForm(){roleForm.reset();roleForm.elements.id.value='';roleForm.elements.email.readOnly=false;}
$('#admin-manage-toggle').onclick=async()=>{
 const button=$('#admin-manage-toggle'),panel=$('#admin-manage-panel');panel.hidden=!panel.hidden;button.setAttribute('aria-expanded',String(!panel.hidden));
 if(!panel.hidden)try{await renderAdminRoles();roleForm.elements.email.focus();}catch(error){roleStatus.textContent=error.message;}
};
$('#admin-role-cancel').onclick=()=>{resetAdminRoleForm();roleStatus.textContent='';};
let roleSaving=false;
async function saveAdminRole(target,role){
 if(roleSaving)return;
 const removing=role==='user',email=target.email;
 if(!confirm(removing?'Gỡ quyền Super Admin của '+email+'? Tài khoản và dữ liệu học vẫn được giữ.':'Cấp Super Admin cho '+email+'? Tài khoản này sẽ được quản lý nội dung chung, cấu hình AI và người dùng.'))return;
 roleSaving=true;roleStatus.textContent='Đang lưu quyền…';
 const controls=[...roleForm.querySelectorAll('input,select,button'),...$('#admin-role-list').querySelectorAll('button')],previous=controls.map(control=>control.disabled);controls.forEach(control=>control.disabled=true);
 try{
  const data=target.id?{id:target.id,role}:{email,role};
  const result=await Account.request('/api/admin/users','PATCH',data);
  resetAdminRoleForm();
  await Promise.all([renderAdminUsers(),renderAdminRoles()]);
  roleStatus.textContent=result.changed?'Đã '+(removing?'gỡ quyền Admin':'cấp Super Admin')+' cho '+email+'. Tài khoản này cần đăng nhập lại.':'Tài khoản đã có quyền đã chọn.';
 }catch(error){roleStatus.textContent=error.message;}
 finally{controls.forEach((control,i)=>control.disabled=previous[i]);roleSaving=false;}
}
roleForm.onsubmit=e=>{e.preventDefault();saveAdminRole({id:roleForm.elements.id.value,email:roleForm.elements.email.value.trim()},roleForm.elements.role.value);};
async function renderAdminRoles(){
 const data=await Account.request('/api/admin/users?role=super_admin');
 const host=$('#admin-role-list');host.replaceChildren();
 for(const user of data.items){
  const row=document.createElement('div');row.className='admin-row';
  const name=document.createElement('strong');name.textContent=user.email;
  const text=document.createElement('p');text.textContent='Super Admin'+(user.id===Account.profile.id?' · Bạn':'')+(user.blocked?' · Đang khóa':'');
  const edit=document.createElement('button');edit.type='button';edit.className='secondary';edit.textContent='Sửa quyền';
  edit.onclick=()=>{if(roleSaving)return;roleForm.elements.id.value=user.id;roleForm.elements.email.value=user.email;roleForm.elements.email.readOnly=true;roleForm.elements.role.value='super_admin';roleForm.elements.role.focus();};
  const remove=document.createElement('button');remove.type='button';remove.className='secondary';remove.textContent='Gỡ Admin';remove.disabled=user.id===Account.profile.id||data.items.filter(item=>!item.blocked).length<=1;
  if(remove.disabled)remove.title='Cần một Super Admin khác để gỡ quyền.';
  remove.onclick=()=>saveAdminRole(user,'user');row.append(name,text,edit,document.createTextNode(' '),remove);host.append(row);
 }
 if(!data.items.length)host.textContent='Chưa có Admin.';
}
renderAdminAI().catch(e=>adminMessage(e.message));renderAdminUsers().catch(e=>adminMessage(e.message));renderAdminContent();

$('#admin-ai-form').elements.provider.onchange=()=>{const fields=$('#admin-ai-form').elements;const previous=fields.model.value;const known=Object.values(AI_MODEL_SUGGESTIONS).some(c=>c.items.some(m=>m.id===previous));if(known)fields.model.value='';renderModelSuggestions();};renderModelSuggestions();

$('#admin-speech-preview').onclick=()=>{const f=$('#admin-site-form').elements;GermanSpeech.read('Guten Tag! Ich lerne Deutsch. Jeden Tag mache ich einen kleinen Fortschritt.',null,Number(f.germanSpeechRate.value),{germanSpeechVoice:f.germanSpeechVoice.value,germanSpeechFallbackVoice:f.germanSpeechFallbackVoice.value});};

$('#admin-piper-download').onclick=async()=>{const button=$('#admin-piper-download'),status=$('#admin-piper-status');button.disabled=true;status.textContent='Đang tải / kiểm tra bộ giọng Đức trên thiết bị này…';try{await PiperGerman.prepare();status.textContent='Piper đã sẵn sàng. Chọn giọng Piper, bấm Nghe thử rồi Lưu cài đặt chung nếu phù hợp.';}catch(error){status.textContent='Piper chưa chạy được: '+error.message+' Bạn có thể dùng API giọng đọc riêng.';}finally{button.disabled=false;}};
const aiFields=$('#admin-ai-form').elements;
aiFields.job.onchange=()=>{const speech=aiFields.job.value==='speech';aiFields.provider.disabled=speech;aiFields.model.readOnly=speech;$('#ai-model-suggestions').hidden=speech;if(speech){aiFields.provider.value='gemini';aiFields.model.value='gemini-2.5-flash-preview-tts';aiFields.vision.checked=false;}else if(aiFields.model.value==='gemini-2.5-flash-preview-tts')aiFields.model.value='gemini-flash-latest';if(aiFields.job.value==='image')aiFields.vision.checked=true;};
const adminMain=document.querySelector('main');
if(adminMain){
 const sections=[...adminMain.querySelectorAll(':scope > section')];
 const names=['AI & phân công','Nội dung học','Tài khoản & quyền','Giao diện & giọng đọc'];
 const keys=['ai','content','users','appearance'];const nav=document.createElement('nav');nav.className='admin-navigation';nav.setAttribute('aria-label','Các mục quản trị');
 const panels=new Map();for(const [i,section] of sections.entries()){const heading=section.querySelector('h2')?.textContent||'';let key=section.id==='ai'?'ai':heading.includes('Tài khoản')?'users':heading.includes('Sửa tài liệu')?'content':'appearance';section.dataset.adminPanel=key;panels.set(key,true);}
 function activate(key){if(!keys.includes(key))key='ai';for(const section of sections)section.hidden=section.dataset.adminPanel!==key;for(const b of nav.querySelectorAll('button')){const active=b.dataset.adminTarget===key;b.setAttribute('aria-pressed',String(active));} }
 keys.forEach((key,i)=>{const button=document.createElement('button');button.type='button';button.dataset.adminTarget=key;button.textContent=names[i];button.onclick=()=>{activate(key);history.replaceState(null,'','#'+key);};nav.append(button);});
 adminMain.querySelector('h1').after(nav);activate(location.hash.slice(1)||'ai');window.addEventListener('hashchange',()=>activate(location.hash.slice(1)));
 const form=$('#admin-ai-form');const add=document.createElement('details');add.className='admin-add-ai';const summary=document.createElement('summary');summary.textContent='＋ Thêm cấu hình AI';form.before(add);add.append(summary,form);
}

