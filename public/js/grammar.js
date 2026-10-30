'use strict';
let currentLesson=null,exerciseIndex=0,answered=false,built=[],grammarEditorOwner=null;
function grammarCanEdit(id){
 if(id==='elio-grammar-atlas-v1')return false;
 if(id==='elio-c1-sicher-v1')return Account.profile?.role==='super_admin';
 return Account.canEdit('materials',id);
}
function materializeGrammarC1(){
 if(typeof ElioGrammarC1Pack==='undefined'||currentLesson?.collectionId!==ElioGrammarC1Pack.id)return;
 if(Account.profile?.role!=='super_admin')throw Error('Chỉ quản trị viên được sửa giáo trình C1 chung.');
 const all=Auth.get('materials',[]);if(all.some(c=>c.id===ElioGrammarC1Pack.id))return;
 if(Account.conflicts.materials||Account.conflicts['shared:materials'])throw Error('Tài liệu có xung đột; hãy xử lý trước khi sửa C1.');
 Auth.set('materials',[...all,{...structuredClone(ElioGrammarC1Pack),createdAt:Date.now()}]);
}

function grammarItems(){
 const levels=['A1','A2','B1','B2','C1','C2'];
 const imported=ImportHub.collections('grammar').flatMap(c=>c.items.map(l=>({...l,collectionId:c.id,level:levels.includes(l.level)?l.level:levels.includes(c.level)?c.level:(String(c.name||'').match(/(?:^|[^a-z0-9])(a1|a2|b1|b2|c1)(?=$|[^a-z0-9])/i)?.[1]||'').toUpperCase()})));
 const old=imported.filter(item=>item.collectionId!=='elio-grammar-atlas-v1');
 const pack=typeof ElioGrammarC1Pack==='undefined'?null:ElioGrammarC1Pack;
 const overridden=pack&&ImportHub.collections('grammar').some(c=>c.id===pack.id);
 return pack&&!overridden?[...old,...pack.items.map(item=>({...item,collectionId:pack.id}))]:old;
}
function grammarAtlasFilter(items,{level='all',source='all',query='',group='all'}={}){
 const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/ß/g,'ss');
 const words=norm(query).trim().split(/\s+/).filter(Boolean);
 return items.filter(l=>(level==='all'||(l.levels||[l.level]).includes(level))&&(source==='all'||(source==='atlas'?l.collectionId==='elio-grammar-atlas-v1':l.collectionId!=='elio-grammar-atlas-v1'))&&(group==='all'||l.group===group)&&words.every(w=>norm([l.title,l.subtitle,l.content].join(' ')).includes(w)));
}

