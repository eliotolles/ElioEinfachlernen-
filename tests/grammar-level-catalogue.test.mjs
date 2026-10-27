import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const ctx=vm.createContext({});
vm.runInContext(fs.readFileSync('public/js/grammar-level-catalogue.js','utf8')+fs.readFileSync('public/js/grammar-atlas-data.js','utf8')+';globalThis.catalogue=ElioGrammarLevelCatalogue;globalThis.lessons=ElioGrammarAtlasData;',ctx);
const index=JSON.parse(JSON.stringify(ctx.catalogue)),lessons=JSON.parse(JSON.stringify(ctx.lessons));
const requested=JSON.parse(fs.readFileSync('scripts/grammar-authoring/requested-topics.json','utf8'));
test('level index matches every requested topic in original order without repeated rows',()=>{
 for(const [level,text]of Object.entries(requested)){
  assert.deepEqual(index.levels[level].map(x=>x.topic),[...new Set(text.split('|'))],level);
  assert.equal(new Set(index.levels[level].map(x=>x.id)).size,index.levels[level].length);
  for(const row of index.levels[level])assert(lessons.some(l=>l.id===row.id&&l.levels.includes(level)&&l.topic===row.topic));
 }
 assert.deepEqual(Object.values(index.levels).map(x=>x.length),[70,109,118,70,18]);
 assert.equal(lessons.length,165);
});
test('ordered filtering leaves lesson IDs, exercises and imported data intact',()=>{
 const code=fs.readFileSync('public/js/grammar.js','utf8'),before=JSON.stringify(lessons);
 ctx.items=lessons;vm.runInContext(code.slice(code.indexOf('function grammarAtlasOrdered'),code.indexOf('function filteredGrammarItems')),ctx);
 for(const level of Object.keys(index.levels)){ctx.level=level;const ids=JSON.parse(vm.runInContext('JSON.stringify(grammarAtlasOrdered(items.filter(l=>l.levels.includes(level)),level).map(l=>l.id))',ctx));assert.deepEqual(ids,index.levels[level].map(r=>r.id));}
 assert.equal(JSON.stringify(lessons),before);
});
test('download export matches runtime lessons and level assignments',()=>{
 const file=JSON.parse(fs.readFileSync('public/data/grammar-atlas-export-v2.json','utf8'));
 assert.deepEqual(file.lessons,lessons);assert.deepEqual(file.levelIndex,index.levels);
});
test('page loads the level index before its consumers and keeps all existing learning tabs',()=>{
 const html=fs.readFileSync('public/grammatik.html','utf8'),ui=fs.readFileSync('public/js/grammar-atlas-ui.js','utf8'),logic=fs.readFileSync('public/js/grammar.js','utf8');
 assert(html.indexOf('js/grammar-level-catalogue.js')<html.indexOf('js/grammar.js'));
 assert(!html.includes('value="all">A1 — C1'));
 assert(ui.includes("level.value='all'")===false);
 assert(ui.includes("setAttribute('aria-pressed'"));
 assert(logic.includes('GrammarMindmap.mount'));assert(logic.includes('LearningContextAI.mount'));assert(logic.includes('saveGrammarSession'));
});
