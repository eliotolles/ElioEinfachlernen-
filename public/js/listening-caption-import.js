'use strict';
// A transient CC queue: only completed captions are written to account storage.
const ListeningCaptionImport={
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
 create({videos,user,request,save,changed=()=>{},sleep=ms=>new Promise(r=>setTimeout(r,ms)),lock}){
  const pending=new Set(),states=new Map();let running=false,paused=false;
  const label=v=>v?.cues?.length?(v.transcriptSource==='ai'?'Bản chép AI':'CC/SRT đã có')+' · '+v.cues.length+' câu':states.get(v?.id)||'Chưa có phụ đề';
  function enqueue(rows){for(const v of rows)if(v.youtubeId&&!v.cues?.length){pending.add(v.id);states.set(v.id,'Chờ lấy CC tiếng Đức');}changed();}
  async function drain(){const owner=user();paused=false;let done=0,failed=0;
   try{while(pending.size&&!paused&&user()===owner){const id=pending.values().next().value;pending.delete(id);let v=videos().find(v=>v.id===id);if(!v||v.cues?.length)continue;
    states.set(id,'Đang lấy CC tiếng Đức…');changed();
    try{const result=await request(v.youtubeId);if(user()!==owner)return;v=videos().find(v=>v.id===id);if(!v)continue;if(v.cues?.length)continue;
     const cues=(result.cues||[]).filter(c=>Number.isFinite(c.start)&&Number.isFinite(c.end)&&c.start>=0&&c.end>c.start&&typeof c.text==='string'&&c.text.trim());
     if(!result.available||!cues.length){const e=Error(result.reason||'YouTube chưa cung cấp CC tiếng Đức cho máy chủ.');e.code=result.code;throw e;}
     v.cues=cues;v.transcriptSource=result.source||'youtube';v.processedUntil=0;
     await save(v,owner);if(user()!==owner)return;states.set(id,'Đã lấy và lưu '+cues.length+' câu CC/SRT');done++;
    }catch(e){if(user()!==owner)return;states.set(id,'Chưa hoàn tất: '+e.message);failed++;if(['CAPTIONS_REDIRECT_ERROR','CAPTIONS_ACCESS_REQUIRED','CAPTIONS_CONSENT'].includes(e.code)){paused=true;for(const next of pending)states.set(next,'Tạm dừng: máy chủ chưa truy cập được YouTube. Không kết luận video thiếu CC.');}}
    changed();if(pending.size&&!paused)await sleep(3500);
   }}finally{running=false;changed({done,failed,paused});}
  }
  return {enqueue,label,async start(){if(running)return;running=true;changed();if(lock){try{await lock(async granted=>{if(granted)await drain();else{running=false;changed({message:'Hàng đợi đang chạy trong tab khác.'});}});}catch(e){running=false;changed({message:e.message});}}else await drain();},pause(){paused=true;changed();},get running(){return running;},get pending(){return pending.size;}};
 }
};
