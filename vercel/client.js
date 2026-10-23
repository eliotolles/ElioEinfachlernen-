'use strict';
// Included only in Vercel builds, before the existing application scripts.
(()=>{
 const original=window.fetch.bind(window),chunkSize=750000;
 window.fetch=async function(input,options={}){
  const url=new URL(typeof input==='string'?input:input.url,location.href),method=(options.method||'GET').toUpperCase();
  if(url.origin!==location.origin||!['PUT /api/state','PUT /api/shared','POST /api/ai','POST /api/listening/shadow'].includes(method+' '+url.pathname)||typeof options.body!=='string')return original(input,options);
  const bytes=new TextEncoder().encode(options.body);if(bytes.length<=3000000)return original(input,options);
  const id=crypto.randomUUID(),headers=new Headers(options.headers);headers.set('Content-Type','application/json');
  const send=(action,data,signal=options.signal)=>original('/api/transfer/'+action,{method:'POST',credentials:'same-origin',headers,body:JSON.stringify({id,...data}),signal});
  let started=false;
  try{
   let response=await send('start',{path:url.pathname,method,size:bytes.length,parts:Math.ceil(bytes.length/chunkSize)});if(!response.ok)return response;started=true;
   for(let offset=0;offset<bytes.length;offset+=chunkSize){
    let binary='';const part=bytes.subarray(offset,offset+chunkSize);for(let i=0;i<part.length;i+=8192)binary+=String.fromCharCode(...part.subarray(i,i+8192));
    response=await send('chunk',{part:offset/chunkSize,data:btoa(binary)});if(!response.ok)return response;
   }
   return await send('commit',{});
  }finally{if(started)send('cancel',{},null).catch(()=>{});}
 };
})();
