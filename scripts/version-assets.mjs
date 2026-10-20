import {createHash} from 'node:crypto';
// Content revision keeps browser assets together without caching account API data.
export function versionAssets(input){
 const hash=createHash('sha256').update('elio-loading-brand-v2');for(const name of Object.keys(input).sort())hash.update(name).update(input[name]);
 const revision=hash.digest('hex').slice(0,16),assets={...input};
 const prepaint=`<meta name="elio-assets" content="${revision}"><script>(()=>{try{const t=localStorage.getItem('dt:_theme');document.documentElement.dataset.loadingTheme=t==='dark'||t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}catch{}})();</script><style>html.auth-pending{background:#faf7ee;color:#18231d}html.auth-pending[data-loading-theme="dark"]{background:#203128;color:#f6f0df;color-scheme:dark}html.auth-pending::before{content:"e";position:fixed;left:calc(50% - 90px);top:calc(50% - 18px);width:32px;height:35px;display:grid;place-items:center;border-radius:12px 12px 12px 1px;background:#245e3f;color:#fff;font:500 30px/1 Arial,sans-serif;pointer-events:none}html.auth-pending::after{content:"Elio Einfach";position:fixed;left:calc(50% - 46px);top:50%;transform:translateY(-50%);font:600 20px/1.4 Arial,sans-serif;white-space:nowrap;pointer-events:none}html.auth-pending body{visibility:hidden}</style>`;
 for(const [name,content]of Object.entries(assets)){
  if(name.endsWith('.html'))assets[name]=content.replace(/\b(src|href)="([^"?#]+\.(?:js|css))"/g,(full,attr,url)=>/^(?:https?:|\/\/|data:)/.test(url)?full:attr+'="'+url+'?v='+revision+'"').replace('<head>','<head>'+prepaint);
 }
 if(assets['/sw.js'])assets['/sw.js']=assets['/sw.js'].replace("const CACHE='elio-cloud-v2-book-ui';","const CACHE='elio-cloud-v2-book-ui-"+revision+"';");
 return {assets,revision};
}
