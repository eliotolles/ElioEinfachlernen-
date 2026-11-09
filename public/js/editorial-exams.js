'use strict';
// Reference catalogue layout, using the existing simulator and import/edit controls.
(()=>{
 const setup=document.getElementById('exam-setup');if(!setup)return;
 const P=ElioEditorialPages,main=setup.closest('main'),oldCatalog=main.querySelector('.exam-catalog');
 document.body.classList.add('ed-exam-page');
 if(oldCatalog)oldCatalog.hidden=true;
 const oldHeader=main.querySelector('.page-title'),eyebrow=main.querySelector(':scope>.eyebrow');if(oldHeader)oldHeader.hidden=true;if(eyebrow)eyebrow.hidden=true;
 const header=document.createElement('div'),catalog=document.createElement('div'),filters=document.createElement('section'),list=document.createElement('section'),tabs=document.createElement('nav');
 catalog.className='ep-exam-catalog';catalog.setAttribute('aria-label','Chọn kỳ thi và cấp độ');filters.className='ep-surface ep-exam-filters';list.className='ep-exam-sets';tabs.className='ep-category-tabs';tabs.setAttribute('aria-label','Kỹ năng luyện thi');
 setup.before(header,catalog,filters);const format=main.querySelector('.exam-format-details');format.after(tabs,list);
 const e=esc,$id=id=>document.getElementById(id),change=(id,value)=>{const field=$id(id);field.value=value;field.dispatchEvent(new Event('change',{bubbles:true}));};
 let level=$id('sim-level').value,exam=$id('sim-exam').value,skill='all',status='all',query='';
 const labels={reading:'Lesen',listening:'Hören',grammar:'Sprachbausteine',writing:'Schreiben',speaking:'Sprechen'};
 const normalize=s=>({lesen:'reading',hören:'listening',hoeren:'listening',schreiben:'writing',sprechen:'speaking',sprachbausteine:'grammar'})[String(s).toLowerCase()]||s;
 const rows=()=>ImportHub.summaries('exam').map(c=>({...c,exam:canonicalExam(c.exam),items:c.items.map(t=>({...t,skill:normalize(t.skill)}))}));
 const started=c=>{const active=Auth.get('activeExam',null),attempts=Auth.get('examAttempts',[]);if(attempts.some(a=>a.selection?.folder==='import:'+c.id&&a.finished))return 'submitted';return active?.selection?.folder==='import:'+c.id?'progress':'new';};
 const titles={new:'Chưa bắt đầu',progress:'Đang làm',submitted:'Đã nộp bài'};
 function room(){const visible=typeof simulation!=='undefined'&&!!simulation;for(const node of [main.querySelector('.exam-room'),$id('exam-skill-tabs'),$id('sim-feedback')])if(node)node.hidden=!visible;}
 function chooseExam(id,l=level){exam=id;level=l;change('sim-exam',id);if(l!=='all')change('sim-level',l);render();}
 function start(id,item){const c=rows().find(c=>c.id===id);if(!c)return;change('sim-exam',c.exam||exam);change('sim-level',c.level||$id('sim-level').value);change('sim-folder','import:'+id);if(item){change('sim-mode','part');change('sim-skill',item.skill);change('sim-part',String(item.teil||1));}else change('sim-mode','module');$id('sim-start').click();room();if(simulation)main.querySelector('.exam-room').scrollIntoView({behavior:'smooth',block:'start'});}
 function renderSets(){
  const found=rows().filter(c=>(!c.exam||c.exam===exam)&&(level==='all'||!c.level||c.level===level)&&(skill==='all'||c.items.some(t=>t.skill===skill))&&(status==='all'||started(c)===status)&&c.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  list.innerHTML=`<div class="ep-exam-list-heading"><h2>${e(exam)} · ${level==='all'?'Tất cả cấp độ':e(level)} · ${found.length} bộ</h2><button class="ep-button" data-clear>Xóa bộ lọc</button></div>`;
  list.querySelector('[data-clear]').onclick=()=>{level='all';skill='all';status='all';query='';render();};
  if(!found.length){const empty=document.createElement('div');empty.className='ep-surface ep-exam-empty';empty.textContent='Chưa có bộ đề phù hợp. Chọn bộ lọc khác hoặc import tài liệu của bạn.';list.append(empty);}
  for(const c of found){const article=document.createElement('article');article.className='ep-surface ep-exam-set';article.innerHTML=`<header><div><div class="ep-eyebrow">${e(c.exam||exam)} · ${e(c.level||level)}</div><h2>${e(c.name)}</h2></div><small>${titles[started(c)]}</small></header><details class="ep-exam-source"><summary>Bộ tài liệu nguồn · ${c.items.length} phần</summary><p>${e(c.name)}</p><button class="ep-button" data-open>Thực hành bộ đề →</button></details><div class="ep-exam-parts"></div><details class="ep-exam-management"><summary>Chỉnh sửa / quản lý bộ đề</summary><button class="ep-button" data-manage>Mở quản lý bộ đề</button></details>`;
   article.querySelector('[data-open]').onclick=()=>start(c.id);
   const manage=article.querySelector('.ep-exam-management');manage.hidden=!Account.canEdit('materials',c.id);article.querySelector('[data-manage]').onclick=()=>{if(oldCatalog){oldCatalog.hidden=false;change('sim-folder','import:'+c.id);oldCatalog.scrollIntoView({behavior:'smooth',block:'start'});}};
   for(const item of c.items.filter(t=>skill==='all'||t.skill===skill)){const part=document.createElement('section');part.className='ep-exam-part';part.innerHTML=`<p>${e(labels[item.skill]||item.skill)} · Teil ${e(item.teil||1)}</p><h3>${e(item.title||c.name)}</h3><small>Theo câu hỏi và đáp án trong tài liệu nguồn</small><button class="ep-button">${started(c)==='progress'?'Tiếp tục':'Bắt đầu'} →</button>`;part.querySelector('button').onclick=()=>start(c.id,item);article.querySelector('.ep-exam-parts').append(part);}list.append(article);
  }
 }
 function render(){
  header.innerHTML=P.header('PHÒNG LUYỆN THI','Luyện thi tiếng Đức','Prüfungstraining','Chọn kỳ thi, cấp độ, bộ đề và phần muốn luyện. Bài làm và đáp án nguồn được giữ theo từng tài liệu.','<button class="ep-button" data-import>＋ Import đề thi</button>');header.querySelector('[data-import]').onclick=()=>{setup.open=true;setup.scrollIntoView({behavior:'smooth',block:'start'});};
  catalog.innerHTML='';for(const id of ['Goethe','Telc','ÖSD']){const card=document.createElement('article');card.className='ep-surface ep-exam-exam';card.innerHTML=`<button class="ep-exam-exam-title" aria-pressed="${exam===id}">${{Goethe:'Goethe-Zertifikat',Telc:'telc Deutsch','ÖSD':'ÖSD Zertifikat'}[id]} <small>· ${rows().filter(c=>c.exam===id).length} bộ</small></button><p>Chọn cấp độ để xem bộ đề.</p><div></div>`;card.querySelector('button').onclick=()=>chooseExam(id,'all');for(const l of [...$id('sim-level').options].map(o=>o.value)){const b=document.createElement('button');b.className='ep-button';b.textContent=l;b.setAttribute('aria-pressed',String(exam===id&&level===l));b.onclick=()=>chooseExam(id,l);card.querySelector('div').append(b);}catalog.append(card);}
  filters.innerHTML=`<label>Kỳ thi<select data-filter="exam">${['Goethe','Telc','ÖSD'].map(id=>`<option ${id===exam?'selected':''}>${id}</option>`).join('')}</select></label><label>Cấp độ<select data-filter="level">${['all',...[...$id('sim-level').options].map(o=>o.value)].map(l=>`<option value="${l}" ${l===level?'selected':''}>${l==='all'?'Tất cả cấp độ':l}</option>`).join('')}</select></label><label>Trạng thái<select data-filter="status"><option value="all">Tất cả trạng thái</option>${Object.entries(titles).map(([id,title])=>`<option value="${id}" ${id===status?'selected':''}>${title}</option>`).join('')}</select></label><label>Tìm bộ đề<input type="search" placeholder="PETRA, EVA…" value="${e(query)}"></label>`;
  filters.querySelector('[data-filter=exam]').onchange=ev=>chooseExam(ev.target.value,'all');filters.querySelector('[data-filter=level]').onchange=ev=>{level=ev.target.value;if(level!=='all')change('sim-level',level);render();};filters.querySelector('[data-filter=status]').onchange=ev=>{status=ev.target.value;renderSets();};filters.querySelector('input').oninput=ev=>{query=ev.target.value;renderSets();};
  tabs.innerHTML='';for(const [id,title]of [['all','Tất cả kỹ năng'],...Object.entries(labels)]){const b=document.createElement('button');b.className='ep-button';b.setAttribute('aria-pressed',String(id===skill));b.textContent=title;b.onclick=()=>{skill=id;render();};tabs.append(b);}renderSets();room();
 }
 for(const event of ['exam-library-change','cloudchange','languagechange'])document.addEventListener(event,render);
 const originalStart=$id('sim-start').onclick;$id('sim-start').onclick=()=>{originalStart();room();};render();
})();
