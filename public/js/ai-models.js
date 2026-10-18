'use strict';
// Reviewed against provider documentation on 2026-10-18. Availability and quota are account-specific.
const AI_MODEL_SUGGESTIONS={
 gemini:{source:'https://ai.google.dev/gemini-api/docs/models',note:'Ưu tiên khi cần đọc ảnh/PDF. Free tier và quota tùy model/dự án; alias latest có thể thay đổi phiên bản. Model 2.5 bị giới hạn cho tài khoản mới.',items:[
  {id:'gemini-flash-latest',name:'Flash Latest',use:'Đã thử thành công trên Elio · lựa chọn bắt đầu',vision:true},
  {id:'gemini-flash-lite-latest',name:'Flash-Lite Latest',use:'Tác vụ nhẹ, trích xuất và từ vựng',vision:true},
  {id:'gemini-3.5-flash-lite',name:'Gemini 3.5 Flash-Lite',use:'Nhanh, ưu tiên chi phí thấp',vision:true},
  {id:'gemini-3.8-flash',name:'Gemini 3.8 Flash',use:'Tác vụ phức tạp, phân tích bài làm',vision:true}]},
 groq:{source:'https://console.groq.com/docs/models',note:'Trong Elio, Groq hiện chỉ xử lý văn bản. Có quota free theo tài khoản; xem Console trước khi dùng. Model Enterprise không phải lựa chọn free mặc định.',items:[
  {id:'openai/gpt-oss-20b',name:'GPT-OSS 20B',use:'Ưu tiên tốc độ cho từ vựng và hội thoại',vision:false},
  {id:'openai/gpt-oss-120b',name:'GPT-OSS 120B',use:'Gợi ý cho chữa viết và giải thích ngữ pháp',vision:false},
  {id:'qwen/qwen3.8-27b',name:'Qwen 3.8 27B · Preview',use:'Lựa chọn thử nghiệm; có thể thay đổi/ngừng',vision:false}]},
 openrouter:{source:'https://openrouter.ai/docs/guides/routing/routers/free-router',note:'Chỉ sử dụng model miễn phí. Vẫn có quota, có thể chờ lâu hoặc hết lượt; không tự nạp tiền hay chuyển model trả phí. Cần API key OpenRouter riêng, không dùng key OpenAI. PDF gốc dùng Gemini. Bấm Đổi model sau khi lưu để lấy danh sách miễn phí mới nhất.',items:[
  {id:'openrouter/free',name:'Free Models Router · nên thử trước',use:'Tự chọn model miễn phí có JSON/ảnh phù hợp',vision:true},
  {id:'google/gemma-4-31b-it:free',name:'Gemma 4 31B · Free',use:'Văn bản/ảnh; có trong catalog lúc kiểm tra',vision:true},
  {id:'nvidia/nemotron-3.5-super-vl:free',name:'Nemotron 3.5 Super VL · Free',use:'Thử phân tích ảnh và văn bản',vision:true},
  {id:'nvidia/nemotron-3-super-120b-a12b:free',name:'Nemotron 3 Super · Free',use:'Phân tích văn bản; không nhận ảnh',vision:false}]}

};
function renderModelSuggestions(){
 const form=$('#admin-ai-form'),fields=form.elements,provider=fields.provider.value,catalog=AI_MODEL_SUGGESTIONS[provider];if(!catalog)return;
 const list=$('#ai-model-options');list.replaceChildren();for(const model of catalog.items){const option=document.createElement('option');option.value=model.id;option.label=model.name;list.append(option);}
 const host=$('#ai-model-suggestions');host.replaceChildren();const heading=document.createElement('p');heading.className='help-text';heading.textContent='Gợi ý đã tra cứu 18/10/2026 · Bấm để điền model và khả năng ảnh';host.append(heading);
 const cards=document.createElement('div');cards.className='ai-model-cards';for(const model of catalog.items){const button=document.createElement('button');button.type='button';button.className='secondary ai-model-card';const title=document.createElement('strong'),id=document.createElement('code'),note=document.createElement('small');title.textContent=model.name;id.textContent=model.id;note.textContent=model.use+' · '+(model.vision?'Văn bản / ảnh':'Văn bản');button.append(title,id,note);button.onclick=()=>{fields.model.value=model.id;fields.vision.checked=model.vision;fields.model.focus();};cards.append(button);}host.append(cards);
 const note=document.createElement('p');note.className='help-text';note.textContent=catalog.note+' Gợi ý không có nghĩa là đã kiểm tra bằng key của bạn. Lưu rồi bấm Kiểm tra.';const link=document.createElement('a');link.href=catalog.source;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Tài liệu chính thức ↗';host.append(note,link);
 fields.model.placeholder=catalog.items[0].id;fields.vision.disabled=provider==='groq';if(provider==='groq')fields.vision.checked=false;
}
