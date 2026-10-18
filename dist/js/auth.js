'use strict';
const $ = s => document.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function readJSON(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function toast(message) { const el=$('#toast'); el.textContent=message; el.style.display='block'; clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.style.display='none',3500); }
const Auth = {
 user: localStorage.getItem('dt:_current'),
 key(suffix) { if(!this.user) throw new Error('Bạn cần đăng nhập để lưu dữ liệu.'); return `dt:${this.user}:${suffix}`; },
 get(suffix, fallback) { return this.user ? readJSON(this.key(suffix),fallback) : structuredClone(fallback); },
 set(suffix,value) { const key=this.key(suffix); try {localStorage.setItem(key,JSON.stringify(value));} catch {throw new Error('Không lưu được dữ liệu. Bộ nhớ trình duyệt có thể đã đầy hoặc bị chặn.');} },
 require() { if(this.user) return true; $('#auth-dialog').showModal(); return false; },
 async hash(value) { // Hash cục bộ đơn giản, không phải hệ thống xác thực bảo mật.
  let h=2166136261; for(const char of value) h=Math.imul(h^char.charCodeAt(0),16777619); return (h>>>0).toString(16);
 },
 update() { $('#user-button').textContent=this.user || (typeof App!=='undefined'?App.t('login'):'Đăng nhập ↗'); $('#logout').hidden=!this.user; document.dispatchEvent(new Event('authchange')); }
};
if(Auth.user && !Object.hasOwn(readJSON('dt:_users',{}),Auth.user)) {Auth.user=null;localStorage.removeItem('dt:_current');}
const path=location.pathname;
const navItems=[['index.html','◈','home'],['grammatik.html','✦','grammar'],['wortschatz.html','▧','vocabulary'],['schreiben.html','✎','writing'],['sprechen.html','◉','speaking'],['pruefung.html','◷','exams'],['tutor.html','⌁','tutor']];
$('#navbar').innerHTML=`<aside class="sidebar"><a class="brand" href="index.html"><b>e</b><span>Elio <strong>Einfach</strong><small>DEUTSCH, JEDEN TAG.</small></span></a><p class="side-label" data-i18n="learnspace">KHÔNG GIAN HỌC</p><div class="navlinks">${navItems.map(([url,icon,key])=>`<a href="${url}" class="${path.endsWith(url)||(url==='index.html'&&path.endsWith('/'))?'active':''}"><span>${icon}</span><span data-i18n="${key}">${key}</span></a>`).join('')}</div><div class="sidebar-bottom"><div class="side-note"><span>✧</span><strong>Einfach anfangen.</strong><small data-i18n="smallsteps">Mỗi ngày, một bước tiến.</small></div><a class="settings-link" href="settings.html">⚙ <span data-i18n="settings">Cài đặt</span></a></div></aside><header class="topbar"><div class="breadcrumb">ELIO EINFACH <span>/</span> <strong id="page-label">LERNRAUM</strong></div><div class="nav-actions"><select id="ui-language" aria-label="Language"><option value="vi">VI</option><option value="de">DE</option><option value="en">EN</option></select><button class="icon-btn" id="theme" aria-label="Theme">◐</button><button class="icon-btn" id="ai-settings">✧ AI</button><button id="user-button"></button><button class="icon-btn" id="logout" hidden>↪</button></div></header>`;
document.body.insertAdjacentHTML('beforeend',`<dialog id="auth-dialog"><button class="secondary dialog-close" type="button" aria-label="Đóng">×</button><h2>Willkommen zurück.</h2><p class="muted">Một không gian học, dành riêng cho bạn.</p><form id="auth-form"><label>Tên đăng nhập<input id="username" autocomplete="username" required pattern="[A-Za-z0-9_-]{2,32}" placeholder="2–32 ký tự: chữ, số, _ hoặc -"></label><label>Mật khẩu<input id="password" type="password" autocomplete="current-password" required minlength="4" maxlength="128"></label><p id="auth-error" role="alert"></p><button class="full" id="auth-submit">Đăng nhập</button><button class="secondary full" id="toggle-register" type="button">Chưa có tài khoản? Đăng ký</button></form><p class="modal-note">Tài khoản chỉ có trên trình duyệt này. Đây là đăng nhập cục bộ, không bảo vệ dữ liệu khỏi người dùng cùng thiết bị. Không dùng mật khẩu quan trọng.</p></dialog>`);
let registering=false;
$('#toggle-register').onclick=()=>{registering=!registering;$('#auth-submit').textContent=registering?'Tạo tài khoản':'Đăng nhập';$('#toggle-register').textContent=registering?'Đã có tài khoản? Đăng nhập':'Chưa có tài khoản? Đăng ký';$('#password').autocomplete=registering?'new-password':'current-password';$('#auth-error').textContent='';};
$('#auth-form').onsubmit=async event=>{event.preventDefault();const username=$('#username').value.trim().toLowerCase(),password=$('#password').value;try{const users=readJSON('dt:_users',{});const hash=await Auth.hash(`${username}:${password}`);if(registering){if(Object.hasOwn(users,username))throw new Error('Tên này đã có người dùng.');Object.defineProperty(users,username,{value:{hash},enumerable:true,writable:true,configurable:true});localStorage.setItem('dt:_users',JSON.stringify(users));}else if(!Object.hasOwn(users,username)||users[username].hash!==hash)throw new Error('Tên đăng nhập hoặc mật khẩu chưa đúng.');localStorage.setItem('dt:_current',username);Auth.user=username;$('#auth-dialog').close();$('#password').value='';Auth.update();toast('Chào '+username+'! Viel Spaß beim Lernen.');}catch(error){$('#auth-error').textContent=error.message;}};
$('#auth-dialog .dialog-close').onclick=()=>$('#auth-dialog').close();
$('#user-button').onclick=()=>{if(Auth.user)toast('Bạn đang đăng nhập bằng '+Auth.user);else $('#auth-dialog').showModal();};
$('#logout').onclick=()=>{Auth.user=null;localStorage.removeItem('dt:_current');Auth.update();toast('Đã đăng xuất.');};
document.body.classList.toggle('dark',localStorage.getItem('dt:_theme')==='dark');
$('#theme').onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem('dt:_theme',document.body.classList.contains('dark')?'dark':'light');};
window.addEventListener('storage',e=>{if(e.key==='dt:_current'||e.key==='dt:_users'){Auth.user=localStorage.getItem('dt:_current');if(Auth.user&&!Object.hasOwn(readJSON('dt:_users',{}),Auth.user))Auth.user=null;Auth.update();}});
Auth.update();
