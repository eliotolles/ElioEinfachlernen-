'use strict';
(()=>{
 const quiz=location.pathname.endsWith('/quiz.html'),main=$('main');if(!main)return;
 const language=()=>App.settings().language||'vi',text=(vi,de,en)=>({vi,de,en})[language()]||vi;
 const admin=()=>Account.profile?.role==='super_admin';
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
 function decks(){return VocabCatalog.decks(Auth.get('vocab',[]),Auth.get('materials',[]));}
 function canManage(deck){try{Vocabulary.planDeckChange(deck.id);return true;}catch{return false;}}
 function openDeck(deck,panel){
  const d=panel.querySelector('.vocab-catalog-detail');opened.set(panel,deck.id);d.replaceChildren();const token={};d.renderToken=token;
  const heading=document.createElement('div');heading.className='catalog-detail-heading';const h=document.createElement('h3');h.textContent=deck.name;heading.append(h);
  const actions=document.createElement('div');actions.className='catalog-actions';
  const learn=document.createElement('a');learn.className='button';learn.textContent=text('Học trong Quiz →','Im Quiz lernen →','Study in Quiz →');learn.href='quiz.html#deck='+encodeURIComponent(deck.id);actions.append(learn);
  const status=document.createElement('p');status.setAttribute('role','status');
  if(canManage(deck))for(const [remove,label]of [[false,text('Đổi tên','Umbenennen','Rename')],[true,text('× Xóa bộ','× Löschen','× Delete set')]]){
   const button=document.createElement('button');button.type='button';button.className='secondary';button.textContent=label;
   button.onclick=async()=>{const item=decks().find(v=>v.id===deck.id);if(!item)return;const level=item.items[0]?vocabularyLevel(item.items[0]):item.level;$('#vocab-level').value=VocabCatalog.levels.includes(level)?level:'unknown';renderDecks();originalSelect.value=item.id;await changeVocabularyDeck(remove);status.textContent=$('#vocab-deck-manage-status').textContent;};actions.append(button);
  }
  const close=document.createElement('button');close.type='button';close.className='secondary';close.textContent=text('Thu gọn','Schließen','Close');close.onclick=()=>{opened.delete(panel);d.renderToken=null;d.replaceChildren();};actions.append(close);heading.append(actions);d.append(heading,status);
  const wrap=document.createElement('div');wrap.className='table-wrap';wrap.innerHTML='<table class="learning-table"><thead><tr><th>Deutsch</th><th>'+esc(text('Nghĩa','Bedeutung','Meaning'))+'</th><th>'+esc(text('Loại từ','Wortart','Word class'))+'</th><th>'+esc(text('Ví dụ','Beispiel','Example'))+'</th></tr></thead><tbody></tbody></table>';d.append(wrap);
  const tbody=wrap.querySelector('tbody');let offset=0;function batch(){if(d.renderToken!==token)return;const rows=deck.items.slice(offset,offset+150).map(w=>'<tr><td><strong>'+esc(w.de)+'</strong>'+Vocabulary.relatedHTML(w)+'</td><td>'+esc(Vocabulary.meaning(w))+'</td><td>'+esc(w.type||'—')+'</td><td>'+esc(w.example||'—')+(w.exampleVi?'<br><small>'+esc(w.exampleVi)+'</small>':'')+'</td></tr>').join('');tbody.insertAdjacentHTML('beforeend',rows);offset+=150;if(offset<deck.items.length)(window.requestAnimationFrame||setTimeout)(batch);}
  batch();
 }
 function deckCard(deck,panel){const b=document.createElement('button');b.type='button';b.className='secondary vocab-catalog-card';const title=document.createElement('strong');title.textContent=deck.name;const count=document.createElement('small');count.textContent=deck.items.length+' '+text('từ','Wörter','words')+(deck.level?' · '+deck.level:'');const arrow=document.createElement('span');arrow.className='deck-card-arrow';arrow.textContent='↗';b.append(title,count,arrow);b.onclick=()=>openDeck(deck,panel);return b;}
 function refresh(){
  const all=decks(),labels=VocabCatalog.labels[language()]||VocabCatalog.labels.vi;tabs.replaceChildren();
  for(const key of ['topic','level','industry','mine']){const b=document.createElement('button');b.type='button';b.textContent=labels[key];b.className=active===key?'':'secondary';b.setAttribute('aria-selected',String(active===key));b.setAttribute('aria-controls',key==='mine'?'vocab-mine':'vocab-catalog-'+key);b.onclick=()=>select(key);tabs.append(b);}
  for(const [key,panel]of panels){panel.hidden=active!==key;panel.querySelector('h2').textContent=labels[key];const grid=panel.querySelector('.vocab-catalog-grid');grid.replaceChildren();const filtered=all.filter(d=>d.source===key);const categories=key==='industry'?[...new Set([...VocabCatalog.industries,...filtered.map(d=>d.category)])]:key==='level'?VocabCatalog.levels:[...new Set(filtered.map(d=>d.category||text('Chưa phân loại','Nicht zugeordnet','Unclassified')))];
   for(const category of categories){const entries=filtered.filter(d=>(key==='level'?d.level:d.category)===category);const group=document.createElement('section');group.className='vocab-catalog-group';const h=document.createElement('h3');h.textContent=category;group.append(h);for(const deck of entries)group.append(deckCard(deck,panel));if(!entries.length){const p=document.createElement('p');p.className='muted';p.textContent=text('Chưa có bộ từ.','Noch keine Sets.','No word sets yet.');group.append(p);}grid.append(group);}
   if(!categories.length)grid.textContent=text('Chưa có bộ từ chung. Admin có thể import tài liệu tại đây.','Noch keine gemeinsamen Wortsets.','No shared word sets yet.');panel.querySelector('.vocab-catalog-admin').hidden=!admin();
  }
  personalGrid.replaceChildren();const level=$('#vocab-level').value||'A1';const selected=all.filter(d=>d.source==='mine'&&(d.items.some(w=>vocabularyLevel(w).toLowerCase()===level.toLowerCase())||!d.items.length&&(d.level||'unknown').toLowerCase()===level.toLowerCase()));for(const deck of selected)personalGrid.append(deckCard(deck,personal));if(!selected.length)personalGrid.textContent=text('Cấp độ này chưa có bộ từ.','Keine Wortsets auf diesem Niveau.','No word sets at this level.');
  for(const [panel,id]of opened){const deck=all.find(d=>d.id===id);if(deck)openDeck(deck,panel);else{panel.querySelector('.vocab-catalog-detail').replaceChildren();opened.delete(panel);}}
  mine.hidden=active!=='mine';
 }
 $('#vocab-level').addEventListener('change',()=>{opened.delete(personal);personalDetail.replaceChildren();refresh();});
 function select(key){active=key;refresh();}
 function mountImports(){for(const [key,panel]of panels){const host=panel.querySelector('.vocab-catalog-admin');host.hidden=!admin();if(!admin()){host.replaceChildren();imports.delete(key);continue;}if(imports.has(key))continue;host.innerHTML='<div class="import-destination"><label>'+esc(text('Nhóm đích (chọn hoặc nhập mới)','Zielgruppe','Destination group'))+'<input data-category list="catalog-options-'+key+'" maxlength="100" value="'+esc(key==='level'?'A1':key==='industry'?VocabCatalog.industries[0]:'Cuộc sống hằng ngày')+'"><datalist id="catalog-options-'+key+'"></datalist></label><label>'+esc(text('Cấp độ khi import','Importniveau','Import level'))+'<select data-catalog-level>'+VocabCatalog.levels.map(l=>'<option>'+l+'</option>').join('')+'</select></label></div><div id="catalog-import-'+key+'"></div>';const list=host.querySelector('datalist');const choices=key==='industry'?VocabCatalog.industries:key==='level'?VocabCatalog.levels:['Cuộc sống hằng ngày','Gia đình','Giao thông','Nhà ở','Sức khỏe','Mua sắm'];list.innerHTML=choices.map(v=>'<option value="'+esc(v)+'"></option>').join('');if(key==='level'){host.querySelector('[data-category]').oninput=()=>{const v=host.querySelector('[data-category]').value.toUpperCase();if(VocabCatalog.levels.includes(v))host.querySelector('[data-catalog-level]').value=v;};host.querySelector('[data-catalog-level]').onchange=e=>host.querySelector('[data-category]').value=e.target.value;}
 const context=()=>{const c=VocabCatalog.context(host,key);if(key==='level'&&!VocabCatalog.levels.includes(c.category))throw Error('Chọn cấp độ từ A1 đến C2.');return c;};ImportHub.mount('vocabulary',collection=>{onVocabularyImported(collection);refresh();},'#catalog-import-'+key,{context});imports.set(key,true);}}
 for(const e of ['vocabchange','languagechange','cloudchange'])document.addEventListener(e,refresh);document.addEventListener('authchange',()=>{mountImports();refresh();});mountImports();refresh();
})();
