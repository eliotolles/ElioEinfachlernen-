'use strict';
const GEMINI_KEY='',GROQ_KEY='';
const AI={config(){return {geminiKey:'server-managed'};},parse(text){if(typeof text!=='string')throw Error('AI không trả về JSON.');try{return JSON.parse(text.trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,''));}catch{throw Error('AI trả về JSON không hợp lệ hoặc bị cắt ngắn.');}}};
async function serverAI(prompt,attachments=[]){return (await Account.request('/api/ai','POST',{prompt,attachments})).text;}
async function callGemini(prompt,attachments=[]){return serverAI(prompt,attachments);}
async function callGroq(prompt){return serverAI(prompt);}
async function askJSON(prompt){return AI.parse(await serverAI(prompt));}
async function fileAttachment(file){const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(Error('Không đọc được tệp.'));reader.readAsDataURL(file);});return {mimeType:file.type||'application/pdf',data};}
$('#ai-settings').onclick=()=>{if(Account.profile.role==='super_admin')location.href='admin.html#ai';else toast('AI được quản trị viên cấu hình và xử lý trên server.');};
