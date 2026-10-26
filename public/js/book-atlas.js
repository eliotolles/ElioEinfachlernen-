'use strict';
// The book's index describes destinations only. Learning data and module engines
// remain owned by their existing pages; this adapter never writes account state.
const ElioBookAtlas=(()=>{
 const groups=[
  {id:'foundation',number:'I',title:['Nền tảng ngôn ngữ','Sprachfundament','Language foundations'],note:['Hiểu quy tắc. Tích lũy từng từ.','Regeln verstehen. Wörter sammeln.','Understand rules. Collect words.']},
  {id:'practice',number:'II',title:['Sử dụng tiếng Đức','Deutsch im Alltag','Use your German'],note:['Nghe, nói, viết và giao tiếp.','Hören, sprechen, schreiben.','Listen, speak, write and converse.']},
  {id:'exams',number:'III',title:['Luyện thi & ôn tập','Prüfen & wiederholen','Practice & review'],note:['Củng cố kiến thức, chuẩn bị kỳ thi.','Wissen festigen. Prüfungen vorbereiten.','Consolidate learning. Prepare for exams.']},
  {id:'personal',number:'IV',title:['Những trang của bạn','Deine eigenen Seiten','Your own pages'],note:['Tiến độ, lịch sử và cài đặt.','Fortschritt, Verlauf und Einstellungen.','Progress, history and settings.']}
 ];
 const entries=[
  ['grammar','foundation','grammatik.html',['Ngữ pháp','Grammatik','Grammar'],['Bài giảng, ví dụ, sơ đồ và bài tập theo cấp độ.','Erklärungen, Beispiele, Mindmaps und Übungen.','Lessons, examples, mind maps and exercises.']],
  ['vocabulary','foundation','wortschatz.html',['Từ vựng','Wortschatz','Vocabulary'],['Bộ từ, nghĩa, ví dụ và những từ bạn đã lưu.','Wortsammlungen, Bedeutungen und Beispiele.','Word collections, meanings and saved words.']],
  ['atelier','foundation','lernen.html',['Học & khám phá','Lernatelier','Learning atelier'],['Mẫu câu, phát âm, văn hóa, tra từ và trò chơi.','Satzmuster, Aussprache, Kultur und Spiele.','Sentence patterns, pronunciation, culture and games.']],
  ['listening','practice','hoeren.html',['Nghe & chép chính tả','Hören & Diktat','Listening & dictation'],['Video, phụ đề, nghe từng câu và shadowing.','Videos, Untertitel, Diktat und Shadowing.','Videos, subtitles, sentence practice and shadowing.']],
  ['writing','practice','schreiben.html',['Luyện viết','Schreiben','Writing'],['Chọn đề, viết bài và xem phân tích, chữa lỗi chi tiết.','Aufgaben, Entwürfe und ausführliche Korrekturen.','Writing tasks, drafts and detailed corrections.']],
  ['speaking','practice','sprechen.html',['Luyện nói','Sprechen','Speaking'],['Hội thoại, luyện đề nói và phân tích bài nói.','Gespräche, Prüfungsaufgaben und Rückmeldungen.','Conversations, speaking tasks and feedback.']],
  ['tutor','practice','tutor.html',['Giao tiếp & AI Tutor','Gespräche & KI-Tutor','Conversations & AI Tutor'],['Các bộ giao tiếp, câu trả lời mẫu và trợ lý học tập.','Gesprächssammlungen, Musterantworten und Lernhilfe.','Conversation collections, sample answers and learning support.']],
  ['exam','exams','pruefung.html',['Luyện thi','Prüfungstraining','Exam practice'],['Chọn kỳ thi → cấp độ → bộ đề → kỹ năng.','Prüfung → Niveau → Sammlung → Fertigkeit.','Exam → level → collection → skill.']],
  ['review','exams','quiz.html',['Ôn từ & Quiz','Wiederholen & Quiz','Word review & Quiz'],['Flashcard, lịch ôn SRS và các trò luyện từ.','Karteikarten, SRS und Wortspiele.','Flashcards, SRS reviews and vocabulary games.']],
  ['study','personal','index.html#study',['Góc học của bạn','Dein Lernraum','Your study space'],['Việc đang làm, bài cần học và từ đến hạn ôn.','Offene Aufgaben, Lektionen und fällige Karten.','Unfinished work, lessons and words due for review.']],
  ['history','personal','history.html',['Lịch sử & bài đã chữa','Verlauf & Korrekturen','History & corrections'],['Mở lại bài làm, kết quả và nhận xét đã lưu.','Gespeicherte Arbeiten, Ergebnisse und Rückmeldungen.','Saved work, results and feedback.']],
  ['settings','personal','settings.html',['Cài đặt & đồng bộ','Einstellungen & Sync','Settings & sync'],['Tài khoản, ngôn ngữ, giao diện và đồng bộ.','Konto, Sprache, Darstellung und Synchronisierung.','Account, language, appearance and synchronization.']],
  ['admin','personal','admin.html',['Quản trị','Verwaltung','Administration'],['Nội dung dùng chung, tài khoản và cấu hình AI.','Gemeinsame Inhalte, Konten und KI-Konfiguration.','Shared content, accounts and AI configuration.'],true]
 ].map(([id,group,url,title,note,admin=false])=>({id,group,url,title,note,admin}));
 const pick=(value,language='vi')=>value[{vi:0,de:1,en:2}[language]??0];
 function search(query,language='vi',administrator=false){const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase();const words=normalize(query).trim().split(/\s+/).filter(Boolean);return entries.filter(e=>(!e.admin||administrator)&&words.every(w=>normalize([...e.title,...e.note,e.id].join(' ')).includes(w)));}
 function current(path,hash=''){const file=path.split('/').pop()||'index.html';return entries.find(e=>e.url===file+hash)||entries.find(e=>e.url.split('#')[0]===file&&e.id!=='study')||null;}
 return {groups,entries,pick,search,current};
})();

