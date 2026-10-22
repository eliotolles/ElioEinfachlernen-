// Heavy inference stays outside the UI thread. Pinned dependencies load only on demand.
const nativeFetch=self.fetch.bind(self);
self.fetch=async function(resource,options){
 const url=typeof resource==='string'?resource:resource.url;
 const runtime=/^https:\/\/(cdn\.jsdelivr\.net\/npm\/@diffusionstudio\/piper-wasm@1\.0\.0\/|cdnjs\.cloudflare\.com\/ajax\/libs\/onnxruntime-web\/1\.18\.0\/)/.test(url||'');
 if(!runtime||!self.caches)return nativeFetch(resource,options);
 let cache;try{cache=await caches.open('elio-piper-runtime-v1');const saved=await cache.match(resource);if(saved)return saved;}catch{}
 const response=await nativeFetch(resource,options);if(response.ok&&cache)try{await cache.put(resource,response.clone());}catch{}return response;
};
let session=null,tts=null,queue=Promise.resolve();
self.onmessage=({data})=>{queue=queue.catch(()=>{}).then(async()=>{
 const {id,text}=data;
 try{
  if(!navigator.storage?.getDirectory)throw Error('Trình duyệt không hỗ trợ lưu bộ giọng Piper.');
  tts=tts||await import('./piper-vendor.js');
  if(!session)session=new tts.TtsSession({voiceId:'de_DE-thorsten-medium',progress:p=>self.postMessage({id,type:'progress',percent:p.total?Math.min(100,Math.round(p.loaded/p.total*100)):null})});
  await session.waitReady;
  if(data.prepare){self.postMessage({id,type:'ready'});return;}
  const audio=await session.predict(text);self.postMessage({id,type:'audio',audio});
 }catch(error){session=null;if(tts)tts.TtsSession._instance=null;self.postMessage({id,type:'error',message:error.message||'Không khởi tạo được Piper.'});}
});};
