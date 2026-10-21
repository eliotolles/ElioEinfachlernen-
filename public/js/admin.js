'use strict';
if(Account.profile.role!=='super_admin')location.replace('index.html');
const adminMessage=m=>$('#admin-status').textContent=m;
async function adminAction(fn){try{await fn();adminMessage('Đã lưu ✓');}catch(e){adminMessage(e.message);}}
async function renderAdminAI(){const data=await Account.request('/api/admin/ai');$('#admin-ai-list').innerHTML=data.items.map(r=>`<div class="admin-row"><strong>${esc(r.label)}</strong> · ${esc(r.provider)} / ${esc(r.model)}<p>${r.enabled?'● Bật':'○ Tắt'} · ${esc(r.status)} · Ưu tiên <input type="number" min="0" max="999" value="${r.priority}" data-ai-priority="${esc(r.id)}" data-enabled="${r.enabled}" style="width:80px;display:inline-block">${r.cooldown>Date.now()?' · Chờ '+Math.ceil((r.cooldown-Date.now())/1000)+'s':''}</p><button class="secondary" data-ai-toggle="${esc(r.id)}" data-enabled="${r.enabled}" data-priority="${r.priority}">${r.enabled?'Tắt':'Bật'}</button> <button class="secondary" data-ai-test="${esc(r.id)}">Kiểm tra</button> <button class="secondary" data-ai-models="${esc(r.id)}" data-provider="${esc(r.provider)}">Đổi model</button> <div id="ai-models-${esc(r.id)}"></div><button class="secondary" data-ai-delete="${esc(r.id)}">Xóa key</button></div>`).join('')||'<p>Chưa có API. Hãy thêm ít nhất một cấu hình.</p>';document.querySelectorAll('[data-ai-toggle]').forEach(b=>b.onclick=()=>adminAction(async()=>{await Account.request('/api/admin/ai','PATCH',{id:b.dataset.aiToggle,enabled:b.dataset.enabled!=='1',priority:Number(b.dataset.priority)});await renderAdminAI();}));document.querySelectorAll('[data-ai-priority]').forEach(input=>input.onchange=()=>adminAction(async()=>{await Account.request('/api/admin/ai','PATCH',{id:input.dataset.aiPriority,enabled:input.dataset.enabled==='1',priority:Number(input.value)});await renderAdminAI();}));document.querySelectorAll('[data-ai-test]').forEach(b=>b.onclick=()=>adminAction(async()=>{b.disabled=true;try{await Account.request('/api/admin/ai/test','POST',{id:b.dataset.aiTest});adminMessage('Kết nối AI thành công ✓');}finally{await renderAdminAI();b.disabled=false;}}));document.querySelectorAll('[data-ai-models]').forEach(b=>b.onclick=()=>adminAction(async()=>{const host=document.getElementById('ai-models-'+b.dataset.aiModels);host.replaceChildren();const input=document.createElement(['gemini','openrouter'].includes(b.dataset.provider)?'select':'input');if(['gemini','openrouter'].includes(b.dataset.provider)){const data=await Account.request('/api/admin/ai/models','POST',{id:b.dataset.aiModels});for(const model of data.items){const option=document.createElement('option');option.value=model.id;option.textContent=model.name+' · '+model.id;input.append(option);}if(!data.items.length)throw Error('Không tìm thấy model phù hợp.');}else{input.placeholder='Nhập mã model từ nhà cung cấp';const list=document.createElement('datalist');list.id='saved-models-'+b.dataset.aiModels;for(const model of AI_MODEL_SUGGESTIONS[b.dataset.provider]?.items||[]){const option=document.createElement('option');option.value=model.id;option.label=model.name;list.append(option);}input.setAttribute('list',list.id);host.append(list);}const save=document.createElement('button');save.className='secondary';save.textContent='Lưu model';save.onclick=()=>adminAction(async()=>{if(!input.value.trim())throw Error('Chọn hoặc nhập model.');await Account.request('/api/admin/ai','PATCH',{id:b.dataset.aiModels,model:input.value});await renderAdminAI();});const note=document.createElement('p');note.className='help-text';note.textContent='OpenRouter chỉ dùng model miễn phí; các nhà cung cấp khác tùy quota tài khoản. Lưu rồi bấm Kiểm tra.';host.append(input,save,note);}));document.querySelectorAll('[data-ai-delete]').forEach(b=>b.onclick=()=>{if(confirm('Xóa cấu hình API này?'))adminAction(async()=>{await Account.request('/api/admin/ai','DELETE',{id:b.dataset.aiDelete});await renderAdminAI();});});}
$('#admin-ai-form').onsubmit=e=>{e.preventDefault();const f=e.target.elements;adminAction(async()=>{await Account.request('/api/admin/ai','POST',{label:f.label.value,provider:f.provider.value,model:f.model.value,key:f.key.value,priority:Number(f.priority.value),vision:f.vision.checked});f.key.value='';await renderAdminAI();});};
$('#admin-site-form').onsubmit=e=>{e.preventDefault();adminAction(async()=>{const data=Object.fromEntries(new FormData(e.target));await Account.request('/api/admin/config','PUT',data);await Account.refresh();App.apply();});};
for(const [key,value]of Object.entries({name:'Elio Einfach',accent:'#26754b',font:'lexend',germanSpeechVoice:'Kore',germanSpeechRate:.9,...Account.config})){const field=$('#admin-site-form').elements.namedItem(key);if(field)field.value=value;}
function renderAdminContent(){$('#admin-content-json').value=JSON.stringify(Account.shared[$('#admin-content-kind').value]?.value||[],null,2);}$('#admin-content-kind').onchange=renderAdminContent;$('#admin-content-save').onclick=()=>adminAction(async()=>{const name=$('#admin-content-kind').value,value=JSON.parse($('#admin-content-json').value);if(!Array.isArray(value))throw Error('Cần mảng JSON.');Account.set(name,value);await Account.flush();if(Object.keys(Account.pending).length)throw Error('Nội dung còn chờ đồng bộ. Kiểm tra trạng thái kết nối.');if(Object.keys(Account.conflicts).length)throw Error('Xung đột dữ liệu. Mở Cài đặt để xử lý.');});
async function renderAdminUsers(){const data=await Account.request('/api/admin/users');$('#admin-users').innerHTML=data.items.map(u=>`<div class="admin-row"><strong>${esc(u.email)}</strong> · ${esc(u.role)} ${u.blocked?'· Khóa':''}${u.role==='user'?` <button class="secondary" data-user="${esc(u.id)}" data-blocked="${u.blocked}">${u.blocked?'Mở khóa':'Khóa'}</button>`:''}</div>`).join('');document.querySelectorAll('[data-user]').forEach(b=>b.onclick=()=>adminAction(async()=>{await Account.request('/api/admin/users','PATCH',{id:b.dataset.user,blocked:b.dataset.blocked!=='1'});await renderAdminUsers();}));}
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

$('#admin-speech-preview').onclick=()=>{const f=$('#admin-site-form').elements;GermanSpeech.read('Guten Tag! Ich lerne Deutsch. Jeden Tag mache ich einen kleinen Fortschritt.',null,Number(f.germanSpeechRate.value),{germanSpeechVoice:f.germanSpeechVoice.value});};