function filteredGrammarItems(){return grammarAtlasFilter(grammarItems(),{level:$('#grammar-level').value,source:['atlas','imported','all'].includes($('#grammar-source')?.value)?$('#grammar-source').value:'all',query:$('#grammar-search')?.type==='search'?$('#grammar-search').value:'',group:['words','verbs','relations','sentences','all'].includes($('#grammar-group')?.value)?$('#grammar-group').value:'all'});}
function renderLessonList(){
 const items=filteredGrammarItems(),completed=Auth.get('lessons',{}),labels=typeof grammarAtlasLabels==='function'?grammarAtlasLabels():null;
 const row=(l,index)=>`<div class="grammar-topic-row"><button type="button" class="grammar-topic-link ${currentLesson?.id===l.id?'active':''}" data-id="${esc(l.id)}" ${currentLesson?.id===l.id?'aria-current="page"':''}><span>${esc(l.title)}</span>${completed[l.id]?'<span class="grammar-topic-check" aria-label="Completed">✓</span>':''}</button>${grammarCanEdit(l.collectionId)?`<button type="button" class="secondary" data-delete-grammar="${esc(l.id)}" aria-label="${esc(App.t('delete')+' '+l.title)}">×</button>`:''}</div>`;
 let count=0;
 if(labels){const groups=[...labels.groups,['imported',labels.imported]];$('#lesson-list').innerHTML=groups.map(([key,title])=>{const list=items.filter(l=>(l.group||'imported')===key);if(!list.length)return '';const open=$('#grammar-search')?.value||list.some(l=>l.id===currentLesson?.id);return `<details class="grammar-chapter" ${open?'open':''}><summary><span>${esc(title)}</span><small>${list.length}</small></summary>${list.map(l=>row(l,count++)).join('')}</details>`;}).join('')||`<p class="grammar-no-results">${esc(labels.empty)}</p>`;
 }else $('#lesson-list').innerHTML=items.map(row).join('')||`<p>${esc(App.t('empty'))}</p>`;
 $('#lesson-list').querySelectorAll('.grammar-chapter').forEach(chapter=>chapter.addEventListener('toggle',()=>{if(!chapter.open||$('#grammar-search')?.value)return;$('#lesson-list').querySelectorAll('.grammar-chapter').forEach(other=>{if(other!==chapter)other.open=false;});}));
 $('#lesson-list').querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>{openLesson(b.dataset.id);if(typeof grammarAtlasSelected==='function')grammarAtlasSelected();});
 $('#lesson-list').querySelectorAll('[data-delete-grammar]').forEach(b=>b.onclick=()=>deleteGrammarTopic(b.dataset.deleteGrammar));
 if(typeof grammarAtlasCount==='function')grammarAtlasCount(items,completed);
}
function deleteGrammarTopic(id){if(!Auth.require())return;const item=grammarItems().find(l=>l.id===id);if(!item||!grammarCanEdit(item.collectionId))return;if(!confirm(App.t('delete')+' “'+item.title+'”?'))return;if(item.collectionId==='elio-c1-sicher-v1'){const previous=currentLesson;currentLesson=item;materializeGrammarC1();currentLesson=previous;}const collections=Auth.get('materials',[]),collection=collections.find(c=>c.type==='grammar'&&c.id===item.collectionId);if(!collection)return;collection.items=collection.items.filter(l=>l.id!==id);Auth.set('materials',collections);if(currentLesson?.id===id)currentLesson=null;loadGrammar();}
function openLesson(id){currentLesson=grammarItems().find(l=>l.id===id)||null;const source=$('#grammar-source');if(currentLesson&&source&&['atlas','imported'].includes(source.value))source.value=currentLesson.collectionId==='elio-grammar-atlas-v1'?'atlas':'imported';exerciseIndex=0;renderLesson();renderLessonList();}
function lessonText(value){if(typeof value==='string')return value;return value?.[App.settings().language]||value?.de||value?.vi||'';}
function visibleGrammarExercises(lesson){return (Array.isArray(lesson?.exercises)?lesson.exercises:[]).filter(ex=>ex.origin!=='ai'&&ex.answerSource!=='ai');}
function grammarAdditionText(value){const text=typeof value==='string'?value:value?.content||'';return /^(?:leave empty\.?|empty|n\/a|none|null|undefined)$/i.test(text.trim())?'':text;}
function renderLesson(){
 const l=currentLesson;if(!l){$('#lesson-panel').innerHTML=`<div class="empty-state">✦<p>${esc(App.t('empty'))}</p></div>`;return;}
 const language=App.settings().language,labels={vi:{section:'Ngữ pháp',source:'NỘI DUNG TÀI LIỆU',contents:'Trong bài này',intro:'Quy tắc, bảng tổng hợp và ví dụ — đọc từng phần, nắm từng ý.',extras:'Giải thích bổ sung',enrich:'Bổ sung giải thích'},en:{section:'Grammar',source:'YOUR LEARNING MATERIAL',contents:'On this page',intro:'Rules, reference tables and examples — one clear section at a time.',extras:'Additional explanations',enrich:'Add explanations'},de:{section:'Grammatik',source:'DEIN LERNMATERIAL',contents:'Auf dieser Seite',intro:'Regeln, Tabellen und Beispiele – Schritt für Schritt verstehen.',extras:'Zusätzliche Erklärungen',enrich:'Erklärungen ergänzen'}}[language];
 const layout=LearningContent.layout(lessonText(l.content),'lesson-'+l.id),toc=layout.headings.length?LearningContent.toc(layout.headings):'',additions=Array.isArray(l.aiAdditions)?l.aiAdditions.filter(a=>grammarAdditionText(a)):[];
 $('#lesson-panel').innerHTML=`<header class="lesson-reader-header"><p class="lesson-breadcrumb">${esc((l.levels||[l.level]).includes($('#grammar-level')?.value)?$('#grammar-level').value:(l.levels||[l.level||'A1–C1']).join(' · '))} <span>/</span> ${esc(labels.section)}</p><h1 class="lesson-reader-title">${esc(l.title)}</h1><p class="lesson-reader-description">${esc(labels.intro)}</p><div class="lesson-reader-meta"><span>▤ ${esc(l.collectionId==='elio-grammar-atlas-v1'?({vi:'ELIO BIÊN SOẠN',de:'ELIO LERNBIBLIOTHEK',en:'ELIO AUTHORED LIBRARY'}[language]||'ELIO'):labels.source)}</span>${layout.headings.length?`<span>${layout.headings.length} ${esc(language==='vi'?'mục':language==='de'?'Abschnitte':'sections')}</span>`:''}</div></header><div class="lesson-reader-grid"><article class="lesson-reader-body">${toc?`<details class="lesson-mobile-toc"><summary>${esc(labels.contents)}</summary>${toc}</details>`:''}<div class="learning-content formatted-content lesson-prose">${layout.html}</div>${l.atlasGuide?`<details class="grammar-deep-guide"><summary>Đọc sâu · ${esc(l.atlasGuide.title)}</summary><div class="learning-content formatted-content lesson-prose">${LearningContent.render(l.atlasGuide.content)}</div></details>`:''}${l.sourceContent?`<details class="lesson-source-book"><summary>Nội dung sách theo trang · bản chuyển OCR</summary><p class="help-text">Lớp chữ có thể sai dấu và ô bảng; đây là tài liệu đối chiếu chưa hiệu đính toàn bộ.</p><div class="learning-content formatted-content lesson-prose">${LearningContent.render(l.sourceContent)}</div></details>`:''}${l.sourceContent&&Auth.get('materials',[]).find(c=>c.id===l.collectionId)?.sourceAnswerKey?`<details class="lesson-source-book"><summary>Lời giải trong sách · PDF 393–416</summary><p class="help-text">Toàn bộ phần lời giải nguồn, chưa ghép tự động vào câu hỏi để tránh chấm nhầm.</p><div class="learning-content formatted-content lesson-prose">${LearningContent.render(Auth.get('materials',[]).find(c=>c.id===l.collectionId).sourceAnswerKey)}</div></details>`:''}${grammarSourceHTML(l)}${l.examples?`<div class="example-box formatted-content">${LearningContent.render(l.examples)}</div>`:''}${additions.length?`<details class="ai-addition lesson-additions"><summary>✦ ${esc(labels.extras)}</summary>${additions.map(a=>`<div class="learning-content formatted-content lesson-prose">${LearningContent.render(grammarAdditionText(a))}</div>`).join('')}</details>`:''}<div class="lesson-reader-tools"><button id="grammar-enrich" class="secondary">✦ ${esc(labels.enrich)}</button><p id="grammar-enrich-status" role="status">${esc(l.enrichmentError||'')}</p></div><div id="grammar-exercise" class="exercise-box"></div></article>${toc?`<aside class="lesson-toc"><h2>${esc(labels.contents)}</h2>${toc}</aside>`:''}</div>`;
 $('#grammar-enrich').hidden=!grammarCanEdit(currentLesson?.collectionId);$('#grammar-enrich').onclick=enrichCurrentLesson;renderExercise();mountGrammarLessonTabs();renderGrammarEditorControl();if(typeof grammarAtlasReaderTools==='function')grammarAtlasReaderTools();
}
function renderExerciseBody(){const stored=Auth.get('grammarSession',null),snapshot=stored?.lessonId===currentLesson.id?(stored.responses?.[exerciseIndex]||stored):null,exercises=visibleGrammarExercises(currentLesson),key=grammarExerciseKey(exercises[exerciseIndex]),resume=snapshot?.lessonId===currentLesson.id&&snapshot.exerciseIndex===exerciseIndex&&(snapshot.exerciseKey?snapshot.exerciseKey===key:exercises.length===(currentLesson.exercises||[]).length)?snapshot:null;const target=$('#grammar-exercise');answered=!!resume?.feedback;built=resume?.built||[];if(!exercises.length){target.innerHTML='';return;}if(exerciseIndex>=exercises.length){target.innerHTML=`<h3>${esc(App.t('complete'))} ✧</h3><button id="complete-lesson">${esc(App.t('complete'))} +20 XP</button>`;$('#complete-lesson').onclick=()=>{if(!Auth.require())return;const state=Auth.get('lessons',{});state[currentLesson.id]={completedAt:Date.now(),level:currentLesson.level};Auth.set('lessons',state);App.event('lesson:'+currentLesson.id,'grammar',20,currentLesson.tag||currentLesson.title);renderLessonList();toast(App.t('complete')+' ✓');};return;}const ex=exercises[exerciseIndex];target.innerHTML=`<span class="tag">${exerciseIndex+1} / ${exercises.length} · ${ex.origin==='ai'?'AI':'Tài liệu / Quelle'}</span><h3>${esc(ex.question||ex.content||'Übung')}</h3><div id="exercise-controls"></div><div id="exercise-feedback" aria-live="polite"></div>`;const controls=$('#exercise-controls');
if(ex.type==='quiz'&&Array.isArray(ex.options)){controls.innerHTML=`<div class="options">${ex.options.map((v,i)=>`<button data-answer="${i}">${esc(v)}</button>`).join('')}</div>`;controls.querySelectorAll('button').forEach(b=>b.onclick=()=>checkExercise(ex.options[Number(b.dataset.answer)]));}
else if(ex.type==='build'&&Array.isArray(ex.tokens)){const indices=ex.tokens.map((_,i)=>i).sort(()=>Math.random()-.5);controls.innerHTML=`<div id="built-sentence" class="example-box">…</div><div class="chat-tools">${indices.map(i=>`<button class="secondary" data-token="${i}">${esc(ex.tokens[i])}</button>`).join('')}</div><div class="chat-tools"><button id="reset-build" class="secondary">↶</button><button id="check-build">${esc(App.t('submit'))}</button></div>`;controls.querySelectorAll('[data-token]').forEach(b=>b.onclick=()=>{if(answered)return;built.push(Number(b.dataset.token));b.disabled=true;$('#built-sentence').textContent=built.map(i=>ex.tokens[i]).join(' ');saveGrammarSession();});$('#built-sentence').textContent=built.map(i=>ex.tokens[i]).join(' ')||'…';controls.querySelectorAll('[data-token]').forEach(b=>b.disabled=built.includes(Number(b.dataset.token)));$('#reset-build').onclick=()=>{built=[];saveGrammarSession({answer:'',feedback:null});renderExercise();};$('#check-build').onclick=()=>checkExercise(built.map(i=>ex.tokens[i]).join(' '));}
else{controls.innerHTML=`<form id="grammar-answer"><label class="sr-only" for="grammar-input">Answer</label><input id="grammar-input" required autocomplete="off"><button style="margin-top:12px">${esc(App.t('submit'))}</button></form>`;$('#grammar-input').value=resume?.answer||'';$('#grammar-input').oninput=()=>saveGrammarSession({answer:$('#grammar-input').value});$('#grammar-answer').onsubmit=e=>{e.preventDefault();checkExercise($('#grammar-input').value);};}if(resume?.feedback)renderGrammarResult(resume.feedback);else saveGrammarSession({answer:resume?.answer||'',feedback:null});}
async function checkExercise(answer){if(answered||!answer.trim())return;if(!Auth.require())return;answered=true;const ex=visibleGrammarExercises(currentLesson)[exerciseIndex],id=currentLesson.id,index=exerciseIndex,user=Auth.user;let good=false,explanation=lessonText(ex.explanation),correct=Array.isArray(ex.answers)?ex.answers:ex.answer?[ex.answer]:[];try{if(correct.length){const norm=v=>String(v).trim().toLocaleLowerCase('de').normalize('NFC').replace(/[.!?]+$/,'').replace(/\s+/g,' ');good=correct.some(a=>norm(a)===norm(answer));}else{$('#exercise-feedback').textContent='AI…';const data=await App.evaluate(`Check this German grammar exercise. Return {"correct":true,"explanation":"...","suggestedAnswer":"..."}. No source answer key is available; label your answer as an AI suggestion. ${JSON.stringify({exercise:ex,answer})}`,{feature:'grammar.check'});good=data.correct===true;explanation='AI · '+(data.explanation||'');correct=[data.suggestedAnswer||'AI'];}if(Auth.user!==user||currentLesson?.id!==id||exerciseIndex!==index)return;const attempts=Auth.get('grammarAttempts',[]);attempts.push({lessonId:id,lessonTitle:currentLesson.title,index,question:ex.question||ex.content||'',answer,correct:good,correctAnswers:correct,explanation,tag:currentLesson.tag||currentLesson.title,time:Date.now()});Auth.set('grammarAttempts',attempts);if(good)App.event(`grammar:${id}:${index}:${App.day()}`,'grammar',5,currentLesson.tag||currentLesson.title);const feedback={good,correct,explanation,answer};saveGrammarSession({answer,feedback});renderGrammarResult(feedback);}catch(error){if(user===Auth.user){answered=false;$('#exercise-feedback').textContent=error.message;}}}
$('#grammar-level').onchange=()=>{if(!filteredGrammarItems().some(l=>l.id===currentLesson?.id))currentLesson=null;loadGrammar();};
function loadGrammar(){if(grammarEditorOwner===Auth.user&&$('#grammar-edit-form'))return;const saved=Auth.get('grammarSession',null),items=filteredGrammarItems();if(!currentLesson&&saved?.lessonId){currentLesson=items.find(l=>l.id===saved.lessonId)||null;if(currentLesson)exerciseIndex=visibleGrammarExercises(currentLesson).length===(currentLesson.exercises||[]).length?saved.exerciseIndex||0:0;}if(!currentLesson||!items.some(l=>l.id===currentLesson.id))openLesson(items[0]?.id);else{currentLesson=items.find(l=>l.id===currentLesson.id);renderLesson();renderLessonList();}$('#grammar-intro').textContent={vi:'Một cuốn sách, nhiều lối học. Chọn cấp độ, tìm chủ điểm và luyện với lời giải chi tiết.',en:'Choose a level, find a topic and practice with detailed explanations.',de:'Niveau wählen, Themen finden und mit ausführlichen Erklärungen üben.'}[App.settings().language];}
ImportHub.mount('grammar',c=>{if($('#grammar-source'))$('#grammar-source').value='imported';if($('#grammar-group'))$('#grammar-group').value='all';if($('#grammar-search'))$('#grammar-search').value='';const first=c.items.find(l=>$('#grammar-level').value==='all'||l.level===$('#grammar-level').value);if(first)openLesson(first.id);else loadGrammar();});document.addEventListener('authchange',()=>{currentLesson=null;loadGrammar();});document.addEventListener('languagechange',loadGrammar);loadGrammar();

