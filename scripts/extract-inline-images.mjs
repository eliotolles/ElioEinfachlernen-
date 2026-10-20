import {createHash} from 'node:crypto';
// Preserve original bytes and dimensions; identical artwork has one public URL.
export function extractInlineImages(input){
 const assets={},images={};
 for(const [name,content]of Object.entries(input))assets[name]=/\.(?:html|css)$/.test(name)?content.replace(/data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})/g,(uri,kind,base64)=>{
  const bytes=Buffer.from(base64,'base64');if(!bytes.length||bytes.toString('base64')!==base64)return uri;
  const hash=createHash('sha256').update(bytes).digest('hex').slice(0,24),url='/images/'+hash+'.'+(kind==='jpeg'?'jpg':kind);
  images[url]={base64,type:'image/'+kind};return url;
 }):content;
 return {assets,images};
}
