'use strict';
// Catalogue presentation only. Exercises, ownership, sync and grading stay in grammar.js.
function grammarAtlasLabels(){
 const language=App.settings().language;
 return {vi:{groups:[['words','I · Danh từ, tính từ & các cách'],['verbs','II · Động từ, thì & thể'],['relations','III · Thời gian, nơi chốn & quan hệ'],['sentences','IV · Câu & liên kết ý']],imported:'Tài liệu đã nhập & giáo trình cũ',empty:'Không có bài khớp. Thử bỏ bớt bộ lọc.',search:'Tìm chủ điểm Đức–Việt',source:'Tủ sách',atlas:'Bài giảng Việt–Đức',mine:'Tài liệu đã nhập & bài cũ',all:'Tất cả nguồn',group:'Nhóm chủ điểm',allGroups:'Tất cả nhóm',resume:'Tiếp tục bài đang học',next:'Bài kế tiếp',contents:'Mục lục chương',count:'chủ điểm',done:'đã hoàn thành'},de:{groups:[['words','I · Nomen, Adjektive & Kasus'],['verbs','II · Verben, Zeiten & Formen'],['relations','III · Zeit, Ort & Beziehungen'],['sentences','IV · Sätze & Verknüpfungen']],imported:'Importe & bisherige Lehrwerke',empty:'Keine Treffer. Filter zurücksetzen.',search:'Grammatikthema suchen',source:'Bibliothek',atlas:'Überarbeitete Lernkapitel',mine:'Importe & bisherige Lektionen',all:'Alle Quellen',group:'Themengruppe',allGroups:'Alle Gruppen',resume:'Lektion fortsetzen',next:'Nächste Lektion',contents:'Kapitelinhalt',count:'Themen',done:'abgeschlossen'},en:{groups:[['words','I · Nouns, adjectives & cases'],['verbs','II · Verbs, tenses & voice'],['relations','III · Time, place & relations'],['sentences','IV · Sentences & connections']],imported:'Imports & earlier books',empty:'No matches. Try fewer filters.',search:'Search grammar topics',source:'Library',atlas:'Reviewed German–Vietnamese lessons',mine:'Imports & earlier lessons',all:'All sources',group:'Topic group',allGroups:'All groups',resume:'Continue your lesson',next:'Next lesson',contents:'Chapter contents',count:'topics',done:'completed'}}[language]||grammarAtlasFallback();
}
function grammarAtlasFallback(){return {groups:[['words','I · Wörter'],['verbs','II · Verben'],['relations','III · Beziehungen'],['sentences','IV · Sätze']],imported:'Imports',empty:'No matches',count:'topics',done:'completed'};}
function grammarAtlasCount(items,completed){const node=document.getElementById('grammar-atlas-count');if(!node)return;const t=grammarAtlasLabels();node.textContent=items.length+' '+t.count+' · '+items.filter(l=>completed[l.id]).length+' '+t.done;grammarAtlasSyncLevels();grammarAtlasSyncFilters();}
function grammarAtlasSyncLevels(){
 const level=document.getElementById('grammar-level')?.value;
 document.querySelectorAll('[data-grammar-level]').forEach(button=>{const active=button.dataset.grammarLevel===level;button.setAttribute('aria-pressed',String(active));});
}
function grammarAtlasFilterLabels(){
 return {vi:{title:'Bộ lọc thêm',reset:'Bỏ bộ lọc',active:'đang dùng'},de:{title:'Weitere Filter',reset:'Filter zurücksetzen',active:'aktiv'},en:{title:'More filters',reset:'Reset filters',active:'active'}}[App.settings().language]||{title:'More filters',reset:'Reset filters',active:'active'};
}
function grammarAtlasSyncFilters(){
 const host=document.querySelector('.grammar-atlas-filters');if(!host)return;
 const t=grammarAtlasFilterLabels(),source=document.getElementById('grammar-source'),group=document.getElementById('grammar-group');
 const count=Number(source?.value!=='atlas')+Number(group?.value!=='all');
 host.querySelector('[data-filter-title]').textContent=t.title;
 host.querySelector('[data-filter-count]').textContent=count?' · '+count+' '+t.active:'';
 const reset=host.querySelector('[data-filter-reset]');reset.textContent=t.reset;reset.hidden=!count;
}
function grammarAtlasLevelNote(){
 return {vi:'Chọn một cấp độ. Các chủ điểm ôn lại được giữ ở những level bạn đã liệt kê.',de:'Ein Niveau wählen. Wiederholungsthemen bleiben den angegebenen Niveaus zugeordnet.',en:'Choose one level. Review topics keep the level assignments from your list.'}[App.settings().language]||'';
}
function grammarAtlasSelected(){
 const list=document.getElementById('grammar-catalogue');if(list&&matchMedia('(max-width:800px)').matches&&currentLesson){list.open=false;document.getElementById('lesson-panel').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
 grammarAtlasReaderTools();
}
function grammarAtlasReaderTools(){
 document.querySelector('.grammar-reader-route')?.remove();if(!currentLesson)return;
 const t=grammarAtlasLabels(),bar=document.createElement('nav');bar.className='grammar-reader-route';bar.setAttribute('aria-label',t.contents);
 const back=document.createElement('button');back.type='button';back.className='secondary';back.textContent='← '+t.contents;back.onclick=()=>{const list=document.getElementById('grammar-catalogue');list.open=true;list.scrollIntoView({block:'start'});document.getElementById('grammar-search').focus();};
 const info=document.createElement('span');const scope=currentLesson.levels||[currentLesson.level],selected=document.getElementById('grammar-level').value;info.textContent=scope.includes(selected)?selected:scope.join(' · ');info.title=scope.join(' · ');
 bar.append(back,info);const items=filteredGrammarItems(),index=items.findIndex(l=>l.id===currentLesson.id);if(index>=0&&index<items.length-1){const next=document.createElement('button');next.type='button';next.className='secondary';next.textContent=t.next+' →';next.onclick=()=>{openLesson(items[index+1].id);grammarAtlasSelected();};bar.append(next);}
 document.getElementById('lesson-panel').prepend(bar);
 document.querySelector('.grammar-level-scope')?.remove();if(currentLesson.collectionId==='elio-grammar-atlas-v1'&&scope.length>1){const note=document.createElement('p');note.className='grammar-level-scope';note.textContent={vi:'Chủ điểm này có trong '+scope.join(', ')+'. Phần tham chiếu dùng chung; level đang chọn là '+selected+'.',de:'Dieses Thema gehört zu '+scope.join(', ')+'. Gemeinsamer Referenztext; ausgewähltes Niveau: '+selected+'.',en:'This topic appears at '+scope.join(', ')+'. The reference chapter is shared; selected level: '+selected+'.'}[App.settings().language]||'';document.querySelector('.lesson-reader-header')?.append(note);}

}
(()=>{
 if(!Account.current())return;
 const main=document.querySelector('main'),list=document.getElementById('lesson-list'),aside=list?.closest('aside');if(!main||!aside)return;
 document.body.classList.add('grammar-atlas');aside.querySelector('.grammar-list-label')?.remove();
 const labels=grammarAtlasLabels(),controls=document.createElement('section');controls.className='grammar-atlas-controls';controls.setAttribute('aria-label',labels.contents);
 controls.innerHTML='<div class="grammar-atlas-heading"><span>ELIO · GRAMMATIK</span><h2>'+esc(labels.contents)+'</h2><p id="grammar-atlas-count" role="status" aria-live="polite"></p></div><label>'+esc(labels.search)+'<input id="grammar-search" type="search" autocomplete="off" placeholder="Perfekt · bị động · Dativ…"></label><details class="grammar-atlas-filters"><summary><span data-filter-title></span><small data-filter-count></small></summary><div class="grammar-filter-fields"><label>'+esc(labels.source)+'<select id="grammar-source"><option value="atlas">'+esc(labels.atlas)+'</option><option value="imported">'+esc(labels.mine)+'</option><option value="all">'+esc(labels.all)+'</option></select></label><label>'+esc(labels.group)+'<select id="grammar-group"><option value="all">'+esc(labels.allGroups)+'</option>'+labels.groups.map(([key,title])=>'<option value="'+key+'">'+esc(title)+'</option>').join('')+'</select></label><button type="button" class="secondary grammar-filter-reset" data-filter-reset></button></div></details>';
 const level=document.getElementById('grammar-level'),levelLabel=level.closest('label')||level;
 levelLabel.classList.add('grammar-atlas-level');levelLabel.hidden=true;controls.insertBefore(levelLabel,controls.children[1]);
 const levels=['A1','A2','B1','B2','C1'],levelBar=document.createElement('nav');levelBar.className='grammar-level-navigation';levelBar.setAttribute('aria-label','CEFR');
 let remembered='';try{remembered=sessionStorage.getItem('elio:grammar-level')||'';}catch{}
 const previous=Auth.get('grammarSession',{}),previousLesson=grammarItems().find(l=>l.id===previous.lessonId);
 level.value=levels.includes(remembered)?remembered:previousLesson?.level&&levels.includes(previousLesson.level)?previousLesson.level:'A1';
 for(const name of levels){const button=document.createElement('button');button.type='button';button.dataset.grammarLevel=name;const count=ElioGrammarLevelCatalogue.levels[name].length;button.innerHTML='<strong>'+name+'</strong><small>'+count+'</small>';button.onclick=()=>{level.value=name;try{sessionStorage.setItem('elio:grammar-level',name);}catch{}level.dispatchEvent(new Event('change'));grammarAtlasSyncLevels();};levelBar.append(button);}
 controls.insertBefore(levelBar,levelLabel);const levelNote=document.createElement('p');levelNote.className='grammar-level-note';levelNote.textContent=grammarAtlasLevelNote();levelNote.hidden=true;levelBar.after(levelNote);
 const catalogue=document.createElement('details');catalogue.id='grammar-catalogue';catalogue.open=true;const summary=document.createElement('summary');summary.textContent=labels.contents;catalogue.append(summary,controls,list);aside.prepend(catalogue);
 const importPanel=document.getElementById('import-zone');if(importPanel){const drawer=document.createElement('details');drawer.className='grammar-import-drawer';const title=document.createElement('summary');title.textContent=labels.imported;drawer.append(title,importPanel);aside.append(drawer);}
 const saved=Auth.get('grammarSession',{}),existing=grammarItems().find(l=>l.id===saved.lessonId);
 if(existing){document.getElementById('grammar-source').value='atlas';const resume=document.createElement('button');resume.type='button';resume.className='grammar-resume';resume.textContent='↶ '+labels.resume+' · '+existing.title;resume.onclick=()=>{document.getElementById('grammar-source').value=existing.collectionId==='elio-grammar-atlas-v1'?'atlas':'imported';level.value=(existing.levels||[existing.level]).includes(level.value)?level.value:existing.level;document.getElementById('grammar-search').value='';document.getElementById('grammar-group').value='all';openLesson(existing.id);loadGrammar();grammarAtlasSelected();};controls.append(resume);}
 let timer;document.getElementById('grammar-search').oninput=()=>{clearTimeout(timer);timer=setTimeout(()=>{renderLessonList();grammarAtlasReaderTools();},100);};
 for(const id of ['grammar-source','grammar-group'])document.getElementById(id).onchange=()=>{renderLessonList();grammarAtlasReaderTools();};
 controls.querySelector('[data-filter-reset]').onclick=()=>{document.getElementById('grammar-source').value='atlas';document.getElementById('grammar-group').value='all';renderLessonList();grammarAtlasReaderTools();};
 const originalLevelChange=level.onchange;level.onchange=()=>{originalLevelChange();grammarAtlasReaderTools();};
 const intro=document.getElementById('grammar-intro');intro.textContent={vi:'Một cuốn sách, nhiều lối học. Chọn cấp độ, tìm chủ điểm và luyện với lời giải chi tiết.',de:'Ein Buch, viele Lernwege. Themen finden, verstehen und mit Erklärungen üben.',en:'One book, many learning paths. Find a topic, understand it and practice with explanations.'}[App.settings().language]||'';
 const reference=document.createElement('p');reference.className='grammar-official-source';const link=document.createElement('a');link.href='https://www.deutschakademie.de/online-deutschkurs/nach-level/';link.target='_blank';link.rel='noopener noreferrer';link.textContent='DeutschAkademie · Học và luyện theo cấp độ ↗';reference.append(link);controls.querySelector('.grammar-filter-fields').append(reference);
 renderLessonList();if(!existing||!filteredGrammarItems().some(l=>l.id===currentLesson?.id)){const first=filteredGrammarItems()[0];if(first)openLesson(first.id);}grammarAtlasReaderTools();
 // Re-render labels through the existing page lifecycle; do not clone editors or answer state.
 document.addEventListener('languagechange',()=>{
  const t=grammarAtlasLabels();controls.querySelector('h2').textContent=t.contents;summary.textContent=t.contents;levelNote.textContent=grammarAtlasLevelNote();
  for(const [id,label]of [['grammar-search',t.search],['grammar-source',t.source],['grammar-group',t.group]]){const field=document.getElementById(id);if(field?.parentElement.firstChild?.nodeType===3)field.parentElement.firstChild.textContent=label;}
  const options=document.getElementById('grammar-source').options;options[0].textContent=t.atlas;options[1].textContent=t.mine;options[2].textContent=t.all;
  const groups=document.getElementById('grammar-group').options;groups[0].textContent=t.allGroups;t.groups.forEach(([,title],i)=>groups[i+1].textContent=title);
  renderLessonList();grammarAtlasReaderTools();
 });
 document.addEventListener('cloudchange',()=>{renderLessonList();grammarAtlasReaderTools();});
})();