let enrichingGrammar=false;
async function enrichCurrentLesson(){if(enrichingGrammar||!Auth.require()||!currentLesson||!grammarCanEdit(currentLesson?.collectionId))return;materializeGrammarC1();const user=Auth.user,folder=currentLesson.collectionId,id=currentLesson.id,lesson=structuredClone(currentLesson);enrichingGrammar=true;$('#grammar-enrich').disabled=true;$('#grammar-enrich-status').textContent='AI…';try{const extra=await GrammarImport.enrich(lesson);if(user!==Auth.user)return;const collections=Auth.get('materials',[]),collection=collections.find(c=>c.type==='grammar'&&c.id===folder),target=collection?.items.find(l=>l.id===id);if(!target)return;target.aiAdditions=[...(target.aiAdditions||[]),...extra.additions];target.exercises=[...(target.exercises||[]),...extra.exercises];delete target.enrichmentError;Auth.set('materials',collections);if(currentLesson?.collectionId===folder&&currentLesson?.id===id){currentLesson={...target,collectionId:folder};renderLesson();renderLessonList();}}catch(error){if(user===Auth.user&&currentLesson?.id===id)$('#grammar-enrich-status').textContent=error.message;}finally{enrichingGrammar=false;if($('#grammar-enrich'))$('#grammar-enrich').disabled=false;}}

