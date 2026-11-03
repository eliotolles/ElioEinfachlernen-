'use strict';
// Catalogue presentation only. Exercises, ownership, sync and grading stay in grammar.js.
function grammarAtlasLabels(){
 const language=App.settings().language;
 return {vi:{groups:[['words','I · Danh từ, tính từ & các cách'],['verbs','II · Động từ, thì & thể'],['relations','III · Thời gian, nơi chốn & quan hệ'],['sentences','IV · Câu & liên kết ý']],imported:'Tài liệu & giáo trình',empty:'Không có bài khớp. Thử bỏ bớt bộ lọc.',search:'Tìm chủ điểm Đức–Việt',source:'Tủ sách',atlas:'Bài giảng Việt–Đức',mine:'Tài liệu đã nhập & bài cũ',all:'Tất cả nguồn',group:'Nhóm chủ điểm',allGroups:'Tất cả nhóm',resume:'Tiếp tục bài đang học',next:'Bài kế tiếp',contents:'Mục lục chương',count:'chủ điểm',done:'đã hoàn thành'},de:{groups:[['words','I · Nomen, Adjektive & Kasus'],['verbs','II · Verben, Zeiten & Formen'],['relations','III · Zeit, Ort & Beziehungen'],['sentences','IV · Sätze & Verknüpfungen']],imported:'Importe & bisherige Lehrwerke',empty:'Keine Treffer. Filter zurücksetzen.',search:'Grammatikthema suchen',source:'Bibliothek',atlas:'Überarbeitete Lernkapitel',mine:'Importe & bisherige Lektionen',all:'Alle Quellen',group:'Themengruppe',allGroups:'Alle Gruppen',resume:'Lektion fortsetzen',next:'Nächste Lektion',contents:'Kapitelinhalt',count:'Themen',done:'abgeschlossen'},en:{groups:[['words','I · Nouns, adjectives & cases'],['verbs','II · Verbs, tenses & voice'],['relations','III · Time, place & relations'],['sentences','IV · Sentences & connections']],imported:'Imports & earlier books',empty:'No matches. Try fewer filters.',search:'Search grammar topics',source:'Library',atlas:'Reviewed German–Vietnamese lessons',mine:'Imports & earlier lessons',all:'All sources',group:'Topic group',allGroups:'All groups',resume:'Continue your lesson',next:'Next lesson',contents:'Chapter contents',count:'topics',done:'completed'}}[language]||grammarAtlasFallback();
}
function grammarAtlasFallback(){return {groups:[['words','I · Wörter'],['verbs','II · Verben'],['relations','III · Beziehungen'],['sentences','IV · Sätze']],imported:'Imports',empty:'No matches',count:'topics',done:'completed'};}
function grammarAtlasCount(items,completed){const node=document.getElementById('grammar-atlas-count');if(!node)return;const t=grammarAtlasLabels();node.textContent=items.length+' '+t.count+' · '+items.filter(l=>completed[l.id]).length+' '+t.done;grammarAtlasSyncLevels();}
function grammarAtlasSyncLevels(){
 const level=document.getElementById('grammar-level')?.value;
 document.querySelectorAll('[data-grammar-level]').forEach(button=>{const active=button.dataset.grammarLevel===level;button.setAttribute('aria-pressed',String(active));const count=grammarItems().filter(item=>(item.levels||[item.level]).includes(button.dataset.grammarLevel)).length;const counter=button.querySelector('small');if(counter)counter.textContent=count;});
}
function grammarAtlasSelected(){if(typeof GrammarWorkspace!=='undefined')GrammarWorkspace.openCurrent();}
function grammarAtlasReaderTools(){if(typeof GrammarWorkspace!=='undefined')GrammarWorkspace.decorateLesson();}
const GrammarWorkspace=(()=>{
 const C=GrammarWorkspaceCore,$id=id=>document.getElementById(id),tr=(vi,de,en)=>({vi,de,en}[App.settings().language]||vi),N=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls||'';if(text)n.textContent=text;return n;},B=(text,fn,cls='secondary')=>{const b=N('button',cls,text);b.type='button';b.onclick=fn;return b;};
 let route=C.route(location.hash),routing=false,activeTab='lecture',listScroll=0,owner=Auth.user;
 const main=document.querySelector('main'),workspace=document.querySelector('.grammar-workspace'),aside=$id('lesson-list')?.closest('aside'),reader=$id('lesson-panel');
 if(!main||!aside)return {openCurrent(){},decorateLesson(){}};
 document.body.classList.add('grammar-atlas','grammar-redesign');
 const catalogue=N('section','gw-catalogue'),filters=N('section','gw-filters'),groups=N('div','gw-groups'),resume=N('div','gw-resume'),count=N('p','help-text');count.setAttribute('role','status');
 const level=$id('grammar-level'),levelLabel=level.closest('label');levelLabel.hidden=false;
 const searchLabel=N('label','',tr('Tìm chủ điểm Đức–Việt','Thema suchen','Search German–Vietnamese topics')),search=N('input');search.id='grammar-search';search.type='search';search.placeholder='Perfekt, Dativ, Konjunktiv…';searchLabel.append(search);
 const stateLabel=N('label','',tr('Trạng thái học','Lernstatus','Learning status')),state=N('select');state.id='grammar-status';for(const [v,t]of [['all',tr('Tất cả','Alle','All')],['new',tr('Chưa học','Nicht begonnen','Not started')],['active',tr('Đang học','In Bearbeitung','In progress')],['done',tr('Đã hoàn thành','Abgeschlossen','Completed')]]){const o=N('option','',t);o.value=v;state.append(o);}stateLabel.append(state);filters.append(searchLabel,levelLabel,stateLabel);
 const all=N('option','',tr('Tất cả cấp độ','Alle Niveaus','All levels'));all.value='all';level.prepend(all);
 const heading=main.querySelector('.page-title');heading?.querySelector('figure')?.remove();
 $id('grammar-intro').textContent=tr('Chọn cấp độ. Hiểu quy tắc. Luyện tập theo nhịp của bạn.','Niveau wählen. Regeln verstehen. Im eigenen Tempo üben.','Choose a level. Understand the rules. Practice at your pace.');
 catalogue.append(filters,resume,count,groups);workspace.before(catalogue);
 const tools=N('details','gw-import-tools');tools.append(N('summary','',tr('Tài liệu & công cụ nhập','Materialien & Import','Materials & import tools')));aside.querySelector('.grammar-list-label')?.remove();$id('lesson-list').hidden=true;while(aside.firstChild)tools.append(aside.firstChild);catalogue.append(tools);aside.remove();
 function progress(){return {completed:Auth.get('lessons',{}),session:Auth.get('grammarSession',{}),attempts:Auth.get('grammarAttempts',[])};}
 function status(l,p=progress()){return C.status(l,p.completed,p.session,p.attempts);}
 function statusLabel(s){return {new:tr('Chưa học','Nicht begonnen','Not started'),active:tr('Đang học','In Bearbeitung','In progress'),done:tr('Đã hoàn thành','Abgeschlossen','Completed')}[s];}
 function fields(){return {level:level.value,query:search.value,status:state.value};}
 function url(lesson='',tab='lecture'){const p=new URLSearchParams();const f=fields();p.set('level',f.level);if(f.query)p.set('q',f.query);if(f.status!=='all')p.set('status',f.status);if(lesson){p.set('lesson',lesson.id);p.set('collection',lesson.collectionId);p.set('tab',tab);}return '#'+p;}
 function remember(){history.replaceState({...history.state,grammarScroll:scrollY},'',location.href);}
 function navigate(l=null,tab='lecture',replace=false){remember();history[replace?'replaceState':'pushState']({...history.state,grammarScroll:l?0:listScroll},'',url(l,tab));apply();dispatchEvent(new HashChangeEvent('hashchange'));}
 function draw(){
  const p=progress();const items=grammarAtlasFilter(grammarItems(),{level:level.value,query:search.value}).filter(l=>state.value==='all'||status(l,p)===state.value),collections=ImportHub.collections('grammar'),map=new Map(),labels=grammarAtlasLabels();
  for(const l of items){const g=C.group(l,collections),known=labels.groups.find(([k])=>k===g.key);if(known)g.title=known[1];if(!map.has(g.key))map.set(g.key,{...g,items:[]});map.get(g.key).items.push(l);}
  count.textContent=items.length+' '+labels.count;groups.replaceChildren();
  for(const g of map.values()){const section=N('section','gw-group'),h=N('div','gw-group-heading');h.append(N('h2','',g.title),N('span','',String(g.items.length)));section.append(h);const cards=N('div','gw-cards');for(const l of g.items){const s=status(l,p),card=N('article','gw-card'),meta=N('div','gw-card-meta');meta.append(N('span','gw-level',(l.levels||[l.level]).filter(Boolean).join(' · ')||'—'),N('span','gw-status',statusLabel(s)));const title=N('h3'),link=B(lessonText(l.titleDe)||lessonText(l.title),()=>{listScroll=scrollY;navigate(l);},'gw-lesson-link');title.append(link);card.append(meta,title);const vi=lessonText(l.titleVi||l.nameVi||'');if(vi)card.append(N('p','gw-vietnamese',vi));const session=p.session,done=C.results(l,session).length,total=visibleGrammarExercises(l).length;const progress=N('p','gw-card-progress',s==='done'?'✓ '+statusLabel(s):done?`${done} / ${total} · ${tr('câu đã kiểm tra','geprüfte Aufgaben','questions checked')}`:total?`${total} · ${tr('bài tập','Übungen','exercises')}`:tr('Bài giảng','Lerninhalt','Lecture'));card.append(progress);if(grammarCanEdit(l.collectionId)){const del=B(tr('Xóa bài','Löschen','Delete'),()=>deleteGrammarTopic(l.id),'gw-delete secondary');card.append(del);}cards.append(card);}section.append(cards);groups.append(section);}
  if(!items.length)groups.append(N('p','empty-state',labels.empty));
  resume.replaceChildren();const saved=p.session,last=grammarItems().find(l=>l.id===saved.lessonId&&(status(l,p)==='active'));
  if(last){resume.append(N('span','gw-eyebrow',labels.resume),B(lessonText(last.title)+' →',()=>navigate(last,'practice'),'secondary'));}
  resume.hidden=!last;
 }
 function apply(){
  routing=true;route=C.route(location.hash);if([...level.options].some(o=>o.value===route.level))level.value=route.level;else level.value='all';search.value=route.query;state.value=route.status;activeTab=route.tab;
  const l=grammarItems().find(l=>l.id===route.lesson&&(!route.collection||l.collectionId===route.collection));const detail=!!route.lesson;document.body.classList.toggle('gw-detail',detail);catalogue.hidden=detail;workspace.hidden=!detail;
  if(detail&&l){currentLesson=l;const saved=Auth.get('grammarSession',{});exerciseIndex=saved.lessonId===l.id?Math.min(saved.exerciseIndex||0,visibleGrammarExercises(l).length):0;renderLesson();}
  else if(detail){reader.replaceChildren(N('h2','',tr('Không tìm thấy bài học','Lektion nicht gefunden','Lesson not found')),B(tr('← Ngữ pháp','← Grammatik','← Grammar'),()=>navigate()));}
  else draw();routing=false;requestAnimationFrame(()=>scrollTo({top:history.state?.grammarScroll||0,behavior:'instant'}));
 }
 function decorateLesson(){
  if(!currentLesson||!document.body.classList.contains('gw-detail'))return;
  reader.querySelector('.gw-breadcrumb')?.remove();const l=currentLesson,collections=ImportHub.collections('grammar'),g=C.group(l,collections),crumb=N('nav','gw-breadcrumb');crumb.setAttribute('aria-label','Breadcrumb');
  crumb.append(B(tr('Ngữ pháp','Grammatik','Grammar'),()=>navigate()),N('span','', ' / '+(l.levels||[l.level]).filter(Boolean).join(' · ')+' / '+(grammarAtlasLabels().groups.find(([k])=>k===g.key)?.[1]||g.title)));reader.prepend(crumb);
  const header=reader.querySelector('.lesson-reader-header');const title=header?.querySelector('h1');if(title)title.textContent=lessonText(l.titleDe||l.title);if(l.titleVi||l.nameVi){const subtitle=N('p','gw-vietnamese',lessonText(l.titleVi||l.nameVi));title?.after(subtitle);}header?.querySelector('.gw-status')?.remove();header?.append(N('p','gw-status',statusLabel(status(l))));
  const nav=$id('grammar-lesson-tabs');if(!nav)return;const buttons=[...nav.querySelectorAll('[role=tab]')],keys=['lecture','mindmap','practice'],names=[tr('Bài giảng','Lerninhalt','Lecture'),'Mindmap',tr('Bài tập','Übungen','Exercises')];
  const results=N('section','gw-results');results.id='grammar-results-panel';results.setAttribute('role','tabpanel');reader.querySelector('.gw-results')?.remove();reader.append(results);
  const practice=$id(buttons[2].getAttribute('aria-controls'));
  const choose=(key,push=true)=>{activeTab=key;buttons.forEach((b,i)=>{const selected=keys[i]===(key==='results'?'practice':key);b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;$id(b.getAttribute('aria-controls')).hidden=key==='results'||!selected;});results.hidden=key!=='results';if(key==='results')renderResults(results);if(key==='mindmap')requestAnimationFrame(()=>{const v=reader.querySelector('.mindmap-viewport');if(v)v.scrollLeft=Math.max(0,(v.scrollWidth-v.clientWidth)/2);});if(push&&!routing){remember();history.pushState({...history.state,grammarScroll:0},'',url(l,key));dispatchEvent(new HashChangeEvent('hashchange'));}};
  buttons.forEach((b,i)=>{b.textContent=names[i];b.onclick=()=>choose(keys[i]);});
  practice?.prepend(B(tr('Xem kết quả','Ergebnisse ansehen','View results'),()=>choose('results'),'gw-view-results secondary'));
  results.setAttribute('aria-labelledby',buttons[2].id);
  buttons.forEach((b,i)=>b.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowRight'?1:2))%3;choose(keys[n]);buttons[n].focus();});
  const lecture=$id(buttons[0].getAttribute('aria-controls'));if(lecture&&!lecture.querySelector('.gw-practice-cta'))lecture.append(B(tr('Chuyển sang bài tập →','Zu den Übungen →','Go to exercises →'),()=>choose('practice'),'gw-practice-cta secondary'));
  const prose=reader.querySelector('.lesson-prose');if(prose&&!prose.textContent.trim())prose.append(N('p','help-text',tr('Bài này chưa có bài giảng.','Noch kein Lerninhalt vorhanden.','This lesson has no lecture yet.')));
  reader.querySelectorAll('.lesson-prose table').forEach(table=>{if(table.closest('.learning-table-wrap,.gw-table'))return;const box=N('div','gw-table');box.tabIndex=0;box.setAttribute('role','region');box.setAttribute('aria-label',tr('Bảng ngữ pháp — cuộn ngang','Grammatiktabelle — horizontal scrollen','Grammar table — scroll horizontally'));table.before(box);box.append(table);});
  choose(activeTab,false);
 }
 function renderResults(host){
  const rows=C.results(currentLesson,Auth.get('grammarSession',{})),total=visibleGrammarExercises(currentLesson).length;host.replaceChildren(B(tr('← Quay lại bài tập','← Zu den Übungen','← Back to exercises'),()=>navigate(currentLesson,'practice'),'secondary'),N('h2','',tr('Kết quả luyện tập','Übungsergebnisse','Practice results')));
  if(!rows.length){host.append(N('p','help-text',tr('Chưa có câu trả lời đã kiểm tra trong phiên bài này.','Noch keine geprüften Antworten in dieser Sitzung.','No checked answers in this lesson session.')));return;}
  host.append(N('p','gw-result-summary',`${rows.filter(r=>r.good).length} / ${rows.length} · ${tr('câu đúng','richtig','correct')} · ${rows.length} / ${total} ${tr('câu đã kiểm tra','geprüft','checked')}`));
  for(const r of rows){const item=N('section','gw-result-item');item.append(N('h3','',(r.good?'✓ ':'✕ ')+(r.index+1)+'. '+lessonText(r.exercise.question||r.exercise.content)),N('p','',tr('Bạn trả lời: ','Deine Antwort: ','Your answer: ')+r.answer),N('p','',tr('Đáp án: ','Lösung: ','Answer: ')+(r.correct||[]).join(' / ')));if(r.explanation){const p=N('div','learning-content');p.innerHTML=LearningContent.render(r.explanation);item.append(p);}if(r.exercise.rule){const p=N('div','learning-content gw-rule');p.innerHTML=LearningContent.render(lessonText(r.exercise.rule));item.append(p);}host.append(item);}
  const wrong=rows.filter(r=>!r.good);if(wrong.length)host.append(B(tr('Làm lại câu sai','Fehler wiederholen','Retry incorrect answers'),()=>{const s=structuredClone(Auth.get('grammarSession',{}));if(s.lessonId!==currentLesson.id)return;for(const r of wrong)if(s.responses?.[r.index]){s.responses[r.index]={...s.responses[r.index],answer:'',built:[],feedback:null};}exerciseIndex=wrong[0].index;const next=s.responses?.[exerciseIndex]||{};Auth.set('grammarSession',{...s,...next,exerciseIndex,answer:'',built:[],feedback:null});renderExercise();navigate(currentLesson,'practice');},'secondary'));
 }
 document.addEventListener('click',e=>{const a=e.target.closest?.('.lesson-toc-nav a');if(!a||!reader.contains(a))return;const id=a.getAttribute('href').slice(1),target=document.getElementById(id);if(target){e.preventDefault();e.stopImmediatePropagation();target.scrollIntoView({block:'start',behavior:'smooth'});}},true);
 const oldSave=saveGrammarSession;saveGrammarSession=function(extra={}){oldSave(extra);decorateStatus();};
 const oldResult=renderGrammarResult;renderGrammarResult=function(result){oldResult(result);decorateStatus();};
 const oldList=renderLessonList;renderLessonList=function(){oldList();decorateStatus();if(!catalogue.hidden)draw();};
 const oldOpen=openLesson;openLesson=function(id){oldOpen(id);if(!routing&&currentLesson)navigate(currentLesson);};
 level.onchange=state.onchange=()=>{listScroll=0;navigate(null,'lecture',true);};let timer;search.oninput=()=>{clearTimeout(timer);timer=setTimeout(()=>navigate(null,'lecture',true),150);};
 addEventListener('popstate',apply);addEventListener('hashchange',()=>{const r=C.route(location.hash);if(r.lesson!==route.lesson||r.tab!==activeTab||r.level!==level.value||r.query!==search.value||r.status!==state.value)apply();});
 document.addEventListener('cloudchange',()=>{if(owner!==Auth.user)return;if(catalogue.hidden)decorateStatus();else draw();});
 function decorateStatus(){const n=reader.querySelector('.lesson-reader-header .gw-status');if(n&&currentLesson)n.textContent=statusLabel(status(currentLesson));}
 document.addEventListener('authchange',()=>{owner=Auth.user;currentLesson=null;apply();});
 requestAnimationFrame(apply);
 return {openCurrent(){if(currentLesson)navigate(currentLesson);},decorateLesson,apply};
})();
