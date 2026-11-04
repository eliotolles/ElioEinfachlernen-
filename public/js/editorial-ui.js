'use strict';
// Editorial shell. Existing module nodes/handlers, auth and data stores remain mounted.
(()=>{
 if(!Account.current())return;
 const main=document.querySelector('main'),legacy=document.getElementById('navbar');if(!main||!legacy)return;
 document.body.classList.add('editorial-app');
 document.querySelectorAll('.mobile-app-nav,body>footer').forEach(n=>n.hidden=true);
 legacy.hidden=true;
 const file=location.pathname.split('/').pop()||'index.html',home=file==='index.html';
 main.dataset.edModule=file.replace('.html','');
 const tr=(vi,de,en)=>({vi,de,en})[App.settings().language]||vi;
 const moduleHeaders={
  'quiz.html':['WIEDERHOLEN','Ôn thẻ từ vựng','Karteikarten','Flashcard review'],
  'wortschatz.html':['WORTSCHATZ','Kho từ vựng','Wortschatzbibliothek','Vocabulary library'],
  'grammatik.html':['GRAMMATIK-WERKSTATT'],
  'hoeren.html':['HÖRVERSTEHEN & VIDEO-STUDIO','Luyện nghe tiếng Đức','Hörverstehen','German listening'],
  'schreiben.html':['SCHREIBWERKSTATT','Luyện viết tiếng Đức','Schreibtraining','German writing'],
  'sprechen.html':['SPRECHWERKSTATT'],
  'pruefung.html':['PRÜFUNGSSIMULATION'],
  'lernen.html':['LERNATELIER','Xưởng luyện tập','Lernatelier','Practice workshop'],
  'tutor.html':['KI-TUTOR'],
  'history.html':['FORTSCHRITT · MEINE SEITEN'],
  'settings.html':['MEIN BEREICH'],
  'admin.html':['ADMINISTRATIONSBEREICH']
 };
 const heading=main.querySelector('h1'),moduleHeader=moduleHeaders[file];
 if(heading&&moduleHeader){
  const kicker=document.createElement('div');
  kicker.className='ed-eyebrow ed-module-kicker';
  kicker.textContent=moduleHeader[0];
  heading.before(kicker);
  heading.classList.add('ed-module-heading');
 }
 const rows=[
 ['HỌC / LERNEN',[['index.html','home','Hôm nay','Heute','Today'],['quiz.html','cards','Ôn thẻ','Wiederholen','Review'],['wortschatz.html','book','Từ vựng','Wortschatz','Vocabulary']]],
 ['LUYỆN / TRAINIEREN',[['index.html#skills','grid','Kỹ năng','Fertigkeiten','Skills'],['hoeren.html','headphones','Luyện nghe','Hören','Listening'],['hoeren.html#view=library&category=youtube','play','Video cá nhân','Eigene Videos','My videos'],['lernen.html#category=games','grid','Trò chơi','Spiele','Games'],['pruefung.html','flag','Luyện thi','Prüfungstraining','Exams'],['index.html#readiness','check','Sẵn sàng thi','Prüfungsbereitschaft','Exam readiness'],['tutor.html','chat','AI ELIO','KI ELIO','AI ELIO']]],
 ['TÔI / PERSÖNLICH',[['history.html','chart','Tiến độ','Fortschritt','Progress'],['history.html#drafts','page','Meine Seiten','Meine Seiten','My pages'],['index.html#plan','calendar','Lộ trình của tôi','Mein Lernplan','My study plan']]]];
 if(Account.profile?.role==='super_admin')rows[2][1].push(['admin.html','settings','Quản trị viên','Verwaltung','Administration']);
 const paths={home:'M3 10 12 3l9 7v11H3Z M9 21v-8h6v8',cards:'M7 6h14v15H7Z M17 2H3v15',book:'M12 5v16 M3 4q5-2 9 1 4-3 9-1v15q-5-2-9 2-4-4-9-2Z',grid:'M3 3h7v7H3Z M14 3h7v7h-7Z M3 14h7v7H3Z M14 14h7v7h-7Z',headphones:'M4 13v-2a8 8 0 0 1 16 0v2 M2 12h5v9H2Z M17 12h5v9h-5Z',play:'M3 4h18v16H3Z M10 8l6 4-6 4Z',flag:'M5 22V3q5-3 10 0h5v12h-5q-5-3-10 0',check:'m5 12 5 5L20 7',chat:'M3 4h18v13H9l-6 4Z M7 9h10m-10 4h6',chart:'M3 3v18h18 M7 16v-4m5 4V7m5 9v-7',page:'M5 2h10l4 4v16H5Z M14 2v6h5 M8 12h8m-8 4h8',settings:'M4 7h16M4 17h16 M8 4v6m8 4v6',calendar:'M3 5h18v16H3Z M7 2v6m10-6v6M3 10h18'};
 const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.page}"/></svg>`;
 const shell=document.createElement('div');shell.id='editorial-shell';shell.innerHTML=`<button class="ed-scrim" aria-label="Đóng menu" hidden></button><aside class="ed-sidebar"><a class="ed-brand" href="index.html"><b>SM</b><span><strong>Sprachmeisterschaft</strong><small>DeutschMaster A1–C2</small></span></a><div class="ed-target"><span>MỤC TIÊU HỌC</span><strong id="ed-target-value"></strong></div><nav class="ed-nav" aria-label="Điều hướng chính"></nav><div class="ed-account"><div id="ed-identity"></div><small id="ed-role"></small><button class="ed-collapse" aria-label="Thu gọn sidebar" aria-expanded="true">‹</button></div><div class="ed-side-actions"><a href="/" target="_top" data-ed-cover>Trang bìa</a><a href="settings.html">Cài đặt</a><button id="ed-signout">Đăng xuất</button></div><div class="ed-preferences"></div></aside><div class="ed-workspace"><header class="ed-topbar"><button class="ed-mobile-menu" aria-label="Mở menu" aria-expanded="false">☰</button><span class="ed-eyebrow">ELIO EINFACH</span><span class="ed-divider">/</span><strong id="ed-page-title"></strong><span class="ed-motto">Lernen, auf deine Art.</span></header><div class="ed-main"></div><footer class="ed-footer"><span>SPRACHMEISTERSCHAFT · ELIO EINFACH</span><a href="settings.html">Cài đặt & đồng bộ ↗</a></footer></div>`;
 legacy.after(shell);shell.querySelector('.ed-main').append(main);
 const identity=document.getElementById('user-button');if(identity)shell.querySelector('#ed-identity').append(identity);
 for(const id of ['theme','ui-language','text-size-link']){const n=document.getElementById(id);if(n){n.hidden=false;shell.querySelector('.ed-preferences').append(n);}}
 shell.querySelector('#ed-signout').onclick=()=>Account.logout();
 let restoreFocus=null;
 const mobile=window.matchMedia('(max-width:800px)'),compact=window.matchMedia('(max-width:1180px)'),sidebar=shell.querySelector('.ed-sidebar'),workspace=shell.querySelector('.ed-workspace');
 const drawerAccess=()=>{const open=document.body.classList.contains('ed-drawer-open');sidebar.inert=mobile.matches&&!open;workspace.inert=mobile.matches&&open;};
 mobile.addEventListener('change',drawerAccess);drawerAccess();
 const closeMenu=()=>{const was=document.body.classList.contains('ed-drawer-open');document.body.classList.remove('ed-drawer-open');shell.querySelector('.ed-scrim').hidden=true;shell.querySelector('.ed-mobile-menu').setAttribute('aria-expanded','false');drawerAccess();if(was)restoreFocus?.focus();};
 shell.querySelector('.ed-mobile-menu').onclick=()=>{restoreFocus=document.activeElement;document.body.classList.add('ed-drawer-open');shell.querySelector('.ed-scrim').hidden=false;shell.querySelector('.ed-mobile-menu').setAttribute('aria-expanded','true');drawerAccess();shell.querySelector('.ed-nav a')?.focus();};
 shell.querySelector('.ed-scrim').onclick=closeMenu;
 document.addEventListener('click',event=>{if(event.target.closest('.ed-sidebar a[href]')&&mobile.matches)closeMenu();},true);
 const syncSidebar=()=>{const choice=App.settings().editorialCollapsed;const collapsed=!mobile.matches&&(compact.matches||choice===true);document.body.classList.toggle('ed-collapsed',collapsed);const toggle=shell.querySelector('.ed-collapse');toggle.setAttribute('aria-expanded',String(!collapsed));toggle.setAttribute('aria-label',collapsed?'Mở rộng sidebar':'Thu gọn sidebar');toggle.textContent=collapsed?'›':'‹';};
 compact.addEventListener('change',()=>{closeMenu();syncSidebar();});mobile.addEventListener('change',()=>{closeMenu();syncSidebar();});
 shell.querySelector('.ed-collapse').onclick=()=>{const next=!document.body.classList.contains('ed-collapsed');if(compact.matches&&!mobile.matches){document.body.classList.toggle('ed-collapsed',next);shell.querySelector('.ed-collapse').setAttribute('aria-expanded',String(!next));shell.querySelector('.ed-collapse').textContent=next?'›':'‹';shell.querySelector('.ed-collapse').setAttribute('aria-label',next?'Mở rộng sidebar':'Thu gọn sidebar');}else App.saveSettings({editorialCollapsed:next});};
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();if(e.key==='Tab'&&document.body.classList.contains('ed-drawer-open')){const nodes=[...shell.querySelectorAll('.ed-sidebar a,.ed-sidebar button,.ed-sidebar select')].filter(n=>!n.hidden&&n.getClientRects().length),first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 let overview,skills,readiness,plan;
 if(home){
  const old=document.createElement('div');old.className='ed-dashboard-source';old.hidden=true;while(main.firstChild)old.append(main.firstChild);main.append(old);
  overview=document.createElement('section');overview.id='ed-overview';main.prepend(overview);
  skills=document.createElement('section');skills.id='ed-skills';main.append(skills);
  readiness=document.createElement('section');readiness.id='ed-readiness';main.append(readiness);
  plan=document.createElement('section');plan.id='ed-plan';plan.dataset.bookScreen='intro';plan.hidden=true;plan.innerHTML='<div class="ed-heading"><div><div class="ed-eyebrow">MEIN LERNWEG</div><h1>Lộ trình của bạn</h1><p>Mục tiêu, thời gian và các buổi học đã lưu.</p></div></div><div class="book-chapter-heading" hidden></div>';main.append(plan);
 }
 const moduleTiles=()=>[['grammatik.html','book',tr('Ngữ pháp','Grammatik','Grammar'),tr('Quy tắc, ví dụ Đức–Việt và bài tập.','Regeln, Beispiele und Übungen.','Rules, examples and exercises.')],['wortschatz.html','cards',tr('Từ vựng','Wortschatz','Vocabulary'),tr('Bộ từ, tra từ và ôn cách quãng.','Wortlisten und Wiederholung.','Collections, dictionary and spaced review.')],['hoeren.html','headphones',tr('Nghe & chép chính tả','Hören & Diktat','Listening & dictation'),tr('Media, phụ đề, nghe theo câu.','Medien, Untertitel und Sätze.','Media, subtitles and sentence practice.')],['schreiben.html','page',tr('Luyện viết','Schreiben','Writing'),tr('Viết bài, phân tích lỗi và sửa từng câu.','Texte schreiben und Fehler verstehen.','Write, understand errors and revise.')],['sprechen.html','chat',tr('Luyện nói','Sprechen','Speaking'),tr('Tình huống, hội thoại và âm thanh.','Situationen und Gespräche.','Situations, conversations and audio.')],['pruefung.html','flag',tr('Luyện thi','Prüfungstraining','Exam practice'),tr('Kỳ thi, cấp độ và từng phần thi.','Prüfungen, Niveaus und Teile.','Exams, levels and individual parts.')]];
 function tiles(){return '<div class="ed-module-grid">'+moduleTiles().map(([url,i,title,note])=>`<a class="ed-module" href="${url}">${icon(i)}<h3>${esc(title)}</h3><p>${esc(note)}</p><span>↗</span></a>`).join('')+'</div>';}
 function update(){
  if(!Account.current())return;
  const title=rows.flatMap(g=>g[1]).find(r=>r[0].split('#')[0]===file)||{'schreiben.html':['','','Luyện viết','Schreiben','Writing'],'sprechen.html':['','','Luyện nói','Sprechen','Speaking'],'lernen.html':['','','Học & khám phá','Lernatelier','Explore'],'settings.html':['','','Cài đặt','Einstellungen','Settings']}[file];
  syncSidebar();
  if(heading&&moduleHeader?.length===4)heading.textContent=tr(...moduleHeader.slice(1));
  shell.querySelector('#ed-page-title').textContent=title?tr(title[2],title[3],title[4]):document.title.split('·')[0];
  shell.querySelector('#ed-role').textContent=Account.profile?.role==='super_admin'?'SUPER ADMIN':tr('NGƯỜI HỌC','LERNENDE','LEARNER');
  shell.querySelector('#ed-target-value').textContent=Account.get('studyPlan',null)?.profile?.target||'—';
  shell.querySelector('.ed-nav').innerHTML=rows.map(([group,items])=>`<div class="ed-nav-label">${group}</div>${items.map(([url,i,vi,de,en])=>{const dest=new URL(url,location.href),active=(dest.pathname===location.pathname||(home&&url.startsWith('index.html')))&&(dest.hash?dest.hash===location.hash:!location.hash);return `<a href="${url}" title="${esc(tr(vi,de,en))}" ${active?'aria-current="page"':''}>${icon(i)}<span>${esc(tr(vi,de,en))}</span></a>`;}).join('')}`).join('');
  shell.querySelectorAll('.ed-nav a').forEach(a=>a.addEventListener('click',closeMenu));
  if(home){
   const stats=App.stats(), saved=Account.get('studyPlan',null);
   const today=App.day(), examDate=saved?.profile?.date;
   const days=examDate&&!saved.profile.dateIsEstimated
    ? Math.round((Date.parse(examDate)-Date.parse(today))/86400000)
    : NaN;
   const trackedCards=Object.values(Account.get('srs',{}));
   const due=trackedCards.filter(card=>card?.dueAt<=Date.now()).length;
   const target=saved?.profile?.target||'—';
   const cards=[
    ['cards',due,tr('Thẻ đã học đến hạn','Fällige gelernte Karten','Learned cards due')],
    ['chart',stats.streak,tr('Chuỗi học · ngày','Lernserie · Tage','Study streak · days')],
    ['calendar',Number.isFinite(days)?(days<0?'D+'+Math.abs(days):'D−'+days):'—',tr('Đếm ngược ngày thi','Tage bis zur Prüfung','Exam countdown')],
    ['book',stats.mastered,tr('Từ đã thành thạo','Beherrschte Wörter','Mastered words')]
   ];
   const tasks=saved&&typeof StudyPlannerCore!=='undefined'?StudyPlannerCore.tasks(saved,today):[];
   const quickTasks=[
    ['quiz.html','cards',tr('Ôn thẻ từ vựng','Karteikarten wiederholen','Review flashcards'),tr('Ôn theo lịch SRS','Nach SRS-Plan','Follow your SRS schedule')],
    ['index.html#skills','grid',tr('Luyện một kỹ năng','Eine Fertigkeit üben','Practice a skill'),tr('Mở xưởng kỹ năng','Werkstatt öffnen','Open the skills workshop')],
    ['lernen.html#category=games','check',tr('Chơi trò tiếng Đức','Deutsch spielen','Play a German game'),tr('Luyện phản xạ','Reaktion trainieren','Practice recall')],
    ['tutor.html','chat',tr('Hỏi gia sư ELIO','ELIO fragen','Ask ELIO'),tr('Luyện hội thoại','Gespräche üben','Practice conversation')]
   ];
   const taskLinks=tasks.length
    ? tasks.map(t=>[t.url,saved.completed?.[t.id]?'check':'calendar',t.title,t.minutes+'′'])
    : quickTasks;
   overview.innerHTML=`<header class="ed-heading ed-page-header">
    <div><div class="ed-eyebrow">${tr('TỔNG QUAN HỌC TẬP','LERNÜBERSICHT','STUDY OVERVIEW')}</div>
    <h1>Guten Tag, ${esc(Account.displayName())}! <small>/ Heute</small></h1>
    <p>${tr('Mục tiêu học của bạn','Dein Lernziel','Your learning target')} · ${esc(target)}</p></div>
    <a class="button" href="quiz.html">${tr('Ôn thẻ từ vựng','Karteikarten wiederholen','Review flashcards')} ↗</a>
   </header>
   <div class="ed-dashboard-stats">${cards.map(([symbol,value,label])=>`<article class="panel"><div>${esc(label)} ${icon(symbol)}</div><strong>${value}</strong></article>`).join('')}</div>
   <div class="ed-dashboard-focus">
    <section class="panel ed-readiness-card"><span class="ed-eyebrow">${tr('SẴN SÀNG THI','PRÜFUNGSBEREITSCHAFT','EXAM READINESS')}</span>
    <h2>Prüfungsreife</h2><p>${tr('Xem kết quả bài thi và các phần cần ôn.','Prüfungsergebnisse und Übungsbedarf prüfen.','Review exam results and practice needs.')}</p>
    <div class="ed-target-ring">${esc(target)}</div>
    <a href="index.html#readiness">${tr('Xem chi tiết','Details ansehen','View details')} ↗</a></section>
    <section class="panel"><span class="ed-eyebrow">DEIN LERNPLAN</span>
    <h2>${tasks.length?tr('Nhiệm vụ học hôm nay','Heutige Aufgaben','Today’s tasks'):tr('Luyện tập hôm nay','Heute üben','Practice today')}</h2>
    <div class="ed-task-grid">${taskLinks.map(([url,symbol,title,note])=>`<a href="${url}">${icon(symbol)}<span><strong>${esc(title)}</strong><small>${esc(note)}</small></span><span aria-hidden="true">↗</span></a>`).join('')}</div>
    <a href="index.html#plan">${tr('Mở lộ trình','Lernplan öffnen','Open study plan')} ↗</a></section>
   </div>
   <section class="panel ed-tutor-promo">${icon('chat')}<div><span class="ed-eyebrow">KI-TUTOR</span><h2>${tr('Trợ lý ngôn ngữ ELIO','ELIO Sprachassistent','ELIO language tutor')}</h2></div><a class="button secondary" href="tutor.html">${tr('Trò chuyện với ELIO','Mit ELIO sprechen','Chat with ELIO')} ↗</a></section>
   <div class="ed-section-heading"><h2>${tr('Các phần học','Lernbereiche','Learning modules')}</h2></div>${tiles()}`;
   skills.innerHTML=`<div class="ed-heading"><div><div class="ed-eyebrow">TRAINIEREN</div><h1>${esc(tr('Kỹ năng & nền tảng','Fertigkeiten & Grundlagen','Skills & foundations'))}</h1><p>${esc(tr('Mở đúng khu vực bạn muốn luyện.','Wähle deinen Lernbereich.','Choose what to practice.'))}</p></div></div>${tiles()}<div class="ed-module-grid"><a class="ed-module" href="lernen.html#category=dictionary">${icon('book')}<h3>${esc(tr('Từ điển & IPA','Wörterbuch & IPA','Dictionary & IPA'))}</h3></a><a class="ed-module" href="tutor.html">${icon('chat')}<h3>${esc(tr('Giao tiếp & AI Tutor','Gespräche & KI-Tutor','Conversations & AI Tutor'))}</h3></a><a class="ed-module" href="lernen.html">${icon('grid')}<h3>${esc(tr('Học & khám phá','Lernatelier','Learning atelier'))}</h3></a></div>`;
   readiness.innerHTML=`<div class="ed-heading"><div><div class="ed-eyebrow">PRÜFUNGSBEREITSCHAFT</div><h1>${esc(tr('Sẵn sàng thi','Bereit für die Prüfung','Exam readiness'))}</h1><p>${esc(tr('Đối chiếu kết quả đã làm, không suy xác suất đậu từ số buổi học.','Ergebnisse prüfen, keine erfundenen Prognosen.','Review evidence, without invented pass predictions.'))}</p></div></div><section class="panel"><h2>${esc(tr('Kết quả & điểm cần ôn','Ergebnisse & Übungsbedarf','Results & review needs'))}</h2><p>${esc(tr('Mở lịch sử để xem bài thi và phản hồi đã lưu. Chưa có hệ thống đánh giá sẵn sàng được xác minh riêng.','Öffne den Verlauf für gespeicherte Prüfungen.','Open history for saved attempts and feedback.'))}</p><a class="button" href="history.html">${esc(tr('Xem lịch sử','Verlauf öffnen','Open history'))} ↗</a> <a class="button secondary" href="pruefung.html">${esc(tr('Luyện thi','Prüfungstraining','Exam practice'))} ↗</a></section>`;
   route();
  }
 }
 function route(){if(!home)return;const hash=location.hash,part=hash==='#skills'||hash==='#contents'?'skills':hash==='#readiness'?'readiness':hash==='#plan'?'plan':'overview';for(const [id,node]of Object.entries({overview,skills,readiness,plan}))node.hidden=id!==part;}
 for(const event of ['languagechange','cloudchange','progresschange','elioviewresume','elioplanrender'])document.addEventListener(event,update);
 window.addEventListener('hashchange',()=>{route();update();});
 update();ElioNavigation.install();window.ElioEditorialReady=true;
})();