function grammarExerciseKey(ex){return ex?JSON.stringify([ex.type,ex.question||ex.content||'',ex.sourcePage||null]):'';}
function saveGrammarSession(extra={}){if(!Auth.user||!currentLesson)return;const old=Auth.get('grammarSession',{}),same=old.lessonId===currentLesson.id&&old.exerciseIndex===exerciseIndex;const response={...(same?old:{}),lessonId:currentLesson.id,exerciseIndex,exerciseKey:grammarExerciseKey(visibleGrammarExercises(currentLesson)[exerciseIndex]),folder:currentLesson.collectionId,built,...extra};delete response.responses;const responses=old.lessonId===currentLesson.id?{...(old.responses||{})}:{};if(same&&!responses[old.exerciseIndex]){const previous={...old};delete previous.responses;responses[old.exerciseIndex]=previous;}responses[exerciseIndex]=response;Auth.set('grammarSession',{...response,responses});}
function renderGrammarResultBody(result){answered=true;$('#exercise-feedback').innerHTML=`<div class="answer-message"><strong class="${result.good?'correct':'incorrect'}">${result.good?'✓ Richtig!':'✕ Noch einmal üben.'}</strong><br>${esc(App.t('answer'))}: ${esc((result.correct||[]).join(' / '))}<br>${esc(result.explanation||'')}</div><button id="next-exercise">${esc(App.t('next'))} →</button>`;$('#next-exercise').onclick=()=>{exerciseIndex++;renderExercise();};}

