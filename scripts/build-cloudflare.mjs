import fs from 'node:fs/promises';
import path from 'node:path';
import {versionAssets} from './version-assets.mjs';
import {extractInlineImages} from './extract-inline-images.mjs';
async function walk(dir){const result=[];for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())result.push(...await walk(file));else if(!file.endsWith('.zip'))result.push(file);}return result;}
const source={};for(const file of await walk('public'))source['/'+file.slice(7)]=await fs.readFile(file,'utf8');
const extracted=extractInlineImages(source),{assets}=versionAssets(extracted.assets);
// Assets are uploaded separately. Never embed artwork or the whole frontend in the runtime.
await fs.rm('cloudflare/assets',{recursive:true,force:true});await fs.mkdir('cloudflare/assets',{recursive:true});
for(const [name,text]of Object.entries(assets)){const file=path.join('cloudflare/assets',name);await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,text);}
for(const [name,image]of Object.entries(extracted.images)){const file=path.join('cloudflare/assets',name);await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,Buffer.from(image.base64,'base64'));}
await fs.writeFile('cloudflare/assets/_headers',`/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
/images/*
  Cache-Control: public, max-age=31536000, immutable
`);
await fs.writeFile('cloudflare/worker.mjs',await fs.readFile('worker/index.js','utf8'));
await fs.copyFile('worker/transcript-backend.mjs','cloudflare/transcript-backend.mjs');
console.log(`Cloudflare build: ${Object.keys(assets).length} static files, ${Object.keys(extracted.images).length} artwork files; backend only Worker.`);