(()=>{
 if(typeof Account==='undefined'||!Account.current()||!window.ElioBookReady)return;
 const A=ElioBookAtlas,main=document.querySelector('.book-shell>main'),shell=document.querySelector('.book-shell');if(!main||!shell)return;
 document.body.classList.add('book-atlas');
 const language=()=>App.settings().language||'vi',t=(vi,de,en)=>A.pick([vi,de,en],language()),text=v=>esc(A.pick(v,language()));
 const isAdmin=()=>Account.profile?.role==='super_admin',visible=()=>A.entries.filter(e=>!e.admin||isAdmin());
 const file=location.pathname.split('/').pop()||'index.html',home=file==='index.html';
 const groupOf=e=>A.groups.find(g=>g.id===e?.group);
 function entryHTML(e){return `<a class="atlas-entry" href="${e.url}" data-atlas-entry="${e.id}"${e.url.split('#')[0]===file&&(!home||location.hash==='#study')?' aria-current="page"':''}><span class="atlas-entry-copy"><strong>${text(e.title)}</strong><small>${text(e.note)}</small></span><span class="atlas-entry-arrow" aria-hidden="true">↗</span></a>`;}
 function groupHTML(g,rows,ids=false){return `<section class="atlas-chapter"${ids?` id="atlas-${g.id}"`:""}><header><span>${g.number}</span><div><h2>${text(g.title)}</h2><p>${text(g.note)}</p></div></header><div class="atlas-entries">${rows.map(entryHTML).join('')}</div></section>`;}
 function groupedHTML(rows,ids=false){return A.groups.map(g=>{const list=rows.filter(e=>e.group===g.id);return list.length?groupHTML(g,list,ids):'';}).join('');}
 const jump=document.createElement('button');jump.type='button';jump.className='atlas-search-toggle';jump.setAttribute('data-atlas-search','');shell.querySelector('.book-profile').prepend(jump);
 const dialog=document.createElement('dialog');dialog.className='atlas-dialog';dialog.setAttribute('aria-labelledby','atlas-search-title');dialog.innerHTML='<header><h2 id="atlas-search-title"></h2><button type="button" data-atlas-close></button></header><label for="atlas-search"></label><input id="atlas-search" type="search" autocomplete="off"><p class="atlas-search-help"></p><nav class="atlas-search-results" aria-label="Elio"></nav><p class="atlas-search-count" role="status" aria-live="polite"></p>';shell.append(dialog);
 let returnFocus=null;
 function closeSearch(){dialog.close();returnFocus?.focus();}
 function searchResults(){const rows=A.search(dialog.querySelector('input').value,language(),isAdmin());dialog.querySelector('.atlas-search-results').innerHTML=rows.map(entryHTML).join('');dialog.querySelector('.atlas-search-count').textContent=rows.length?t(rows.length+' mục trong quyển sách',rows.length+' Einträge',rows.length+' destinations'):t('Không tìm thấy. Thử “viết”, “nghe” hoặc “ngữ pháp”.','Keine Treffer. Versuche „Schreiben“ oder „Grammatik“.','No matches. Try “writing”, “listening” or “grammar”.');}
 function openSearch(){returnFocus=document.activeElement;dialog.querySelector('input').value='';searchResults();dialog.showModal();dialog.querySelector('input').focus();}
 window.addEventListener('click',event=>{if(event.target.closest?.('a')&&dialog.contains(event.target)&&dialog.open)closeSearch();},true);
 jump.onclick=openSearch;dialog.querySelector('[data-atlas-close]').onclick=closeSearch;dialog.querySelector('input').oninput=searchResults;dialog.addEventListener('cancel',event=>{event.preventDefault();closeSearch();});dialog.addEventListener('click',event=>{if(event.target===dialog)closeSearch();else if(event.target.closest('a'))closeSearch();});
 document.addEventListener('keydown',event=>{if(event.key==='/'&&!event.ctrlKey&&!event.altKey&&!event.metaKey&&!event.target.closest('input,textarea,select,[contenteditable="true"]')){event.preventDefault();if(!dialog.open)openSearch();}});
 const toc=main.querySelector('.book-toc');let contentsSearch=null;
 if(toc){
  toc.classList.add('atlas-toc');
  const tools=document.createElement('div');tools.className='atlas-toc-tools';tools.innerHTML='<label for="atlas-contents-search"></label><input type="search" id="atlas-contents-search" autocomplete="off"><p role="status" aria-live="polite"></p>';toc.before(tools);contentsSearch=tools.querySelector('input');
  const guide=document.createElement('nav');guide.className='atlas-chapter-index';toc.before(guide);
  const intro=document.createElement('p');intro.className='atlas-toc-intro';main.querySelector('[data-book-screen="contents"] h1').after(intro);
  const bookmark=document.createElement('div');bookmark.className='atlas-bookmark';intro.after(bookmark);
  function filterContents(){const rows=A.search(contentsSearch.value,language(),isAdmin());toc.innerHTML=groupedHTML(rows,true);tools.querySelector('[role="status"]').textContent=rows.length?'':t('Không tìm thấy mục phù hợp.','Keine passenden Kapitel.','No matching chapters.');}
  contentsSearch.oninput=filterContents;
  guide.addEventListener('click',event=>{const link=event.target.closest('[data-atlas-group]');if(!link)return;event.preventDefault();event.stopPropagation();contentsSearch.value='';filterContents();const section=document.getElementById('atlas-'+link.dataset.atlasGroup);section?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});section?.querySelector('a')?.focus({preventScroll:true});});
  contentsSearch.refresh=()=>{tools.querySelector('label').textContent=t('Tìm trong mục lục','Im Inhaltsverzeichnis suchen','Search the contents');contentsSearch.placeholder=t('Ví dụ: ngữ pháp, giao tiếp, thi thử…','Zum Beispiel: Grammatik, Gespräche, Prüfung…','For example: grammar, conversation, exams…');intro.textContent=t('Một quyển sách, bốn phần. Chọn điều bạn muốn học; bài đang làm vẫn chờ bạn.','Ein Buch, vier Teile. Deine offene Arbeit wartet auf dich.','One book, four parts. Your unfinished work stays with you.');guide.setAttribute('aria-label',t('Các phần trong sách','Buchteile','Book sections'));guide.innerHTML=A.groups.map(g=>`<button type="button" data-atlas-group="${g.id}"><span>${g.number}</span>${text(g.title)}</button>`).join('');
   const exam=Auth.get('activeExam',null),grammar=Auth.get('grammarSession',{}),drafts=Auth.get('drafts',{}),unfinished=[];
   if(exam&&!exam.finished)unfinished.push(['pruefung.html',t('Tiếp tục bài thi','Prüfung fortsetzen','Resume your exam')]);
   if(grammar.lessonId)unfinished.push(['grammatik.html',t('Học tiếp ngữ pháp','Grammatik fortsetzen','Resume grammar')]);
   if(Object.values(drafts).some(v=>typeof v==='string'?v.trim():v?.essay||v?.text))unfinished.push(['schreiben.html',t('Viết tiếp bản nháp','Entwurf fortsetzen','Continue your draft')]);
   bookmark.hidden=!unfinished.length;bookmark.innerHTML='<span>'+t('Dấu trang của bạn','Deine Lesezeichen','Your bookmarks')+'</span>'+unfinished.map(([url,label])=>`<a href="${url}">${esc(label)} ↗</a>`).join('');filterContents();};
 }
 const leafNav=document.createElement('nav');leafNav.className='atlas-leaf-nav';leafNav.setAttribute('aria-label',t('Điều hướng chương','Kapitelnavigation','Chapter navigation'));
 if(!home){main.querySelector('.book-crumb')?.remove();main.prepend(leafNav);}
 function updateLeaf(){
  if(home)return;const e=A.current(location.pathname,location.hash),g=groupOf(e);if(!e)return;
  const siblings=visible().filter(x=>x.group===e.group&&x.id!==e.id);
  leafNav.innerHTML=`<div class="atlas-crumb"><a href="index.html#contents">${t('Mục lục','Inhalt','Contents')}</a><span aria-hidden="true">/</span><span>${g.number} · ${text(g.title)}</span><span aria-hidden="true">/</span><strong aria-current="page">${text(e.title)}</strong></div><div class="atlas-leaf-tools"><span>${t('Cùng phần này','In diesem Teil','In this part')}</span>${siblings.map(x=>`<a href="${x.url}">${text(x.title)}</a>`).join('')}<button type="button" data-atlas-open>${t('Tra mục lục','Kapitel finden','Find a chapter')} <kbd>/</kbd></button></div>`;
  leafNav.querySelector('button').onclick=openSearch;
 }
 // These are navigation containers only; no exercise, editor, media, feedback,
 // original settings control, or task input is replaced or cloned.
 function refresh(){
  jump.textContent=t('Tra mục lục','Kapitel finden','Find a chapter');jump.setAttribute('aria-label',t('Tra nhanh mục lục, phím /','Kapitel finden, Taste /','Find a chapter, / key'));
  dialog.querySelector('h2').textContent=t('Bạn muốn mở trang nào?','Welche Seite suchst du?','Which page would you like?');dialog.querySelector('[data-atlas-close]').textContent=t('Đóng','Schließen','Close');dialog.querySelector('label').textContent=t('Tìm trang học','Lernseite suchen','Find a learning page');dialog.querySelector('input').placeholder=t('Nhập tên hoặc việc muốn làm…','Name oder Lernziel eingeben…','Type a name or learning goal…');dialog.querySelector('.atlas-search-help').textContent=t('Tra đường đi trong Elio. Nội dung trong từng bộ vẫn nằm ở trang học tương ứng.','Finde deinen Weg durch Elio. Sammlungen bleiben auf ihren Lernseiten.','Find your way around Elio. Collections remain on their learning pages.');
  contentsSearch?.refresh();searchResults();updateLeaf();
  for(const grid of main.querySelectorAll('.book-home-grid,.studio-module-grid'))grid.innerHTML=visible().filter(e=>!['personal'].includes(e.group)).map(entryHTML).join('');
  const program=document.getElementById('book-programs');if(program){
   let list=program.querySelector('.atlas-program-links');if(!list){list=document.createElement('div');list.className='atlas-program-links';for(const child of [...program.children])if(!child.matches('.book-menu-title,.book-menu-settings'))child.remove();program.querySelector('.book-menu-settings').before(list);}list.innerHTML=groupedHTML(visible());
   const title=program.querySelector('.book-menu-title');if(title?.firstChild?.nodeType===3)title.firstChild.textContent=t('MỤC LỤC ','INHALT ','CONTENTS ');
  }
  const mobile=document.querySelector('#studio-mobile-menu .studio-menu-links');if(mobile){mobile.classList.add('atlas-mobile-links');mobile.innerHTML=groupedHTML(visible());}
  const page=document.getElementById('studio-current-page'),e=A.current(location.pathname,location.hash);if(page&&e&&!home)page.textContent=A.pick(e.title,language());
 }
 // Existing listeners refresh their chrome first, then this one consistently
 // applies the same index to desktop, mobile and module navigation.
 for(const event of ['languagechange','cloudchange','authchange','progresschange'])document.addEventListener(event,refresh);
 window.addEventListener('hashchange',refresh);refresh();
 const menu=document.getElementById('book-programs');menu?.addEventListener('click',event=>{if(event.target.closest('a')){menu.hidden=true;document.getElementById('book-menu-toggle')?.setAttribute('aria-expanded','false');}});
})();
