const appScripts=JSON.parse(document.currentScript.dataset.scripts);
const importLibraries=appScripts.filter(src=>/^https?:/.test(src)),libraryLoads=new Map();
window.ensureImportLibrary=async ext=>{const src=importLibraries.find(src=>/^(xlsx|xls|csv)$/.test(ext)?src.includes('xlsx'):ext==='docx'?src.includes('mammoth'):ext==='pdf'?src.includes('pdf.min.js'):false);if(!src)return;if(!libraryLoads.has(src)){const promise=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=()=>{libraryLoads.delete(src);reject(Error('Không tải được thư viện đọc file. Kiểm tra mạng rồi thử lại.'));};document.head.append(script);});libraryLoads.set(src,promise);}await libraryLoads.get(src);};
const localScripts=[...appScripts.filter(src=>!/^https?:/.test(src)),'js/pdf-tools.js','js/cloud-ui.js','js/book-ui.js'];
for(const src of localScripts){const link=document.createElement('link');link.rel='preload';link.as='script';link.href=src;document.head.append(link);}
(async()=>{
 await Account.ready;
 if(!Account.current()||Account.profile.passwordExpired)return;
 for(const src of localScripts){
  await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=()=>reject(Error('Không tải được '+src));document.body.append(s);});
 }
 // Reveal once, after saved theme, module controls and the current shell are ready.
 if(!window.ElioBookReady)throw Error('Chưa tải xong giao diện Elio. Vui lòng tải lại trang.');
 document.documentElement.classList.remove('auth-pending');
})().catch(e=>{document.body.textContent=e.message;document.documentElement.classList.remove('auth-pending');});
