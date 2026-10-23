'use strict';
const GEMINI_KEY='',GROQ_KEY='';
const AI={config(){return {geminiKey:'server-managed'};},parse(text){if(typeof text!=='string')throw Error('AI không trả về JSON.');try{return JSON.parse(text.trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,''));}catch{throw Error('AI trả về JSON không hợp lệ hoặc bị cắt ngắn.');}}};
async function requestAIWithRetry(path,data,{isCurrent=()=>true,onProgress=()=>{}}={}){
 for(let attempt=0;attempt<3;attempt++){
  if(!isCurrent())throw Error('Đã dừng vì tài khoản hoặc nội dung thay đổi.');
  try{const result=await Account.request(path,'POST',data);if(!isCurrent())throw Error('Đã dừng vì tài khoản hoặc nội dung thay đổi.');return result;}catch(error){
   const retryable=error.data?.retryable===true||error.offline||[408,429,502,504].includes(error.status);
   if(!retryable||attempt===2||Number(error.data?.retryAfter)>120)throw error;
   const wait=Math.max(1,Math.min(120,Number(error.data?.retryAfter)||30));
   for(let left=wait;left>0;left--){if(!isCurrent())throw Error('Đã dừng vì tài khoản hoặc nội dung thay đổi.');onProgress('AI đang bận hoặc hết thời gian chờ. Tự thử tiếp sau '+left+' giây · lần '+(attempt+2)+'/3. Nội dung đã nhận vẫn được giữ.');await new Promise(resolve=>setTimeout(resolve,1000));}
   onProgress('Đang tự tiếp tục công việc…');
  }
 }
}
const activeAIJobs=new Map();
function serverAI(prompt,attachments=[],options={}){
 const user=Auth.user,language=options.language||App.explain?.()||'vi',task=options.task||'text';
 const hash=text=>{let a=2166136261,b=5381;for(let i=0;i<text.length;i++){a=Math.imul(a^text.charCodeAt(i),16777619);b=Math.imul(b,33)^text.charCodeAt(i);}return (a>>>0).toString(36)+'-'+(b>>>0).toString(36)+'-'+text.length;};
 const attachmentSignature=attachments.map(a=>a.mimeType+':'+hash(a.data)).join('|');
 const legacyAttachmentSignature=attachments.map(a=>{let n=2166136261;for(let i=0;i<a.data.length;i++)n=Math.imul(n^a.data.charCodeAt(i),16777619);return a.mimeType+':'+a.data.length+':'+(n>>>0);}).join('|');
 const identity=JSON.stringify([user,prompt,attachmentSignature,options.feature||null,task,language]),jobId=hash(identity);
 if(activeAIJobs.has(identity))return activeAIJobs.get(identity);
 const run=async()=>{
  const key='dt:'+user+':ai-continuation:'+jobId,legacyKey='dt:'+user+':ai-continuation';let continuation='',legacy=null;
  const matches=(saved,old=false)=>saved?.prompt===prompt&&saved?.attachmentSignature===(old?legacyAttachmentSignature:attachmentSignature)&&(saved?.feature||null)===(options.feature||null)&&(saved?.task||'text')===task&&(saved?.language||language)===language;
  try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(matches(saved))continuation=saved.text||'';}catch{}
  // Read old text-only checkpoints without deleting them on a failed resume.
  try{legacy=JSON.parse(localStorage.getItem(legacyKey)||'null');if(!continuation&&matches(legacy,true))continuation=legacy.text||'';}catch{}
  const notify=message=>document.dispatchEvent(new CustomEvent('ai-progress',{detail:{message,user,jobId}}));
  try{for(let round=0;round<8;round++){
   if(Auth.user!==user)throw Error('Tài khoản đã thay đổi.');
   if(continuation){for(let seconds=30;seconds>0;seconds--){notify('Đã giữ nội dung trước đó. AI tự viết tiếp sau '+seconds+' giây…');await new Promise(resolve=>setTimeout(resolve,1000));if(Auth.user!==user)throw Error('Tài khoản đã thay đổi.');}notify('AI đang viết tiếp phần còn lại…');}
   else notify('AI đang xử lý…');
   const result=await requestAIWithRetry('/api/ai',{prompt,attachments,continuation,task,feature:options.feature,explanationLanguage:language},{isCurrent:()=>Auth.user===user,onProgress:notify});
   if(typeof result.text!=='string')throw Error('AI không trả về nội dung.');
   continuation=continuation&&result.text.startsWith(continuation)?result.text:continuation+result.text;
   try{localStorage.setItem(key,JSON.stringify({prompt,attachmentSignature,feature:options.feature||null,task,language,text:continuation}));}catch{notify('Bộ nhớ thiết bị đã đầy. Giữ trang mở để bảo toàn nội dung đang xử lý.');}
   if(!result.truncated){AI.parse(continuation);localStorage.removeItem(key);if(matches(legacy,true)&&localStorage.getItem(legacyKey)===JSON.stringify(legacy))localStorage.removeItem(legacyKey);return continuation;}
  }
  throw Error('Đã đạt giới hạn 8 lượt tiếp nối. Nội dung đã nhận vẫn được giữ; bấm lại để tiếp tục.');
  }finally{notify('');}
 };
 const promise=run();activeAIJobs.set(identity,promise);
 const clear=()=>{if(activeAIJobs.get(identity)===promise)activeAIJobs.delete(identity);};promise.then(clear,clear);return promise;
}
async function callGemini(prompt,attachments=[],options={}){return serverAI(prompt,attachments,options);}
async function callGroq(prompt){return serverAI(prompt);}
async function askJSON(prompt,options={}){return AI.parse(await serverAI(prompt,[],options));}
async function fileAttachment(file){const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(Error('Không đọc được tệp.'));reader.readAsDataURL(file);});return {mimeType:file.type||'application/pdf',data};}
$('#ai-settings').onclick=()=>{if(Account.profile.role==='super_admin')location.href='admin.html#ai';else toast('AI được quản trị viên cấu hình và xử lý trên server.');};

const aiProgressMessages=new Map();
document.addEventListener('authchange',()=>{aiProgressMessages.clear();const status=document.getElementById('ai-continuation-status');if(status)status.hidden=true;});
document.addEventListener('ai-progress',event=>{
 if(event.detail.user!==Auth.user)return;
 let status=document.getElementById('ai-continuation-status');
 if(!status){status=document.createElement('div');status.id='ai-continuation-status';status.className='ai-continuation-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');document.body.appendChild(status);}
 const key=event.detail.jobId||'legacy';if(event.detail.message)aiProgressMessages.set(key,event.detail.message);else aiProgressMessages.delete(key);status.textContent=[...aiProgressMessages.values()].join(' · ');status.hidden=!aiProgressMessages.size;
});

