'use strict';
// The provider catalogue is fetched by the existing backend; no dated model IDs.
const AI_MODEL_SUGGESTIONS={};let aiCatalogueRequest=0;
async function renderModelSuggestions(){
 const generation=++aiCatalogueRequest,form=$('#admin-ai-form'),fields=form.elements,provider=fields.provider.value,host=$('#ai-model-suggestions'),list=$('#ai-model-options');list.replaceChildren();host.replaceChildren();
 const refresh=document.createElement('button');refresh.type='button';refresh.className='secondary';refresh.textContent='Đồng bộ danh mục từ API';refresh.onclick=renderModelSuggestions;
 const preview=document.createElement('button');preview.type='button';preview.className='secondary';preview.textContent='Xem gợi ý model đang nhập';preview.onclick=()=>ElioAIAssignments.open({provider:fields.provider.value,model:fields.model.value,capabilities:{}});
 const status=document.createElement('p');status.setAttribute('role','status');status.textContent='Đang tải danh mục…';host.append(refresh,preview,status);refresh.disabled=true;
 fields.vision.checked=false;fields.vision.disabled=true;
 try{const data=await Account.request('/api/admin/ai/catalog','POST',{provider});if(generation!==aiCatalogueRequest)return;const cards=document.createElement('div');cards.className='ai-model-cards';for(const model of data.items||[]){const option=document.createElement('option');option.value=model.id;option.label=model.name;list.append(option);const row=document.createElement('div'),choose=document.createElement('button'),suggest=document.createElement('button');choose.type=suggest.type='button';choose.className=suggest.className='secondary';choose.textContent=model.name+' · Dùng mã';suggest.textContent='Xem gợi ý';choose.onclick=()=>{fields.model.value=model.id;fields.model.focus();};suggest.onclick=()=>ElioAIAssignments.open({provider,model:model.id,...model,id:undefined,catalogVerified:true,capabilitySource:'API nhà cung cấp',source:data.source});row.append(choose,suggest);cards.append(row);}status.textContent=(data.items?.length?'Đã đồng bộ '+data.items.length+' model. ':'Danh sách rỗng. ')+(data.note||'Khả năng chưa có metadata sẽ hiển thị Chưa xác minh.');host.append(cards);}
 catch(e){if(generation===aiCatalogueRequest)status.textContent='Không tải được danh mục: '+e.message+' Có thể nhập mã và xem gợi ý tham khảo.';}finally{refresh.disabled=false;}
}
