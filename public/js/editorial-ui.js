'use strict';
// Editorial shell. Existing module nodes/handlers, auth and data stores remain mounted.
(()=>{
 if(!Account.current())return;
 const main=document.querySelector('main'),legacy=document.getElementById('navbar');if(!main||!legacy)return;
 document.body.classList.add('editorial-app');
 if(window.parent!==window&&window.parent.ElioNavigationHost===true){document.body.classList.add('ed-embedded');const syncSize=()=>{document.body.classList.toggle('ed-embedded-wide',window.parent.innerWidth>=1280);document.body.classList.toggle('ed-embedded-compact',window.parent.innerWidth>800&&window.parent.innerWidth<1280);};syncSize();window.parent.addEventListener('resize',syncSize);}
 document.querySelectorAll('.mobile-app-nav,body>footer').forEach(n=>n.hidden=true);
 legacy.hidden=true;
 const file=location.pathname.split('/').pop()||'index.html',home=file==='index.html';
 const tr=(vi,de,en)=>({vi,de,en})[App.settings().language]||vi;
 const rows=[
 ['HỌC / LERNEN',[['index.html','home','Hôm nay','Heute','Today'],['quiz.html','cards','Ôn thẻ','Wiederholen','Review'],['wortschatz.html','book','Từ vựng','Wortschatz','Vocabulary'],['lernen.html','grid','Học & khám phá','Lernen & Entdecken','Explore'],['index.html#collections','book','Các bộ học','Sammlungen','Collections']]],
 ['LUYỆN / TRAINIEREN',[['index.html#skills','grid','Kỹ năng','Fertigkeiten','Skills'],['hoeren.html','headphones','Luyện nghe','Hören','Listening'],['hoeren.html#view=library&category=youtube','play','Video cá nhân','Eigene Videos','My videos'],['lernen.html#category=games','grid','Trò chơi','Spiele','Games'],['pruefung.html','flag','Luyện thi','Prüfungstraining','Exams'],['index.html#readiness','check','Sẵn sàng thi','Prüfungsbereitschaft','Exam readiness'],['tutor.html','chat','AI ELIO','KI ELIO','AI ELIO']]],
 ['TÔI / PERSÖNLICH',[['history.html','chart','Tiến độ','Fortschritt','Progress'],['me.html','page','Meine Seiten','Meine Seiten','My pages']]]];
 if(Account.profile?.role==='super_admin')rows[2][1].push(['admin.html','settings','Quản trị viên','Verwaltung','Administration']);
 const paths={home:'M3 10 12 3l9 7v11H3Z M9 21v-8h6v8',cards:'M7 6h14v15H7Z M17 2H3v15',book:'M12 5v16 M3 4q5-2 9 1 4-3 9-1v15q-5-2-9 2-4-4-9-2Z',grid:'M3 3h7v7H3Z M14 3h7v7h-7Z M3 14h7v7H3Z M14 14h7v7h-7Z',headphones:'M4 13v-2a8 8 0 0 1 16 0v2 M2 12h5v9H2Z M17 12h5v9h-5Z',play:'M3 4h18v16H3Z M10 8l6 4-6 4Z',flag:'M5 22V3q5-3 10 0h5v12h-5q-5-3-10 0',check:'m5 12 5 5L20 7',chat:'M3 4h18v13H9l-6 4Z M7 9h10m-10 4h6',chart:'M3 3v18h18 M7 16v-4m5 4V7m5 9v-7',page:'M5 2h10l4 4v16H5Z M14 2v6h5 M8 12h8m-8 4h8',settings:'M4 7h16M4 17h16 M8 4v6m8 4v6',calendar:'M3 5h18v16H3Z M7 2v6m10-6v6M3 10h18'};
 const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.page}"/></svg>`;
 const shell=document.createElement('div');shell.id='editorial-shell';shell.innerHTML=`<button class="ed-scrim" aria-label="Đóng menu" hidden></button><aside class="ed-sidebar"><a class="ed-brand" href="index.html"><b>S</b><span><strong>Sprachmeisterschaft</strong><small>DeutschMaster A1–C2</small></span></a><div class="ed-target"><span>MỤC TIÊU HỌC</span><strong id="ed-target-value"></strong></div><nav class="ed-nav" aria-label="Điều hướng chính"></nav><div class="ed-account"><div id="ed-identity"></div><small id="ed-role"></small><button class="ed-collapse" aria-label="Thu gọn sidebar" aria-expanded="true">‹</button></div><div class="ed-side-actions"><a href="/" target="_top" data-ed-cover>Trang bìa</a><a href="settings.html">Cài đặt</a><button id="ed-signout">Đăng xuất</button></div><div class="ed-preferences"></div></aside><div class="ed-workspace"><header class="ed-topbar"><button class="ed-mobile-menu" aria-label="Mở menu" aria-expanded="false">☰</button><span class="ed-eyebrow">ELIO EINFACH</span><span class="ed-divider">/</span><strong id="ed-page-title"></strong><span class="ed-motto">Lernen, auf deine Art.</span></header><div class="ed-main"></div><footer class="ed-footer"><span>SPRACHMEISTERSCHAFT · ELIO EINFACH</span><a href="settings.html">Cài đặt & đồng bộ ↗</a></footer></div>`;
 legacy.after(shell);shell.querySelector('.ed-main').append(main);
 const identity=document.getElementById('user-button');if(identity)shell.querySelector('#ed-identity').append(identity);
 for(const id of ['theme','ui-language','text-size-link']){const n=document.getElementById(id);if(n){n.hidden=false;shell.querySelector('.ed-preferences').append(n);}}
 shell.querySelector('#ed-signout').onclick=()=>Account.logout();shell.querySelector('.ed-sidebar').append(shell.querySelector('.ed-collapse'));
 let restoreFocus=null;
 const mobile=window.matchMedia('(max-width:800px)'),sidebar=shell.querySelector('.ed-sidebar'),workspace=shell.querySelector('.ed-workspace');
 const drawerAccess=()=>{const open=document.body.classList.contains('ed-drawer-open');sidebar.inert=mobile.matches&&!open;workspace.inert=mobile.matches&&open;};
 mobile.addEventListener('change',drawerAccess);drawerAccess();
 const closeMenu=()=>{const was=document.body.classList.contains('ed-drawer-open');document.body.classList.remove('ed-drawer-open');shell.querySelector('.ed-scrim').hidden=true;shell.querySelector('.ed-mobile-menu').setAttribute('aria-expanded','false');drawerAccess();if(was)restoreFocus?.focus();};
 shell.querySelector('.ed-mobile-menu').onclick=()=>{restoreFocus=document.activeElement;document.body.classList.add('ed-drawer-open');shell.querySelector('.ed-scrim').hidden=false;shell.querySelector('.ed-mobile-menu').setAttribute('aria-expanded','true');drawerAccess();shell.querySelector('.ed-nav a')?.focus();};
 shell.querySelector('.ed-scrim').onclick=closeMenu;
 document.addEventListener('click',event=>{if(event.target.closest('.ed-sidebar a[href]')&&mobile.matches)closeMenu();},true);
 const syncSidebar=()=>{const choice=App.settings().editorialCollapsed;const collapsed=!mobile.matches&&choice===true;document.body.classList.toggle('ed-collapsed',collapsed);const toggle=shell.querySelector('.ed-collapse');toggle.setAttribute('aria-expanded',String(!collapsed));toggle.setAttribute('aria-label',collapsed?'Mở rộng sidebar':'Thu gọn sidebar');toggle.textContent=collapsed?'›':'‹';};
 mobile.addEventListener('change',()=>{closeMenu();syncSidebar();});
 shell.querySelector('.ed-collapse').onclick=()=>App.saveSettings({editorialCollapsed:!document.body.classList.contains('ed-collapsed')});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();if(e.key==='Tab'&&document.body.classList.contains('ed-drawer-open')){const nodes=[...shell.querySelectorAll('.ed-sidebar a,.ed-sidebar button,.ed-sidebar select')].filter(n=>!n.hidden&&n.getClientRects().length),first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 let overview,skills,readiness,plan,collections;
 if(home){
  const old=document.createElement('div');old.className='ed-dashboard-source';old.hidden=true;while(main.firstChild)old.append(main.firstChild);main.append(old);
  overview=document.createElement('section');overview.id='ed-overview';main.prepend(overview);
  skills=document.createElement('section');skills.id='ed-skills';main.append(skills);
  readiness=document.createElement('section');readiness.id='ed-readiness';main.append(readiness);collections=document.createElement('section');collections.id='ed-collections';main.append(collections);
  plan=document.createElement('section');plan.id='ed-plan';plan.dataset.bookScreen='intro';plan.hidden=true;plan.innerHTML='<div class="ed-heading"><div><div class="ed-eyebrow">MEIN LERNWEG</div><h1>Lộ trình của bạn</h1><p>Mục tiêu, thời gian và các buổi học đã lưu.</p></div></div><div class="book-chapter-heading" hidden></div>';main.append(plan);
 }
 function update(){
  if(!Account.current())return;
  const title=rows.flatMap(g=>g[1]).find(r=>r[0].split('#')[0]===file)||{'schreiben.html':['','','Luyện viết','Schreiben','Writing'],'sprechen.html':['','','Luyện nói','Sprechen','Speaking'],'lernen.html':['','','Học & khám phá','Lernatelier','Explore'],'settings.html':['','','Cài đặt','Einstellungen','Settings']}[file];
  syncSidebar();
  shell.querySelector('#ed-page-title').textContent=title?tr(title[2],title[3],title[4]):document.title.split('·')[0];
  shell.querySelector('#ed-role').textContent=Account.profile?.role==='super_admin'?'SUPER ADMIN':tr('NGƯỜI HỌC','LERNENDE','LEARNER');
  shell.querySelector('#ed-target-value').textContent=Account.get('studyPlan',null)?.profile?.target||'—';
  shell.querySelector('.ed-nav').innerHTML=rows.map(([group,items])=>`<div class="ed-nav-label">${group}</div>${items.map(([url,i,vi,de,en])=>{const dest=new URL(url,location.href),active=dest.pathname===location.pathname&&(dest.hash?dest.hash===location.hash:!location.hash);return `<a href="${url}" title="${esc(tr(vi,de,en))}" ${active?'aria-current="page"':''}>${icon(i)}<span>${esc(tr(vi,de,en))}</span></a>`;}).join('')}`).join('');
  shell.querySelectorAll('.ed-nav a').forEach(a=>a.addEventListener('click',closeMenu));updateNavigation();
  if(home){
   const data=ElioEditorialPages.snapshot(Account,App.stats());
   overview.innerHTML=ElioEditorialPages.dashboard(data,Account.displayName());
   skills.innerHTML=ElioEditorialPages.skillCards(data);
   readiness.innerHTML=ElioEditorialPages.readiness(data);
   collections.innerHTML=ElioEditorialPages.collectionCards(Account);
   route();
  }
 }
 function route(){if(!home)return;const hash=location.hash,part=hash==='#skills'||hash==='#contents'?'skills':hash==='#readiness'?'readiness':hash==='#plan'?'plan':hash==='#collections'?'collections':'overview';for(const [id,node]of Object.entries({overview,skills,readiness,plan,collections}))node.hidden=id!==part;}
 for(const event of ['languagechange','cloudchange','progresschange','elioviewresume'])document.addEventListener(event,update);
 window.addEventListener('hashchange',()=>{route();update();});
 document.addEventListener('elioroutechange',()=>{closeMenu();updateNavigation();});
 function updateNavigation(){const url=new URL(location.href),links=[...shell.querySelectorAll('.ed-nav a')],matches=links.filter(a=>{const dest=new URL(a.href,location.href);return dest.pathname===url.pathname&&(dest.hash?(dest.hash===url.hash||url.hash.startsWith(dest.hash+'&')):(dest.pathname!=='/index.html'||!url.hash));}).sort((a,b)=>new URL(b.href).hash.length-new URL(a.href).hash.length);for(const a of links){if(a===matches[0])a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}if(matches[0])shell.querySelector('#ed-page-title').textContent=matches[0].textContent;}
 document.addEventListener('elioappearancechange',()=>App.apply());
 update();ElioNavigation.install();window.ElioEditorialReady=true;
})();
