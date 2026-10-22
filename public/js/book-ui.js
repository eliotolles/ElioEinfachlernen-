'use strict';
// Presentation adapter. Existing module handlers, AI requests, authorization and storage remain authoritative.
(()=>{
 if(typeof Account==='undefined'||typeof App==='undefined'||!Account.current())return;
 const root=document.body,main=document.querySelector('main');if(!main)return;
 root.classList.add('book-app');
 const modules=[['grammatik.html','Grammatik','Entdecke die Struktur der Sprache.','I'],['wortschatz.html','Wortschatz','Sammle Wörter, die dir die Welt näherbringen.','II'],['quiz.html','Quiz','Spielerisch lernen und deinen Wortschatz festigen.','III'],['schreiben.html','Schreiben','Gib deinen Gedanken eine Form.','IV'],['sprechen.html','Sprechen','Mach Deutsch zu deiner eigenen Stimme.','V'],['pruefung.html','Prüfungstraining','Goethe · telc · ÖSD. Mit jeder Übung sicherer.','VI']];
 modules.push(['hoeren.html','Hören & Diktat','Höre genau hin. Schreibe Wort für Wort.','VII']);
 const file=location.pathname.split('/').pop()||'index.html',home=file==='index.html';
 const lang=()=>App.settings().language;
 const tr=(vi,de,en)=>({vi,de,en})[lang()]||vi;
 const admin=()=>Account.profile?.role==='super_admin';
 const links=()=>modules.map(([url,title,desc,num])=>`<a href="${url}" class="book-chapter"><small>${num}</small><span><strong>${title}</strong><em>${desc}</em></span></a>`).join('')+(admin()?'<a href="admin.html" class="book-chapter book-project"><small>VIII</small><span><strong>Weitere Projekte</strong><em>Hier entstehen neue Kapitel.</em></span></a>':'');
 const shell=document.createElement('div');shell.className='book-shell';shell.innerHTML=`<header class="book-heading"><a class="book-brand" href="index.html"><b>e</b><span>Elio Einfach</span></a><p class="book-slogan"></p></header><nav class="book-nav" aria-label="Điều hướng chính"><a href="index.html" data-book-page="intro">Lời mở đầu</a><a href="index.html#contents" data-book-page="contents">Mục lục</a><a href="index.html#study" data-book-page="study">Góc học của bạn</a><div class="book-profile"><div id="book-account-toggle"></div><div id="book-account-menu" class="book-account-menu" hidden><strong id="book-profile-name"></strong><a href="settings.html#profile">Trang cá nhân</a><a href="settings.html">Cài đặt & đồng bộ</a><a href="history.html">Lịch sử học</a>${admin()?'<a href="admin.html">Quản trị · AI & nội dung</a>':''}<button type="button" id="book-logout">Đăng xuất</button></div></div></nav>`;
 // Keep original shell nodes mounted: core and cloud handlers still own their state.
 const legacy=document.getElementById('navbar');legacy.classList.add('book-legacy-shell');legacy.setAttribute('aria-hidden','true');
 legacy.before(shell);shell.append(main);
 const reading=document.createElement('div');reading.className='book-reading-control';reading.innerHTML='<button type="button" id="book-reading-toggle" aria-label="Cỡ chữ" aria-expanded="false" aria-controls="book-reading-menu">Aa</button><div id="book-reading-menu" hidden><label for="book-reading-size" id="book-reading-label">Cỡ chữ</label><select id="book-reading-size"><option value="16">16 · M</option><option value="18">18 · L</option><option value="20">20 · XL</option><option value="22">22 · XXL</option></select><small id="book-reading-status" role="status"></small></div>';shell.querySelector('.book-profile').prepend(reading);
 const readingMenu=reading.querySelector('#book-reading-menu'),readingToggle=reading.querySelector('#book-reading-toggle'),readingSize=reading.querySelector('#book-reading-size');
 readingToggle.onclick=()=>{readingMenu.hidden=!readingMenu.hidden;readingToggle.setAttribute('aria-expanded',String(!readingMenu.hidden));};
 readingSize.onchange=()=>{try{App.saveSettings({textSize:Number(readingSize.value)});document.getElementById('book-reading-status').textContent=tr('Đã lưu cỡ chữ','Schriftgröße gespeichert','Text size saved');}catch(error){document.getElementById('book-reading-status').textContent=error.message;}};
 document.addEventListener('click',e=>{if(!reading.contains(e.target)){readingMenu.hidden=true;readingToggle.setAttribute('aria-expanded','false');}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){readingMenu.hidden=true;readingToggle.setAttribute('aria-expanded','false');}});
 const avatar=document.getElementById('user-button');document.getElementById('book-account-toggle').append(avatar);avatar.onclick=null;avatar.setAttribute('aria-label','Tài khoản');avatar.setAttribute('aria-expanded','false');
 document.getElementById('book-account-toggle').onclick=()=>{const menu=document.getElementById('book-account-menu');menu.hidden=!menu.hidden;avatar.setAttribute('aria-expanded',String(!menu.hidden));};
 document.getElementById('book-logout').onclick=()=>Account.logout();
 const footer=document.createElement('footer');footer.className='book-footer';footer.innerHTML=`<button id="book-menu-toggle" type="button" aria-label="Chương trình" aria-expanded="false" aria-controls="book-programs"><span></span><span></span><span></span></button><span><strong>ELIO EINFACH</strong> · DEIN KLEINER BEGLEITER</span><a href="history.html" class="book-history-link">↶ ${esc(App.t('progress'))}</a><nav id="book-programs" class="book-programs" aria-label="Chương trình" hidden><div class="book-menu-title">CHƯƠNG TRÌNH <button id="book-menu-close" type="button" aria-label="Đóng menu">×</button></div>${modules.map(([url,title])=>`<a href="${url}">${title}</a>`).join('')}<a href="tutor.html">AI Tutor</a>${admin()?'<a href="admin.html">Weitere Projekte</a>':''}<div class="book-menu-settings"></div></nav>`;
 document.querySelectorAll('body>footer').forEach(el=>el.hidden=true);shell.append(footer);
 const menu=document.getElementById('book-programs'),toggle=document.getElementById('book-menu-toggle');
 function closeMenu(){menu.hidden=true;toggle.setAttribute('aria-expanded','false');}
 toggle.onclick=()=>{menu.hidden=!menu.hidden;toggle.setAttribute('aria-expanded',String(!menu.hidden));};document.getElementById('book-menu-close').onclick=closeMenu;
 const settings=footer.querySelector('.book-menu-settings');for(const id of ['theme','ui-language','text-size-link','ai-settings']){const node=document.getElementById(id);if(node)settings.append(node);}
 document.addEventListener('click',e=>{if(!footer.contains(e.target))closeMenu();if(!shell.querySelector('.book-profile').contains(e.target)){document.getElementById('book-account-menu').hidden=true;avatar.setAttribute('aria-expanded','false');}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();document.getElementById('book-account-menu').hidden=true;avatar.setAttribute('aria-expanded','false');}});
 if(!home&&modules.some(m=>m[0]===file)){const crumb=document.createElement('nav');crumb.className='book-crumb';const current=modules.find(m=>m[0]===file)?.[1]||document.title.split('·')[0];crumb.innerHTML=`<a href="index.html#contents">Mục lục</a><span>/</span><strong>${esc(current)}</strong>`;main.prepend(crumb);}
 // Quiz uses the exact existing vocabulary and SRS engines, with the library kept mounted.
 if(file==='quiz.html'){
 root.classList.add('book-quiz');
 const level=document.getElementById('vocab-level'),practice=document.querySelector('.vocabulary-practice');
 if(level&&practice&&!document.getElementById('game-level')){const label=level.closest('label');practice.insertBefore(label,practice.querySelector('label'));}
 }else if(file==='wortschatz.html')root.classList.add('book-library');
 let panels;
 if(home){
 const old=document.createElement('div');old.className='book-dashboard-legacy';while(main.firstChild)old.append(main.firstChild);main.append(old);
 const landing=document.createElement('div');landing.className='book-home';landing.innerHTML=`<section data-book-screen="intro"><div class="book-spread"><div><span class="book-eyebrow">DEIN LERNRAUM</span><h1>Mỗi ngày,<br>một <i>trang mới.</i></h1><p class="book-intro-copy"></p><a class="book-start" href="index.html#contents">Học ngay ↗</a><p class="book-hand">Du schaffst das! ✧</p></div><figure class="book-painting"><div role="img" aria-label="Tranh học tiếng Đức"></div><figcaption>Jeden Tag ein wenig. Morgen eine neue Welt.</figcaption></figure></div><h2 class="book-chapter-heading">Những chương đang chờ bạn</h2><div class="book-home-grid">${links()}</div><section class="book-real-stats"></section></section><section data-book-screen="contents" class="book-contents" hidden><span class="book-eyebrow">DEINE KAPITEL</span><h1>Mục lục</h1><div class="book-toc">${links()}</div></section><section data-book-screen="study" class="book-study" hidden><span class="book-eyebrow">DEIN ATELIER</span><h1>Góc học của bạn</h1><div class="book-study-tabs" role="tablist" aria-label="Góc học"><button type="button" data-study-tab="history" role="tab" id="book-tab-history" aria-controls="book-panel-history">Lịch sử học</button><button type="button" data-study-tab="todo" role="tab" id="book-tab-todo" aria-controls="book-panel-todo">Việc cần làm</button><button type="button" data-study-tab="lessons" role="tab" id="book-tab-lessons" aria-controls="book-panel-lessons">Bài cần học</button><button type="button" data-study-tab="words" role="tab" id="book-tab-words" aria-controls="book-panel-words">Từ cần ôn</button></div><section id="book-panel-history" role="tabpanel" aria-labelledby="book-tab-history"></section><section id="book-panel-todo" role="tabpanel" aria-labelledby="book-tab-todo" hidden></section><section id="book-panel-lessons" role="tabpanel" aria-labelledby="book-tab-lessons" hidden></section><section id="book-panel-words" role="tabpanel" aria-labelledby="book-tab-words" hidden></section><details class="book-progress-details"><summary>Tiến độ & điểm cần ôn</summary><div id="book-progress-panels"></div></details></section><p class="book-bottom-slogan"></p>`;
 main.prepend(landing);panels=landing;
 const stats=old.querySelector('#dash-stats');landing.querySelector('.book-real-stats').append(stats);
 const dash=old.querySelector('.dash-side');if(dash)landing.querySelector('#book-progress-panels').append(dash);
 let selected='history';function showStudy(id){selected=id;landing.querySelectorAll('[data-study-tab]').forEach(b=>{const active=b.dataset.studyTab===id;b.setAttribute('aria-selected',String(active));});for(const key of ['history','todo','lessons','words'])document.getElementById('book-panel-'+key).hidden=key!==id;}
 landing.querySelectorAll('[data-study-tab]').forEach(b=>b.onclick=()=>showStudy(b.dataset.studyTab));showStudy(selected);
 const row=(title,note,url,action)=>`<div class="book-study-row"><div><strong>${esc(title)}</strong><small>${esc(note)}</small></div><a href="${url}">${esc(action||tr('Xem lại ↗','Ansehen ↗','Review ↗'))}</a></div>`;
 function renderStudy(){
 const writings=Object.values(Auth.get('writingFeedback',{})).flatMap(v=>v.attempts?.length?v.attempts:[v]).map(a=>({title:tr('Bài chữa viết','Schreibrückmeldung','Writing feedback'),time:a.updatedAt,url:'history.html?kind=writing'}));
 const grammar=Auth.get('grammarAttempts',[]).map(a=>({title:a.lessonTitle||a.tag||'Grammatik',time:a.time,url:'history.html?kind=grammar'}));
 const quizzes=Auth.get('history',[]).map(a=>({title:'Quiz · '+a.score+'/'+a.total,time:new Date(a.date).getTime(),url:'history.html?kind=quiz'}));
 const exams=Auth.get('examAttempts',[]).map(a=>({title:a.exam+' '+a.level,time:a.finishedAt||a.startedAt,url:'history.html?kind=exam'}));
 const chats=Object.values(Auth.get('conversations',{})).map(a=>({title:'Sprechen',time:a.updatedAt,url:'history.html?kind=chat'}));
 const history=[...writings,...grammar,...quizzes,...exams,...chats].sort((a,b)=>(b.time||0)-(a.time||0)).slice(0,5);
 document.getElementById('book-panel-history').innerHTML=(history.map(a=>row(a.title,a.time?new Date(a.time).toLocaleString(lang()):'',a.url)).join('')||'<p>'+esc(tr('Chưa có lịch sử. Hãy bắt đầu bài học đầu tiên.','Noch kein Lernverlauf. Beginne deine erste Lektion.','No history yet. Start your first lesson.'))+'</p>')+`<a class="book-text-link" href="history.html">${esc(tr('Xem toàn bộ lịch sử ↗','Gesamten Lernverlauf ansehen ↗','View all history ↗'))}</a>`;
 const drafts=Object.values(Auth.get('drafts',{})).filter(d=>typeof d==='string'?d.trim():d?.essay||d?.text),gs=Auth.get('grammarSession',{}),activeExam=Auth.get('activeExam',null);
 const tasks=[];if(drafts.length)tasks.push(row('Schreiben',tr('Tiếp tục bản nháp đã lưu','Gespeicherten Entwurf fortsetzen','Continue your saved draft'),'schreiben.html',tr('Viết tiếp ↗','Weiter ↗','Continue ↗')));if(gs.lessonId)tasks.push(row('Grammatik',tr('Tiếp tục bài đang học','Lektion fortsetzen','Resume your lesson'),'grammatik.html'));if(activeExam&&!activeExam.finished)tasks.push(row('Prüfungstraining',tr('Bài thi đang làm','Laufende Prüfung','Exam in progress'),'pruefung.html'));
 const cards=Auth.get('srs',{}),due=Object.values(cards).filter(c=>{const date=c.dueAt||c.due||c.dueDate||c.nextReview;if(!date)return true;return (typeof date==='number'?date:Date.parse(date))<=Date.now();}).length;
 if(due)tasks.push(row('Wortschatz',due+' '+tr('thẻ đến hạn ôn','fällige Karten','cards due'),'quiz.html#srs',tr('Ôn ngay ↗','Wiederholen ↗','Review ↗')));
 document.getElementById('book-panel-todo').innerHTML=tasks.join('')||'<p>'+esc(tr('Bạn chưa có bài đang làm. Chọn một chương để bắt đầu.','Wähle ein Kapitel und lege los.','Choose a chapter to get started.'))+'</p>';
 document.getElementById('book-panel-lessons').innerHTML=(gs.lessonId?row('Grammatik',tr('Bài đang học được tự lưu','Deine aktuelle Lektion ist gespeichert','Your current lesson is saved'),'grammatik.html'):'')+row('Schreiben',tr('Luyện viết và xem chữa bài','Schreiben üben und Feedback ansehen','Practice writing and review feedback'),'schreiben.html')+row('Sprechen',tr('Tiếp tục hội thoại cùng AI','Gespräch mit KI fortsetzen','Continue your AI conversation'),'sprechen.html');
 document.getElementById('book-panel-words').innerHTML=row('Wortschatz',due+' '+tr('thẻ đến hạn ôn','fällige Karten','cards due'),'quiz.html#srs',tr('Ôn ngay ↗','Wiederholen ↗','Review ↗'))+row('Quiz',tr('Chọn bộ từ để tạo trò chơi','Wähle deine Wortsammlung','Choose your vocabulary set'),'quiz.html',tr('Bắt đầu ↗','Starten ↗','Start ↗'));
 }
 for(const event of ['authchange','languagechange','cloudchange','progresschange'])document.addEventListener(event,renderStudy);renderStudy();
 function route(){const id=['contents','study'].includes(location.hash.slice(1))?location.hash.slice(1):'intro';landing.querySelectorAll('[data-book-screen]').forEach(p=>p.hidden=p.dataset.bookScreen!==id);document.querySelectorAll('[data-book-page]').forEach(a=>{if(a.dataset.bookPage===id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});}
 document.querySelectorAll('[data-book-page]').forEach(a=>a.onclick=e=>{e.preventDefault();const hash=a.dataset.bookPage==='intro'?'':a.dataset.bookPage;if(location.hash.slice(1)===hash)route();else location.hash=hash;});window.addEventListener('hashchange',route);route();
 }
 function appearance(){
 document.getElementById('book-profile-name').textContent=Account.displayName();readingSize.value=String(App.settings().textSize||16);readingToggle.setAttribute('aria-label',tr('Cỡ chữ','Schriftgröße','Text size'));document.getElementById('book-reading-label').textContent=tr('Cỡ chữ','Schriftgröße','Text size');
 const c=Account.config||{},brand=shell.querySelector('.book-brand');brand.querySelector('span').textContent=c.name||'Elio Einfach';if(c.logo){const mark=brand.querySelector('b');mark.replaceChildren();const img=document.createElement('img');img.src=c.logo;img.alt='';mark.append(img);}
 const slogan=tr('Học điều mới hôm nay, thay đổi ngày mai của bạn.','Lerne heute etwas Neues und verändere dein Morgen.','Learn something today and change your tomorrow.');shell.querySelector('.book-slogan').textContent=slogan;
 const navTexts=[tr('Lời mở đầu','Auftakt','Introduction'),tr('Mục lục','Inhalt','Contents'),tr('Góc học của bạn','Dein Lernraum','Your study space')];shell.querySelectorAll('[data-book-page]').forEach((a,i)=>a.textContent=navTexts[i]);
 if(home){panels.querySelector('.book-bottom-slogan').textContent=slogan;panels.querySelector('.book-intro-copy').textContent=c.intro||App.t('intro');panels.querySelector('[data-book-screen="intro"] h1').innerHTML=tr('Mỗi ngày,<br>một <i>trang mới.</i>','Jeden Tag<br>eine <i>neue Seite.</i>','Every day,<br>a <i>new page.</i>');panels.querySelector('.book-start').textContent=App.t('learn')+' ↗';panels.querySelector('.book-chapter-heading').textContent=tr('Những chương đang chờ bạn','Deine nächsten Kapitel','Your next chapters');panels.querySelector('[data-book-screen="contents"] h1').textContent=navTexts[1];panels.querySelector('[data-book-screen="study"] h1').textContent=navTexts[2];const names=[tr('Lịch sử học','Lernverlauf','History'),tr('Việc cần làm','Aufgaben','To do'),tr('Bài cần học','Weiterlernen','Lessons'),tr('Từ cần ôn','Wiederholen','Review words')];panels.querySelectorAll('[data-study-tab]').forEach((b,i)=>b.textContent=names[i]);}
 }
 for(const event of ['languagechange','cloudchange','authchange'])document.addEventListener(event,appearance);appearance();
 // Mobile studio is a real presentation of existing learning data, not the demo's sample data.
 const studioIcon=name=>{const paths={menu:'M4 6h16M4 12h16M4 18h16',home:'m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8',book:'M12 6c-3-3-8-3-10-2v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 2Zm0 0v15',layers:'m12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 16l10 5 10-5',quiz:'M9 3H4v5h5V3ZM20 3h-5v5h5V3ZM9 15H4v5h5v-5ZM17 13v8M13 17h8',pen:'m15 3 6 6-12 12H3v-6L15 3ZM12 6l6 6',mic:'M12 16a4 4 0 0 0 4-4V6a4 4 0 0 0-8 0v6a4 4 0 0 0 4 4ZM4 11v1a8 8 0 0 0 16 0v-1M12 20v3M8 23h8',clock:'M12 8v5l3 2M9 2h6M12 2v3M19 5l2 2M21 14a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',headphones:'M3 14v-3a9 9 0 0 1 18 0v3M3 12h4v9H3v-9ZM17 12h4v9h-4v-9',arrow:'M5 12h14m-5-5 5 5-5 5',grid:'M3 3h7v7H3V3ZM14 3h7v7h-7V3ZM3 14h7v7H3v-7ZM14 14h7v7h-7v-7',check:'m5 12 4 4L19 6',settings:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2'};return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+(paths[name]||paths.book)+'"/></svg>';};
 const mobileTitles=()=>({
  'index.html':tr('Tổng quan','Übersicht','Overview'),'grammatik.html':tr('Ngữ pháp','Grammatik','Grammar'),
  'wortschatz.html':tr('Từ vựng','Wortschatz','Vocabulary'),'quiz.html':'Quiz','schreiben.html':tr('Luyện viết','Schreiben','Writing'),
  'sprechen.html':tr('Luyện nói','Sprechen','Speaking'),'hoeren.html':tr('Luyện nghe','Hören','Listening'),
  'pruefung.html':tr('Thi thử','Prüfung','Exam practice'),'tutor.html':'AI Tutor','settings.html':tr('Cài đặt','Einstellungen','Settings'),
  'history.html':tr('Lịch sử học','Lernverlauf','History'),'admin.html':tr('Quản trị','Verwaltung','Administration')});
 const mobileDescriptions=()=>({
  'grammatik.html':tr('Hiểu quy tắc, vững từng câu.','Regeln verstehen. Sicher anwenden.','Understand rules. Build better sentences.'),
  'wortschatz.html':tr('Bộ từ, ví dụ và lịch ôn của bạn.','Deine Wörter und Wiederholungen.','Your words, examples and reviews.'),
  'quiz.html':tr('Chọn bộ từ và chơi để nhớ lâu.','Wortsammlung wählen und üben.','Choose a set and learn through play.'),
  'schreiben.html':tr('Viết rõ ý, hiểu từng lỗi sai.','Schreiben und aus Fehlern lernen.','Write clearly. Learn from corrections.'),
  'sprechen.html':tr('Trò chuyện và luyện nói cùng AI.','Mit KI ins Gespräch kommen.','Speak and practice with AI.'),
  'pruefung.html':tr('Goethe · telc · ÖSD.','Goethe · telc · ÖSD.','Goethe · telc · ÖSD.'),
  'hoeren.html':tr('Nghe từng câu, chép và đối chiếu.','Satz für Satz hören und schreiben.','Listen, transcribe and compare.')});
 const iconNames=['book','layers','quiz','pen','mic','clock','headphones'];
 const mobileLinks=()=>modules.map(([url],i)=>'<a class="studio-module" href="'+url+'"><span class="studio-module-icon">'+studioIcon(iconNames[i])+'</span><span><strong>'+esc(mobileTitles()[url])+'</strong><small>'+esc(mobileDescriptions()[url])+'</small></span><span class="studio-arrow" aria-hidden="true">↗</span></a>').join('');
 const studioBar=document.createElement('div');studioBar.className='studio-mobile-bar';
 studioBar.innerHTML='<button type="button" id="studio-menu-toggle" aria-expanded="false" aria-controls="studio-mobile-menu" aria-label="'+tr('Mở chương trình','Programme öffnen','Open programs')+'">'+studioIcon('menu')+'</button><a href="index.html" class="studio-mobile-brand"><b>e</b><span><strong>Elio Einfach</strong><small id="studio-current-page"></small></span></a>';
 shell.querySelector('.book-nav').prepend(studioBar);
 const mobileMenu=document.createElement('nav');mobileMenu.id='studio-mobile-menu';mobileMenu.className='studio-mobile-menu';mobileMenu.hidden=true;
 mobileMenu.setAttribute('aria-label',tr('Chương trình học','Lernprogramme','Learning programs'));
 shell.querySelector('.book-nav').after(mobileMenu);
 const menuButton=studioBar.querySelector('button');
 function closeStudioMenu(){mobileMenu.hidden=true;menuButton.setAttribute('aria-expanded','false');}
 menuButton.onclick=()=>{mobileMenu.hidden=!mobileMenu.hidden;menuButton.setAttribute('aria-expanded',String(!mobileMenu.hidden));};
 mobileMenu.addEventListener('click',event=>{if(event.target.closest('a'))closeStudioMenu();});
 document.addEventListener('click',event=>{if(!mobileMenu.contains(event.target)&&!studioBar.contains(event.target))closeStudioMenu();});
 document.addEventListener('keydown',event=>{if(event.key==='Escape')closeStudioMenu();});
 const mobileBottom=document.createElement('nav');mobileBottom.className='studio-mobile-bottom';mobileBottom.setAttribute('aria-label',tr('Không gian học','Lernraum','Study space'));shell.append(mobileBottom);
 function updateMobileChrome(){
  const titles=mobileTitles(),screen=home?location.hash.slice(1):'';
  const title=screen==='contents'?tr('Mục lục','Inhalt','Contents'):screen==='study'?tr('Góc học','Lernraum','Study space'):titles[file]||'Elio Einfach';
  document.getElementById('studio-current-page').textContent=title;
  mobileMenu.innerHTML='<div class="studio-menu-links">'+modules.map(([url],i)=>'<a href="'+url+'"'+(url===file?' aria-current="page"':'')+'>'+studioIcon(iconNames[i])+esc(titles[url])+'</a>').join('')+'<a href="tutor.html">'+studioIcon('mic')+'AI Tutor</a><a href="settings.html">'+studioIcon('settings')+esc(titles['settings.html'])+'</a>'+(admin()?'<a href="admin.html">'+studioIcon('grid')+esc(titles['admin.html'])+'</a>':'')+'</div><div class="studio-menu-tools"></div>';
  mobileBottom.innerHTML=[['index.html','home',titles['index.html'],'intro'],['index.html#contents','grid',tr('Mục lục','Inhalt','Contents'),'contents'],['index.html#study','book',tr('Góc học','Lernraum','Study space'),'study']].map(([url,icon,label,key])=>'<a href="'+url+'"'+(home&&(screen||'intro')===key?' aria-current="page"':'')+'>'+studioIcon(icon)+'<span>'+esc(label)+'</span></a>').join('');
  const logo=Account.config?.logo,brand=studioBar.querySelector('b');
  if(logo){const image=document.createElement('img');image.src=logo;image.alt='';brand.replaceChildren(image);}else brand.textContent='e';
  studioBar.querySelector('strong').textContent=Account.config?.name||'Elio Einfach';
 }
 updateMobileChrome();
 // Move, rather than duplicate, the original theme/language controls and their handlers.
 const phoneLayout=window.matchMedia('(max-width:700px)'),studioControls=[];
 for(const id of ['theme','ui-language','text-size-link','ai-settings']){const node=document.getElementById(id);if(node)studioControls.push({node,parent:node.parentElement});}
 function placeStudioControls(){for(const {node,parent} of studioControls){const target=phoneLayout.matches?mobileMenu.querySelector('.studio-menu-tools'):parent;if(target)target.append(node);}}
 placeStudioControls();phoneLayout.addEventListener('change',placeStudioControls);
 function refreshStudio(){updateMobileChrome();placeStudioControls();if(home)renderMobileDashboard();}
 for(const event of ['languagechange','cloudchange','authchange','progresschange'])document.addEventListener(event,refreshStudio);
 window.addEventListener('hashchange',()=>{updateMobileChrome();placeStudioControls();closeStudioMenu();});
 // Keep the same module nodes and handlers; only fold configuration above the lesson on phones.
 const studioFolds=[];
 for(const workspace of main.querySelectorAll('.workspace')){
  const aside=Array.from(workspace.children).find(node=>node.tagName==='ASIDE');if(!aside)continue;
  const fold=document.createElement('details');fold.className='studio-module-tools';fold.open=!phoneLayout.matches;
  const summary=document.createElement('summary');summary.textContent=tr('Chọn bài · Tài liệu & tùy chọn','Aufgabe · Materialien & Optionen','Task · Materials & options');
  aside.before(fold);fold.append(summary,aside);studioFolds.push(fold);
 }
 phoneLayout.addEventListener('change',()=>{for(const fold of studioFolds)fold.open=!phoneLayout.matches;});
 let mobileDashboard=null;
 if(home){
  mobileDashboard=document.createElement('section');mobileDashboard.className='studio-mobile-home';mobileDashboard.setAttribute('aria-label',tr('Tổng quan học tập','Lernübersicht','Learning overview'));
  panels.querySelector('[data-book-screen="intro"]').prepend(mobileDashboard);
  renderMobileDashboard();
 }
 function renderMobileDashboard(){
  if(!mobileDashboard)return;
  const titles=mobileTitles(),stats=App.stats(),drafts=Auth.get('drafts',{}),hasDraft=Object.values(drafts).some(value=>typeof value==='string'?value.trim():value?.essay||value?.text),session=Auth.get('grammarSession',{});
  const resume=hasDraft?'schreiben.html':session.lessonId?'grammatik.html':'index.html#contents';
  const action=hasDraft?tr('Viết tiếp bài của bạn','Weiterschreiben','Continue your writing'):session.lessonId?tr('Học tiếp bài đang dở','Lektion fortsetzen','Resume your lesson'):tr('Bắt đầu học','Jetzt lernen','Start learning');
  const caption=hasDraft?tr('Bản nháp vẫn ở đây. Tiếp tục từ nơi bạn dừng lại.','Dein Entwurf wartet. Mach dort weiter, wo du aufgehört hast.','Your draft is here. Pick up where you left off.'):tr('Chọn một chương và học theo nhịp của bạn.','Wähle ein Kapitel und lerne in deinem Tempo.','Choose a chapter and learn at your own pace.');
  const pending=document.getElementById('book-panel-todo')?.innerHTML||'',name=Account.displayName();
  mobileDashboard.innerHTML='<div class="studio-greeting"><p>'+esc(tr('Chào '+name+'. Hôm nay học thêm một chút nhé.','Hallo '+name+'. Zeit für ein neues Kapitel.','Hello '+name+'. A little learning today.'))+'</p><h1>'+tr('Từng ngày,<br>một chương mới.','Jeden Tag<br>ein neues Kapitel.','A new chapter,<br>every day.')+'</h1></div><section class="studio-resume"><figure class="studio-home-art"><div role="img" aria-label="Tranh bầu trời sao và cánh đồng hướng dương Elio"></div><figcaption>Ein neuer Tag. Ein neues Kapitel.</figcaption></figure><div class="studio-resume-copy"><span class="studio-kicker">ELIO · DEIN LERNRAUM</span><h2>'+tr('Ý tưởng của bạn.<br>Tiếng Đức của bạn.','Deine Gedanken.<br>Dein Deutsch.','Your thoughts.<br>Your German.')+'</h2><p>'+esc(caption)+'</p><a href="'+resume+'" class="studio-primary">'+esc(action)+studioIcon('arrow')+'</a></div></section><div class="studio-section-title"><h2>'+tr('Những chương của bạn','Deine Kapitel','Your chapters')+'</h2></div><div class="studio-module-grid">'+mobileLinks()+'</div><section class="studio-today"><header><h2>'+tr('Cho hôm nay','Für heute','For today')+'</h2><a href="index.html#study">'+tr('Xem tất cả','Alles ansehen','View all')+' ↗</a></header><div class="studio-live-tasks">'+pending+'</div></section><section class="studio-live-stats" aria-label="'+tr('Tiến độ học thực tế','Dein Lernfortschritt','Your learning progress')+'"><div><strong>'+esc(String(stats.streak??0))+'</strong><small>'+esc(App.t('streak'))+'</small></div><div><strong>'+esc(String(stats.xp??0))+'</strong><small>XP</small></div><div><strong>'+esc(String(stats.mastered??0))+'</strong><small>'+esc(App.t('mastered'))+'</small></div></section><figure class="studio-study-art"><div role="img" aria-label="Góc học trong tranh Elio"></div></figure><blockquote class="studio-motivation">'+esc(tr('Học điều mới hôm nay, thay đổi ngày mai của bạn.','Lerne heute etwas Neues und verändere dein Morgen.','Learn something today and change your tomorrow.'))+'</blockquote>';
 }

 if(file==='history.html'){const kind=new URLSearchParams(location.search).get('kind'),select=document.getElementById('history-kind');if(kind&&select&&Array.from(select.options).some(o=>o.value===kind)){select.value=kind;select.dispatchEvent(new Event('change'));}}
 if(file==='quiz.html'&&location.hash==='#srs')document.getElementById('tab-srs')?.click();
 // Middle content frames stay square; only the final visible outer frame closes the screen.
 const frameSelector='.panel,.exam-setup,.exam-selection-actions,.format-module,.vocab-deck-details,.lesson-reader,.exam-paper,.yt-card';
 function markLastFrame(){
  const candidates=Array.from(main.querySelectorAll(frameSelector)).filter(node=>!node.parentElement?.closest(frameSelector));
  const visible=node=>{for(let p=node;p&&p!==main.parentElement;p=p.parentElement){if(p.hidden||p.getAttribute('aria-hidden')==='true')return false;if(typeof getComputedStyle==='function'&&getComputedStyle(p).display==='none')return false;}return true;};
  const last=candidates.reverse().find(visible);
  main.querySelectorAll('.book-last-frame').forEach(node=>{if(node!==last)node.classList.remove('book-last-frame');});
  if(last&&!last.classList.contains('book-last-frame'))last.classList.add('book-last-frame');
 }
 let frameQueued=false;function queueFrames(){if(frameQueued)return;frameQueued=true;(typeof requestAnimationFrame==='function'?requestAnimationFrame:fn=>Promise.resolve().then(fn))(()=>{frameQueued=false;markLastFrame();});}
 if(typeof MutationObserver==='function')new MutationObserver(records=>{if(records.some(r=>r.type==='attributes'||[...r.addedNodes,...r.removedNodes].some(n=>n.nodeType===1&&(n.matches?.(frameSelector)||n.querySelector?.(frameSelector)))))queueFrames();}).observe(main,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','aria-hidden']});
 for(const event of ['click','change'])main.addEventListener(event,queueFrames);
 window.addEventListener('resize',queueFrames);markLastFrame();
 window.ElioBookReady=true;
 document.addEventListener('elioviewresume',()=>App.apply());
 if(typeof ElioNavigation!=='undefined')ElioNavigation.install();
})();

