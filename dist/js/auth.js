'use strict';
const $ = s => document.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function readJSON(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function toast(message) { const el=$('#toast'); el.textContent=message; el.style.display='block'; clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.style.display='none',3500); }
const Auth = {
 user: Account.current(),
 key(suffix) { if(!this.user) throw new Error('Bạn cần đăng nhập để lưu dữ liệu.'); return `dt:${this.user}:${suffix}`; },
 get(suffix, fallback) { return this.user ? readJSON(this.key(suffix),fallback) : structuredClone(fallback); },
 set(suffix,value) { const key=this.key(suffix); try {localStorage.setItem(key,JSON.stringify(value));} catch {throw new Error('Không lưu được dữ liệu. Bộ nhớ trình duyệt có thể đã đầy hoặc bị chặn.');} },
 require() { if(this.user) return true; Account.redirectToLogin(); return false; },
 async hash(value){return Account.hash(value);},
 update() { $('#user-button').textContent=this.user || (typeof App!=='undefined'?App.t('login'):'Đăng nhập ↗'); $('#logout').hidden=!this.user; document.dispatchEvent(new Event('authchange')); }
};
if(Auth.user && !Object.hasOwn(readJSON('dt:_users',{}),Auth.user)) {Auth.user=null;localStorage.removeItem('dt:_current');}
const path=location.pathname;
const navItems=[['index.html','◈','home'],['grammatik.html','✦','grammar'],['wortschatz.html','▧','vocabulary'],['schreiben.html','✎','writing'],['sprechen.html','◉','speaking'],['pruefung.html','◷','exams'],['tutor.html','⌁','tutor']];
$('#navbar').innerHTML=`<aside class="sidebar"><a class="brand" href="index.html"><b>e</b><span>Elio <strong>Einfach</strong><small>DEUTSCH, JEDEN TAG.</small></span></a><p class="side-label" data-i18n="learnspace">KHÔNG GIAN HỌC</p><div class="navlinks">${navItems.map(([url,icon,key])=>`<a href="${url}" class="${path.endsWith(url)||(url==='index.html'&&path.endsWith('/'))?'active':''}"><span>${icon}</span><span data-i18n="${key}">${key}</span></a>`).join('')}</div><div class="sidebar-bottom"><div class="side-note"><span>✧</span><strong>Einfach anfangen.</strong><small data-i18n="smallsteps">Mỗi ngày, một bước tiến.</small></div><a class="settings-link" href="settings.html">⚙ <span data-i18n="settings">Cài đặt</span></a></div></aside><header class="topbar"><div class="breadcrumb">ELIO EINFACH <span>/</span> <strong id="page-label">LERNRAUM</strong></div><div class="nav-actions"><select id="ui-language" aria-label="Language"><option value="vi">VI</option><option value="de">DE</option><option value="en">EN</option></select><button class="icon-btn" id="theme" aria-label="Theme">◐</button><button class="icon-btn" id="ai-settings">✧ AI</button><button id="user-button"></button><button class="icon-btn" id="logout" hidden>↪</button></div></header>`;
$('#user-button').onclick=()=>{if(Auth.user)toast('Bạn đang đăng nhập bằng '+Auth.user);else Account.redirectToLogin();};
$('#logout').onclick=()=>{Auth.user=null;Account.logout();};
document.body.classList.toggle('dark',localStorage.getItem('dt:_theme')==='dark');
$('#theme').onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem('dt:_theme',document.body.classList.contains('dark')?'dark':'light');};
window.addEventListener('storage',e=>{if(e.key===null||e.key==='dt:_current'||e.key==='dt:_users'){Auth.user=Account.current();if(!Auth.user){Account.redirectToLogin();return;}Auth.update();}});
Auth.update();
