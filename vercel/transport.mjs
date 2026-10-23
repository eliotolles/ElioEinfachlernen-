// Vercel-only transport. Temporary chunks are isolated by account and expire.
export function createTransport({worker,initialize,session,sql}) {
 const max=14000000,chunk=750000,ttl=10*60*1000;
 const reply=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
 const fail=(status,message)=>{throw Object.assign(new Error(message),{status});};
 const targets=new Map([['PUT /api/state',13000000],['PUT /api/shared',13000000],['POST /api/ai',14000000],['POST /api/listening/shadow',5700000]]);
 async function handle(request,env){
  const url=new URL(request.url);
  if(!url.pathname.startsWith('/api/transfer/'))return worker.fetch(request,env);
  try{
   if(request.headers.get('Origin')!==url.origin)fail(403,'Origin không hợp lệ.');
   await initialize(env);const u=await session(request,env);
   const expected=request.headers.get('X-Elio-User');if(!expected||expected!==u.id)fail(409,'Phiên đăng nhập đã chuyển tài khoản.');
   await sql(env,'CREATE TABLE IF NOT EXISTS app_vercel_transfers (id TEXT NOT NULL,user_id TEXT NOT NULL,part INTEGER NOT NULL,value TEXT NOT NULL,expires INTEGER NOT NULL,PRIMARY KEY(id,user_id,part))');
   await sql(env,'DELETE FROM app_vercel_transfers WHERE expires<?',[Date.now()]);
   const text=await request.text();if(new TextEncoder().encode(text).length>1100000)fail(413,'Phần dữ liệu quá lớn.');
   let d;try{d=JSON.parse(text);}catch{fail(400,'JSON không hợp lệ.');}
   if(!/^[a-f0-9-]{36}$/.test(d.id||''))fail(400,'Mã chuyển không hợp lệ.');
   if(url.pathname==='/api/transfer/start'&&request.method==='POST'){
    const cap=targets.get(d.method+' '+d.path);if(!cap||!Number.isInteger(d.size)||d.size<=3000000||d.size>Math.min(cap,max)||!Number.isInteger(d.parts)||d.parts!==Math.ceil(d.size/chunk))fail(400,'Yêu cầu chuyển không hợp lệ.');
    const count=(await sql(env,'SELECT COUNT(*) AS n FROM app_vercel_transfers WHERE user_id=? AND part=-1',[u.id])).rows[0].n;
    if(count>=2)fail(429,'Đang có hai lượt chuyển. Hãy thử lại sau.');
    await sql(env,'INSERT INTO app_vercel_transfers(id,user_id,part,value,expires) VALUES(?,?,-1,?,?)',[d.id,u.id,JSON.stringify({path:d.path,method:d.method,size:d.size,parts:d.parts}),Date.now()+ttl]);return reply({ok:true});
   }
   const meta=(await sql(env,'SELECT value,expires FROM app_vercel_transfers WHERE id=? AND user_id=? AND part=-1',[d.id,u.id])).rows[0];if(!meta)fail(404,'Lượt chuyển đã hết hạn. Hãy thử lại.');const m=JSON.parse(meta.value);
   if(url.pathname==='/api/transfer/cancel'&&request.method==='POST'){await sql(env,'DELETE FROM app_vercel_transfers WHERE id=? AND user_id=?',[d.id,u.id]);return reply({ok:true});}
   if(url.pathname==='/api/transfer/chunk'&&request.method==='POST'){
    if(!Number.isInteger(d.part)||d.part<0||d.part>=m.parts||typeof d.data!=='string'||d.data.length>1000000||! /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(d.data))fail(400,'Phần dữ liệu không hợp lệ.');
    const length=Buffer.from(d.data,'base64').length;if(length!==Math.min(chunk,m.size-d.part*chunk))fail(400,'Kích thước phần dữ liệu không đúng.');
    await sql(env,'INSERT INTO app_vercel_transfers(id,user_id,part,value,expires) VALUES(?,?,?,?,?) ON CONFLICT(id,user_id,part) DO UPDATE SET value=excluded.value',[d.id,u.id,d.part,d.data,meta.expires]);return reply({ok:true});
   }
   if(url.pathname==='/api/transfer/commit'&&request.method==='POST'){
    const rows=(await sql(env,'SELECT part,value FROM app_vercel_transfers WHERE id=? AND user_id=? AND part>=0 ORDER BY part',[d.id,u.id])).rows;
    if(rows.length!==m.parts||rows.some((r,i)=>r.part!==i))fail(409,'Dữ liệu chưa chuyển đầy đủ.');
    const data=Buffer.concat(rows.map(r=>Buffer.from(r.value,'base64')));if(data.length!==m.size)fail(400,'Dữ liệu chưa đầy đủ.');
    // Claim once, atomically: simultaneous commits cannot execute the operation twice.
    const claimed=await sql(env,'DELETE FROM app_vercel_transfers WHERE id=? AND user_id=? AND part=-1',[d.id,u.id]);if(claimed.changes!==1)fail(409,'Lượt chuyển đã được xử lý.');
    await sql(env,'DELETE FROM app_vercel_transfers WHERE id=? AND user_id=?',[d.id,u.id]);
    const headers=new Headers(request.headers);headers.delete('Content-Length');headers.set('Content-Type','application/json');
    return worker.fetch(new Request(url.origin+m.path,{method:m.method,headers,body:data}),env);
   }
   fail(405,'Method not allowed');
  }catch(e){return reply({error:e.status?e.message:'Không chuyển được dữ liệu.',...e.extra},e.status||500);}
 }
 return handle;
}
export function streamResponse(response){
 if(!response.body||[204,205,304].includes(response.status))return response;
 const reader=response.body.getReader();const headers=new Headers(response.headers);headers.delete('Content-Length');
 return new Response(new ReadableStream({async pull(controller){try{const {done,value}=await reader.read();if(done)controller.close();else controller.enqueue(value);}catch(e){controller.error(e);}},cancel(reason){return reader.cancel(reason);}}),{status:response.status,statusText:response.statusText,headers});
}
