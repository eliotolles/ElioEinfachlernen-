'use strict';
// Keep each opened module document alive: its handlers, draft and timer stay intact.
const ElioNavigation=(()=>{
 const allowed=new Set(['index','grammatik','wortschatz','quiz','schreiben','sprechen','pruefung','hoeren','tutor','settings','history','admin']);
 let installed=false,go;
 function target(value){try{const u=new URL(value,location.href),name=u.pathname.split('/').filter(Boolean).pop()||'index.html',base=name.replace(/\.html$/,'');if(u.origin!==location.origin||!allowed.has(base))return null;u.pathname='/'+base+'.html';return u;}catch{return null;}}
 function install(){
  if(installed)return;installed=true;
  let child=false;try{child=window.parent!==window&&window.parent.ElioNavigationHost===true;}catch{}
  if(!child)window.ElioNavigationHost=true;
  const own=target(location.href);if(!own)return;
  if(child){go=value=>{const u=target(value);if(u)window.parent.postMessage({type:'elio:navigate',url:u.pathname+u.search+u.hash},location.origin);};}
  else{
   const views=new Map(),ownKey=own.pathname+own.search;let current=ownKey,overlay=null,savedOverflow='',savedScroll=0;
   history.replaceState({...history.state,elioNavigation:true},'',own.pathname+own.search+own.hash);
   const style=document.createElement('style');style.textContent='.elio-route-frame{position:fixed;inset:0;width:100%;height:100dvh;border:0;background:var(--bg,#faf7ee);z-index:10000}.elio-route-frame[hidden]{display:none!important}';document.head.append(style);
   function show(value,push=true){const u=target(value);if(!u)return;const key=u.pathname+u.search;
    if(push&&location.pathname+location.search+location.hash!==u.pathname+u.search+u.hash)history.pushState({elioNavigation:true},'',u.pathname+u.search+u.hash);
    if(key===ownKey){if(overlay)overlay.hidden=true;document.body.style.overflow=savedOverflow;window.scrollTo(0,savedScroll);if(current!==key||location.hash!==own.hash)window.dispatchEvent(new Event('hashchange'));current=key;document.dispatchEvent(new Event('elioviewresume'));document.dispatchEvent(new Event('cloudchange'));document.title=views.get(ownKey).title;return;}
    if(current===ownKey){savedOverflow=document.body.style.overflow;savedScroll=window.scrollY;}
    let view=views.get(key);
    if(!view){const frame=document.createElement('iframe');frame.className='elio-route-frame';frame.title='Elio Einfach';frame.src=u.pathname+u.search+u.hash;frame.referrerPolicy='same-origin';view={frame,title:'Elio Einfach',ready:false};views.set(key,view);frame.addEventListener('load',()=>{try{view.title=frame.contentDocument.title;if(current===key)document.title=view.title;}catch{}});document.body.append(frame);}
    else{try{view.frame.contentDocument.dispatchEvent(new view.frame.contentWindow.Event('elioviewresume'));if(view.frame.contentWindow.location.hash!==u.hash){view.frame.contentWindow.history.replaceState(null,'',u.pathname+u.search+u.hash);view.frame.contentWindow.dispatchEvent(new view.frame.contentWindow.Event('hashchange'));}view.frame.contentDocument.dispatchEvent(new view.frame.contentWindow.Event('cloudchange'));view.frame.contentDocument.dispatchEvent(new view.frame.contentWindow.Event('languagechange'));}catch{}}
    if(overlay&&overlay!==view.frame)overlay.hidden=true;overlay=view.frame;overlay.hidden=false;document.body.style.overflow='hidden';current=key;document.title=view.title;
   }
   views.set(ownKey,{title:document.title});go=show;
   window.addEventListener('message',event=>{if(event.origin!==location.origin)return;const view=[...views.values()].find(v=>v.frame?.contentWindow===event.source);if(!view)return;if(event.data?.type==='elio:navigate')show(event.data.url);});
   window.addEventListener('popstate',()=>show(location.href,false));
   document.addEventListener('cloudchange',()=>{for(const view of views.values())if(view.frame?.contentDocument)try{view.frame.contentDocument.dispatchEvent(new view.frame.contentWindow.Event('cloudchange'));}catch{}});
  }
  document.addEventListener('click',event=>{if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;const a=event.target.closest?.('a[href]');if(!a||a.hasAttribute('download')||a.target&&a.target!=='_self')return;const u=target(a.href);if(!u)return;
   // Keep same-document anchors with their existing module handlers.
   if(!child&&u.pathname===own.pathname&&u.search===own.search)return;
   event.preventDefault();event.stopImmediatePropagation();go(u.href);
  },true);
 }
 return {install,go:value=>go?go(value):location.assign(value)};
})();
