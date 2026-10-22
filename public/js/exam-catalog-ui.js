'use strict';
// Presentation adapter: existing selectors, handlers and exam data remain authoritative.
(()=>{
 const setup=document.getElementById('exam-setup');
 if(!setup||typeof setup.before!=='function')return;
 const select=id=>document.getElementById(id);
 const catalog=document.createElement('section');
 catalog.className='exam-catalog';catalog.setAttribute('aria-label','Exam · Level · Collection');
 setup.before(catalog);
 const summary=setup.querySelector(':scope > summary');
 summary.replaceChildren(document.createTextNode('Exam · Audio/Bilder · Import'));
 const arrow=document.createElement('span');arrow.className='exam-setup-arrow';arrow.textContent='⌄';summary.append(arrow);
 let expanded=null,viewTab='sets';
 const names={Goethe:'Goethe-Zertifikat',Telc:'telc Deutsch','ÖSD':'ÖSD Zertifikat'};
 const lang=()=>App.settings().language||'vi';
 const labels=()=>({vi:{choose:'Chọn cấp độ để xem bộ đề.',sets:'Bộ đề',empty:'Chưa có bộ đề.',hint:'Nhấp bộ muốn mở · vuốt danh sách để xem thêm',tools:'Exam · Audio/Bilder · Import'},en:{choose:'Choose a level to view collections.',sets:'Collections',empty:'No collections available.',hint:'Select a collection · scroll for more',tools:'Exam · Audio/Bilder · Import'},de:{choose:'Niveau wählen und Sammlungen ansehen.',sets:'Sammlungen',empty:'Keine Sammlung vorhanden.',hint:'Sammlung auswählen · für mehr scrollen',tools:'Exam · Audio/Bilder · Import'}})[lang()]||{choose:'Choose a level',sets:'Collections',empty:'No collections',hint:'Select a collection'};
 function choose(id,value){const field=select(id);field.value=value;field.dispatchEvent(new Event('change',{bubbles:true}));}
 const tabNames=()=>({vi:['Bộ đề','Luyện kỹ năng','Thi thử'],en:['Collections','Skill practice','Mock exam'],de:['Sammlungen','Fertigkeiten','Probeprüfung']})[lang()]||['Collections','Skill practice','Mock exam'];
 function start(mode,skill,part){if(mode)choose('sim-mode',mode);if(skill)choose('sim-skill',skill);if(part)choose('sim-part',part);select('sim-start').click();}
 function folderPicker(parent){const label=document.createElement('label');label.textContent=labels().sets;const picker=document.createElement('select');picker.setAttribute('aria-label',labels().sets);for(const folder of select('sim-folder').options){const item=document.createElement('option');item.value=folder.value;item.textContent=folder.text;picker.append(item);}picker.value=select('sim-folder').value;picker.onchange=()=>choose('sim-folder',picker.value);label.append(picker);parent.append(label);}
 function collections(parent,t){
  const hint=document.createElement('p');hint.className='help-text';hint.textContent=t.hint;
  const list=document.createElement('div');list.className='exam-catalog-collections';list.setAttribute('role','region');list.setAttribute('aria-label',t.sets);
  const folders=[...select('sim-folder').options];
  if(!folders.length){const empty=document.createElement('p');empty.textContent=t.empty;list.append(empty);}
  for(const folder of folders){const button=document.createElement('button');button.type='button';button.className='exam-catalog-collection';const name=document.createElement('span');name.textContent=folder.text;const next=document.createElement('span');next.textContent='↗';next.setAttribute('aria-hidden','true');button.append(name,next);button.onclick=()=>{choose('sim-folder',folder.value);start();};list.append(button);}
  parent.append(hint,list);
 }
 function activity(parent){
  const t=labels(),exam=select('sim-exam').value,level=select('sim-level').value;
  const heading=document.createElement('h3');heading.textContent=exam+' · '+level;
  const tabs=document.createElement('div');tabs.className='exam-catalog-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label',exam+' '+level);
  const panel=document.createElement('div');panel.className='exam-catalog-tab-panel';panel.id='exam-catalog-panel';panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby','exam-catalog-tab-'+viewTab);
  ['sets','skills','mock'].forEach((key,i)=>{const b=document.createElement('button');b.type='button';b.id='exam-catalog-tab-'+key;b.textContent=tabNames()[i];b.setAttribute('role','tab');b.setAttribute('aria-selected',String(viewTab===key));b.setAttribute('aria-controls',panel.id);b.onclick=()=>{viewTab=key;render();document.getElementById(b.id)?.focus();};tabs.append(b);});
  parent.append(heading,tabs,panel);
  if(viewTab==='sets'){collections(panel,t);return;}
  folderPicker(panel);
  const profile=examProfile();
  if(viewTab==='mock'){
   const blocks=document.createElement('div');blocks.className='exam-catalog-time-blocks';
   for(const block of profile.blocks){const row=document.createElement('p');row.textContent=block.name+' · '+block.minutes+' min';blocks.append(row);}
   const open=document.createElement('button');open.type='button';open.className='exam-catalog-start';open.textContent=({vi:'Bắt đầu thi thử →',en:'Start mock exam →',de:'Probeprüfung starten →'})[lang()]||'Start →';open.onclick=()=>start('full');panel.append(blocks,open);return;
  }
  const skills=document.createElement('div');skills.className='exam-catalog-skills';
  for(const module of profile.modules){const detail=document.createElement('details');detail.className='exam-catalog-skill';const summary=document.createElement('summary');summary.textContent=module.name+' · '+module.parts.length+' Teil';const body=document.createElement('div');
   const whole=document.createElement('button');whole.type='button';whole.textContent=({vi:'Luyện trọn kỹ năng',en:'Practice full skill',de:'Fertigkeit üben'})[lang()]||module.name;whole.onclick=()=>start('module',module.key);body.append(whole);
   for(const part of module.parts){const b=document.createElement('button');b.type='button';b.textContent='Teil '+part.teil+' · '+part.name+' ↗';b.onclick=()=>start('part',module.key,String(part.teil));body.append(b);}
   detail.append(summary,body);skills.append(detail);
  }
  panel.append(skills);
 }
 function render(){
  const exam=select('sim-exam').value,level=select('sim-level').value,t=labels();
  catalog.replaceChildren();
  for(const option of select('sim-exam').options){
   const card=document.createElement('article');card.className='exam-catalog-card'+(option.value===exam?' selected':'');
   const head=document.createElement('button');head.type='button';head.className='exam-catalog-head';head.setAttribute('aria-expanded',String(expanded===option.value));
   const mark=document.createElement('span');mark.className='exam-catalog-mark';mark.textContent=option.value==='Telc'?'telc':option.value;
   const text=document.createElement('span');text.className='exam-catalog-copy';const title=document.createElement('strong');title.textContent=names[option.value]||option.text;const sub=document.createElement('small');sub.textContent=t.choose;text.append(title,sub);
   const caret=document.createElement('span');caret.className='exam-catalog-caret';caret.textContent=expanded===option.value?'⌃':'⌄';head.append(mark,text,caret);
   head.onclick=()=>{const wasOpen=expanded===option.value;expanded=wasOpen?null:option.value;if(exam!==option.value)choose('sim-exam',option.value);render();};
   const levels=document.createElement('div');levels.className='exam-catalog-levels';levels.setAttribute('role','group');levels.setAttribute('aria-label',option.text+' · Level');
   for(const item of select('sim-level').options){const button=document.createElement('button');button.type='button';button.textContent=item.text;button.setAttribute('aria-pressed',String(option.value===exam&&item.value===level));button.onclick=()=>{expanded=option.value;if(select('sim-exam').value!==option.value)choose('sim-exam',option.value);choose('sim-level',item.value);render();};levels.append(button);}
   card.append(head,levels);
   if(expanded===option.value&&option.value===exam){
    const contents=document.createElement('div');contents.className='exam-catalog-contents';
    activity(contents);card.append(contents);
   }
   catalog.append(card);
  }
 }
 // Refresh only from the original controls, including imports and restored sessions.
 document.addEventListener('change',event=>{if(['sim-exam','sim-level','sim-folder'].includes(event.target.id))queueMicrotask(render);});
 new MutationObserver(render).observe(select('sim-folder'),{childList:true});
 document.addEventListener('exam-library-change',()=>queueMicrotask(render));
 render();
})();
