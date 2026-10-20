const CACHE='elio-cloud-v2-book-ui';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 // Only obsolete static caches; never touch account snapshots or queued edits.
 const keys=await caches.keys();
 await Promise.all(keys.filter(key=>key.startsWith('elio-cloud-')&&key!==CACHE).map(key=>caches.delete(key)));
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try{
   const response=await fetch(event.request);
   if(response.ok)event.waitUntil(cache.put(event.request,response.clone()).catch(()=>{}));
   return response;
  }catch{
   return await cache.match(event.request)||new Response('Chưa có trang này trong bộ nhớ ngoại tuyến. Hãy kết nối mạng.',{status:503});
  }
 })());
});
