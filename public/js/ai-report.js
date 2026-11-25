// Báo cáo tiến độ AI: ai đang làm, ai đang trốn việc, phân công từng đề mục, giám sát.
if(Account.profile.role!=='super_admin')location.replace('index.html');
const JOB_LABELS={image:'Ảnh & PDF',speech:'Giọng nói',text:'Chấm chữa & văn bản',general:'Giám sát & hỗ trợ'};
const BROKEN_RE=/không kết nối|không giải mã|lỗi|không có quyền|hết quota|429|401|403|404|thất bại|chưa khả dụng|không xử lý|quá tải|overload|500|502|503|504/i;
function classify(r){
  if(!r.enabled)return{key:'off',label:'Tắt',cls:'off'};
  if(r.cooldown>Date.now())return{key:'rest',label:'Đang nghỉ',cls:'rest',until:r.cooldown};
  if(BROKEN_RE.test(r.status||''))return{key:'broken',label:'Hỏng · cần hỗ trợ',cls:'broken'};
  return{key:'work',label:'Đang làm',cls:'work'};
}
let data=null,testing=false,timer=null;
const setStatus=m=>{$('#report-status').textContent=m;};
function fmtTime(ts){return new Date(ts).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit',second:'2-digit'});}
async function load(){
  data=await Account.request('/api/admin/ai');
  render();
}
function render(){
  const items=data.items||[];
  const counts={work:0,rest:0,broken:0,off:0};
  const byKey={work:[],rest:[],broken:[],off:[]};
  for(const r of items){const c=classify(r);counts[c.key]++;byKey[c.key].push(r);}
  $('#report-cards').innerHTML=
    '<div class="report-card"><b>'+counts.work+'</b><span>Đang làm</span></div>'+
    '<div class="report-card"><b>'+counts.rest+'</b><span>Đang nghỉ (chờ hết giới hạn)</span></div>'+
    '<div class="report-card"><b>'+counts.broken+'</b><span>Hỏng · cần hỗ trợ</span></div>'+
    '<div class="report-card"><b>'+counts.off+'</b><span>Tắt</span></div>';
  let alert='';
  if(byKey.broken.length){
    alert='<div class="alert broken" role="alert"><strong>⚠ '+byKey.broken.length+' AI đang hỏng, cần hỗ trợ ngay:</strong> '+byKey.broken.map(r=>esc(r.label)).join(' · ')+'<br>Nhấn “Kiểm tra” từng AI bên dưới để thử lại, hoặc sửa/xóa key ở <a href="admin.html#ai">trang Quản trị AI</a>.</div>';
  }
  if(byKey.rest.length){
    alert+='<div class="alert rest"><strong>'+byKey.rest.length+' AI đang nghỉ</strong> (bị giới hạn tốc độ/quota, tự quay lại lúc '+byKey.rest.map(r=>fmtTime(r.cooldown)).join(', ')+').</div>';
  }
  if(!byKey.broken.length&&!byKey.rest.length){
    alert='<div class="alert ok">Tất cả AI đang bật đều làm việc bình thường.</div>';
  }
  $('#report-alerts').innerHTML=alert;
  const order={broken:0,rest:1,work:2,off:3};
  const sorted=[...items].sort((a,b)=>{const ca=classify(a).key,cb=classify(b).key;if(order[ca]!==order[cb])return order[ca]-order[cb];return (a.priority-b.priority)||String(a.label).localeCompare(String(b.label));});
  $('#report-ai-list').innerHTML=sorted.map(r=>{
    const c=classify(r);
    const wait=c.key==='rest'?'Chờ '+Math.ceil((r.cooldown-Date.now())/1000)+'s · quay lại '+fmtTime(r.cooldown):'—';
    return '<tr><td><span class="badge '+c.cls+'">'+c.label+'</span></td><td><strong>'+esc(r.label)+'</strong><br><span class="help-text">'+esc(r.provider)+' / '+esc(r.model)+'</span></td><td>'+esc(JOB_LABELS[r.job]||'Chưa phân công')+'</td><td>'+r.priority+'</td><td>'+esc(r.status||'')+'<br><span class="help-text">'+wait+'</span></td><td><button type="button" class="secondary" data-report-test="'+esc(r.id)+'">Kiểm tra</button></td></tr>';
  }).join('')||'<tr><td colspan="6">Chưa có AI nào.</td></tr>';
  $('#report-support-secs').textContent=data.supportAfterSeconds||12;
  $('#report-assignments').innerHTML='<table><thead><tr><th>Công việc / đề mục</th><th>AI chính</th><th>AI hỗ trợ</th></tr></thead><tbody>'+(data.assignments||[]).map(f=>{
    const primary=f.primary||[],support=f.support||[];
    const missing=!primary.length;
    return '<tr'+(missing?' class="row-missing"':'')+'><td><strong>'+esc(f.label)+'</strong><br><span class="help-text">'+esc(f.scope)+'</span></td><td>'+(primary.length?esc(primary.join(' · ')):'<strong class="text-broken">⚠ Chưa có AI</strong>')+'</td><td>'+(support.length?esc(support.join(' · ')):(f.job==='general'?'Trong nhóm, theo ưu tiên':'—'))+'</td></tr>';
  }).join('')+'</tbody></table>';
  document.querySelectorAll('[data-report-test]').forEach(b=>b.onclick=()=>testOne(b));
  setStatus('Cập nhật lúc '+fmtTime(Date.now())+' · '+items.length+' AI · hỗ trợ tự động sau '+(data.supportAfterSeconds||12)+' giây.');
}
async function testOne(btn){
  if(testing)return;testing=true;btn.disabled=true;
  try{
    const result=await Account.request('/api/admin/ai/test','POST',{id:btn.dataset.reportTest});
    setStatus('Kiểm tra xong: '+(JOB_LABELS[result.tested]||result.tested)+' chạy tốt ✓');
  }catch(e){setStatus('Kiểm tra lỗi: '+e.message);}
  testing=false;btn.disabled=false;
  await load();
}
async function testAll(){
  if(testing)return;testing=true;
  const btn=$('#report-test-all');btn.disabled=true;
  const enabled=(data.items||[]).filter(r=>r.enabled);
  let ok=0,fail=0;
  for(let i=0;i<enabled.length;i++){
    const r=enabled[i];
    setStatus('Đang kiểm tra '+r.label+' ('+(i+1)+'/'+enabled.length+')…');
    try{await Account.request('/api/admin/ai/test','POST',{id:r.id});ok++;}catch(e){fail++;}
    await new Promise(res=>setTimeout(res,400));
  }
  setStatus('Đã kiểm tra '+enabled.length+' AI: '+ok+' chạy tốt, '+fail+' lỗi. AI lỗi sẽ tự tắt để khỏi làm nghẽn.');
  testing=false;btn.disabled=false;
  await load();
}
function startAuto(){
  stopAuto();
  if($('#report-auto').checked)timer=setInterval(()=>{if(!testing)load().catch(e=>setStatus('Không cập nhật được: '+e.message));},30000);
}
function stopAuto(){if(timer){clearInterval(timer);timer=null;}}
$('#report-refresh').onclick=()=>load().catch(e=>setStatus('Không cập nhật được: '+e.message));
$('#report-test-all').onclick=testAll;
$('#report-auto').onchange=startAuto;
load().then(startAuto).catch(e=>setStatus('Không tải được báo cáo: '+e.message));
