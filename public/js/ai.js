'use strict';
const GEMINI_KEY='',GROQ_KEY='';
const AI={config(){return {geminiKey:'server-managed'};},parse(text){if(typeof text!=='string')throw Error('AI không trả về JSON.');try{return JSON.parse(text.trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,''));}catch{throw Error('AI trả về JSON không hợp lệ hoặc bị cắt ngắn.');}}};
async function serverAI(prompt,attachments=[],options={}){
 const user=Auth.user,key='dt:'+user+':ai-continuation';let continuation='';const attachmentSignature=attachments.map(a=>{let hash=2166136261;for(let i=0;i<a.data.length;i++)hash=Math.imul(hash^a.data.charCodeAt(i),16777619);return a.mimeType+':'+a.data.length+':'+(hash>>>0);}).join('|');
 try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved?.prompt===prompt&&saved?.attachmentSignature===attachmentSignature)continuation=saved.text||'';}catch{}
 const notify=(message)=>document.dispatchEvent(new CustomEvent('ai-progress',{detail:{message,user}}));
 try{for(let round=0;round<8;round++){
 if(Auth.user!==user)throw Error('Tài khoản đã thay đổi.');
 if(continuation){for(let seconds=30;seconds>0;seconds--){notify('Đã giữ nội dung trước đó. AI tự viết tiếp sau '+seconds+' giây…');await new Promise(resolve=>setTimeout(resolve,1000));if(Auth.user!==user)throw Error('Tài khoản đã thay đổi.');}notify('AI đang viết tiếp phần còn lại…');}
 const result=await Account.request('/api/ai','POST',{prompt,attachments,continuation,task:options.task||'text',explanationLanguage:options.language||App.explain?.()||'vi'});
 if(typeof result.text!=='string')throw Error('AI không trả về nội dung.');
 continuation=continuation&&result.text.startsWith(continuation)?result.text:continuation+result.text;
 // Keep each received fragment before starting another network request.
 try{localStorage.setItem(key,JSON.stringify({prompt,attachmentSignature,text:continuation}));}catch{}
 if(!result.truncated){AI.parse(continuation);localStorage.removeItem(key);return continuation;}
 }
 throw Error('Đã đạt giới hạn 8 lượt tiếp nối. Nội dung đã nhận vẫn được giữ; bấm lại để tiếp tục.');
 }finally{notify('');}
}
async function callGemini(prompt,attachments=[]){return serverAI(prompt,attachments);}
async function callGroq(prompt){return serverAI(prompt);}
async function askJSON(prompt,options={}){return AI.parse(await serverAI(prompt,[],options));}
async function fileAttachment(file){const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(Error('Không đọc được tệp.'));reader.readAsDataURL(file);});return {mimeType:file.type||'application/pdf',data};}
$('#ai-settings').onclick=()=>{if(Account.profile.role==='super_admin')location.href='admin.html#ai';else toast('AI được quản trị viên cấu hình và xử lý trên server.');};

document.addEventListener('ai-progress',event=>{
 if(event.detail.user!==Auth.user)return;
 let status=document.getElementById('ai-continuation-status');
 if(!status){status=document.createElement('div');status.id='ai-continuation-status';status.className='ai-continuation-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');document.body.appendChild(status);}
 status.textContent=event.detail.message;status.hidden=!event.detail.message;
});
