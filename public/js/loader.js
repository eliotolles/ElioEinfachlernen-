const appScripts=JSON.parse(document.currentScript.dataset.scripts);
const importLibraries=appScripts.filter(src=>/^https?:/.test(src)),libraryLoads=new Map();
window.ensureImportLibrary=async ext=>{const src=importLibraries.find(src=>/^(xlsx|xls|csv)$/.test(ext)?src.includes('xlsx'):ext==='docx'?src.includes('mammoth'):ext==='pdf'?src.includes('pdf.min.js'):false);if(!src)return;if(!libraryLoads.has(src)){const promise=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=()=>{libraryLoads.delete(src);reject(Error('Không tải được thư viện đọc file. Kiểm tra mạng rồi thử lại.'));};document.head.append(script);});libraryLoads.set(src,promise);}await libraryLoads.get(src);};
const localScripts=[...appScripts.filter(src=>!/^https?:/.test(src)),'js/pdf-tools.js','js/cloud-ui.js','js/book-ui.js'];
const assetVersion=document.querySelector('meta[name="elio-assets"]')?.content;
let assetVersions={};try{assetVersions=JSON.parse(document.getElementById?.('elio-asset-map')?.textContent||'{}');}catch{}
const assetURL=src=>{const version=assetVersions[src]||assetVersion;return version?src+'?v='+encodeURIComponent(version):src;};
for(const src of localScripts){const link=document.createElement('link');link.rel='preload';link.as='script';link.href=assetURL(src);document.head.append(link);}
(async()=>{
 if(window.ElioSessionLoaded)await window.ElioSessionLoaded;
 await Account.ready;
 if(!Account.current()||Account.profile.passwordExpired)return;
 // Fetch together; async=false preserves the existing dependency/execution order.
 await Promise.all(localScripts.map(src=>new Promise((resolve,reject)=>{
  const s=document.createElement('script');s.async=false;s.src=assetURL(src);s.onload=resolve;s.onerror=()=>reject(Error('Không tải được '+src));document.body.append(s);
 })));
 // Reveal once, after saved theme, module controls and the current shell are ready.
 if(!window.ElioBookReady)throw Error('Chưa tải xong giao diện Elio. Vui lòng tải lại trang.');
 document.documentElement.classList.remove('auth-pending');
 const artwork=document.querySelector('meta[name="elio-artwork"]')?.content;
 if(artwork){const loadArt=()=>artwork.split(',').forEach(src=>{const link=document.createElement('link');link.rel='stylesheet';link.href=assetURL(src);document.head.append(link);});if(window.requestIdleCallback)window.requestIdleCallback(loadArt,{timeout:1500});else setTimeout(loadArt,0);}
})().catch(e=>{document.body.textContent=e.message;document.documentElement.classList.remove('auth-pending');});
