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
  const tbody=wrap.querySelector('tbody'),rowLanguage=language(),relatedLabel=esc(text('Đồng nghĩa & cụm từ','Synonyme & Wendungen','Synonyms & phrases'));wrap.addEventListener('toggle',event=>{const node=event.target;if(!node.matches?.('[data-word-related]')||!node.open||node.dataset.loaded)return;node.dataset.loaded='1';node.querySelector('div').innerHTML=Vocabulary.relatedHTML(deck.items[Number(node.dataset.wordRelated)]);},true);let offset=0;function batch(){if(d.renderToken!==token)return;const rows=deck.items.slice(offset,offset+150).map((w,i)=>'<tr><td><strong>'+esc(w.de)+'</strong><details data-word-related="'+(offset+i)+'"><summary>'+relatedLabel+'</summary><div></div></details></td><td>'+esc(Vocabulary.meaning(w,rowLanguage))+'</td><td>'+Vocabulary.typeHTML(w)+'</td><td>'+Vocabulary.examplesHTML(w)+'</td></tr>').join('');tbody.insertAdjacentHTML('beforeend',rows);offset+=150;if(offset<deck.items.length)(window.requestAnimationFrame||setTimeout)(batch);}
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
     const entries=byCategory.get(category)||[],group=document.createElement('details');group.className='vocab-parent-group';
     const summary=document.createElement('summary');summary.className='vocab-parent-tab';
     const title=document.createElement('strong');title.textContent=category;
     const count=document.createElement('small');count.textContent=entries.length+' '+text('bộ từ','Wortsets','word sets');
     const arrow=document.createElement('span');arrow.className='vocab-parent-arrow';arrow.textContent='⌄';arrow.setAttribute('aria-hidden','true');
     summary.append(title,count,arrow);group.append(summary);
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
