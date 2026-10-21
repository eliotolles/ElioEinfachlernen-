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
 let expanded=null;
 const names={Goethe:'Goethe-Zertifikat',Telc:'telc Deutsch','ÖSD':'ÖSD Zertifikat'};
 const lang=()=>App.settings().language||'vi';
 const labels=()=>({vi:{choose:'Chọn cấp độ để xem bộ đề.',sets:'Bộ đề',empty:'Chưa có bộ đề.',hint:'Nhấp bộ muốn mở · vuốt danh sách để xem thêm',tools:'Exam · Audio/Bilder · Import'},en:{choose:'Choose a level to view collections.',sets:'Collections',empty:'No collections available.',hint:'Select a collection · scroll for more',tools:'Exam · Audio/Bilder · Import'},de:{choose:'Niveau wählen und Sammlungen ansehen.',sets:'Sammlungen',empty:'Keine Sammlung vorhanden.',hint:'Sammlung auswählen · für mehr scrollen',tools:'Exam · Audio/Bilder · Import'}})[lang()]||{choose:'Choose a level',sets:'Collections',empty:'No collections',hint:'Select a collection'};
 function choose(id,value){const field=select(id);field.value=value;field.dispatchEvent(new Event('change',{bubbles:true}));}
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
    const heading=document.createElement('h3');heading.textContent=t.sets+' · '+exam+' '+level;
    const hint=document.createElement('p');hint.className='help-text';hint.textContent=t.hint;
    const list=document.createElement('div');list.className='exam-catalog-collections';list.setAttribute('role','region');list.setAttribute('aria-label',t.sets);
    const folders=[...select('sim-folder').options];
    if(!folders.length){const empty=document.createElement('p');empty.textContent=t.empty;list.append(empty);}
    for(const folder of folders){const button=document.createElement('button');button.type='button';button.className='exam-catalog-collection';const name=document.createElement('span');name.textContent=folder.text;const next=document.createElement('span');next.textContent='↗';next.setAttribute('aria-hidden','true');button.append(name,next);button.onclick=()=>{choose('sim-folder',folder.value);select('sim-start').click();};list.append(button);}
    contents.append(heading,hint,list);card.append(contents);
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