function renderBookPackControls(){const root=$('#book-pack-zone');if(root)root.hidden=Account.profile?.role!=='super_admin';}
function mergeGrammarBookPack(all,pack){
 const old=all.find(c=>c.id===pack.id);
 if(old&&(old.packVersion||1)>=pack.packVersion)return {materials:all,added:0};
 if(old&&(old.packVersion||1)>=3){const targets=Array.isArray(pack.revisionTargets)?new Set(pack.revisionTargets):null;const byId=new Map(pack.items.filter(i=>!targets||targets.has(i.id)).map(i=>[i.id,i]));let changed=0;const items=old.items.map(item=>{const next=byId.get(item.id);if(!next||item.updatedAt||JSON.stringify(item)===JSON.stringify(next))return item;changed++;return next;});return {materials:all.map(c=>c.id===pack.id?{...c,items,packVersion:pack.packVersion}:c),added:changed,upgraded:true};}
 return {materials:old?all.map(c=>c.id===pack.id?{...pack,createdAt:old.createdAt||Date.now()}:c):[...all,{...pack,createdAt:Date.now()}],added:pack.items.length,replaced:!!old};
}
async function installGrammarBookPack(){
 if(!Auth.require()||Account.profile?.role!=='super_admin')return;
 const user=Auth.user,button=$('#book-pack-install'),status=$('#book-pack-status');button.disabled=true;
 try{
  if(Account.conflicts.materials||Account.conflicts['shared:materials'])throw Error('Xử lý xung đột tài liệu trong Cài đặt trước.');
  status.textContent='Đang tải giáo trình đã chuẩn bị…';
  const response=await fetch('data/grammar-book-a1-b2.json');if(!response.ok)throw Error('Không tải được giáo trình. Hãy tải lại trang.');
  const pack=await response.json();if(user!==Auth.user)return;
  if(pack.packVersion!==7||!Array.isArray(pack.items)||pack.items.length!==64||new Set(pack.items.map(l=>l.id)).size!==64||pack.items.some(l=>!l.title||!l.content||!['A1','A2','B1','B2'].includes(l.level)))throw Error('Gói giáo trình không hợp lệ.');
  const merged=mergeGrammarBookPack(Auth.get('materials',[]),pack);
  if(!merged.added&&!merged.upgraded){status.textContent='Giáo trình đã ở phiên bản mới. Giữ nguyên nội dung đã sửa và bài bạn đã xóa.';return;}
  const old=Auth.get('materials',[]).find(c=>c.id===pack.id);if(old)await AccountCache.write(Account.cacheKey('grammar-book-backup'),structuredClone(old));if(user!==Auth.user)return;Auth.set('materials',merged.materials);loadGrammar();
  const first=grammarItems().find(l=>l.collectionId===pack.id&&($('#grammar-level').value==='all'||l.level===$('#grammar-level').value));if(first)openLesson(first.id);
  await Account.flush();if(user!==Auth.user)return;
  status.textContent=Account.pending['shared:materials']||Account.conflicts['shared:materials']?'Đã thêm trên thiết bị; đang chờ đồng bộ. Kiểm tra Cài đặt.':`Đã đồng bộ ${merged.added} bài cập nhật. Gói mới gồm A2 bài 6–13, 17 bài B1 và 22 bài B2 (470 câu bài tập trong 47 bài cập nhật). Giữ nguyên A1, A2 bài 1–5, bài đã chỉnh tay và bài đã xóa. Chỉ Admin được sửa/xóa nội dung chung.`;
 }catch(error){if(user===Auth.user)status.textContent=error.message;}finally{button.disabled=false;}
}
$('#book-pack-install').onclick=installGrammarBookPack;
document.addEventListener('authchange',renderBookPackControls);
renderBookPackControls();

$('#book-pack-restore').onclick=async()=>{if(!Auth.require()||Account.profile?.role!=='super_admin')return;const user=Auth.user,status=$('#book-pack-status');try{if(Account.conflicts.materials||Account.conflicts['shared:materials'])throw Error('Xử lý xung đột tài liệu trước.');const old=await AccountCache.read(Account.cacheKey('grammar-book-backup'),null);if(!old)throw Error('Thiết bị này chưa có bản sao trước khi thay.');if(user!==Auth.user)return;const all=Auth.get('materials',[]);Auth.set('materials',[...all.filter(c=>c.id!==old.id),old]);currentLesson=null;loadGrammar();await Account.flush();if(user===Auth.user)status.textContent='Đã khôi phục. Kiểm tra trạng thái đồng bộ trong Cài đặt.';}catch(e){status.textContent=e.message;}};
function renderGrammarEditorControl(){
 if(!currentLesson||!grammarCanEdit(currentLesson.collectionId))return;
 $('#grammar-lesson-tabs').insertAdjacentHTML('beforebegin','<div class="grammar-editor-tools"><button type="button" id="grammar-edit" class="secondary">✎ Sửa bài học</button><div id="grammar-editor"></div></div>');$('#grammar-edit').onclick=openGrammarEditor;
}
function validateGrammarEdit(title,level,content,exercises){
 if(!title.trim()||title.length>200)throw Error('Tiêu đề cần có nội dung, tối đa 200 ký tự.');
 if(!['A1','A2','B1','B2','C1'].includes(level))throw Error('Chọn cấp độ A1–C1.');
 if(!content.trim())throw Error('Nội dung không được để trống.');
 if(!Array.isArray(exercises)||exercises.some(e=>!e||!['fill','quiz','build'].includes(e.type)||typeof e.question!=='string'||!e.question.trim()||!Array.isArray(e.answers)||!e.answers.length||e.answers.some(a=>typeof a!=='string'||!a.trim())||(e.type==='quiz'&&(!Array.isArray(e.options)||e.options.some(o=>typeof o!=='string')||!e.answers.every(a=>e.options.includes(a))))||(e.type==='build'&&(!Array.isArray(e.tokens)||e.tokens.some(t=>typeof t!=='string')))))throw Error('Mỗi bài tập cần type (fill/quiz/build), question, answers; quiz cần options chứa đáp án, build cần tokens.');
 return {title:title.trim(),topic:title.trim(),level,content:content.trim(),exercises:exercises.map(e=>({...e,origin:'admin',answerSource:'admin'}))};
}
function openGrammarEditor(){
 materializeGrammarC1();
 const lesson=currentLesson;if(!lesson||!grammarCanEdit(lesson.collectionId))return;
 grammarEditorOwner=Auth.user;const target=$('#grammar-editor');target.innerHTML='<form id="grammar-edit-form"><label>Tiêu đề<input id="grammar-edit-title" maxlength="200" required></label><label>Cấp độ<select id="grammar-edit-level">'+['A1','A2','B1','B2','C1'].map(l=>'<option>'+l+'</option>').join('')+'</select></label><label>Nội dung bài học<textarea id="grammar-edit-content" rows="18" required></textarea></label><p class="help-text">Dùng ## cho tiêu đề, **chữ đậm**, - cho danh sách; bảng Markdown dùng dấu | để chia cột.</p><label>Bài tập (JSON)<textarea id="grammar-edit-exercises" rows="8"></textarea></label><p class="help-text">Mẫu: [{"type":"fill","question":"Ich ___ hier. (sein)","answers":["bin"],"explanation":"Ich đi với bin."}]. Để [] nếu chỉ có bài học.</p><div class="chat-tools"><button type="button" id="grammar-edit-preview" class="secondary">Xem trước</button><button type="submit">Lưu bài học</button><button type="button" id="grammar-edit-cancel" class="secondary">Hủy</button></div><p id="grammar-edit-status" role="status"></p><div id="grammar-edit-preview-body" class="learning-content formatted-content"></div></form>';
 $('#grammar-edit-title').value=lesson.title;$('#grammar-edit-level').value=lesson.level||'A1';$('#grammar-edit-content').value=lessonText(lesson.content);$('#grammar-edit-exercises').value=JSON.stringify(lesson.exercises||[],null,2);
 mountGrammarEditorTabs();
 $('#grammar-edit-cancel').onclick=()=>{grammarEditorOwner=null;target.replaceChildren();loadGrammar();};$('#grammar-edit-preview').onclick=()=>{$('#grammar-edit-preview-body').innerHTML=LearningContent.render($('#grammar-edit-content').value);};
 $('#grammar-edit-form').onsubmit=async event=>{
  event.preventDefault();const user=Auth.user,collectionId=lesson.collectionId,id=lesson.id,status=$('#grammar-edit-status'),button=event.submitter;if(button)button.disabled=true;
  try{
   if(!Auth.require()||!Account.canEdit('materials',collectionId))throw Error('Bạn không có quyền sửa bài này.');
   if(Account.conflicts.materials||Account.conflicts['shared:materials'])throw Error('Xử lý xung đột tài liệu trong Cài đặt trước.');
   const update=validateGrammarEdit($('#grammar-edit-title').value,$('#grammar-edit-level').value,$('#grammar-edit-content').value,parseGrammarExerciseCode($('#grammar-edit-exercises').value));
   const all=Auth.get('materials',[]),collection=all.find(c=>c.id===collectionId),item=collection?.items.find(l=>l.id===id);if(!item)throw Error('Bài học không còn tồn tại.');
   const fingerprint=v=>JSON.stringify([v.title,v.level,v.content,v.exercises]);if(fingerprint(item)!==fingerprint(lesson))throw Error('Bài đã thay đổi trong lúc sửa. Hãy sao chép bản đang sửa rồi mở lại để tránh ghi đè.');
   const baseline=JSON.stringify(all);await AccountCache.write(Account.cacheKey('grammar-edit-backup:'+id),structuredClone(item));if(user!==Auth.user)return;if(JSON.stringify(Auth.get('materials',[]))!==baseline)throw Error('Tài liệu vừa đồng bộ thay đổi. Giữ bản đang sửa và thử lưu lại để kiểm tra.');
   Object.assign(item,update,{updatedAt:Date.now()});if(Array.isArray(item.levels))item.levels=[update.level];delete item.sourceContent;delete item.aiAdditions;Auth.set('materials',all);grammarEditorOwner=null;currentLesson={...item,collectionId};exerciseIndex=0;renderLesson();renderLessonList();toast('Đã lưu bài học; đang đồng bộ…');await Account.flush();
  }catch(e){if(user===Auth.user)status.textContent=e.message;}finally{if(button)button.disabled=false;}
 };
}

