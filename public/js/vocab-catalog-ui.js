'use strict';
(()=>{
 const quiz=location.pathname.endsWith('/quiz.html'),main=$('main');if(!main)return;
 const language=()=>App.settings().language||'vi',text=(vi,de,en)=>({vi,de,en})[language()]||vi;
 const admin=()=>Account.profile?.role==='super_admin';
 let catalogCache=null,catalogRevision=0;
 function decks(){if(catalogCache)return catalogCache;const vocab=Auth.get('vocab',[]),materials=Auth.get('materials',[]),collections=new Map(materials.filter(c=>c.type==='vocabulary').map(c=>[c.id,c]));catalogCache=VocabCatalog.decks(vocab,materials);for(const d of catalogCache)d.levels=new Set(d.items.length?d.items.map(w=>vocabularyLevel(w,collections).toLowerCase()):[(d.level||'unknown').toLowerCase()]);catalogRevision++;return catalogCache;}

 // Keep the original nodes, IDs, handlers, game engine, import and AI tools intact.
 const mine=document.createElement('div');mine.id='vocab-mine';const workspace=main.querySelector('.workspace.vocab'),practice=main.querySelector('.vocabulary-practice');if(!workspace?.before)return;workspace.before(mine);mine.append(workspace,practice);
 if(quiz){const source=$('#game-source'),level=$('#game-level');function labels(){const l=VocabCatalog.labels[language()]||VocabCatalog.labels.vi;for(const o of source.options)o.textContent=l[o.value]||l.all;level.options[0].textContent=text('Mọi cấp độ','Alle Niveaus','All levels');}labels();document.addEventListener('languagechange',labels);
 function requestedDeck(){if(!location.hash.startsWith('#deck='))return;let id;try{id=decodeURIComponent(location.hash.slice(6));}catch{return;}if(!decks().some(d=>d.id===id))return;source.value='all';level.value='all';renderPracticeDecks();const select=$('#game-deck');if(select.value!==id){select.value=id;select.onchange();}}
 window.addEventListener('hashchange',requestedDeck);requestedDeck();return;}
 // The library opens sets as cards; the game engine remains mounted only for compatibility.
 practice.hidden=true;practice.setAttribute('aria-hidden','true');
 const originalSelect=$('#vocab-deck');originalSelect.closest('label').hidden=true;
 for(const id of ['vocab-deck-details-toggle','vocab-deck-rename','vocab-deck-delete'])$('#'+id).hidden=true;
 $('#vocab-deck-details').hidden=true;
 const personal=originalSelect.closest('.panel'),personalGrid=document.createElement('div'),personalDetail=document.createElement('div');
 personalGrid.className='vocab-catalog-grid personal-deck-grid';personalDetail.className='vocab-catalog-detail';personal.append(personalGrid,personalDetail);
 const opened=new Map();
 const tabs=document.createElement('nav');tabs.className='vocab-catalog-tabs';tabs.setAttribute('aria-label','Wortschatz');mine.before(tabs);
 const panels=new Map(),imports=new Map();let active='topic';
 for(const key of ['topic','level','industry']){
  const panel=document.createElement('section');panel.className='vocab-catalog-panel';panel.dataset.catalogPanel=key;panel.id='vocab-catalog-'+key;panel.innerHTML='<h2></h2><div class="vocab-catalog-admin" hidden></div><div class="vocab-catalog-grid"></div><div class="vocab-catalog-detail" aria-live="polite"></div>';mine.before(panel);panels.set(key,panel);
 }
 function canManage(deck){try{Vocabulary.planDeckChange(deck.id);return true;}catch{return false;}}
 function openDeck(deck,panel){
  const d=panel.querySelector('.vocab-catalog-detail');const signature=catalogRevision+':'+language()+':'+deck.id;if(d.deckSignature===signature&&d.firstChild)return;d.deckSignature=signature;opened.set(panel,deck.id);d.replaceChildren();const token={};d.renderToken=token;
  const heading=document.createElement('div');heading.className='catalog-detail-heading';const h=document.createElement('h3');h.textContent=deck.name;heading.append(h);
  const actions=document.createElement('div');actions.className='catalog-actions';
  const learn=document.createElement('a');learn.className='button';learn.textContent=text('Học trong Quiz →','Im Quiz lernen →','Study in Quiz →');learn.href='quiz.html#deck='+encodeURIComponent(deck.id);actions.append(learn);
  const status=document.createElement('p');status.setAttribute('role','status');
  if(canManage(deck))for(const [remove,label]of [[false,text('Đổi tên','Umbenennen','Rename')],[true,text('× Xóa bộ','× Löschen','× Delete set')]]){
   const button=document.createElement('button');button.type='button';button.className='secondary';button.textContent=label;
   button.onclick=async()=>{const item=decks().find(v=>v.id===deck.id);if(!item)return;await changeVocabularyDeck(remove,item.id);status.textContent=$('#vocab-deck-manage-status').textContent;};actions.append(button);
  }
  const close=document.createElement('button');close.type='button';close.className='secondary';close.textContent=text('Thu gọn','Schließen','Close');close.onclick=()=>{opened.delete(panel);d.renderToken=null;d.deckSignature=null;d.replaceChildren();};actions.append(close);heading.append(actions);d.append(heading,status);
  const wrap=document.createElement('div');wrap.className='table-wrap';wrap.innerHTML='<table class="learning-table"><thead><tr><th>Deutsch</th><th>'+esc(text('Nghĩa','Bedeutung','Meaning'))+'</th><th>'+esc(text('Loại từ','Wortart','Word class'))+'</th><th>'+esc(text('Ví dụ','Beispiel','Example'))+'</th></tr></thead><tbody></tbody></table>';d.append(wrap);
  const tbody=wrap.querySelector('tbody'),rowLanguage=language(),relatedLabel=esc(text('Đồng nghĩa & cụm từ','Synonyme & Wendungen','Synonyms & phrases'));wrap.addEventListener('toggle',event=>{const node=event.target;if(!node.matches?.('[data-word-related]')||!node.open||node.dataset.loaded)return;node.dataset.loaded='1';node.querySelector('div').innerHTML=Vocabulary.relatedHTML(deck.items[Number(node.dataset.wordRelated)]);},true);let offset=0;function batch(){if(d.renderToken!==token)return;const rows=deck.items.slice(offset,offset+150).map((w,i)=>'<tr><td><span class="vocab-word-audio"><strong>'+esc(w.de)+'</strong>'+VocabularySpeech.controls(w.de)+'</span><details data-word-related="'+(offset+i)+'"><summary>'+relatedLabel+'</summary><div></div></details></td><td>'+esc(Vocabulary.meaning(w,rowLanguage))+'</td><td>'+Vocabulary.typeHTML(w)+'</td><td>'+Vocabulary.examplesHTML(w)+'</td></tr>').join('');tbody.insertAdjacentHTML('beforeend',rows);offset+=150;if(offset<deck.items.length)(window.requestAnimationFrame||setTimeout)(batch);}
  batch();
 }
 function deckCard(deck,panel){
  const card=document.createElement('div');card.className='vocab-deck-card';
  const b=document.createElement('button');b.type='button';b.className='secondary vocab-catalog-card';
  const title=document.createElement('strong');title.textContent=deck.name;
  const count=document.createElement('small');count.textContent=deck.items.length+' '+text('từ','Wörter','words')+(deck.source!=='industry'&&deck.level?' · '+deck.level:'');
  const arrow=document.createElement('span');arrow.className='deck-card-arrow';arrow.textContent='↗';b.append(title,count,arrow);b.onclick=()=>openDeck(deck,panel);card.append(b);
  if(canManage(deck)){
   const actions=document.createElement('div');actions.className='catalog-actions deck-card-management';
   const status=document.createElement('p');status.setAttribute('role','status');status.className='deck-card-status';
   for(const [remove,label,icon] of [[false,text('Sửa tên','Umbenennen','Rename'),'✎'],[true,text('Xóa bộ','Set löschen','Delete set'),'×']]){
    const button=document.createElement('button');button.type='button';button.className='secondary';button.textContent=icon+' '+label;button.setAttribute('aria-label',label+': '+deck.name);
    button.onclick=async()=>{button.disabled=true;await changeVocabularyDeck(remove,deck.id);status.textContent=$('#vocab-deck-manage-status').textContent;button.disabled=false;};actions.append(button);
   }
   card.append(actions,status);
  }
  return card;
 }

 const tabButtons=new Map(),rendered=new Map();
 for(const key of ['topic','level','industry','mine']){const b=document.createElement('button');b.type='button';b.setAttribute('aria-controls',key==='mine'?'vocab-mine':'vocab-catalog-'+key);b.onclick=()=>select(key);tabs.append(b);tabButtons.set(key,b);}
 function refresh(){
  const labels=VocabCatalog.labels[language()]||VocabCatalog.labels.vi;
  for(const [key,b]of tabButtons){if(b.textContent!==labels[key])b.textContent=labels[key];b.className=active===key?'':'secondary';b.setAttribute('aria-selected',String(active===key));}
  for(const [key,panel]of panels)if(panel.hidden!==(active!==key))panel.hidden=active!==key;
  if(mine.hidden!==(active!=='mine'))mine.hidden=active!=='mine';
  const all=decks(),level=($('#vocab-level').value||'A1').toLowerCase(),signature=catalogRevision+':'+language()+':'+(active==='mine'?level:'');
  const panel=active==='mine'?personal:panels.get(active);
  if(rendered.get(active)!==signature){
   const grid=active==='mine'?personalGrid:panel.querySelector('.vocab-catalog-grid');grid.replaceChildren();
   if(active==='mine'){
    const selected=all.filter(d=>d.source==='mine'&&d.levels.has(level));for(const deck of selected)grid.append(deckCard(deck,panel));if(!selected.length)grid.textContent=text('Cấp độ này chưa có bộ từ.','Keine Wortsets auf diesem Niveau.','No word sets at this level.');
   }else{
    panel.querySelector('h2').textContent=labels[active];const filtered=all.filter(d=>d.source===active),byCategory=new Map();for(const d of filtered){const k=active==='level'?d.level:d.category||text('Chưa phân loại','Nicht zugeordnet','Unclassified');if(!byCategory.has(k))byCategory.set(k,[]);byCategory.get(k).push(d);}
    const categories=active==='industry'?[...new Set([...VocabCatalog.industries,...byCategory.keys()])]:active==='level'?VocabCatalog.levels:[...byCategory.keys()];
    for(const category of categories){
     const entries=byCategory.get(category)||[],group=document.createElement('details');group.className='vocab-parent-group';group.dataset.kind=active;
     const summary=document.createElement('summary');summary.className='vocab-parent-tab';
     const title=document.createElement('strong');title.textContent=category;
     const count=document.createElement('small');count.textContent=entries.length+' '+text('bộ từ','Wortsets','word sets');
     const arrow=document.createElement('span');arrow.className='vocab-parent-arrow';arrow.textContent='⌄';arrow.setAttribute('aria-hidden','true');
     const icon=document.createElement('span');icon.className='vocab-parent-icon';icon.setAttribute('aria-hidden','true');icon.textContent=active==='level'?({A1:'🌱',A2:'🌿',B1:'🌳',B2:'✦',C1:'🌴',C2:'✧'}[category]||'📚'):active==='industry'?'💼':'📚';
     const caption=document.createElement('span');caption.className='vocab-parent-caption';caption.append(title,count);
     if(active!=='topic'){
      const levelIndex=Math.max(0,VocabCatalog.levels.indexOf(category));
      const professionPaths={
       'Điều dưỡng':'M12 3v18M3 12h18',
       'Nhà hàng, khách sạn':'M4 18h16M5 15a7 7 0 0 1 14 0M12 5v3',
       'Đầu bếp':'M7 14a4 4 0 1 1-2-7 5 5 0 0 1 9-2 4 4 0 1 1 3 9v6H7z',
       'Khách sạn':'M4 20V8h16v12M8 8V4h8v4M9 20v-5h6v5',
       'Bán hàng':'M4 8h16l-1 12H5zM8 8V6a4 4 0 0 1 8 0v2',
       'Mẫu câu bán hàng':'M4 4h16v12H9l-5 4zM8 8h8M8 12h5',
       'Trợ lý nha khoa':'M8 4c-5-1-5 7-2 10l2 6 3-5h2l3 5 2-6c3-3 3-11-2-10l-4 1z',
       'Xây dựng':'M3 19h18M5 16V9l7-5 7 5v7M10 19v-6h4v6',
       'Nghề nail':'M8 21V10a4 4 0 0 1 8 0v11M9 10h6M10 3h4',
       'Công nghệ ô tô':'M4 16V9h16v7M6 9l2-5h8l2 5M6 16v3M18 16v3M7 12h1M16 12h1',
       'Lái xe ô tô':'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M3 11h18M12 12v9',
       'Cơ khí':'M14 4a6 6 0 0 0-7 7L3 17l4 4 6-6a6 6 0 0 0 7-7l-4 4-4-4z',
       'Công nghệ và điện tử':'M7 7h10v10H7zM9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4',
       'Điện':'M13 2 5 14h6l-1 8 9-13h-6z',
       'Kinh doanh':'M4 19V5M4 19h16M8 15l4-5 4 2 4-7',
       'Khoa học':'M9 3h6M10 3v7l-6 9h16l-6-9V3M7 15h10',
       'Trường học và giáo dục':'M3 5h7l2 2 2-2h7v14h-7l-2 2-2-2H3zM12 7v14',
       'Chính trị':'M3 9l9-6 9 6zM5 12v7M12 12v7M19 12v7M3 21h18',
       'Toán học':'M5 5h6M8 2v6M15 5h6M5 14l6 6M11 14l-6 6M15 15h6M15 19h6',
       'Khoa học máy tính':'M3 4h18v13H3zM8 21h8M12 17v4M7 9l-2 2 2 2M17 9l2 2-2 2',
       'Vật liệu':'M12 3l9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5'
      };
      const path=active==='level'?Array.from({length:3},(_,i)=>{const h=5+(i+1)*(levelIndex+2)/2;return 'M'+(5+i*6)+' 20v-'+h.toFixed(1);}).join(' '):(professionPaths[category]||'M12 3l9 9-9 9-9-9zM8 12h8M12 8v8');
      icon.textContent='';icon.innerHTML='<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="'+path+'"/></svg>';
     }
     summary.append(icon,caption,arrow);if(active==='level'){const badge=document.createElement('span');badge.className='vocab-level-badge';badge.textContent=category;summary.append(badge);}group.append(summary);
     const children=document.createElement('div');children.className='vocab-child-tabs';
     group.addEventListener('toggle',()=>{summary.setAttribute('aria-expanded',String(group.open));if(!group.open)return;for(const sibling of grid.children)if(sibling!==group&&sibling.tagName==='DETAILS')sibling.open=false;});
     summary.setAttribute('aria-expanded','false');
     for(const deck of entries)children.append(deckCard(deck,panel));
     if(!entries.length){const p=document.createElement('p');p.className='muted';p.textContent=text('Chưa có bộ từ.','Noch keine Sets.','No word sets yet.');children.append(p);}
     group.append(children);grid.append(group);
    }
    if(!categories.length)grid.textContent=text('Chưa có bộ từ chung. Admin có thể import tài liệu tại đây.','Noch keine gemeinsamen Wortsets.','No shared word sets yet.');panel.querySelector('.vocab-catalog-admin').hidden=!admin();
   }
   rendered.set(active,signature);
  }
  const id=opened.get(panel);if(id){const deck=all.find(d=>d.id===id);if(deck)openDeck(deck,panel);else{const detail=panel.querySelector('.vocab-catalog-detail');detail.renderToken=null;detail.replaceChildren();opened.delete(panel);}}
 }
 $('#vocab-level').addEventListener('change',()=>{opened.delete(personal);personalDetail.renderToken=null;personalDetail.deckSignature=null;personalDetail.replaceChildren();refresh();});
 function select(key){if(active===key)return;active=key;refresh();}
 function invalidate(){catalogCache=null;refresh();}
 function mountImports(){for(const [key,panel]of panels){const host=panel.querySelector('.vocab-catalog-admin');host.hidden=!admin();if(!admin()){host.replaceChildren();imports.delete(key);continue;}if(imports.has(key))continue;host.innerHTML='<div class="import-destination"><label>'+esc(text('Nhóm đích (chọn hoặc nhập mới)','Zielgruppe','Destination group'))+'<input data-category list="catalog-options-'+key+'" maxlength="100" value="'+esc(key==='level'?'A1':key==='industry'?VocabCatalog.industries[0]:'Cuộc sống hằng ngày')+'"><datalist id="catalog-options-'+key+'"></datalist></label>'+'</div><div id="catalog-import-'+key+'"></div>';const list=host.querySelector('datalist');const choices=key==='industry'?VocabCatalog.industries:key==='level'?VocabCatalog.levels:['Cuộc sống hằng ngày','Gia đình','Giao thông','Nhà ở','Sức khỏe','Mua sắm'];list.innerHTML=choices.map(v=>'<option value="'+esc(v)+'"></option>').join('');
 const context=()=>{const c=VocabCatalog.context(host,key);if(key==='level'&&!VocabCatalog.levels.includes(c.category))throw Error('Chọn cấp độ từ A1 đến C2.');return c;};ImportHub.mount('vocabulary',collection=>{onVocabularyImported(collection);invalidate();},'#catalog-import-'+key,{context});imports.set(key,true);}}
 for(const e of ['vocabchange','cloudchange','elioviewresume'])document.addEventListener(e,invalidate);document.addEventListener('languagechange',refresh);document.addEventListener('authchange',()=>{catalogCache=null;mountImports();refresh();});mountImports();refresh();
})();
