'use strict';
const ListeningCaptionImport={
 toSrt(cues){const time=n=>{const ms=Math.round(n*1000);return [Math.floor(ms/3600000),Math.floor(ms/60000)%60,Math.floor(ms/1000)%60].map(n=>String(n).padStart(2,'0')).join(':')+','+String(ms%1000).padStart(3,'0');};return cues.filter(c=>Number.isFinite(c.start)&&Number.isFinite(c.end)&&c.start>=0&&c.end>c.start&&typeof c.text==='string'&&c.text.trim()).slice().sort((a,b)=>a.start-b.start).map((c,i)=>(i+1)+'\n'+time(c.start)+' --> '+time(c.end)+'\n'+c.text.trim()).join('\n\n')+'\n';},
 enqueue(rows){let count=0;for(const v of rows){if(v.kind==='collection'||!v.youtubeId||v.cues?.length)continue;if(v.captionFetchState!=='fetching')v.captionFetchState='queued';delete v.captionFetchReason;count++;}return count;},
 describe(v){if(v.cues?.length)return (v.transcriptSource==='ai'?'Bản chép AI':'Đã có phụ đề')+' · '+v.cues.length+' câu';return v.captionFetchState==='fetching'?'Đang lấy CC tiếng Đức…':v.captionFetchState==='queued'?'Đang chờ lấy CC':v.captionFetchState==='unavailable'?'Không lấy được CC: '+(v.captionFetchReason||'YouTube chưa cung cấp phụ đề tiếng Đức.'):'Chưa có phụ đề';},
 create({videos,user,request,save,progress=()=>{},sleep=ms=>new Promise(r=>setTimeout(r,ms)),lock,applied=()=>{},settled=()=>{}}){
  let running=false,paused=false;
  async function drain(){const owner=user();let done=0,unavailable=0;paused=false;
   // A fetching flag left by a closed tab is a saved checkpoint, not a finished result.
   for(const v of videos())if(v.captionFetchState==='fetching'&&!v.cues?.length)v.captionFetchState='queued';
   try{while(!paused&&user()===owner){let v=videos().find(v=>['queued','fetching'].includes(v.captionFetchState)&&!v.cues?.length);if(!v)break;
    const id=v.id,title=v.title;v.captionFetchState='fetching';progress('Đang lưu hàng đợi trước khi lấy CC: '+title+'…');await save();progress('Đang lấy CC: '+title+' · đã lấy '+done+' · chưa lấy được '+unavailable+'. Có thể học video khác trong lúc chờ.');
    let result;try{result=await request(v.youtubeId);}catch(e){if(user()!==owner)return;v=videos().find(v=>v.id===id);if(!v)continue;if(e.offline||e.data?.retryable||[408,429,500,502,503,504,524].includes(e.status)){v.captionFetchState='queued';await save();const wait=Math.max(60,Number(e.data?.retryAfter)||0);for(let left=wait;left>0&&!paused&&user()===owner;left--){progress('Lấy CC tạm bị giới hạn. Tự tiếp tục sau '+left+' giây.');await sleep(1000);}continue;}result={available:false,reason:e.message};}
    if(user()!==owner)return;v=videos().find(v=>v.id===id);if(!v)continue;
    if(v.cues?.length){v.captionFetchState='ready';}
    else if(result.available&&Array.isArray(result.cues)&&result.cues.length){v.cues=result.cues;v.transcriptSource=result.source;v.processedUntil=0;v.captionFetchState='ready';delete v.captionFetchReason;done++;}
    else{v.captionFetchState='unavailable';v.captionFetchReason=result.reason||'Không lấy được CC tiếng Đức. Có thể mở video để dùng AI dự phòng hoặc nhập SRT/VTT.';unavailable++;}
    await save();if(user()===owner&&v.captionFetchState==='ready')await applied(v);if(user()===owner)await settled(v);await sleep(3500);
   }
   progress(paused?'Đã tạm dừng lấy CC; các video đã xử lý vẫn được lưu.': 'Đã xử lý hàng đợi CC: '+done+' video có phụ đề · '+unavailable+' video chưa lấy được. Không tự gọi AI hàng loạt.');
   }catch(e){progress(e.message+' Đã giữ hàng đợi; giải quyết đồng bộ rồi bấm Tiếp tục lấy CC.');}finally{running=false;}
  }
  return {async start(){if(running)return;running=true;progress('Đang khởi động hàng đợi phụ đề…');if(lock){try{await lock(async granted=>{if(granted)await drain();else{running=false;progress('Hàng đợi CC đang chạy ở tab khác.');}});}catch(e){running=false;progress(e.message);}}else await drain();},pause(){paused=true;},get running(){return running;}};
 }
};


