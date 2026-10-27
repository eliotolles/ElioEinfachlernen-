'use strict';
const TutorLibrary={
 page:0,query:'',ready:false,ideas:null,loading:false,
 mount(){
  const workspace=document.querySelector('.workspace');if(!workspace)return;
  const root=document.createElement('section');root.id='tutor-library';root.className='panel tutor-library';
  root.innerHTML='<h2>Các bộ giao tiếp thường ngày</h2><p>Chọn từng bộ để đọc câu hỏi, câu trả lời mẫu và gợi ý khác. Bấm vào từ tiếng Đức để xem nghĩa.</p><div id="tutor-library-sets" class="tutor-library-sets"></div><div class="tutor-library-modes"><button type="button" id="tutor-read-mode" aria-pressed="true">Đọc & học câu</button><button type="button" id="tutor-chat-mode" class="secondary" aria-pressed="false">Luyện với AI Tutor</button></div><div id="tutor-reading"><label>Tìm trong bộ<input id="tutor-search" type="search" placeholder="Tìm câu hỏi hoặc từ Đức–Việt…"></label><p id="tutor-reading-count" role="status"></p><div id="tutor-reading-items"></div><div class="tutor-library-pagination"><button type="button" id="tutor-prev" class="secondary">← Trang trước</button><span id="tutor-page"></span><button type="button" id="tutor-next" class="secondary">Trang sau →</button></div></div>';
  workspace.before(root);
  const importPanel=$('#tutor-import-panel');root.querySelector('.tutor-library-modes').before(importPanel);$('#tutor-collection').closest('label').hidden=true;
  this.ready=true;this.mode(false);
  $('#tutor-read-mode').onclick=()=>this.mode(false);$('#tutor-chat-mode').onclick=()=>this.mode(true);
  $('#tutor-search').oninput=e=>{this.query=e.target.value;this.page=0;this.renderItems();};
  $('#tutor-prev').onclick=()=>{this.page=Math.max(0,this.page-1);this.renderItems();};$('#tutor-next').onclick=()=>{this.page++;this.renderItems();};
  if(!tutorCollection()&&tutorCollections().length)$('#tutor-collection').value=tutorCollections()[0].id;
  $('#tutor-topic').disabled=!!tutorCollection();this.render();
 },
 mode(chat){$('#tutor-collection').closest('label').hidden=!chat;document.querySelector('.workspace').hidden=!chat;$('#tutor-reading').hidden=chat;$('#tutor-read-mode').setAttribute('aria-pressed',String(!chat));$('#tutor-chat-mode').setAttribute('aria-pressed',String(chat));},
 render(){
  if(!this.ready)return;
  const sets=$('#tutor-library-sets');sets.replaceChildren();
  for(const c of tutorCollections()){
   const b=document.createElement('button');b.type='button';b.className='secondary tutor-set-card';b.setAttribute('aria-pressed',String(tutorCollection()?.id===c.id));
   const title=document.createElement('strong');title.textContent=c.name;const count=document.createElement('small');count.textContent=c.items.length+' câu · Đức–Việt';b.append(title,count);
   b.onclick=()=>{$('#tutor-collection').value=c.id;this.page=0;this.query='';$('#tutor-search').value='';renderTutorReference();loadConversation();};sets.append(b);
  }
  if(!sets.children.length)sets.textContent='Chưa có bộ. Mở “Thêm bộ phỏng vấn từ TXT” để nhập tài liệu.';
  let publish=$('#tutor-publish-shared');
  const canPublish=typeof Account!=='undefined'&&Account.profile?.role==='super_admin'&&!!tutorCollection()&&!Account.isShared('materials',tutorCollection().id);
  if(canPublish){if(!publish){publish=document.createElement('button');publish.id='tutor-publish-shared';publish.type='button';publish.className='secondary';publish.textContent='Chia sẻ bộ này cho mọi user';sets.after(publish);const status=document.createElement('p');status.id='tutor-publish-status';status.setAttribute('role','status');publish.after(status);}publish.hidden=false;publish.onclick=publishTutorCollection;}
  else if(publish)publish.hidden=true;
  this.renderItems();this.loadIdeas();
 },
 async loadIdeas(){
  if(this.loading||this.ideas)return;this.loading=true;
  try{const response=await fetch('data/housekeeping-answer-ideas.json');if(!response.ok)throw Error('Không tải được gợi ý');const data=await response.json();if(!Array.isArray(data.items))throw Error('Gợi ý không hợp lệ');this.ideas=new Map(data.items.map(x=>[x.question,x]));this.renderItems();}
  catch{const host=$('#tutor-reading-count');if(host){host.append(document.createTextNode(' Chưa tải được gợi ý bổ sung. '));const retry=document.createElement('button');retry.type='button';retry.className='secondary';retry.textContent='Tải lại gợi ý';retry.onclick=()=>this.loadIdeas();host.append(retry);}}finally{this.loading=false;}
 },
 german(host,text,collection,translation){host.lang='de';WordDictionary.text(host,text,{collection:collection.name,level:$('#speak-level').value,translation,sourceLabel:'Câu trong bộ giao tiếp'});},
 renderItems(){
  if(!this.ready)return;const c=tutorCollection(),host=$('#tutor-reading-items');host.replaceChildren();
  const normalize=x=>String(x||'').toLocaleLowerCase('de').normalize('NFD').replace(/\p{M}/gu,'');const query=normalize(this.query);
  const rows=(c?.items||[]).filter(q=>{const idea=this.ideas?.get(q.question);return normalize([q.question,q.answerDe,q.answerVi,idea?.de,idea?.vi].join(' ')).includes(query);});
  const pages=Math.max(1,Math.ceil(rows.length/10));this.page=Math.min(this.page,pages-1);
  $('#tutor-reading-count').textContent=c?c.name+' · '+rows.length+' / '+c.items.length+' câu':'Chọn một bộ để bắt đầu đọc.';
  $('#tutor-page').textContent='Trang '+(this.page+1)+' / '+pages;$('#tutor-prev').disabled=this.page===0;$('#tutor-next').disabled=this.page>=pages-1;
  for(const q of rows.slice(this.page*10,this.page*10+10)){
   const card=document.createElement('article');card.className='tutor-phrase-card';
   const number=document.createElement('small');number.textContent='Câu '+q.number;const heading=document.createElement('h3');this.german(heading,q.question,c,'');card.append(number,heading);
   const add=(label,de,vi)=>{const caption=document.createElement('h4');caption.textContent=label;const text=document.createElement('p');this.german(text,de,c,vi);const meaning=document.createElement('p');meaning.className='tutor-meaning';meaning.textContent=vi;card.append(caption,text,meaning);};
   add('Câu trả lời mẫu',q.answerDe,q.answerVi);
   const idea=this.ideas?.get(q.question);if(idea)add('Gợi ý trả lời khác',idea.de,idea.vi);
   host.append(card);
  }
  if(c&&rows.length===0){const empty=document.createElement('p');empty.textContent='Không tìm thấy câu phù hợp.';host.append(empty);}
  if(c?.source){const rescue=c.source.match(/CÂU CỨU NGUY[^\n]*\n+([\s\S]*)$/);if(rescue){const details=document.createElement('details');details.className='tutor-rescue';const title=document.createElement('summary');title.textContent='Câu cứu nguy khi nghe chưa rõ';details.append(title);for(const pair of rescue[1].trim().split(/\n\s*\n/)){const [de,...vi]=pair.split('\n');const text=document.createElement('p');this.german(text,de,c,vi.join(' '));const meaning=document.createElement('p');meaning.className='tutor-meaning';meaning.textContent=vi.join(' ');details.append(text,meaning);}host.append(details);}}
 }
};

