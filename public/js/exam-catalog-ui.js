'use strict';
const ExamCollectionEdits={
 setListeningHidden(ids,hidden,user){
  if(Auth.user!==user)throw Error('Tài khoản đã thay đổi.');
  const selected=new Set(ids),all=Auth.get('materials',[]),members=all.filter(c=>selected.has(c.id));
  if(!selected.size||members.length!==selected.size||members.some(c=>c.type!=='exam'||!Account.canEdit('materials',c.id)))throw Error('Bạn không có quyền chỉnh sửa bộ đề này.');
  let count=0;
  const updated=all.map(c=>{if(!selected.has(c.id))return c;const archived=c.archivedItems||[];
   const moving=(hidden?c.items:archived).filter(t=>t.skill==='listening');if(!moving.length)return c;count+=moving.length;
   return {...c,items:hidden?c.items.filter(t=>t.skill!=='listening'):[...c.items,...moving.filter(t=>!c.items.some(old=>old.id===t.id))],archivedItems:hidden?[...archived,...moving]:archived.filter(t=>t.skill!=='listening')};
  });
  if(count){Auth.set('materials',updated);document.dispatchEvent(new Event('exam-library-change'));}
  return count;
 },
 save(id,patch,expected,user){
  if(Auth.user!==user||!Account.canEdit('materials',id))throw Error('Bạn không có quyền chỉnh sửa bộ đề này.');
  const all=Auth.get('materials',[]),old=all.find(c=>c.id===id&&c.type==='exam');
  if(!old)throw Error('Bộ đề không còn tồn tại.');
  if(JSON.stringify(old)!==expected)throw Error('Bộ đề đã thay đổi trong lúc chỉnh sửa. Hãy mở lại để lấy bản mới.');
  const name=String(patch.name||'').trim();
  if(!name||name.length>100)throw Error('Tên bộ đề cần từ 1 đến 100 ký tự.');
  if(!Array.isArray(patch.items)||patch.items.length!==old.items.length||patch.items.some((t,i)=>t.id!==old.items[i].id))throw Error('Không được thay ID của các phần thi.');
  const items=old.items.map((t,i)=>{const edit=patch.items[i];if(typeof edit.title!=='string'||!edit.title.trim()||typeof edit.content!=='string'||!edit.content.trim())throw Error('Mỗi phần thi cần tiêu đề và nội dung.');if(edit.questions!==undefined&&!Array.isArray(edit.questions))throw Error('Danh sách câu hỏi cần là một mảng.');return {...t,title:edit.title.trim(),content:edit.content.trim(),...(edit.questions!==undefined?{questions:edit.questions}:{})};});
  const updated={...old,name,items,updatedAt:Date.now()};Auth.set('materials',all.map(c=>c.id===id?updated:c));document.dispatchEvent(new Event('exam-library-change'));return updated;
 }
};
// Presentation adapter: existing selectors, handlers and exam data remain authoritative.
(()=>{
 const setup=document.getElementById('exam-setup');
 if(!setup||typeof setup.before!=='function')return;
 const select=id=>document.getElementById(id);
 const catalog=document.createElement('section');
 catalog.className='exam-catalog';catalog.setAttribute('aria-label','Exam · Level · Collection');
 setup.before(catalog);
 const summary=setup.querySelector(':scope > summary');
 summary.replaceChildren(document.createTextNode('Audio/Bilder · Import'));
 const arrow=document.createElement('span');arrow.className='exam-setup-arrow';arrow.textContent='⌄';summary.append(arrow);
 // Retain the original controller fields without showing a second exam picker.
 const originalFields=setup.querySelector('.exam-setup-fields');
 if(originalFields){
  const retained=document.createElement('div');retained.hidden=true;retained.className='exam-catalog-original-controls';
  for(const child of [...originalFields.children])if(child.tagName!=='DETAILS'&&child.id!=='import-zone')retained.append(child);
  originalFields.prepend(retained);
  const selectionError=document.getElementById('exam-selection-error');if(selectionError)setup.before(selectionError);
 }
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
  const catalogRows=Account.project('materials',rows=>rows.map(c=>({id:c.id,type:c.type,groupName:c.groupName,items:(c.items||[]).map(t=>({skill:t.skill})),archivedItems:(c.archivedItems||[]).map(t=>({skill:t.skill}))})));
  const catalogById=new Map(catalogRows.map(c=>[c.id,c]));
  const groups=new Map();
  for(const folder of folders){const collection=folder.value.startsWith('import:')?catalogById.get(folder.value.slice(7)):null;const groupName=collection?.groupName;let target=list;if(groupName){if(!groups.has(groupName)){const detail=document.createElement('details');detail.className='exam-catalog-group';const summary=document.createElement('summary');summary.textContent=groupName;const children=document.createElement('div');children.className='exam-catalog-collections';children.setAttribute('role','region');children.setAttribute('aria-label',groupName);detail.append(summary,children);groups.set(groupName,{detail,children,summary,count:0,ids:[]});}const group=groups.get(groupName);group.count++;group.ids.push(collection.id);group.summary.textContent=groupName+' · '+group.count+' bộ đề';target=group.children;}const row=document.createElement('div');row.className='exam-catalog-collection-row';const button=document.createElement('button');button.type='button';button.className='exam-catalog-collection';const name=document.createElement('span');name.textContent=folder.text;const next=document.createElement('span');next.textContent='↗';next.setAttribute('aria-hidden','true');button.append(name,next);button.onclick=()=>{choose('sim-folder',folder.value);start();};row.append(button);
   if(folder.value.startsWith('import:')&&typeof Account!=='undefined'){
    const id=folder.value.slice(7),collection=catalogById.get(id);
    if(collection&&Account.canEdit('materials',id)){
     const edit=document.createElement('button');edit.type='button';edit.className='exam-catalog-edit';edit.textContent=({vi:'Sửa',en:'Edit',de:'Bearbeiten'})[lang()]||'Edit';edit.setAttribute('aria-label',edit.textContent+' · '+folder.text);edit.onclick=()=>editCollection(id);
     const remove=document.createElement('button');remove.type='button';remove.className='exam-catalog-delete';remove.textContent='×';remove.setAttribute('aria-label','Xóa bộ đề · '+folder.text);remove.onclick=()=>{if(!Account.canEdit('materials',id)||!confirm('Xóa bộ đề này? Bài đã làm vẫn được giữ.'))return;Auth.set('materials',Auth.get('materials',[]).filter(c=>c.id!==id));document.dispatchEvent(new Event('exam-library-change'));};row.append(edit,remove);
    }
   }
   target.append(row);
  }
  for(const group of groups.values()){
   const members=catalogRows.filter(c=>group.ids.includes(c.id));
   if(typeof Account!=='undefined'&&members.length&&members.every(c=>Account.canEdit('materials',c.id))){
    const hidden=!members.some(c=>c.items.some(t=>t.skill==='listening'));
    if(!hidden||members.some(c=>(c.archivedItems||[]).some(t=>t.skill==='listening'))){
     const toggle=document.createElement('button');toggle.type='button';toggle.className='secondary';toggle.textContent=hidden?'Khôi phục bài nghe':'Bỏ bài nghe';
     toggle.onclick=async()=>{try{const count=ExamCollectionEdits.setListeningHidden(group.ids,!hidden,Auth.user);toast((hidden?'Đã khôi phục ':'Đã bỏ ')+count+' phần nghe.');if(Account.flush){await Account.flush();const key=Account.profile?.role==='super_admin'?'shared:materials':'materials';toast(Account.pending?.[key]||Account.conflicts?.[key]?'Thay đổi đang chờ đồng bộ.':'Đã đồng bộ bộ đề ✓');}}catch(error){toast(error.message);}};
     group.detail.append(toggle);
    }
   }
  }
  parent.append(hint,list,...[...groups.values()].map(g=>g.detail));
 }
 function editCollection(id){
  if(!Account.canEdit('materials',id))return;
  const collection=Auth.get('materials',[]).find(c=>c.id===id&&c.type==='exam');if(!collection)return;
  const expected=JSON.stringify(collection),user=Auth.user,dialog=document.createElement('dialog');dialog.className='exam-collection-editor';const form=document.createElement('form');
  const heading=document.createElement('div');heading.className='exam-collection-editor-heading';const title=document.createElement('h2');title.textContent='Chỉnh sửa bộ đề';const close=document.createElement('button');close.type='button';close.className='exam-catalog-delete';close.textContent='×';close.setAttribute('aria-label','Đóng trình chỉnh sửa');close.onclick=()=>dialog.close();heading.append(title,close);form.append(heading);
  const field=(parent,label,value,multiline=false)=>{const wrap=document.createElement('label');wrap.textContent=label;const input=document.createElement(multiline?'textarea':'input');input.value=value||'';if(multiline)input.rows=7;wrap.append(input);parent.append(wrap);return input;};
  const name=field(form,'Tên bộ đề',collection.name);name.maxLength=100;
  const editors=collection.items.map((item,index)=>{const detail=document.createElement('details');const label=document.createElement('summary');label.textContent=(index+1)+'. '+item.title;detail.append(label);const titleInput=field(detail,'Tiêu đề',item.title),content=field(detail,'Nội dung đề',item.content,true);const advanced=document.createElement('details');const summary=document.createElement('summary');summary.textContent='Câu hỏi & đáp án · nâng cao';advanced.append(summary);const questions=field(advanced,'Dữ liệu câu hỏi (JSON)',JSON.stringify(item.questions||[],null,2),true);detail.append(advanced);form.append(detail);return {item,titleInput,content,questions};});
  const status=document.createElement('p');status.setAttribute('role','alert');const save=document.createElement('button');save.type='submit';save.textContent='Lưu thay đổi';form.append(status,save);dialog.append(form);document.body.append(dialog);dialog.addEventListener('close',()=>dialog.remove());
  form.onsubmit=async event=>{event.preventDefault();try{const items=editors.map(e=>({...e.item,title:e.titleInput.value,content:e.content.value,...((e.item.questions!==undefined||e.questions.value.trim()!=='[]')?{questions:JSON.parse(e.questions.value)}:{})}));ExamCollectionEdits.save(id,{name:name.value,items},expected,user);dialog.close();toast('Đã lưu thay đổi trên thiết bị.');if(Account.flush){await Account.flush();const key=Account.profile?.role==='super_admin'?'shared:materials':'materials';if(Account.conflicts?.[key]||Account.pending?.[key])toast('Thay đổi đang chờ đồng bộ. Kiểm tra trạng thái trong Cài đặt.');else toast('Đã đồng bộ bộ đề ✓');}}catch(error){if(dialog.isConnected)status.textContent=error.message;else toast('Chưa đồng bộ bộ đề: '+error.message);}};
  dialog.showModal();
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


