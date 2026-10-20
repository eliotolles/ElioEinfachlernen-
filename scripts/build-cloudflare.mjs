import fs from 'node:fs/promises';
import path from 'node:path';
import {versionAssets} from './version-assets.mjs';
import {extractInlineImages} from './extract-inline-images.mjs';
async function walk(dir){const result=[];for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())result.push(...await walk(file));else if(!file.endsWith('.zip'))result.push(file);}return result;}
const assets={};for(const file of await walk('public'))assets['/'+file.slice(7)]=await fs.readFile(file,'utf8');
const extracted=extractInlineImages(assets),versioned=versionAssets(extracted.assets);
await fs.mkdir('cloudflare',{recursive:true});await fs.writeFile('cloudflare/worker.mjs','const IMAGE_ASSETS='+JSON.stringify(extracted.images)+';\nconst ASSETS='+JSON.stringify(versioned.assets)+';\n'+await fs.readFile('worker/index.js','utf8'));
console.log('Cloudflare Worker built with '+Object.keys(assets).length+' text assets and '+Object.keys(extracted.images).length+' separate cached images.');
