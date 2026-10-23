import fs from 'node:fs/promises';
import path from 'node:path';
import {extractInlineImages} from './extract-inline-images.mjs';
import {versionAssets} from './version-assets.mjs';
async function walk(dir){const files=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())files.push(...await walk(p));else if(!p.endsWith('.zip'))files.push(p);}return files;}
const source={};for(const file of await walk('public'))source['/'+file.slice(7)]=await fs.readFile(file,'utf8');
const extracted=extractInlineImages(source),{assets}=versionAssets(extracted.assets);
await fs.rm('vercel-public',{recursive:true,force:true});await fs.mkdir('vercel-public',{recursive:true});
const dynamic={};
for(const [name,text] of Object.entries(assets)){
 if(['/home.html','/hoeren.html'].includes(name)){dynamic[name]=text;continue;}
 const file=path.join('vercel-public',name);await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,text);
}
for(const [name,img] of Object.entries(extracted.images)){const file=path.join('vercel-public',name);await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,Buffer.from(img.base64,'base64'));}
await fs.mkdir('vercel-server',{recursive:true});
await fs.writeFile('vercel-server/worker.mjs','const ASSETS='+JSON.stringify(dynamic)+';\n'+await fs.readFile('worker/index.js','utf8'));
console.log(`Vercel build: ${Object.keys(assets).length} assets, ${Object.keys(extracted.images).length} images; authenticated listening page retained.`);
