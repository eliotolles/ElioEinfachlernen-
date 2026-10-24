'use strict';
// Presentation metadata only: source IDs, answer keys and grading stay intact.
const TelcExam={
 skill(value){return ({lesen:'reading',reading:'reading',sprachbausteine:'grammar',grammar:'grammar',hören:'listening',hoeren:'listening',listening:'listening'})[String(value||'').toLowerCase()]||String(value||'');},
 supported(task){return /telc/i.test(task.exam||'')&&['reading','grammar','listening'].includes(this.skill(task.skill));},
 kind(task){const skill=this.skill(task.skill),part=Number(task.teil||task.part);return skill==='reading'?(part===1?'headings':part===3?'advertisements':'multiple-choice'):skill==='grammar'?(part===2?'word-bank':'cloze'):'listening';},
 bank(value){
  if(!Array.isArray(value))return [];
  return value.flatMap((row,i)=>{
   if(typeof row==='string'){const match=row.trim().match(/^([a-z])[.)·:]\s+([\s\S]+)$/i);return [{label:match?match[1]:String.fromCharCode(97+i),text:match?match[2]:row}];}
   if(!row||typeof row!=='object')return [];
   const text=row.text||row.content||row.title||row.word||'',label=String(row.label||row.key||String.fromCharCode(97+i));
   return typeof text==='string'&&text.trim()?[{...row,label,text}]:[];
  });
 },
 sourceChoices(task,question){
  const labels=question.options||[];if(labels.length!==3||labels.some(v=>!/^[abc]$/i.test(v)))return null;
  const number=Number(question.sourceNumber||question.number||String(question.prompt||'').match(/^(?:\s*|Lücke\s+)(\d+)/i)?.[1]);if(!Number.isInteger(number))return null;
  const clean=line=>line.trim().replace(/^\*\*|\*\*$/g,'');
  const plain=q=>String(q.prompt||q.question||'').replace(/^\s*\d+[.)]\s*/,'').trim().replace(/\s+/g,' ');
  const lines=String(task.content||'').split(/\r?\n/).map(clean),numbered=new RegExp('^\\s*'+number+'[.)]\\s+');
  let start=lines.findIndex(line=>numbered.test(line));
  // Some legacy imports lost list markers while retaining every source line.
  // Require an exact stem prefix from the original question; never guess text.
  if(start<0)for(let i=0;i<lines.length;i++)if(lines[i].length>=10&&plain(question).startsWith(lines[i].replace(/\s+/g,' ')))start=i;
  if(start<0)return null;
  const stem=lines[start].replace(numbered,'').trim(),other=(task.questions||[]).filter(q=>q!==question&&plain(q)!==plain(question));
  const body=[];for(let i=start+1;i<lines.length;i++){const line=lines[i];if(/^\d{1,3}[.)]\s+|^---$|^#{1,3}\s|^Trang\s+\d+/i.test(line)||line.length>=10&&other.some(q=>plain(q).startsWith(line.replace(/\s+/g,' '))))break;if(line)body.push(line);}
  const texts={},order=[],pending=[];let active=null,invalid=false;
  const put=(label,text)=>{label=label.toUpperCase();if(texts[label]||!text.trim()){invalid=true;return;}texts[label]=text.trim();order.push(label);};
  const flush=()=>{if(pending.length){if(!active){invalid=true;return;}texts[active]+=' '+pending.join(' ');pending.length=0;}};
  for(const line of body){
   const before=line.match(/^([abc])[.)·:]?\s+(.+)$/i),after=line.match(/^(.+?)\s+([abc])[.)]?$/i),single=line.match(/^([abc])[.)]?$/i);
   if(before){flush();put(before[1],before[2]);active=before[1].toUpperCase();}
   else if(after){const text=active?(flush(),after[1]):[...pending,after[1]].join(' ');pending.length=0;put(after[2],text);active=null;}
   else if(single){put(single[1],pending.join(' '));pending.length=0;active=null;}
   else pending.push(line);
  }
  flush();if(invalid||order.join('')!=='ABC'||!stem)return null;
  return {prompt:stem,optionTexts:Object.fromEntries(labels.map(label=>[label,texts[label.toUpperCase()]])),sourceNumber:number};
 },
 normalize(task,context={}){
  const base={...task,exam:task.exam||context.exam,level:task.level||context.level};
  if(!this.supported(base))return task;
  const next={...base,skill:this.skill(base.skill),teil:Number(base.teil||base.part)||1,telcFormVersion:1};
  // A cloze passage is Sprachbausteine even when an extractor labels it Hören.
  // Require explicit source evidence, never infer this just from the screenshot.
  if(next.skill==='listening'&&/Sprachbausteine/i.test((next.sourceHeading||'')+' '+(next.title||''))&&!next.audioUrl&&!next.transcript)next.skill='grammar';
  next.taskType=this.kind(next);
  const provided=[next.choiceBank,next.headings,next.advertisements,next.ads,next.wordBank].find(v=>Array.isArray(v)&&v.length);
  const bank=this.bank(provided);if(bank.length)next.choiceBank=bank;
  next.questions=Array.isArray(task.questions)?task.questions.map((q,index)=>{
   const question={...q};
   if(!question.options?.length&&bank.length&&['headings','advertisements','word-bank'].includes(next.taskType)){
    question.options=bank.map(b=>b.label);
    if(next.taskType==='advertisements'&&/^[a-z0-9]$/i.test(next.noMatchOption||'')&&!question.options.includes(next.noMatchOption))question.options.push(next.noMatchOption);
   }
   if(question.sourceNumber==null){const match=String(question.prompt||question.question||'').match(/^(?:\s*|Lücke\s+)(\d{1,3})(?:[.)]\s|$)/i);if(match)question.sourceNumber=Number(match[1]);else if(Number.isInteger(question.number))question.sourceNumber=question.number;}
   if(['multiple-choice','cloze'].includes(next.taskType)&&!question.optionTexts){const recovered=this.sourceChoices(next,question);if(recovered)Object.assign(question,recovered);}
   return question;
  }):task.questions;
  return next;
 },
 assemble(tasks){
  const output=[],groups=new Map();
  for(const original of tasks){
   const task=this.normalize(original);
   if(!this.supported(task)||!task.sourcePage||!(task.parentNameConfirmed||task.setKey)){output.push(task);continue;}
   const key=JSON.stringify([task.setName,task.setKey||'',task.exam,task.level,task.skill,task.teil]);
   const previous=groups.get(key);
   if(!previous){const first={...task,sourcePages:[...new Set([...(task.sourcePages||[]),task.sourcePage])]};groups.set(key,first);output.push(first);continue;}
   // Same-page tasks can be variants. Do not merge them based on a guessed name.
   if(previous.sourcePages.includes(task.sourcePage)){output.push(task);continue;}
   previous.sourcePages.push(...(task.sourcePages||[]),task.sourcePage);previous.sourcePages=[...new Set(previous.sourcePages)];
   previous.content=[previous.content,task.content].filter(Boolean).join('\n\n---\n\n');
   previous.sourceTaskIds=[...new Set([...(previous.sourceTaskIds||[]),previous.id,task.id].filter(Boolean))];
   const images=[...(previous.sourceImages||[]),previous.imageUrl,...(task.sourceImages||[]),task.imageUrl].filter(Boolean);
   if(images.length)previous.sourceImages=[...new Set(images)];
   const questions=[...(previous.questions||[])],ids=new Set(questions.map(q=>q.id));
   for(const [index,q]of (task.questions||[]).entries()){
    const next={...q};if(next.id&&ids.has(next.id)){next.sourceQuestionId=next.id;next.id=next.id+'_page'+task.sourcePage+'_'+index;}if(next.id)ids.add(next.id);questions.push(next);
   }
   previous.questions=questions;
   const bank=[...this.bank(previous.choiceBank),...this.bank(task.choiceBank)];
   previous.choiceBank=bank.filter((v,i)=>bank.findIndex(x=>x.label===v.label&&x.text===v.text)===i);
   if(task.noMatchOption)previous.noMatchOption=task.noMatchOption;
   for(const field of ['texts'])if(task[field]?.length)previous[field]=[...(previous[field]||[]),...task[field]];
   if(task.passage&&task.passage!==previous.passage)previous.passage=[previous.passage,task.passage].filter(Boolean).join('\n\n');
   if(task.instructions&&task.instructions!==previous.instructions)previous.instructions=[previous.instructions,task.instructions].filter(Boolean).join('\n\n');
  }
  return output.map(t=>this.normalize(t));
 },
 collection(collection){return {...collection,items:(collection.items||[]).map(t=>this.normalize(t,collection))};},
 warnings(task){
  if(!this.supported(task))return [];
  const result=[],kind=this.kind(task),questions=task.questions||[];
  if(!questions.length)result.push('Chưa trích được câu hỏi; cần đối chiếu tài liệu gốc.');
  if(questions.some(q=>!q.options?.length))result.push('Có câu chưa có phương án chọn; không tự tạo đáp án.');
  if(['multiple-choice','cloze'].includes(kind)&&questions.some(q=>q.options?.length&&q.options.every(v=>/^[abc]$/i.test(v))&&!q.optionTexts))result.push('Có lựa chọn a/b/c chưa tách được nội dung. Đối chiếu ảnh/trang gốc; không suy đoán các cột OCR.');
  const profile=typeof EXAM_FORMATS==='undefined'?null:EXAM_FORMATS['Telc-'+task.level];
  const expected=profile?.modules.find(m=>m.key===task.skill)?.parts.find(p=>p.teil===Number(task.teil))?.itemCount;
  if(expected&&questions.length!==expected)result.push('Teil có '+questions.length+'/'+expected+' câu theo cấu trúc đã chọn; cần kiểm tra trang nguồn.');
  const bank=this.bank(task.choiceBank);if(new Set(bank.map(v=>v.label)).size!==bank.length)result.push('Có nhãn lựa chọn trùng nhưng nội dung khác nhau; cần đối chiếu trước khi lưu.');
  if(['headings','advertisements','word-bank'].includes(kind)&&!this.bank(task.choiceBank||task.headings||task.advertisements||task.ads||task.wordBank).length)result.push('Ngân hàng tiêu đề/quảng cáo/từ chưa được tách riêng; văn bản và ảnh gốc vẫn được giữ.');
  return result;
 },
 sourceHTML(task){
  const t=this.normalize(task),bank=this.bank(t.choiceBank),kind=this.kind(t);
  // content is always retained, including old Arabic-collection page images.
  let html=LearningContent.render(t.content||'');
  if(t.instructions&&!String(t.content||'').includes(t.instructions))html='<div class="telc-instructions">'+LearningContent.render(t.instructions)+'</div>'+html;
  if(t.passage&&t.passage!==t.content)html+='<div class="telc-passage">'+LearningContent.render(t.passage)+'</div>';
  if(Array.isArray(t.texts))html+='<div class="telc-texts">'+t.texts.map((v,i)=>'<article><strong>'+esc(v.label||v.number||i+1)+'</strong>'+LearningContent.render(v.text||v.content||'')+'</article>').join('')+'</div>';
  if(bank.length)html+='<section class="telc-bank"><h4>'+({headings:'Überschriften',advertisements:'Anzeigen','word-bank':'Ergänzungswörter'}[kind]||'Auswahl')+'</h4>'+bank.map(v=>'<article class="telc-bank-entry"><b>'+esc(v.label)+'</b><div>'+LearningContent.render(v.text)+'</div></article>').join('')+'</section>';
  for(const url of t.sourceImages||[])if(url!==t.imageUrl&&this.imageURL(url))html+='<img class="exam-image" loading="lazy" src="'+esc(url)+'" alt="'+esc(t.title||'Quellenseite')+'">';
  if(t.skill==='listening')html+=this.listeningSourcesHTML(t);
  return html;
 },
 listeningSourcesHTML(task){
  const links=[],video=task.listeningReferenceVideo;
  // Reference videos cover the full test. They do not satisfy per-Teil audio checks.
  if(video&&/^[A-Za-z0-9_-]{11}$/.test(video.id||''))links.push('<a class="button secondary" href="https://www.youtube.com/watch?v='+video.id+'" target="_blank" rel="noopener noreferrer">Mở video cùng tên đề · Teil 1–3 ↗</a><p class="help-text">Video được ghép theo tên đề; hãy đối chiếu câu hỏi/phiên bản trước khi nghe. Đây là video trọn bài, chưa chia mốc từng Teil.</p>');
  try{const u=new URL(task.listeningPlaylistUrl);if(u.protocol==='https:'&&['youtube.com','www.youtube.com'].includes(u.hostname)&&u.pathname==='/playlist'&&/^[A-Za-z0-9_-]+$/.test(u.searchParams.get('list')||''))links.push('<a class="button secondary" href="https://www.youtube.com/playlist?list='+esc(u.searchParams.get('list'))+'" target="_blank" rel="noopener noreferrer">Mở playlist nghe của bộ đề ↗</a>');}catch{}
  return links.length?'<section class="exam-listening-sources" aria-label="Nguồn nghe">'+links.join('')+'</section>':'';
 },
 imageURL(url){return typeof url==='string'&&(/^https:\/\//i.test(url)||(url.length<2500000&&/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(url)));},
 // This schema is shared by every exam import entry point.
 extractionRule:'For ALL telc imports preserve complete original content AND return structured fields when visible: sourceHeading, instructions, passage, texts:[{label,text}], choiceBank:[{label,text}], questions:[{id,sourceNumber,prompt,options,answer,answerSource}]. Lesen Teil 1: all texts 1-5 and ALL headings a-j, select one heading per text. Lesen Teil 2: full passage and each original a/b/c option. Lesen Teil 3: ALL situations and advertisements with their original letter labels, including noMatchOption (the original x/0 label) ONLY when explicitly present. Sprachbausteine Teil 1: full gapped passage and the original a/b/c choices for EVERY numbered gap. Sprachbausteine Teil 2: full gapped passage, ALL word-bank letters/words and every gap. Sprachbausteine is grammar, NEVER listening. Hören is listening and must retain its actual statements/options and audio/transcript references; do not turn it into a cloze. Preserve question numbering from the source. Preserve the actual language of the source, not an inferred language from a collection nickname. Do not infer an answer from a highlighted circle unless it is an explicit source answer key. Never invent missing text, questions, options, audio, answers or explanations. Do not force B1 counts onto other telc levels. Report missing or unreadable parts in warnings. Keep continuation pages in the SAME parent test and Teil, including all sourcePage/sourcePages references.'
};

function telcPartItems(){
 if(typeof simulation==='undefined'||!simulation||!['reading','grammar','listening'].includes(examVisibleSkill))return [];
 return examVisibleIndices().map(i=>({i,task:simulation.items[i]})).filter(({task})=>task.skill===examVisibleSkill&&TelcExam.supported({...task,exam:task.exam||simulation.exam}));
}
function renderTelcParts(){
 const host=document.getElementById('telc-part-tabs');if(!host)return;
 const items=telcPartItems();host.hidden=!items.length;if(!items.length)return;
 simulation.telcParts ||= {};
 const parts=[...new Set(items.map(({task})=>Number(task.teil)))].sort((a,b)=>a-b);
 let selected=Number(simulation.telcParts[examVisibleSkill]);if(!parts.includes(selected))selected=parts[0];
 simulation.telcParts[examVisibleSkill]=selected;
 host.innerHTML=parts.map(part=>{
  const rows=items.filter(({task})=>Number(task.teil)===part);let done=0,total=0;
  for(const {i,task}of rows)for(const [j,q]of (task.questions||[]).entries()){total++;const value=simulation.answers[i]?.[q.id||'q'+j];if(value!==undefined&&value!==null&&String(value).trim())done++;}
  return '<button type="button" data-telc-part="'+part+'" aria-pressed="'+(selected===part)+'" class="'+(selected===part?'active':'')+'">Teil '+part+' <small>'+done+'/'+total+'</small></button>';
 }).join('');
 for(const {i,task}of items){const section=document.querySelector('#sim-work [data-exam-item="'+i+'"]');if(section)section.hidden=Number(task.teil)!==selected;}
 host.querySelectorAll('[data-telc-part]').forEach(button=>button.onclick=()=>{
  simulation.telcParts[examVisibleSkill]=Number(button.dataset.telcPart);saveSimulation();renderTelcParts();
 });
}
function showTelcPartForItem(index){
 const item=telcPartItems().find(row=>row.i===index);if(!item)return;
 simulation.telcParts ||= {};simulation.telcParts[examVisibleSkill]=Number(item.task.teil);saveSimulation();renderTelcParts();
}
