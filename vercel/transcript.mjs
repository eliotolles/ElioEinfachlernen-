// Calls the Python function only after the existing Worker authenticates/rate-limits
// the public listening route. A short-lived HMAC binds the exact request body.
export function withNativeTranscript(request,env){
 if(env.TRANSCRIPT_BACKEND_URL||env.TRANSCRIPT_BACKEND_TOKEN)return env;
 const origin=new URL(request.url).origin;
 const target=new URL('/api/transcript',origin);
 const native=async body=>{
  if(!env.AI_ENCRYPTION_KEY)return Response.json({available:false,code:'CAPTIONS_NOT_CONFIGURED',reason:'Máy chủ thiếu khóa cấu hình ứng dụng.',cues:[]});
  const timestamp=String(Math.floor(Date.now()/1000));
  const encoder=new TextEncoder();
  const key=await crypto.subtle.importKey('raw',encoder.encode(env.AI_ENCRYPTION_KEY),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const signature=await crypto.subtle.sign('HMAC',key,encoder.encode('elio-transcript-v1\n'+timestamp+'\n'+body));
  const hex=Array.from(new Uint8Array(signature),n=>n.toString(16).padStart(2,'0')).join('');
  return fetch(target,{method:'POST',redirect:'manual',signal:AbortSignal.timeout(65000),
   headers:{'Content-Type':'application/json','X-Elio-Transcript-Time':timestamp,'X-Elio-Transcript-Signature':hex},
   body});
 };
 return {...env,TRANSCRIPT_NATIVE_FETCH:native,TRANSCRIPT_NATIVE_HEALTH:()=>fetch(target,{redirect:'manual',signal:AbortSignal.timeout(15000)})};
}
