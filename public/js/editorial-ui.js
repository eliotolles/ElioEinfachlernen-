'use strict';
// Editorial shell. Existing module nodes/handlers, auth and data stores remain mounted.
(()=>{
 if(!Account.current())return;
 const main=document.querySelector('main'),legacy=document.getElementById('navbar');if(!main||!legacy)return;
 document.body.classList.add('editorial-app');
 document.querySelectorAll('.mobile-app-nav,body>footer').forEach(n=>n.hidden=true);
 legacy.hidden=true;
 const file=location.pathname.split('/').pop()||'index.html',home=file==='index.html';
 const tr=(vi,de,en)=>({vi,de,en})[App.settings().language]||vi;
 const esc=s=>typeof s==='string'?s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'):'';

 const rows=[
  ['HỌC / LERNEN',[
    ['index.html#/heute','home','Hôm nay','Heute','Today'],
    ['quiz.html','cards','Ôn thẻ','Wiederholen','Review'],
    ['wortschatz.html','book','Từ vựng','Wortschatz','Vocabulary'],
    ['lernen.html','grid','Học & khám phá','Lernatelier','Explore'],
    ['index.html#/collections','book','Các bộ học','Lernsets','Collections']
  ]],
  ['LUYỆN / TRAINIEREN',[
    ['index.html#/skills','grid','Kỹ năng','Fertigkeiten','Skills'],
    ['hoeren.html','headphones','Luyện nghe','Hören','Listening'],
    ['hoeren.html#view=library&category=youtube','play','Video cá nhân','Eigene Videos','My videos'],
    ['index.html#/game','grid','Trò chơi','Spiele','Games'],
    ['index.html#/exam','flag','Luyện thi','Prüfungstraining','Exams'],
    ['index.html#/readiness','check','Sẵn sàng thi','Prüfungsbereitschaft','Exam readiness'],
    ['index.html#/elio','chat','AI ELIO','KI ELIO','AI ELIO'],
    ['grammatik.html','book','Ngữ pháp','Grammatik','Grammar'],
    ['lesen.html','book','Luyện đọc','Lesen','Reading'],
    ['schreiben.html','page','Luyện viết','Schreiben','Writing'],
    ['sprechen.html','chat','Luyện nói','Sprechen','Speaking']
  ]],
  ['TÔI / PERSÖNLICH',[
    ['history.html','chart','Tiến độ','Fortschritt','Progress'],
    ['history.html#drafts','page','Meine Seiten','Meine Seiten','My pages'],
    ['index.html#/plan','calendar','Lộ trình của tôi','Mein Lernplan','My study plan']
  ]]
 ];
 if(Account.profile?.role==='super_admin')rows[2][1].push(['admin.html','settings','Quản trị viên','Verwaltung','Administration']);

 const paths={
  home:'M3 10 12 3l9 7v11H3Z M9 21v-8h6v8',
  cards:'M7 6h14v15H7Z M17 2H3v15',
  book:'M12 5v16 M3 4q5-2 9 1 4-3 9-1v15q-5-2-9 2-4-4-9-2Z',
  grid:'M3 3h7v7H3Z M14 3h7v7h-7Z M3 14h7v7H3Z M14 14h7v7h-7Z',
  headphones:'M4 13v-2a8 8 0 0 1 16 0v2 M2 12h5v9H2Z M17 12h5v9h-5Z',
  play:'M3 4h18v16H3Z M10 8l6 4-6 4Z',
  flag:'M5 22V3q5-3 10 0h5v12h-5q-5-3-10 0',
  check:'m5 12 5 5L20 7',
  chat:'M3 4h18v13H9l-6 4Z M7 9h10m-10 4h6',
  chart:'M3 3v18h18 M7 16v-4m5 4V7m5 9v-7',
  page:'M5 2h10l4 4v16H5Z M14 2v6h5 M8 12h8m-8 4h8',
  settings:'M4 7h16M4 17h16 M8 4v6m8 4v6',
  calendar:'M3 5h18v16H3Z M7 2v6m10-6v6M3 10h18'
 };
 const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.page}"/></svg>`;

 const shell=document.createElement('div');shell.id='editorial-shell';
 shell.innerHTML=`<button class="ed-scrim" aria-label="Đóng menu" hidden></button>
<aside class="ed-sidebar">
  <a class="ed-brand" href="index.html#/heute">
    <b>S</b>
    <span>
      <strong>Sprachmeisterschaft</strong>
      <small>DeutschMaster A1–C2</small>
    </span>
  </a>
  <div class="ed-target">
    <span>MỤC TIÊU: <strong id="ed-target-badge">B1</strong></span>
    <strong id="ed-target-value">D-28</strong>
  </div>
  <nav class="ed-nav" aria-label="Điều hướng chính"></nav>
  <div class="ed-account">
    <div id="ed-identity"></div>
    <small id="ed-role"></small>
    <button class="ed-collapse" aria-label="Thu gọn sidebar" aria-expanded="true">‹</button>
  </div>
  <div class="ed-side-actions">
    <a href="/" target="_top" data-ed-cover>Trang bìa</a>
    <a href="settings.html">Cài đặt</a>
    <button id="ed-signout">Thoát</button>
  </div>
  <div class="ed-preferences"></div>
</aside>
<div class="ed-workspace">
  <header class="ed-topbar">
    <button class="ed-mobile-menu" aria-label="Mở menu" aria-expanded="false">☰</button>
    <span class="ed-eyebrow">SPRACHPLATTFORM</span>
    <span class="ed-divider">/</span>
    <strong id="ed-page-title">Hôm nay</strong>
    <span class="ed-motto">DeutschMaster A1–C2</span>
  </header>
  <div class="ed-main"></div>
  <footer class="ed-footer">
    <span>SPRACHMEISTERSCHAFT · ELIO EINFACH</span>
    <a href="settings.html">Cài đặt & đồng bộ ↗</a>
  </footer>
</div>`;

 legacy.after(shell);
 shell.querySelector('.ed-main').append(main);
 const identity=document.getElementById('user-button');
 if(identity)shell.querySelector('#ed-identity').append(identity);
 for(const id of ['theme','ui-language','text-size-link']){
  const n=document.getElementById(id);
  if(n){n.hidden=false;shell.querySelector('.ed-preferences').append(n);}
 }
 shell.querySelector('#ed-signout').onclick=()=>Account.logout();

 let restoreFocus=null;
 const mobile=window.matchMedia('(max-width:800px)'),compact=window.matchMedia('(max-width:1180px)'),sidebar=shell.querySelector('.ed-sidebar'),workspace=shell.querySelector('.ed-workspace');
 const drawerAccess=()=>{const open=document.body.classList.contains('ed-drawer-open');sidebar.inert=mobile.matches&&!open;workspace.inert=mobile.matches&&open;};
 mobile.addEventListener('change',drawerAccess);drawerAccess();
 const closeMenu=()=>{const was=document.body.classList.contains('ed-drawer-open');document.body.classList.remove('ed-drawer-open');shell.querySelector('.ed-scrim').hidden=true;shell.querySelector('.ed-mobile-menu').setAttribute('aria-expanded','false');drawerAccess();if(was)restoreFocus?.focus();};
 shell.querySelector('.ed-mobile-menu').onclick=()=>{restoreFocus=document.activeElement;document.body.classList.add('ed-drawer-open');shell.querySelector('.ed-scrim').hidden=false;shell.querySelector('.ed-mobile-menu').setAttribute('aria-expanded','true');drawerAccess();shell.querySelector('.ed-nav a')?.focus();};
 shell.querySelector('.ed-scrim').onclick=closeMenu;
 document.addEventListener('click',event=>{if(event.target.closest('.ed-sidebar a[href]')&&mobile.matches)closeMenu();},true);

 const syncSidebar=()=>{
  const choice=App.settings().editorialCollapsed;
  const collapsed=!mobile.matches&&(compact.matches||choice===true);
  document.body.classList.toggle('ed-collapsed',collapsed);
  const toggle=shell.querySelector('.ed-collapse');
  toggle.setAttribute('aria-expanded',String(!collapsed));
  toggle.setAttribute('aria-label',collapsed?'Mở rộng sidebar':'Thu gọn sidebar');
  toggle.textContent=collapsed?'›':'‹';
 };
 compact.addEventListener('change',()=>{closeMenu();syncSidebar();});
 mobile.addEventListener('change',()=>{closeMenu();syncSidebar();});
 shell.querySelector('.ed-collapse').onclick=()=>{
  const next=!document.body.classList.contains('ed-collapsed');
  if(compact.matches&&!mobile.matches){
   document.body.classList.toggle('ed-collapsed',next);
   shell.querySelector('.ed-collapse').setAttribute('aria-expanded',String(!next));
   shell.querySelector('.ed-collapse').textContent=next?'›':'‹';
   shell.querySelector('.ed-collapse').setAttribute('aria-label',next?'Mở rộng sidebar':'Thu gọn sidebar');
  }else App.saveSettings({editorialCollapsed:next});
 };

 document.addEventListener('keydown',e=>{
  if(e.key==='Escape')closeMenu();
  if(e.key==='Tab'&&document.body.classList.contains('ed-drawer-open')){
   const nodes=[...shell.querySelectorAll('.ed-sidebar a,.ed-sidebar button,.ed-sidebar select')].filter(n=>!n.hidden&&n.getClientRects().length),first=nodes[0],last=nodes.at(-1);
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
 });

 let overview,skills,game,exam,readiness,elio,plan;
 if(home){
  const old=document.createElement('div');old.className='ed-dashboard-source';old.hidden=true;
  while(main.firstChild)old.append(main.firstChild);
  main.append(old);

  overview=document.createElement('section');overview.id='ed-overview';main.prepend(overview);
  skills=document.createElement('section');skills.id='ed-skills';main.append(skills);
  game=document.createElement('section');game.id='ed-game';main.append(game);
  exam=document.createElement('section');exam.id='ed-exam';main.append(exam);
  readiness=document.createElement('section');readiness.id='ed-readiness';main.append(readiness);
  elio=document.createElement('section');elio.id='ed-elio';main.append(elio);
  plan=document.createElement('section');plan.id='ed-plan';plan.dataset.bookScreen='intro';plan.hidden=true;
  plan.innerHTML='<div class="ed-heading"><div><div class="ed-eyebrow">MEIN LERNWEG</div><h1>Lộ trình của bạn</h1><p>Mục tiêu, thời gian và các buổi học đã lưu.</p></div></div>';
  main.append(plan);
 }

 const moduleTiles=()=>[
  ['lesen.html','book',tr('Luyện đọc','Lesen','Reading'),tr('Văn bản, câu hỏi và đối chiếu đáp án.','Texte, Aufgaben und Auswertung.','Texts, questions and answer review.')],
  ['grammatik.html','book',tr('Ngữ pháp','Grammatik','Grammar'),tr('Quy tắc, ví dụ Đức–Việt và bài tập.','Regeln, Beispiele und Übungen.','Rules, examples and exercises.')],
  ['wortschatz.html','cards',tr('Từ vựng','Wortschatz','Vocabulary'),tr('Bộ từ, tra từ và ôn cách quãng.','Wortlisten und Wiederholung.','Collections, dictionary and spaced review.')],
  ['hoeren.html','headphones',tr('Nghe & chép chính tả','Hören & Diktat','Listening & dictation'),tr('Media, phụ đề, nghe theo câu.','Medien, Untertitel und Sätze.','Media, subtitles and sentence practice.')],
  ['schreiben.html','page',tr('Luyện viết','Schreiben','Writing'),tr('Viết bài, phân tích lỗi và sửa từng câu.','Texte schreiben und Fehler verstehen.','Write, understand errors and revise.')],
  ['sprechen.html','chat',tr('Luyện nói','Sprechen','Speaking'),tr('Tình huống, hội thoại và âm thanh.','Situationen und Gespräche.','Situations, conversations and audio.')],
  ['pruefung.html','flag',tr('Luyện thi','Prüfungstraining','Exam practice'),tr('Kỳ thi, cấp độ và từng phần thi.','Prüfungen, Niveaus und Teile.','Exams, levels and individual parts.')]
 ];

 function update(){
  if(!Account.current())return;
  syncSidebar();
  const roleName=Account.profile?.role==='super_admin'?'SUPER ADMIN':tr('NGƯỜI HỌC','LERNENDE','LEARNER');
  shell.querySelector('#ed-role').textContent=roleName;
  const targetLvl=Account.get('studyPlan',null)?.profile?.target||'B1';
  shell.querySelector('#ed-target-badge').textContent=targetLvl;

  // Render navigation links
  const navContainer=shell.querySelector('.ed-nav');
  navContainer.innerHTML=rows.map(([group,items])=>`<div class="ed-nav-label">${group}</div>${items.map(([url,i,vi,de,en])=>{
   const dest=new URL(url,location.href);
   return `<a href="${url}" data-nav-dest="${dest.pathname}${dest.hash}" title="${esc(tr(vi,de,en))}">${icon(i)}<span>${esc(tr(vi,de,en))}</span></a>`;
  }).join('')}`).join('');

  navContainer.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{
   if(mobile.matches)closeMenu();
   const href=a.getAttribute('href');
   if(home&&href.includes('#/')){
    const targetHash='#'+href.split('#')[1];
    if(targetHash){
     e.preventDefault();
     if(location.hash!==targetHash){
      location.hash=targetHash;
     }else{
      route();
     }
    }
   }
  }));

  if(home){
   const s=App.stats();
   const displayName=Account.displayName()||'Học viên';
   const hour=new Date().getHours();
   const greeting=hour<11?'Guten Morgen':hour>=18?'Guten Abend':'Guten Tag';

   // =========================================================================
   // VIEW 1: TRANG CHỦ (Ảnh 1)
   // =========================================================================
   overview.innerHTML=`
   <div class="sp-header-row">
     <div class="sp-header-titles">
       <div class="sp-eyebrow">TỔNG QUAN HỌC TẬP</div>
       <h1>${esc(greeting)}, ${esc(displayName)}! <small>/ Heute</small></h1>
       <p>Kế hoạch ôn tập và mục tiêu chứng chỉ ${esc(targetLvl)} của bạn hôm nay.</p>
     </div>
     <a href="quiz.html" class="sp-btn-burgundy">
       <span>🔄</span>
       <span>Ôn 6731 thẻ đến hạn</span>
     </a>
   </div>

   <div class="sp-stat-grid">
     <div class="sp-stat-card">
       <div class="sp-stat-head">
         <span>THẺ ĐẾN HẠN HÔM NAY</span>
         <span class="sp-stat-icon">🔄</span>
       </div>
       <div class="sp-stat-body">
         <div class="sp-stat-value">6731</div>
         <span class="sp-badge sp-badge-pink">Cần ôn</span>
       </div>
       <p class="sp-stat-hint">Cần ôn tập để giữ trí nhớ SM-2</p>
     </div>
     <div class="sp-stat-card">
       <div class="sp-stat-head">
         <span>CHUỖI HỌC LIÊN TIẾP</span>
         <span class="sp-stat-icon">🔥</span>
       </div>
       <div class="sp-stat-body">
         <div class="sp-stat-value">${s.streak||0} ngày</div>
         <span class="sp-badge sp-badge-orange">Streak</span>
       </div>
       <p class="sp-stat-hint">Học đều đặn mỗi ngày để duy trì streak</p>
     </div>
     <div class="sp-stat-card">
       <div class="sp-stat-head">
         <span>ĐẾM NGƯỢC NGÀY THI</span>
         <span class="sp-stat-icon">📅</span>
       </div>
       <div class="sp-stat-body">
         <div class="sp-stat-value">D-28</div>
         <span class="sp-badge sp-badge-orange">${esc(targetLvl)}</span>
       </div>
       <p class="sp-stat-hint">Kỳ thi mục tiêu ${esc(targetLvl)}</p>
     </div>
     <div class="sp-stat-card">
       <div class="sp-stat-head">
         <span>TỔNG TỪ TRONG BỘ THẺ</span>
         <span class="sp-stat-icon">📖</span>
       </div>
       <div class="sp-stat-body">
         <div class="sp-stat-value">6731</div>
         <span class="sp-badge sp-badge-yellow">5 đã học</span>
       </div>
       <p class="sp-stat-hint">0 từ đã thuộc vững</p>
     </div>
   </div>

   <div class="sp-main-grid">
     <div class="sp-box">
       <div>
         <div class="sp-box-eyebrow">CHỈ SỐ SẴN SÀNG THI</div>
         <h2>Prüfungsreife</h2>
         <p class="sp-desc">Đo lường tổng hợp từ 3 trụ cột: Vốn từ (3%), Kỹ năng (0%), Đề thi (0%).</p>
       </div>
       <div style="display:flex;justify-content:center;align-items:center;padding:12px 0;">
         <svg width="130" height="130" viewBox="0 0 130 130">
           <circle cx="65" cy="65" r="54" fill="none" stroke="var(--sp-border)" stroke-width="10"/>
           <circle cx="65" cy="65" r="54" fill="none" stroke="var(--sp-burgundy)" stroke-width="10" stroke-dasharray="339.29" stroke-dashoffset="335.89" stroke-linecap="round" transform="rotate(-90 65 65)"/>
           <text x="65" y="60" text-anchor="middle" font-family="system-ui, sans-serif" font-size="24" font-weight="700" fill="var(--sp-text)">1%</text>
           <text x="65" y="78" text-anchor="middle" font-family="var(--mono)" font-size="9" letter-spacing="1" fill="var(--sp-muted)">SẴN SÀNG</text>
         </svg>
       </div>
       <div class="sp-box-footer">
         <span style="font-family:var(--mono);color:var(--sp-muted);">Mục tiêu: ${esc(targetLvl)}</span>
         <a href="#/readiness">Xem chi tiết →</a>
       </div>
     </div>

     <div class="sp-box">
       <div>
         <div class="sp-box-eyebrow">LỘ TRÌNH TELC DEUTSCH (${esc(targetLvl)})</div>
         <h2>Nhiệm vụ trọng tâm hôm nay</h2>
         <p class="sp-desc">Theo lộ trình cá nhân hóa (45 phút/ngày). Đánh dấu hoàn thành để cập nhật tiến độ.</p>
       </div>
       <div class="sp-tasks-list">
         <a href="grammatik.html" class="sp-task-card">
           <div class="sp-task-left">
             <div class="sp-checkbox-circle"></div>
             <div class="sp-task-info">
               <span class="sp-task-tag" style="color:#9b2c47;">GRAMMAR · 16 phút</span>
               <div class="sp-task-title">Học ngữ pháp: "Chia động từ và trật tự câu" &amp; ôn thẻ từ vựng</div>
             </div>
           </div>
           <span class="sp-task-arrow">→</span>
         </a>
         <a href="lesen.html" class="sp-task-card">
           <div class="sp-task-left">
             <div class="sp-checkbox-circle"></div>
             <div class="sp-task-info">
               <span class="sp-task-tag" style="color:#047857;">READING · 29 phút</span>
               <div class="sp-task-title">Đọc hiểu bài ngắn trình độ B1 &amp; tra cứu cấu trúc câu</div>
             </div>
           </div>
           <span class="sp-task-arrow">→</span>
         </a>
       </div>
       <div class="sp-box-footer">
         <span style="font-family:var(--mono);color:var(--sp-muted);">Đã hoàn thành 0/2 nhiệm vụ</span>
         <a href="#/readiness">Đo lường độ sẵn sàng thi →</a>
       </div>
     </div>
   </div>

   <div class="sp-tutor-banner">
     <div class="sp-tutor-content">
       <div class="sp-tutor-icon">🤖</div>
       <div class="sp-tutor-info">
         <div class="sp-box-eyebrow" style="margin-bottom:2px;">GIA SƯ AI RIÊNG</div>
         <h3>Trợ lý ngôn ngữ ELIO</h3>
         <p>ELIO đồng hành cùng bạn 24/7: sửa lỗi ngữ pháp, chấm bài viết luận theo 4 tiêu chí chuẩn thi, đóng vai giám khảo phỏng vấn thi nói và đưa ra lộ trình ôn tập tuần.</p>
       </div>
     </div>
     <a href="#/elio" class="sp-btn-outline" style="border-color:var(--sp-border);white-space:nowrap;">Trò chuyện với ELIO →</a>
   </div>`;

   // =========================================================================
   // VIEW 2: KỸ NĂNG (Ảnh 2)
   // =========================================================================
   const skillsList=[
    {tag:'TELC SPRACHBAUSTEINE',title:'Sprachbausteine telc',quote:'Luyện điền từ theo đề telc đã import',desc:'Làm Teil 1/2, lưu bài làm và đối chiếu PDF đáp án hoặc màn đề xuất AI.',url:'#/exam',level:'B1'},
    {tag:'HÖREN / DICTATION',title:'Luyện nghe chính tả',quote:'Nghe câu tiếng Đức chuẩn bản xứ và gõ lại chính xác từng từ.',desc:'Tăng cường phản xạ âm thanh, nhận biết nối âm và viết đúng chính tả tiếng Đức.',url:'hoeren.html',level:'B1'},
    {tag:'GESPRÄCH / INTERVIEW',title:'Phỏng vấn & hội thoại',quote:'Luyện giao tiếp theo chủ đề với bạn hội thoại AI.',desc:'Chọn tình huống đời sống hoặc công việc, trả lời bằng giọng nói hay văn bản và nhận góp ý.',url:'sprechen.html',level:'B1'},
    {tag:'LESEN / LESESAAL',title:'Phòng đọc hiểu',quote:'Đọc các đoạn văn bám sát đề thi từ A1 đến C2 và trả lời câu hỏi trắc nghiệm.',desc:'Giải thích chi tiết ngữ pháp, từ vựng và mẹo tìm từ khóa trong bài thi.',url:'lesen.html',level:'B1'},
    {tag:'SCHREIBEN / SCHREIBWERKSTATT',title:'Phòng viết luận',quote:'Viết email, thư từ và bài luận theo đề thi, gửi AI chấm điểm 4 tiêu chí.',desc:'Nhận ngay thang điểm 100, sửa lỗi ngữ pháp từng câu và bài viết mẫu hoàn chỉnh.',url:'schreiben.html',level:'B1'},
    {tag:'AUSSPRACHE',title:'Phòng phát âm',quote:'Luyện phát âm các âm khó trong tiếng Đức (ch, r, ö, ü, ä, z, st, sp).',desc:'Ghi âm giọng của bạn, so khớp với người bản xứ và xem thanh điểm âm sắc.',url:'sprechen.html',level:'B1'},
    {tag:'GRAMMATIK',title:'Phòng ngữ pháp',quote:'Hệ thống chủ đề ngữ pháp từ cơ bản A1 đến nâng cao C2.',desc:'Học quy tắc trực quan, ví dụ song ngữ Đức-Việt và làm bài tập chấm điểm ngay.',url:'grammatik.html',level:'B1'},
    {tag:'INTERVIEW / SPRECHEN',title:'Phòng vấn thi nói',quote:'Mô phỏng 3 phần thi nói mục tiêu cùng giám khảo AI ELIO thông minh.',desc:'Trò chuyện tương tác từng lượt, nhận phản hồi 4 tiêu chí và mẫu câu ăn điểm.',url:'sprechen.html',level:'B1'},
    {tag:'DER / DIE / DAS',title:'Luyện qua trò chơi',quote:'Luyện phản xạ chọn mạo từ và cấu trúc câu.',desc:'Tích lũy combo, cộng điểm kinh nghiệm XP và khắc sâu mạo từ vào trí nhớ dài hạn.',url:'#/game',level:'B1'},
    {tag:'LERNEN & ENTDECKEN',title:'Học & khám phá',quote:'Tiểu phẩm đời sống tiếng Đức.',desc:'Cấu trúc câu, phát âm, giao tiếp, văn hóa và tổng hợp kỹ năng.',url:'lernen.html',level:'B1'}
   ];

   skills.innerHTML=`
   <div class="sp-header-row">
     <div class="sp-header-titles">
       <div class="sp-eyebrow">PHÒNG LUYỆN TOÀN DIỆN</div>
       <h1>Các phòng kỹ năng ngôn ngữ <small>/ Fertigkeiten</small></h1>
       <p>Rèn giũa phản xạ từ nghe, nói, đọc, viết đến phát âm và phỏng vấn mô phỏng.</p>
     </div>
     <button type="button" class="sp-btn-burgundy" onclick="location.href='import.html'">
       <span>+</span>
       <span>Import bài luyện mới</span>
     </button>
   </div>

   <div class="sp-tab-bar">
     ${['Học chung','telc','Goethe','ÖSD','DTZ','ECL','TestDaF','DSH','Chưa phân loại'].map((tab,idx)=>`
       <button type="button" class="sp-tab-btn ${idx===0?'active':''}">${tab}</button>
     `).join('')}
   </div>

   <div class="sp-skills-grid">
     ${skillsList.map(s=>`
       <div class="sp-skill-card">
         <div>
           <div class="sp-skill-head">
             <span class="sp-skill-category">${s.tag}</span>
             <span class="sp-skill-status">Chưa luyện</span>
           </div>
           <div class="sp-skill-title">${s.title}</div>
           <div class="sp-skill-tagline">"${s.quote}"</div>
           <p class="sp-skill-desc">${s.desc}</p>
         </div>
         <div class="sp-skill-footer">
           <span class="sp-skill-level">${s.level}</span>
           <a href="${s.url}" class="sp-btn-outline" style="padding:4px 10px;font-size:11px;">Vào phòng →</a>
         </div>
       </div>
     `).join('')}
   </div>`;

   // =========================================================================
   // VIEW 3: TRÒ CHƠI (Ảnh 3)
   // =========================================================================
   const gamesList=[
    {id:'der-die-das',title:'Der–Die–Das',desc:'Một lượt tối đa 10 câu, có đáp án và giải thích.'},
    {id:'partizip-2',title:'Partizip II',desc:'Một lượt tối đa 10 câu, có đáp án và giải thích.'},
    {id:'haben-sein',title:'Haben / Sein',desc:'Một lượt tối đa 10 câu, có đáp án và giải thích.'},
    {id:'meaning',title:'Chọn nghĩa',desc:'Một lượt tối đa 10 câu, có đáp án và giải thích.'},
    {id:'writing',title:'Viết từ',desc:'Một lượt tối đa 10 câu, có đáp án và giải thích.'},
    {id:'listening',title:'Nghe và viết',desc:'Một lượt tối đa 10 câu, có đáp án và giải thích.'},
    {id:'sentence',title:'Xếp câu',desc:'Một lượt tối đa 10 câu, có đáp án và giải thích.'},
    {id:'matching',title:'Ghép từ',desc:'Tìm các cặp từ Đức–Việt tương ứng.'},
    {id:'memory',title:'Lật thẻ tìm cặp',desc:'Tìm các cặp từ Đức–Việt tương ứng.'},
    {id:'structure',title:'Điền cấu trúc',desc:'Một lượt tối đa 10 câu, có đáp án và giải thích.'}
   ];

   game.innerHTML=`
   <div class="sp-header-row">
     <div class="sp-header-titles">
       <h1>Luyện qua trò chơi</h1>
       <p>Luyện từ vựng và ngữ pháp; điểm dựa trên câu trả lời của bạn.</p>
     </div>
   </div>

   <div id="sp-game-play-area" hidden></div>

   <div class="sp-games-grid" id="sp-games-catalog">
     ${gamesList.map(g=>`
       <div class="sp-game-card">
         <div>
           <div class="sp-game-title">${g.title}</div>
           <p class="sp-game-desc">${g.desc}</p>
         </div>
         <div>
           <button type="button" class="sp-btn-outline" data-play-game="${g.id}">Bắt đầu →</button>
         </div>
       </div>
     `).join('')}
   </div>`;

   game.querySelectorAll('[data-play-game]').forEach(btn=>{
    btn.onclick=()=>{
     const gid=btn.dataset.playGame;
     const catalog=game.querySelector('#sp-games-catalog');
     const arena=game.querySelector('#sp-game-play-area');
     catalog.hidden=true;
     arena.hidden=false;
     renderGameArena(gid,arena,catalog);
    };
   });

   // =========================================================================
   // VIEW 4: LUYỆN THI (Ảnh 4)
   // =========================================================================
   exam.innerHTML=`
   <div class="sp-header-row">
     <div class="sp-header-titles">
       <div class="sp-eyebrow">PHÒNG LUYỆN THI</div>
       <h1>Luyện thi tiếng Đức <small>/ Prüfungstraining</small></h1>
       <p>Chọn kỳ thi, cấp độ, bộ đề và phần muốn luyện. Bài làm và đáp án nguồn được giữ theo từng tài liệu.</p>
     </div>
     <div style="display:flex;gap:8px;align-items:center;">
       <a href="import.html" class="sp-btn-burgundy">+ Import đề thi</a>
     </div>
   </div>

   <div style="display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap;">
     <a href="#/exam" class="sp-btn-outline">Tạo bộ</a>
     <a href="#/exam" class="sp-btn-outline">Các bộ học</a>
     <a href="#/exam" class="sp-btn-outline">Luyện đề đã import</a>
     <a href="#/exam" class="sp-btn-outline">Sửa / Xóa nội dung import</a>
   </div>

   <div class="sp-exam-cert-row">
     <div class="sp-exam-cert-card">
       <div class="sp-exam-cert-title">
         <span>Goethe-Zertifikat</span>
         <small>· 61 bộ</small>
       </div>
       <p class="sp-exam-cert-sub">Chọn cấp độ để xem bộ đề.</p>
       <div class="sp-level-buttons">
         ${['A1','A2','B1','B2','C1','C2'].map(l=>`<button type="button" class="sp-lvl-btn">${l}</button>`).join('')}
       </div>
     </div>
     <div class="sp-exam-cert-card selected">
       <div class="sp-exam-cert-title">
         <span>telc Deutsch</span>
         <small>· 58 bộ</small>
       </div>
       <p class="sp-exam-cert-sub">Chọn cấp độ để xem bộ đề.</p>
       <div class="sp-level-buttons">
         ${['A1','A2','B1','B2','C1','C2'].map(l=>`<button type="button" class="sp-lvl-btn ${l==='B1'?'active':''}">${l}</button>`).join('')}
       </div>
     </div>
     <div class="sp-exam-cert-card">
       <div class="sp-exam-cert-title">
         <span>ÖSD Zertifikat</span>
         <small>· 8 bộ</small>
       </div>
       <p class="sp-exam-cert-sub">Chọn cấp độ để xem bộ đề.</p>
       <div class="sp-level-buttons">
         ${['A1','A2','B1','B2','C1','C2'].map(l=>`<button type="button" class="sp-lvl-btn">${l}</button>`).join('')}
       </div>
     </div>
   </div>

   <div class="sp-exam-filters">
     <div class="sp-filter-group">
       <label>Kỳ thi</label>
       <select><option selected>telc</option><option>Goethe</option><option>ÖSD</option></select>
     </div>
     <div class="sp-filter-group">
       <label>Cấp độ</label>
       <select><option selected>B1</option><option>A1</option><option>A2</option><option>B2</option><option>C1</option><option>C2</option></select>
     </div>
     <div class="sp-filter-group">
       <label>Trạng thái</label>
       <select><option>Tất cả trạng thái</option><option>Đang làm</option><option>Chưa bắt đầu</option></select>
     </div>
     <div class="sp-filter-group">
       <label>Tìm bộ đề</label>
       <input type="search" placeholder="PETRA, EVA..."/>
     </div>
   </div>

   <div class="sp-exam-accordions">
     <details>
       <summary>▶ Import PDF / ảnh / tài liệu nghe</summary>
       <div style="padding-top:10px;"><p style="font-size:12px;color:var(--sp-muted);">Kéo thả file đề PDF hoặc audio vào đây để tự động tách Teil.</p></div>
     </details>
     <details>
       <summary>▶ Cấu trúc kỳ thi &amp; thời gian luyện</summary>
       <div style="padding-top:10px;"><p style="font-size:12px;color:var(--sp-muted);">telc B1: Đọc &amp; Sprachbausteine 90 phút · Nghe 30 phút · Viết 30 phút · Nói 15 phút.</p></div>
     </details>
   </div>

   <div style="display:flex;gap:6px;flex-wrap:wrap;margin:16px 0;">
     ${['Tất cả kỹ năng','Lesen - Đọc','Sprachbausteine','Hören - Nghe','Schreiben - Viết','Sprechen - Nói','Ngữ pháp'].map((s,i)=>`
       <button type="button" class="sp-tab-btn ${i===0?'active':''}">${s}</button>
     `).join('')}
   </div>

   <div style="display:flex;justify-content:space-between;align-items:center;margin:18px 0 14px;">
     <h2 style="font-size:1.15rem;font-weight:700;margin:0;">telc · B1 · 53 bộ</h2>
     <button type="button" class="sp-btn-outline" style="font-size:11px;padding:3px 10px;">Xóa bộ lọc</button>
   </div>

   <div class="sp-exam-sets-list">
     <div class="sp-exam-set-box">
       <div class="sp-exam-set-head">
         <div>
           <div class="sp-box-eyebrow">TELC · B1</div>
           <h3 style="margin:2px 0 0;font-size:1.2rem;font-weight:700;font-family:Georgia,serif;">Alex und Cora</h3>
         </div>
         <span class="sp-badge sp-badge-orange">Đang làm</span>
       </div>
       <details style="border:1px solid var(--sp-border);border-radius:4px;padding:8px 12px;font-size:11.5px;margin:8px 0;">
         <summary style="cursor:pointer;">▶ Bộ tài liệu nguồn · 1 tài liệu</summary>
       </details>
       <div class="sp-exam-parts-grid">
         <div class="sp-exam-part-card">
           <div>
             <span class="sp-task-tag" style="color:var(--sp-burgundy);">Lesen · Đọc · Teil 1</span>
             <h4>Alex und Cora · Lesen · Teil 1</h4>
             <p>0/5 câu đã trả lời</p>
           </div>
           <a href="lesen.html" class="sp-btn-outline" style="width:fit-content;font-size:11.5px;">Bắt đầu →</a>
         </div>
         <div class="sp-exam-part-card">
           <div>
             <span class="sp-task-tag" style="color:var(--sp-burgundy);">Lesen · Đọc · Teil 3</span>
             <h4>Alex und Cora · Lesen · Teil 3</h4>
             <p>0/10 câu đã trả lời</p>
           </div>
           <a href="lesen.html" class="sp-btn-outline" style="width:fit-content;font-size:11.5px;">Bắt đầu →</a>
         </div>
       </div>
     </div>

     <div class="sp-exam-set-box">
       <div class="sp-exam-set-head">
         <div>
           <div class="sp-box-eyebrow">TELC · B1</div>
           <h3 style="margin:2px 0 0;font-size:1.2rem;font-weight:700;font-family:Georgia,serif;">Alicia</h3>
         </div>
         <span class="sp-badge sp-badge-yellow">Chưa bắt đầu</span>
       </div>
       <details style="border:1px solid var(--sp-border);border-radius:4px;padding:8px 12px;font-size:11.5px;margin:8px 0;">
         <summary style="cursor:pointer;">▶ Bộ tài liệu nguồn · 1 tài liệu</summary>
       </details>
       <div class="sp-exam-parts-grid">
         <div class="sp-exam-part-card">
           <div>
             <span class="sp-task-tag" style="color:var(--sp-burgundy);">Lesen · Đọc · Teil 1</span>
             <h4>Alicia · Lesen · Teil 1</h4>
             <p>0/5 câu đã trả lời</p>
           </div>
           <a href="lesen.html" class="sp-btn-outline" style="width:fit-content;font-size:11.5px;">Bắt đầu →</a>
         </div>
         <div class="sp-exam-part-card">
           <div>
             <span class="sp-task-tag" style="color:var(--sp-burgundy);">Lesen · Đọc · Teil 2</span>
             <h4>Alicia · Lesen · Teil 2</h4>
             <p>0/5 câu đã trả lời</p>
           </div>
           <a href="lesen.html" class="sp-btn-outline" style="width:fit-content;font-size:11.5px;">Bắt đầu →</a>
         </div>
         <div class="sp-exam-part-card">
           <div>
             <span class="sp-task-tag" style="color:var(--sp-burgundy);">Lesen · Đọc · Teil 3</span>
             <h4>Alicia · Lesen · Teil 3</h4>
             <p>0/10 câu đã trả lời</p>
           </div>
           <a href="lesen.html" class="sp-btn-outline" style="width:fit-content;font-size:11.5px;">Bắt đầu →</a>
         </div>
       </div>
     </div>

     <div class="sp-exam-set-box">
       <div class="sp-exam-set-head">
         <div>
           <div class="sp-box-eyebrow">TELC · B1</div>
           <h3 style="margin:2px 0 0;font-size:1.2rem;font-weight:700;font-family:Georgia,serif;">ANDREAS</h3>
         </div>
         <span class="sp-badge sp-badge-yellow">Chưa bắt đầu</span>
       </div>
       <details style="border:1px solid var(--sp-border);border-radius:4px;padding:8px 12px;font-size:11.5px;margin:8px 0;">
         <summary style="cursor:pointer;">▶ Bộ tài liệu nguồn · 1 tài liệu</summary>
       </details>
       <div class="sp-exam-parts-grid">
         <div class="sp-exam-part-card">
           <div>
             <span class="sp-task-tag" style="color:var(--sp-burgundy);">Lesen · Đọc · Teil 1</span>
             <h4>ANDREAS · Lesen · Teil 1</h4>
             <p>0/5 câu đã trả lời</p>
           </div>
           <a href="lesen.html" class="sp-btn-outline" style="width:fit-content;font-size:11.5px;">Bắt đầu →</a>
         </div>
         <div class="sp-exam-part-card">
           <div>
             <span class="sp-task-tag" style="color:var(--sp-burgundy);">Lesen · Đọc · Teil 2</span>
             <h4>ANDREAS · Lesen · Teil 2</h4>
             <p>0/5 câu đã trả lời</p>
           </div>
           <a href="lesen.html" class="sp-btn-outline" style="width:fit-content;font-size:11.5px;">Bắt đầu →</a>
         </div>
         <div class="sp-exam-part-card">
           <div>
             <span class="sp-task-tag" style="color:var(--sp-burgundy);">Lesen · Đọc · Teil 3</span>
             <h4>ANDREAS · Lesen · Teil 3</h4>
             <p>0/10 câu đã trả lời</p>
           </div>
           <a href="lesen.html" class="sp-btn-outline" style="width:fit-content;font-size:11.5px;">Bắt đầu →</a>
         </div>
       </div>
     </div>
   </div>`;

   // =========================================================================
   // VIEW 5: SẴN SÀNG THI (Ảnh 5)
   // =========================================================================
   readiness.innerHTML=`
   <div class="sp-header-row">
     <div class="sp-header-titles">
       <div class="sp-eyebrow">CHỈ SỐ SẴN SÀNG THI</div>
       <h1>Đo lường độ sẵn sàng <small>/ Prüfungsreife</small></h1>
       <p>Đánh giá khách quan năng lực ngôn ngữ theo chuẩn kỳ thi quốc tế trình độ ${esc(targetLvl)}.</p>
     </div>
   </div>

   <div class="sp-readiness-main-grid">
     <div class="sp-box" style="align-items:center;text-align:center;">
       <div class="sp-box-eyebrow">CHỈ SỐ TỔNG HỢP</div>
       <div style="margin:16px 0;">
         <svg width="150" height="150" viewBox="0 0 150 150">
           <circle cx="75" cy="75" r="62" fill="none" stroke="var(--sp-border)" stroke-width="12"/>
           <circle cx="75" cy="75" r="62" fill="none" stroke="var(--sp-burgundy)" stroke-width="12" stroke-dasharray="389.55" stroke-dashoffset="385.65" stroke-linecap="round" transform="rotate(-90 75 75)"/>
           <text x="75" y="70" text-anchor="middle" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="var(--sp-text)">1%</text>
           <text x="75" y="90" text-anchor="middle" font-family="var(--mono)" font-size="10" letter-spacing="1" fill="var(--sp-muted)">SẴN SÀNG</text>
         </svg>
       </div>
       <div style="font-weight:700;font-size:1.15rem;margin-bottom:6px;font-family:Georgia,serif;">Cần bổ sung kiến thức thêm</div>
       <p style="font-size:11.5px;color:var(--sp-muted);line-height:1.5;margin:0;">Công thức: Đề thi (30%) + Từ vựng SM-2 (30%) + 7 Kỹ năng (40%).</p>
     </div>

     <div class="sp-box">
       <div class="sp-box-eyebrow">3 TRỤ CỘT ĐÁNH GIÁ NĂNG LỰC</div>
       <div class="sp-pillars-list">
         <div class="sp-pillar-item">
           <div class="sp-pillar-header">
             <span style="font-weight:600;">Trụ cột 1: Vốn từ vựng SM-2</span>
             <span style="color:var(--sp-muted);">1 đã học / Mục tiêu: 400 từ (${esc(targetLvl)}) · Tiến độ: 0%</span>
           </div>
           <div class="sp-progress-bar-bg"><div class="sp-progress-bar-fill" style="width:0%;"></div></div>
           <p style="font-size:11px;color:var(--sp-muted);margin:0;">Đã ghi nhận 1 từ trong bộ từ vựng; cần duy trì ôn tập hàng ngày.</p>
         </div>

         <div class="sp-pillar-item">
           <div class="sp-pillar-header">
             <span style="font-weight:600;">Trụ cột 2: 7 Phòng kỹ năng</span>
             <span style="color:var(--sp-muted);">0 hoàn thành / 7 kỹ năng · Tiến độ: 0%</span>
           </div>
           <div class="sp-progress-bar-bg"><div class="sp-progress-bar-fill" style="width:0%;"></div></div>
           <p style="font-size:11px;color:var(--sp-muted);margin:0;">Đã làm 0 phòng kỹ năng; hãy mở phòng Viết hoặc Đọc để ghi nhận điểm.</p>
         </div>

         <div class="sp-pillar-item">
           <div class="sp-pillar-header">
             <span style="font-weight:600;">Trụ cột 3: Làm đề thi (4 kỹ năng)</span>
             <span style="color:var(--sp-muted);">Đã làm 0 / 53 bộ đề telc · Tiến độ: 0%</span>
           </div>
           <div class="sp-progress-bar-bg"><div class="sp-progress-bar-fill" style="width:0%;"></div></div>
           <p style="font-size:11px;color:var(--sp-muted);margin:0;">Hoàn thành ít nhất 3 đề thi đầy đủ 4 kỹ năng để kiểm chứng năng lực.</p>
         </div>
       </div>

       <div class="sp-alert-yellow">
         <strong>⚠️ Kỹ năng đang có hiệu suất thấp nhất: 7 KỸ NĂNG.</strong> Hãy dành 15 phút luyện tập kỹ năng này hôm nay.
       </div>
     </div>
   </div>

   <div class="sp-tutor-banner">
     <div class="sp-tutor-content">
       <div class="sp-tutor-icon">🤖</div>
       <div class="sp-tutor-info">
         <div class="sp-box-eyebrow" style="margin-bottom:2px;">ĐỐI TÁC CHIẾN LƯỢC TỰ HỌC: AI ELIO</div>
         <h3>Phân tích &amp; Hành động tuần</h3>
         <p>Bấm nút để kích hoạt AI ELIO tổng hợp dữ liệu học tập và đưa ra nhận xét cá nhân hóa cùng chiến lược phân bổ thời gian tuần.</p>
       </div>
     </div>
     <button type="button" class="sp-btn-burgundy" id="sp-btn-ai-advice" style="white-space:nowrap;">Lấy phân tích từ AI ELIO →</button>
   </div>
   <div id="sp-ai-advice-result" class="sp-box" style="margin-top:16px;" hidden></div>`;

   const adviceBtn=readiness.querySelector('#sp-btn-ai-advice');
   const adviceOut=readiness.querySelector('#sp-ai-advice-result');
   if(adviceBtn&&adviceOut){
    adviceBtn.onclick=async()=>{
     adviceBtn.disabled=true;
     adviceBtn.textContent='AI ELIO đang phân tích…';
     try{
      adviceOut.hidden=false;
      adviceOut.innerHTML='<div style="font-size:12px;color:var(--sp-muted);">Đang phân tích dữ liệu học tập và chuẩn bị lộ trình tuần…</div>';
      const prompt='Hãy đóng vai gia sư tiếng Đức chuyên nghiệp ELIO. Phân tích tiến độ học tập cho học viên đang chuẩn bị thi cấp độ '+targetLvl+'. Đưa ra 3 lời khuyên chiến lược cụ thể trong tuần để cải thiện kỹ năng yếu nhất. Trả lời bằng tiếng Việt ngắn gọn, chuyên nghiệp, truyền cảm hứng.';
      const res=await App.evaluate(prompt,{feature:'chat'});
      adviceOut.innerHTML=`<div class="sp-box-eyebrow">NHẬN XÉT CHIẾN LƯỢC TỪ AI ELIO</div><div style="font-size:13px;line-height:1.6;margin-top:6px;white-space:pre-wrap;">${esc(typeof res==='string'?res:(res.feedback||res.text||JSON.stringify(res)))}</div>`;
     }catch(e){
      adviceOut.innerHTML=`<div style="color:var(--sp-burgundy);font-size:12px;">Chưa thể tải phân tích AI lúc này: ${esc(e.message)}</div>`;
     }finally{
      adviceBtn.disabled=false;
      adviceBtn.textContent='Lấy phân tích từ AI ELIO →';
     }
    };
   }

   // =========================================================================
   // VIEW 6: AI ELIO CHAT (Gia sư tương tác)
   // =========================================================================
   elio.innerHTML=`
   <div class="sp-header-row">
     <div class="sp-header-titles">
       <div class="sp-eyebrow">GIA SƯ RIÊNG 24/7</div>
       <h1>Trò chuyện với AI ELIO <small>/ Tutor</small></h1>
       <p>Gia sư ngôn ngữ hỗ trợ giải đáp ngữ pháp, luyện hội thoại song ngữ và chấm bài thi thử.</p>
     </div>
     <a href="tutor.html" class="sp-btn-outline">Mở phòng đầy đủ ↗</a>
   </div>

   <div class="sp-box" style="min-height:480px;display:flex;flex-direction:column;justify-content:space-between;">
     <div id="sp-chat-messages" style="overflow-y:auto;max-height:400px;display:flex;flex-direction:column;gap:12px;padding:10px 0;">
       <div style="display:flex;gap:10px;align-items:flex-start;">
         <div class="sp-tutor-icon" style="width:30px;height:30px;font-size:14px;">🤖</div>
         <div style="background:var(--sp-burgundy-soft);border:1px solid #f9d8de;padding:12px 16px;border-radius:4px;font-size:13px;line-height:1.5;max-width:85%;">
           Hallo ${esc(displayName)}! Ich bin ELIO, dein persönlicher Deutsch-Tutor. Bạn muốn luyện tập gì hôm nay? Bạn có thể hỏi ngữ pháp, gửi câu cần sửa hoặc luyện hội thoại theo tình huống đời sống!
         </div>
       </div>
     </div>

     <form id="sp-chat-form" style="display:flex;gap:10px;margin-top:16px;border-top:1px solid var(--sp-border);padding-top:14px;">
       <input type="text" id="sp-chat-input" placeholder="Nhập câu hỏi tiếng Đức hoặc tiếng Việt…" style="flex:1;border:1px solid var(--sp-border);padding:10px 14px;border-radius:4px;font-size:13px;background:var(--sp-card);color:var(--sp-text);"/>
       <button type="submit" class="sp-btn-burgundy">Gửi</button>
     </form>
   </div>`;

   const chatForm=elio.querySelector('#sp-chat-form');
   const chatInput=elio.querySelector('#sp-chat-input');
   const chatBox=elio.querySelector('#sp-chat-messages');
   if(chatForm&&chatInput&&chatBox){
    chatForm.onsubmit=async e=>{
     e.preventDefault();
     const text=chatInput.value.trim();
     if(!text)return;
     chatInput.value='';
     const userMsg=document.createElement('div');
     userMsg.style.cssText='display:flex;justify-content:flex-end;margin-bottom:8px;';
     userMsg.innerHTML=`<div style="background:var(--sp-card);border:1px solid var(--sp-border);padding:10px 14px;border-radius:4px;font-size:13px;max-width:80%;">${esc(text)}</div>`;
     chatBox.append(userMsg);
     chatBox.scrollTop=chatBox.scrollHeight;

     const botMsg=document.createElement('div');
     botMsg.style.cssText='display:flex;gap:10px;align-items:flex-start;';
     botMsg.innerHTML=`<div class="sp-tutor-icon" style="width:30px;height:30px;font-size:14px;">🤖</div><div style="background:var(--sp-burgundy-soft);border:1px solid #f9d8de;padding:10px 14px;border-radius:4px;font-size:13px;line-height:1.5;max-width:85%;">Đang suy nghĩ…</div>`;
     chatBox.append(botMsg);
     chatBox.scrollTop=chatBox.scrollHeight;

     try{
      const reply=await App.evaluate('Bạn là gia sư tiếng Đức tận tâm ELIO. Hãy trả lời câu hỏi của người học: "'+text+'". Trả lời có ví dụ tiếng Đức chuẩn, giải thích bằng tiếng Việt dễ hiểu.',{feature:'chat'});
      const replyText=typeof reply==='string'?reply:(reply.reply||reply.text||JSON.stringify(reply));
      botMsg.querySelector('div:last-child').textContent=replyText;
     }catch(err){
      botMsg.querySelector('div:last-child').textContent='ELIO tạm thời chưa kết nối được: '+err.message;
     }
     chatBox.scrollTop=chatBox.scrollHeight;
    };
   }

   route();
  }
 }

 // Interactive mini-game arena
 function renderGameArena(gameId,container,catalogBack){
  container.replaceChildren();
  const titleMap={'der-die-das':'Der–Die–Das','partizip-2':'Partizip II','haben-sein':'Haben / Sein','meaning':'Chọn nghĩa','writing':'Viết từ','listening':'Nghe và viết','sentence':'Xếp câu','matching':'Ghép từ','memory':'Lật thẻ tìm cặp','structure':'Điền cấu trúc'};
  const questions={
   'der-die-das':[
    {word:'Tisch',options:['der','die','das'],answer:'der',meaning:'cái bàn (der Tisch)'},
    {word:'Lampe',options:['der','die','das'],answer:'die',meaning:'cái đèn (die Lampe)'},
    {word:'Buch',options:['der','die','das'],answer:'das',meaning:'quyển sách (das Buch)'},
    {word:'Fenster',options:['der','die','das'],answer:'das',meaning:'cửa sổ (das Fenster)'},
    {word:'Tür',options:['der','die','das'],answer:'die',meaning:'cánh cửa (die Tür)'}
   ],
   'haben-sein':[
    {word:'Ich ___ nach Berlin gefahren.',options:['habe','bin'],answer:'bin',meaning:'Động từ chỉ sự chuyển dịch vị trí -> dùng sein (bin gefahren).'},
    {word:'Er ___ ein Buch gelesen.',options:['hat','ist'],answer:'hat',meaning:'Ngoại động từ có tân ngữ trực tiếp -> dùng haben (hat gelesen).'},
    {word:'Wir ___ zu Hause geblieben.',options:['haben','sind'],answer:'sind',meaning:'Động từ bleiben (ở lại) -> dùng sein (sind geblieben).'}
   ]
  }[gameId]||[
   {word:'Guten Tag nghĩa là gì?',options:['Chào buổi sáng','Chào buổi trưa / ngày tốt lành','Tạm biệt'],answer:'Chào buổi trưa / ngày tốt lành',meaning:'Guten Tag dùng chào ban ngày.'},
   {word:'Auf Wiedersehen nghĩa là gì?',options:['Hẹn gặp lại','Cảm ơn','Xin lỗi'],answer:'Hẹn gặp lại',meaning:'Auf Wiedersehen là chào tạm biệt trang trọng.'}
  ];

  let curIdx=0,correctCount=0;
  function showQuestion(){
   if(curIdx>=questions.length){
    container.innerHTML=`
    <div class="sp-box" style="text-align:center;padding:32px;">
      <h3 style="font-size:1.5rem;font-family:Georgia,serif;margin-bottom:8px;">Hoàn thành lượt chơi!</h3>
      <p style="color:var(--sp-muted);font-size:13px;">Bạn đã trả lời đúng ${correctCount}/${questions.length} câu hỏi.</p>
      <div style="display:flex;justify-content:center;gap:12px;margin-top:20px;">
        <button type="button" class="sp-btn-burgundy" id="sp-btn-replay">Chơi lại</button>
        <button type="button" class="sp-btn-outline" id="sp-btn-back">← Danh sách trò chơi</button>
      </div>
    </div>`;
    container.querySelector('#sp-btn-replay').onclick=()=>{curIdx=0;correctCount=0;showQuestion();};
    container.querySelector('#sp-btn-back').onclick=()=>{container.hidden=true;catalogBack.hidden=false;};
    return;
   }

   const q=questions[curIdx];
   container.innerHTML=`
   <div class="sp-box">
     <div style="display:flex;justify-content:space-between;align-items:center;">
       <button type="button" class="sp-btn-outline" id="sp-btn-back" style="font-size:11px;">← Các trò chơi</button>
       <span style="font-family:var(--mono);font-size:11px;color:var(--sp-muted);">Câu ${curIdx+1}/${questions.length}</span>
     </div>
     <div class="sp-game-q-box" style="margin:20px 0;text-align:center;">
       <div class="sp-box-eyebrow">${titleMap[gameId]||'Trò chơi'}</div>
       <h2 style="font-size:1.8rem;margin:8px 0;font-family:Georgia,serif;">${esc(q.word)}</h2>
     </div>
     <div class="sp-game-options" style="justify-content:center;">
       ${q.options.map(opt=>`
         <button type="button" class="sp-game-opt-btn" data-opt="${esc(opt)}">${esc(opt)}</button>
       `).join('')}
     </div>
     <div id="sp-game-feedback" style="min-height:45px;text-align:center;font-size:13px;margin-top:8px;" role="status"></div>
   </div>`;

   container.querySelector('#sp-btn-back').onclick=()=>{container.hidden=true;catalogBack.hidden=false;};

   container.querySelectorAll('.sp-game-opt-btn').forEach(btn=>{
    btn.onclick=()=>{
     container.querySelectorAll('.sp-game-opt-btn').forEach(b=>b.disabled=true);
     const chosen=btn.dataset.opt;
     const isRight=chosen===q.answer;
     if(isRight)correctCount++;
     btn.style.background=isRight?'#ecfdf5':'#fdf2f4';
     btn.style.borderColor=isRight?'#047857':'#9b2c47';
     btn.style.color=isRight?'#047857':'#9b2c47';
     const fb=container.querySelector('#sp-game-feedback');
     fb.innerHTML=`
     <div style="color:${isRight?'#047857':'#9b2c47'};font-weight:600;margin-bottom:4px;">
       ${isRight?'Chính xác! ✓':'Chưa đúng. Đáp án: '+esc(q.answer)}
     </div>
     <div style="color:var(--sp-muted);font-size:12px;">${esc(q.meaning||'')}</div>
     <button type="button" class="sp-btn-burgundy" id="sp-btn-next" style="margin-top:12px;font-size:12px;padding:6px 14px;">Tiếp tục →</button>`;
     fb.querySelector('#sp-btn-next').onclick=()=>{curIdx++;showQuestion();};
    };
   });
  }
  showQuestion();
 }

 function route(){
  if(!home)return;
  const hash=location.hash||'#/heute';
  let part='overview';
  if(hash.startsWith('#/skills')||hash==='#skills'||hash==='#contents')part='skills';
  else if(hash.startsWith('#/game')||hash==='#game'||hash==='#games')part='game';
  else if(hash.startsWith('#/exam')||hash==='#exam'||hash==='#exams')part='exam';
  else if(hash.startsWith('#/readiness')||hash==='#readiness')part='readiness';
  else if(hash.startsWith('#/elio')||hash==='#elio'||hash==='#tutor')part='elio';
  else if(hash.startsWith('#/plan')||hash==='#plan')part='plan';
  else part='overview';

  for(const [id,node] of Object.entries({overview,skills,game,exam,readiness,elio,plan})){
   if(node)node.hidden=(id!==part);
  }

  // Update page title
  const titleMap={
   overview:'Hôm nay',
   skills:'Kỹ năng',
   game:'Trò chơi',
   exam:'Luyện thi',
   readiness:'Sẵn sàng thi',
   elio:'AI ELIO',
   plan:'Lộ trình của tôi'
  };
  const titleEl=shell.querySelector('#ed-page-title');
  if(titleEl&&titleMap[part])titleEl.textContent=titleMap[part];

  // Update active state in sidebar
  shell.querySelectorAll('.ed-nav a').forEach(a=>{
   const dest=a.getAttribute('data-nav-dest')||a.getAttribute('href');
   const isMatch=dest&&(dest.includes(hash)||(hash==='#/heute'&&dest.includes('#/heute'))||(part==='skills'&&dest.includes('#/skills'))||(part==='game'&&dest.includes('#/game'))||(part==='exam'&&dest.includes('#/exam'))||(part==='readiness'&&dest.includes('#/readiness'))||(part==='elio'&&dest.includes('#/elio')));
   a.classList.toggle('active',!!isMatch);
   a.setAttribute('aria-current',isMatch?'page':'false');
  });
 }

 for(const event of ['languagechange','cloudchange','progresschange','elioviewresume'])document.addEventListener(event,update);
 window.addEventListener('hashchange',()=>{route();});
 update();
 route();
 ElioNavigation.install();
 window.ElioEditorialReady=true;
})();
