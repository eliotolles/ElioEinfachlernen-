'use strict';
const $ = s => document.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function readJSON(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function toast(message) { const el=$('#toast'); el.textContent=message; el.style.display='block'; clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.style.display='none',3500); }
const Auth = {
 user: Account.current(),
 key(suffix) { if(!this.user) throw new Error('Bạn cần đăng nhập để lưu dữ liệu.'); return `dt:${this.user}:${suffix}`; },
 get(suffix, fallback) { return this.user ? Account.get(suffix,fallback) : structuredClone(fallback); },
 set(suffix,value){Account.set(suffix,value);},
 require() { if(this.user) return true; Account.redirectToLogin(); return false; },
 async hash(value){return Account.hash(value);},
 renderIdentity(){const button=$('#user-button');button.replaceChildren();button.title=Account.profile?.email||'';const avatar=document.createElement(Account.avatar()?'img':'span');avatar.className='user-avatar';if(Account.avatar()){avatar.src=Account.avatar();avatar.alt='';}else avatar.textContent=Array.from(Account.displayName())[0].toUpperCase();const name=document.createElement('span');name.className='user-display-name';name.textContent=Account.displayName();button.append(avatar,name);},
 update() { this.renderIdentity(); $('#logout').hidden=!this.user; document.dispatchEvent(new Event('authchange')); }
};
const path=location.pathname;
document.body.classList.add('elio-app');
const moduleClass=({'grammatik':'grammar','wortschatz':'vocabulary','schreiben':'writing','sprechen':'speaking','pruefung':'exams','tutor':'tutor','settings':'settings','admin':'admin','history':'history'})[path.split('/').pop().replace(/\.html$/,'')]||'home';document.body.classList.add('module-'+moduleClass);
const navItems=[['index.html','◈','home'],['grammatik.html','✦','grammar'],['wortschatz.html','▧','vocabulary'],['schreiben.html','✎','writing'],['sprechen.html','◉','speaking'],['pruefung.html','◷','exams'],['tutor.html','⌁','tutor']];
$('#navbar').innerHTML=`<aside class="sidebar" id="menu-sidebar"><button type="button" class="icon-btn menu-close" id="menu-close" aria-label="Đóng menu">×</button><a class="brand" href="index.html"><b>e</b><span>Elio <strong>Einfach</strong><small>DEUTSCH, JEDEN TAG.</small></span></a><p class="side-label" data-i18n="learnspace">KHÔNG GIAN HỌC</p><div class="navlinks">${navItems.map(([url,icon,key])=>`<a href="${url}" class="${path.endsWith(url)||(url==='index.html'&&path.endsWith('/'))?'active':''}"><span>${icon}</span><span data-i18n="${key}">${key}</span></a>`).join('')}</div><div class="sidebar-bottom"><div class="side-note"><span>✧</span><strong>Einfach anfangen.</strong><small data-i18n="smallsteps">Mỗi ngày, một bước tiến.</small></div><a class="settings-link" href="settings.html">⚙ <span data-i18n="settings">Cài đặt</span></a></div></aside><button class="menu-backdrop" id="menu-backdrop" aria-label="Đóng menu" hidden></button><header class="topbar"><div class="topbar-leading"><button class="icon-btn" id="menu-toggle" type="button" aria-controls="menu-sidebar" aria-expanded="true" aria-label="Mở hoặc thu menu">☰</button><div class="breadcrumb"><a class="breadcrumb-brand" href="index.html">ELIO <b class="menu-word">EINFACH</b></a> <span>/</span> <strong id="page-label">LERNRAUM</strong></div></div><div class="nav-actions"><select id="ui-language" aria-label="Language"><option value="vi">VI</option><option value="de">DE</option><option value="en">EN</option></select><label class="quick-color" title="Accent"><input type="color" id="quick-accent" aria-label="Accent" value="#26754b"></label><button class="icon-btn" id="theme" aria-label="Theme">◐</button><button class="icon-btn" id="ai-settings">✧ AI</button><button id="user-button"></button><button class="icon-btn" id="logout" hidden>↪</button></div></header>`;
$('#quick-accent').onchange=e=>{App.saveSettings({accent:e.target.value});};
const mobileNav=document.createElement('nav');mobileNav.className='mobile-app-nav';mobileNav.setAttribute('aria-label','Elio');mobileNav.innerHTML=navItems.slice(0,6).map(([url,icon,key])=>`<a href="${url}" class="${path.endsWith(url)||(url==='index.html'&&path.endsWith('/'))?'active':''}"><span aria-hidden="true">${icon}</span><small data-i18n="${key}">${key}</small></a>`).join('');document.body.append(mobileNav);
$('#user-button').onclick=()=>{location.href='settings.html#profile';};
$('#logout').onclick=()=>Account.logout();
document.body.classList.toggle('dark',localStorage.getItem('dt:_theme')==='dark');
$('#theme').onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem('dt:_theme',document.body.classList.contains('dark')?'dark':'light');};
Auth.update();

const syncBadge=document.createElement('span');syncBadge.id='sync-state';syncBadge.className='help-text';syncBadge.setAttribute('role','status');syncBadge.textContent=Account.online?'Đã đồng bộ ✓':'Chờ kết nối';document.querySelector('.nav-actions').prepend(syncBadge);
if(Account.profile.role==='super_admin'){const link=document.createElement('a');link.href='admin.html';link.className='settings-link';link.textContent='⚙ Quản trị';document.querySelector('.sidebar-bottom').prepend(link);}
if(Account.profile.passwordDays<=7){const note=document.createElement('a');note.href='password.html';note.textContent='Đổi mật khẩu · '+Account.profile.passwordDays+' ngày còn lại';note.className='password-notice';document.querySelector('main').prepend(note);}
document.addEventListener('cloudchange',()=>{Auth.user=Account.current();Auth.update();});

const Menu={
 collapsed:localStorage.getItem('dt:_menuCollapsed')==='true'||localStorage.getItem('dt:_menuCollapsed')===null&&!!window.matchMedia?.('(max-width: 850px)').matches,
 mobile(){return !!window.matchMedia?.('(max-width: 850px)').matches;},
 apply(){document.body.classList.toggle('menu-collapsed',this.collapsed);document.body.classList.toggle('menu-open',!this.collapsed);const lang=typeof App==='undefined'?'vi':App.settings().language,button=$('#menu-toggle');button.setAttribute('aria-expanded',String(!this.collapsed));button.setAttribute('aria-label',({vi:this.collapsed?'Mở menu':'Thu menu',en:this.collapsed?'Open menu':'Collapse menu',de:this.collapsed?'Menü öffnen':'Menü einklappen'})[lang]);$('#menu-backdrop').hidden=this.collapsed||!this.mobile();$('#menu-sidebar').inert=this.mobile()&&this.collapsed;},
 set(value){this.collapsed=value;localStorage.setItem('dt:_menuCollapsed',String(value));this.apply();}
};
$('#menu-toggle').onclick=()=>Menu.set(!Menu.collapsed);$('#menu-close').onclick=$('#menu-backdrop').onclick=()=>{Menu.set(true);$('#menu-toggle').focus();};document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!Menu.collapsed){Menu.set(true);$('#menu-toggle').focus();}});document.addEventListener('click',event=>{if(Menu.mobile()&&event.target.closest?.('.sidebar a'))Menu.set(true);});document.addEventListener('languagechange',()=>Menu.apply());window.matchMedia?.('(max-width: 850px)').addEventListener?.('change',()=>Menu.apply());Menu.apply();
