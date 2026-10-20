import {createHash} from 'node:crypto';
// Content revision keeps browser assets together without caching account API data.
export function versionAssets(input){
 const hash=createHash('sha256').update('elio-loading-brand-v2');for(const name of Object.keys(input).sort())hash.update(name).update(input[name]);
 const revision=hash.digest('hex').slice(0,16),assets={...input};
 const versions=Object.fromEntries(Object.entries(input).filter(([name])=>/\.(?:js|css)$/.test(name)).map(([name,content])=>[name.replace(/^\//,''),createHash('sha256').update(content).digest('hex').slice(0,16)]));
 const prepaint=`<link rel="icon" type="image/svg+xml" href="/favicon.svg?v=1"><meta name="elio-assets" content="${revision}"><script type="application/json" id="elio-asset-map">${JSON.stringify(versions).replaceAll('<','\\u003c')}</script><script>(()=>{try{const t=localStorage.getItem('dt:_theme');document.documentElement.dataset.loadingTheme=t==='dark'||t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}catch{}})();</script><style>html.auth-pending{background:#faf7ee;color:#18231d}html.auth-pending[data-loading-theme="dark"]{background:#203128;color:#f6f0df;color-scheme:dark}html.auth-pending::before{content:"e";position:fixed;left:calc(50% - 90px);top:calc(50% - 18px);width:32px;height:35px;display:grid;place-items:center;border-radius:12px 12px 12px 1px;background:#245e3f;color:#fff;font:500 30px/1 Arial,sans-serif;pointer-events:none}html.auth-pending::after{content:"Elio Einfach";position:fixed;left:calc(50% - 46px);top:50%;transform:translateY(-50%);font:600 20px/1.4 Arial,sans-serif;white-space:nowrap;pointer-events:none}html.auth-pending body{visibility:hidden}</style>`;
 for(const [name,content]of Object.entries(assets)){
  if(name.endsWith('.html'))assets[name]=content.replace(/\b(src|href)="([^"?#]+\.(?:js|css))"/g,(full,attr,url)=>/^(?:https?:|\/\/|data:)/.test(url)?full:attr+'="'+url+'?v='+(versions[url.replace(/^\.?\//,'')]||revision)+'"').replace('<head>','<head>'+prepaint);
 }

 return {assets,revision};
}
