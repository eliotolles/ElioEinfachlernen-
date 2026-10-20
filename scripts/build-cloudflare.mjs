import fs from 'node:fs/promises';
import path from 'node:path';
import {versionAssets} from './version-assets.mjs';
async function walk(dir){const result=[];for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())result.push(...await walk(file));else if(!file.endsWith('.zip'))result.push(file);}return result;}
const assets={};for(const file of await walk('public'))assets['/'+file.slice(7)]=await fs.readFile(file,'utf8');
const versioned=versionAssets(assets);
await fs.mkdir('cloudflare',{recursive:true});await fs.writeFile('cloudflare/worker.mjs','const ASSETS='+JSON.stringify(versioned.assets)+';\n'+await fs.readFile('worker/index.js','utf8'));
console.log('Cloudflare Worker built with '+Object.keys(assets).length+' assets. No Sites runtime dependency.');