function grammarSourceHTML(lesson){
 const links=(Array.isArray(lesson.reviewSources)?lesson.reviewSources:[]).flatMap(ref=>{try{const url=new URL(ref.url);return url.protocol==='https:'?['<li><a href="'+esc(url.href)+'" target="_blank" rel="noopener noreferrer">'+esc(ref.title||url.hostname)+'</a></li>']:[];}catch{return [];}});
 const note=lesson.sourceNote?'<p>'+esc(lesson.sourceNote)+'</p>':'';
 const pages=lesson.origin==='elio-c1-pdf-rewrite'?'<p>Sicher! C1 · Hueber Verlag · PDF '+esc((lesson.sourcePages||[]).join(', '))+'</p>':'';
 return note||links.length?'<details class="lesson-source-book"><summary>Nguồn và ghi chú biên soạn</summary>'+note+pages+(links.length?'<ul>'+links.join('')+'</ul>':'')+'</details>':'';
}

function parseGrammarExerciseCode(raw){
 const text=String(raw||'').trim().replace(/^\x60{3}(?:json)?\s*\n?/i,'').replace(/\n?\x60{3}\s*$/,'').trim();
 let data;try{data=JSON.parse(text||'[]');}catch{throw Error('Code bài tập phải là JSON hợp lệ. Có thể dán cả khối code json.');}
 return Array.isArray(data)?data:Array.isArray(data?.exercises)?data.exercises:data;
}
function grammarTabs(host,panels,labels,id){
 const nav=document.createElement('div');nav.id=id;nav.className='chat-tools grammar-tabs';nav.setAttribute('role','tablist');
 const show=index=>{panels.forEach((panel,i)=>{panel.hidden=i!==index;buttons[i].setAttribute('aria-selected',String(i===index));buttons[i].tabIndex=i===index?0:-1;});};
 const buttons=panels.map((panel,i)=>{panel.id=id+'-panel-'+i;panel.setAttribute('role','tabpanel');const b=document.createElement('button');b.type='button';b.className='secondary';b.id=id+'-tab-'+i;b.textContent=labels[i];b.setAttribute('role','tab');b.setAttribute('aria-controls',panel.id);panel.setAttribute('aria-labelledby',b.id);b.onclick=()=>show(i);b.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?panels.length-1:(i+(e.key==='ArrowRight'?1:panels.length-1))%panels.length;show(next);buttons[next].focus();};nav.append(b);return b;});
 host.prepend(nav);show(0);return nav;
}
function grammarTabLabels(){return {vi:['Nội dung tài liệu','Bài tập'],de:['Lerninhalt','Übungen'],en:['Learning material','Exercises']}[App.settings().language]||['Nội dung tài liệu','Bài tập'];}
function mountGrammarLessonTabs(){
 const host=$('#lesson-panel'),header=host.querySelector('.lesson-reader-header'),grid=host.querySelector('.lesson-reader-grid'),exercise=$('#grammar-exercise');if(!grid||!exercise)return;
 const practice=document.createElement('section');practice.className='grammar-practice-panel';exercise.before(practice);practice.append(exercise);host.append(practice);
 if(!visibleGrammarExercises(currentLesson).length){const p=document.createElement('p');p.textContent={vi:'Bài học này chưa có bài tập.',de:'Für diese Lektion gibt es noch keine Übungen.',en:'This lesson has no exercises yet.'}[App.settings().language]||'Bài học này chưa có bài tập.';practice.append(p);}
 const mindmap=document.createElement('section');host.append(mindmap);GrammarMindmap.mount(mindmap,currentLesson,lessonText(currentLesson.content),currentLesson.examples?lessonText(currentLesson.examples):'');
 LearningContextAI.mount(host,{title:currentLesson.title,level:currentLesson.level,text:lessonText(currentLesson.content)});
 const labels=grammarTabLabels();const nav=grammarTabs(host,[grid,mindmap,practice],[labels[0],GrammarMindmap.copy(App.settings().language).tab,labels[1]],'grammar-lesson-tabs');if(header)header.after(nav);
}
function mountGrammarEditorTabs(){
 const form=$('#grammar-edit-form'),content=$('#grammar-edit-content')?.closest('label'),exercise=$('#grammar-edit-exercises')?.closest('label');if(!form||!content||!exercise)return;
 const contentPanel=document.createElement('section'),exercisePanel=document.createElement('section'),contentHelp=content.nextElementSibling,exerciseHelp=exercise.nextElementSibling;
 content.before(contentPanel);contentPanel.append(content);if(contentHelp?.classList.contains('help-text'))contentPanel.append(contentHelp);
 exercise.before(exercisePanel);exercisePanel.append(exercise);if(exerciseHelp?.classList.contains('help-text'))exercisePanel.append(exerciseHelp);
 const field=$('#grammar-edit-exercises');field.spellcheck=false;field.style.fontFamily='ui-monospace, monospace';field.rows=16;
 const help=document.createElement('p');help.className='help-text';help.textContent='Dán mảng JSON hoặc khối code json chứa bài tập. Dữ liệu chỉ được áp dụng khi bấm Lưu bài học.';exercisePanel.prepend(help);
 const nav=grammarTabs(form,[contentPanel,exercisePanel],grammarTabLabels(),'grammar-editor-tabs');contentPanel.before(nav);
}

