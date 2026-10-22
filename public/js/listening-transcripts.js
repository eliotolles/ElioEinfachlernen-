'use strict';
// A transient CC queue: only completed captions are written to account storage.
const ListeningTranscripts={
 parseTranscript(input,duration){
  const text=String(input||'').replace(/\r/g,'').trim();
  if(!text||text.length>1500000)throw Error('Dán bản chép lời có mốc thời gian, tối đa 1,5 MB.');
  const time=s=>s.replace(',','.').split(':').reduce((n,p)=>n*60+Number(p),0),cues=[];
  if(text.includes('-->')){
   for(const block of text.split(/\n\s*\n/)){const lines=block.split('\n'),i=lines.findIndex(l=>l.includes('-->'));if(i<0)continue;const t=lines[i].match(/([\d:. ,]+)\s*-->\s*([\d:.,]+)/);if(!t)throw Error('Mốc SRT/VTT không hợp lệ.');cues.push({start:time(t[1].trim()),end:time(t[2]),text:lines.slice(i+1).join(' ').replace(/<[^>]*>/g,'').trim()});}
  }else{
   let current;
   for(const line of text.split('\n').map(l=>l.trim()).filter(Boolean)){const m=line.match(/^(\d{1,3}:\d{2}(?::\d{2})?)(?:\s+(.+))?$/);if(m){current={start:time(m[1]),text:m[2]||''};cues.push(current);}else if(current)current.text+=(current.text?' ':'')+line;else throw Error('Bản chép lời cần có mốc như 0:10 trước mỗi đoạn.');}
   for(let i=0;i<cues.length;i++)cues[i].end=cues[i+1]?.start??Number(duration);
  }
  if(!cues.length||cues.length>1500)throw Error('Cần từ 1 đến 1500 đoạn phụ đề.');
  if(cues.some((c,i)=>!c.text||!Number.isFinite(c.start)||!Number.isFinite(c.end)||c.start<0||c.end<=c.start||(i&&c.start<cues[i-1].start)))throw Error('Kiểm tra thứ tự mốc, nội dung và thời điểm kết thúc video; chưa thay phụ đề cũ.');
  return cues;
 },
 toSrt(cues){const time=n=>{const ms=Math.round(n*1000);return [Math.floor(ms/3600000),Math.floor(ms/60000)%60,Math.floor(ms/1000)%60].map(n=>String(n).padStart(2,'0')).join(':')+','+String(ms%1000).padStart(3,'0');};return cues.map((c,i)=>(i+1)+'\n'+time(c.start)+' --> '+time(c.end)+'\n'+c.text).join('\n\n')+'\n';},
 create({videos,user,request,save,transcribe,duration,changed=()=>{},sleep=ms=>new Promise(r=>setTimeout(r,ms)),lock}){
  const pending=new Set(),states=new Map();let running=false,paused=false,ccUnavailable=false;
  const needs=v=>v.youtubeId&&!(v.transcriptSource==='ai'&&v.transcriptComplete)&&(!v.cues?.length||v.transcriptSource==='ai');
  const label=v=>states.get(v?.id)||(v?.cues?.length?(v.transcriptSource==='ai'?(v.transcriptComplete?'Bản chép AI đã hoàn tất':'Bản chép AI còn dở'):'CC/SRT đã có')+' · '+v.cues.length+' câu':'Chưa có phụ đề');
  const valid=c=>Number.isFinite(c.start)&&Number.isFinite(c.end)&&c.start>=0&&c.end>c.start&&typeof c.text==='string'&&c.text.trim();
  function enqueue(rows){for(const v of rows)if(needs(v)){pending.add(v.id);if(!states.has(v.id))states.set(v.id,'Chờ tạo bản chép lời');}changed();}
  async function drain(){const owner=user();paused=false;let done=0,failed=0;
   const current=id=>user()===owner&&videos().find(v=>v.id===id);
   try{while(pending.size&&!paused&&user()===owner){const id=pending.values().next().value;pending.delete(id);let v=current(id);if(!v||!needs(v))continue;
    try{
     let ccError;
     if(!v.cues?.length&&!ccUnavailable){states.set(id,'Đang lấy CC tiếng Đức…');changed();try{
      const result=await request(v.youtubeId);v=current(id);if(!v)return;if(v.cues?.length)continue;
      if(!result.available||!Array.isArray(result.cues)||!result.cues.length||!result.cues.every(valid)){const e=Error(result.reason||'CC chưa lấy được');e.code=result.code;throw e;}
      v.cues=result.cues;v.transcriptSource=result.source||'youtube';v.transcriptComplete=true;await save(v,owner);states.set(id,'Đã lưu '+v.cues.length+' câu CC/SRT');done++;changed();if(pending.size&&!paused)await sleep(3500);continue;
     }catch(e){ccError=e;if(['CAPTIONS_REDIRECT_ERROR','CAPTIONS_ACCESS_REQUIRED','CAPTIONS_CONSENT'].includes(e.code))ccUnavailable=true;}}
     if(!transcribe||!duration)throw ccError||Error('Chưa lấy được CC từ máy chủ.');
     v=current(id);if(!v)return;if(v.cues?.length&&v.transcriptSource!=='ai')continue;
     states.set(id,'CC chưa lấy được · chuẩn bị AI nghe video…');changed();
     const total=Number(v.durationSeconds)||Number(await duration(v.youtubeId));
     if(!Number.isFinite(total)||total<=0||total>7200)throw Error('Chưa xác định được thời lượng, hoặc video dài quá 2 giờ. Không đoán mốc kết thúc.');
     v=current(id);if(!v)return;v.durationSeconds=total;
     let start=Number(v.processedUntil)||0;
     while(start<total&&!paused){
      v=current(id);if(!v)return;if(v.cues?.length&&v.transcriptSource!=='ai')break;
      const end=Math.min(total,start+120);states.set(id,'AI đang chép '+Math.floor(start)+'–'+Math.ceil(end)+' / '+Math.ceil(total)+' giây');changed();
      let result;for(let attempt=0;attempt<3;attempt++){try{result=await transcribe(v.youtubeId,start,end);break;}catch(e){if(!(e.status===429||e.data?.retryable)||attempt===2)throw e;for(let remaining=30;remaining>0;remaining--){if(paused||!current(id))throw Error('Đã tạm dừng.');states.set(id,'AI tạm bận · tự thử tiếp sau '+remaining+' giây · giữ tới giây '+start);changed();await sleep(1000);}}}v=current(id);if(!v)return;if(v.cues?.length&&v.transcriptSource!=='ai')break;
      if(result.start!==start||result.end!==end||!Array.isArray(result.cues)||!result.cues.every(c=>valid(c)&&c.start>=start&&c.end<=end)||(!result.cues.length&&result.status!=='no_speech'))throw Error('AI chưa trả đoạn hợp lệ; giữ tiến độ để thử tiếp.');
      const merged=[...(v.cues||[]),...result.cues].sort((a,b)=>a.start-b.start).filter((c,i,a)=>!i||c.start!==a[i-1].start||c.text!==a[i-1].text);
      if(merged.length>1500)throw Error('Vượt 1500 câu; bản đã lưu được giữ nguyên.');
      v.cues=merged;v.transcriptSource='ai';v.processedUntil=end;v.transcriptComplete=end>=total;
      await save(v,owner);if(!current(id))return;start=end;
      states.set(id,'Đã lưu '+Math.ceil(end)+' / '+Math.ceil(total)+' giây · '+v.cues.length+' câu AI');changed();
      if(start<total&&!paused)await sleep(3500);
     }
     if(paused){pending.add(id);states.set(id,'Đã tạm dừng · giữ tới giây '+Math.floor(start));}
     else if(v.transcriptComplete){states.set(id,'Hoàn tất bản chép AI · '+v.cues.length+' câu · cần kiểm tra độ chính xác');done++;}
    }catch(e){if(user()!==owner)return;states.set(id,'Chưa hoàn tất: '+e.message);if(paused){pending.add(id);}else failed++;if(transcribe&&(e.status===429||e.data?.retryable||/chưa cấu hình AI|cấu hình AI phù hợp/i.test(e.message))){paused=true;pending.add(id);}
     if(!transcribe&&ccUnavailable){paused=true;for(const next of pending)states.set(next,'Tạm dừng: máy chủ chưa truy cập được YouTube. Không kết luận video thiếu CC.');}
    }
    changed();if(pending.size&&!paused)await sleep(3500);
   }}finally{running=false;changed({done,failed,paused});}
  }
  return {enqueue,label,resetAccess(){ccUnavailable=false;},async start(){if(running)return;running=true;changed();if(lock){try{await lock(async granted=>{if(granted)await drain();else{running=false;changed({message:'Hàng đợi đang chạy trong tab khác.'});}});}catch(e){running=false;changed({message:e.message});}}else await drain();},pause(){paused=true;changed();},get running(){return running;},get pending(){return pending.size;}};
 }
};
