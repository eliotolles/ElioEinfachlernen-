import fs from 'node:fs/promises';import path from 'node:path';
async function walk(dir){let list=[];for(const ent of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,ent.name);if(ent.isDirectory())list.push(...await walk(p));else if(!p.endsWith('.zip'))list.push(p);}return list;}
const assets={};for(const file of await walk('public')){assets['/'+file.slice(7)]=await fs.readFile(file,'utf8');}const source=await fs.readFile('worker/index.js','utf8');await fs.rm('dist',{recursive:true,force:true});await fs.mkdir('dist/server',{recursive:true});await fs.mkdir('dist/.openai',{recursive:true});await fs.writeFile('dist/server/index.js','const ASSETS='+JSON.stringify(assets)+';\n'+source);await fs.copyFile('.openai/hosting.json','dist/.openai/hosting.json');console.log('Worker +',Object.keys(assets).length,'assets built');

await fs.copyFile('worker/transcript-backend.mjs','dist/server/transcript-backend.mjs');