function grammarPracticeLabels(){return {vi:{title:'Sprachbausteine',hint:'Chọn câu để làm bài. Kiểm tra xong sẽ hiện đáp án và giải thích.',sheet:'Phiếu câu trả lời',question:'Câu',done:'Đã kiểm tra',prev:'Câu trước',next:'Câu tiếp',passage:'Ngữ cảnh',empty:'Chưa có ngữ cảnh bổ sung'},de:{title:'Sprachbausteine',hint:'Aufgabe wählen. Nach der Prüfung erscheinen Lösung und Erklärung.',sheet:'Antwortbogen',question:'Aufgabe',done:'Geprüft',prev:'Zurück',next:'Weiter',passage:'Lesetext',empty:'Kein zusätzlicher Lesetext'},en:{title:'Sprachbausteine',hint:'Choose a question. Check your answer to see the solution and explanation.',sheet:'Answer sheet',question:'Question',done:'Checked',prev:'Previous',next:'Next',passage:'Context',empty:'No additional context'}}[App.settings().language]||grammarPracticeLabels.vi;}
function renderExercise(){renderExerciseBody();decorateGrammarPractice();}
function renderGrammarResult(result){renderGrammarResultBody(result);decorateGrammarAnswer(result);}
function decorateGrammarPractice(){
 const host=$('#grammar-exercise');if(!host||host.querySelector('.sprach-shell'))return;
 const items=visibleGrammarExercises(currentLesson);if(!items.length)return;const labels=grammarPracticeLabels(),saved=Auth.get('grammarSession',{}),responses=saved.lessonId===currentLesson.id?saved.responses||{}:{},ex=items[exerciseIndex];
 const shell=document.createElement('div');shell.className='sprach-shell';
 const header=document.createElement('header');header.className='sprach-heading';header.innerHTML='<div><span class="sprach-eyebrow">'+esc((currentLesson.levels||[currentLesson.level]).includes($('#grammar-level')?.value)?$('#grammar-level').value:(currentLesson.levels||[currentLesson.level||'']).join(' · '))+' · GRAMMATIKTRAINING</span><h2>'+esc(labels.title)+'</h2><p>'+esc(labels.hint)+'</p></div><strong class="sprach-counter">'+Math.min(exerciseIndex+1,items.length)+' / '+items.length+'</strong>';
 const grid=document.createElement('div');grid.className='sprach-grid';const paper=document.createElement('section');paper.className='sprach-paper';
 if(ex){const context=lessonText(ex.passage||ex.context||ex.text||'');if(context){const passage=document.createElement('div');passage.className='sprach-passage learning-content';passage.innerHTML='<h3>'+esc(labels.passage)+'</h3>'+LearningContent.render(context);paper.append(passage);}}
 const question=document.createElement('div');question.className='sprach-question';while(host.firstChild)question.append(host.firstChild);paper.append(question);
 const options=question.querySelectorAll('[data-answer]');options.forEach((button,i)=>{const label=button.textContent;button.classList.add('sprach-option');button.innerHTML='<span class="sprach-letter">'+String.fromCharCode(65+i)+'</span><span>'+esc(label)+'</span><span class="sprach-choice" aria-hidden="true"></span>';button.setAttribute('aria-label',String.fromCharCode(65+i)+'. '+label);});
 const aside=document.createElement('aside');aside.className='sprach-sheet';aside.innerHTML='<h3>'+esc(labels.sheet)+'</h3>';const numbers=document.createElement('div');numbers.className='sprach-numbers';
 items.forEach((item,i)=>{const response=responses[i],valid=response?.exerciseKey===grammarExerciseKey(item),feedback=valid?response.feedback:null,b=document.createElement('button');b.type='button';b.textContent=String(i+1);b.className='sprach-number'+(i===exerciseIndex?' is-current':'')+(feedback?(feedback.good?' is-correct':' is-incorrect'):valid&&response.answer?' is-filled':'');b.setAttribute('aria-label',labels.question+' '+(i+1)+(feedback?' · '+labels.done:''));if(i===exerciseIndex)b.setAttribute('aria-current','step');b.onclick=()=>{exerciseIndex=i;renderExercise();};numbers.append(b);});aside.append(numbers);
 const progress=document.createElement('p');progress.className='help-text';progress.textContent=Object.entries(responses).filter(([i,r])=>r.feedback&&r.exerciseKey===grammarExerciseKey(items[Number(i)])).length+' / '+items.length+' · '+labels.done;aside.append(progress);
 const navigation=document.createElement('div');navigation.className='sprach-navigation';for(const [text,index]of [[labels.prev,exerciseIndex-1],[labels.next,exerciseIndex+1]]){const button=document.createElement('button');button.type='button';button.className='secondary';button.textContent=text;button.disabled=index<0||index>=items.length;button.onclick=()=>{exerciseIndex=index;renderExercise();};navigation.append(button);}aside.append(navigation);
 grid.append(paper,aside);shell.append(header,grid);host.append(shell);
 const snapshot=Auth.get('grammarSession',{});if(snapshot.lessonId===currentLesson.id&&snapshot.exerciseIndex===exerciseIndex&&snapshot.feedback)decorateGrammarAnswer(snapshot.feedback);
}
function decorateGrammarAnswer(result){
 const controls=$('#exercise-controls');if(!controls)return;
 controls.querySelectorAll('[data-answer]').forEach(button=>{button.disabled=true;const index=Number(button.dataset.answer),ex=visibleGrammarExercises(currentLesson)[exerciseIndex],text=ex?.options?.[index];const selected=text===result.answer;button.setAttribute('aria-pressed',String(selected));if(selected)button.classList.add(result.good?'is-correct':'is-incorrect');if((result.correct||[]).includes(text))button.classList.add('is-correct');});
 const input=$('#grammar-input');if(input)input.readOnly=true;
}
(function grammarPracticeStyle(){
 if(document.getElementById('grammar-practice-style'))return;const style=document.createElement('style');style.id='grammar-practice-style';style.textContent=`
 #grammar-exercise{background:transparent;padding:0;border:0}
 .sprach-shell{margin-top:18px;border:1px solid var(--line);border-radius:16px;overflow:hidden;color:var(--text)}
 .sprach-heading{display:flex;justify-content:space-between;gap:18px;padding:24px;background:var(--bg)}
 .sprach-heading h2{font-size:1.65rem;margin:5px 0;font-weight:700}.sprach-heading p{margin:0;max-width:60ch;font-size:1rem}
 .sprach-eyebrow{font-size:.8rem;font-weight:650;letter-spacing:.12em;color:var(--muted)}.sprach-counter{align-self:center;font-size:1.25rem;white-space:nowrap}
 .sprach-grid{display:grid;grid-template-columns:minmax(0,1fr) 220px}.sprach-paper{min-width:0;padding:28px;border-top:1px solid var(--line)}
 .sprach-question>h3{font-size:1.3rem;line-height:1.7;margin:20px 0;white-space:pre-wrap}.sprach-question>.tag{font-size:.85rem}
 .sprach-sheet{padding:22px 18px;border-top:1px solid var(--line);border-left:1px solid var(--line);align-self:stretch}.sprach-sheet h3{font-size:1rem;margin:0 0 16px;font-weight:700}
 .sprach-numbers{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.sprach-number{min-height:40px;padding:6px;background:transparent;color:var(--text);border:1px solid var(--line);border-radius:8px;font-weight:650}
 .sprach-number.is-current{outline:2px solid var(--accent,#26754b);outline-offset:2px}.sprach-number.is-filled{background:var(--line)}
 .sprach-number.is-correct,.sprach-option.is-correct{border-color:#32845a;background:rgba(50,132,90,.13)}.sprach-number.is-incorrect,.sprach-option.is-incorrect{border-color:#c45c4c;background:rgba(196,92,76,.12)}
 .sprach-question .options{display:grid;gap:10px}.sprach-option{display:flex!important;align-items:center;gap:14px;width:100%;text-align:left;padding:14px!important;border:1px solid var(--line)!important;border-radius:10px!important;background:transparent!important;color:var(--text)!important;font-size:1.05rem!important}
 .sprach-option:disabled{opacity:1}.sprach-letter{display:grid;place-items:center;width:32px;height:32px;flex-shrink:0;border:1px solid var(--line);border-radius:7px;font-weight:700}.sprach-choice{margin-left:auto;width:18px;height:18px;border:1px solid currentColor;border-radius:50%;flex-shrink:0}.sprach-option[aria-pressed="true"] .sprach-choice{background:var(--accent,#26754b);box-shadow:inset 0 0 0 4px var(--bg)}
 .sprach-option.is-correct{background:rgba(50,132,90,.13)!important;border-color:#32845a!important}.sprach-option.is-incorrect{background:rgba(196,92,76,.12)!important;border-color:#c45c4c!important}
 .sprach-question .answer-message{white-space:pre-line;line-height:1.75}.sprach-navigation{display:grid;gap:8px;margin-top:20px}.sprach-navigation button{font-size:.95rem;padding:10px}.sprach-passage{border-bottom:1px solid var(--line);padding-bottom:20px;margin-bottom:22px;font-size:1.08rem;line-height:1.85}
 .grammar-tabs [aria-selected="true"]{font-weight:750;border-bottom:3px solid var(--accent,#26754b)}
 @media(max-width:850px){.sprach-grid{grid-template-columns:1fr}.sprach-sheet{border-left:0}.sprach-numbers{grid-template-columns:repeat(auto-fill,minmax(40px,1fr))}.sprach-navigation{grid-template-columns:1fr 1fr}.sprach-heading{padding:18px}.sprach-paper{padding:18px}}
 `;document.head.append(style);
})();






GrammarImport.mountManual();
