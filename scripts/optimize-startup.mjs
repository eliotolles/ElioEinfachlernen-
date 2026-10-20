// Keep presentation downloads out of the authentication and module startup path.
export function optimizeStartup(input){
 const assets={...input};
 const fontURL='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Lexend:wght@300;400;500;600;700&family=Patrick+Hand&family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap';
 const googleImport=/@import\s+url\(['"]https:\/\/fonts\.googleapis\.com\/[^'"\)]+['"]\);?/g;
 for(const [name,content]of Object.entries(assets))if(name.endsWith('.css'))assets[name]=content.replace(googleImport,'');
 if(assets['/book-art.css'])assets['/book-art.css']=assets['/book-art.css'].replace(/@import\s+url\(["']book-(?:contents|study)-art\.css["']\);?/g,'');
 for(const [name,content]of Object.entries(input)){
  if(!name.endsWith('.html'))continue;
  let html=content;
  const bootPaths=['js/cloud-cache.js','js/session.js',...(content.includes('src="js/guard.js"')?['js/guard.js']:[])];
  if(bootPaths.length===3&&bootPaths.every(src=>assets['/'+src]!==undefined)&&content.includes('src="js/session.js"')){
   const boot=bootPaths.length===3?'js/boot-app.js':'js/boot-account.js';
   assets['/'+boot]=bootPaths.map(src=>assets['/'+src]).join('\n;\n');
   for(const src of bootPaths)html=html.replace(new RegExp('<script src="'+src.replaceAll('.','\\.')+'"><\\/script>'),'');
   // Dynamically inserted scripts do not wait for pending stylesheets.
   html=html.replace('<head>','<head><script>window.ElioSessionLoaded=new Promise((resolve,reject)=>{const s=document.createElement("script");s.src="'+boot+'";s.onload=resolve;s.onerror=()=>reject(Error("Không tải được phiên đăng nhập. Vui lòng tải lại trang."));document.head.append(s);});</script>');
  }
  html=html.replace(/<link\b[^>]*href="book-art\.css"[^>]*>/g,'<meta name="elio-artwork" content="book-art.css,book-contents-art.css,book-study-art.css">');
  html=html.replace('</head>','<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="'+fontURL+'" media="print" onload="this.media=\'all\'"></head>');
  const scripts=content.match(/data-scripts=(['"])(.*?)\1/);
  if(scripts){
   const paths=JSON.parse(scripts[2].replaceAll('&quot;','"')).filter(src=>!/^https?:/.test(src));
   const preload=[...new Set([...paths,'js/pdf-tools.js','js/cloud-ui.js','js/book-ui.js'])].map(src=>'<link rel="preload" as="script" href="'+src+'">').join('');
   html=html.replace('</head>',preload+'</head>');
  }
  assets[name]=html;
 }
 return assets;
}
