import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const c=vm.createContext({});vm.runInContext(fs.readFileSync('public/js/grammar-atlas-data.js','utf8'),c);const lessons=JSON.parse(vm.runInContext('JSON.stringify(ElioGrammarAtlasData)',c));
const requested=JSON.parse(fs.readFileSync('scripts/grammar-authoring/requested-topics.json','utf8'));
test('every requested topic is accessible in exactly the levels the owner supplied',()=>{
 assert(!fs.existsSync('scripts/grammar-authoring/build-atlas.py'));
 assert.equal(new Set(lessons.map(l=>l.id)).size,lessons.length);
 const wanted=[...new Set(Object.values(requested).flatMap(s=>s.split('|')))];
 assert.deepEqual(lessons.map(l=>l.topic).sort(),wanted.sort());
 for(const [level,text] of Object.entries(requested))assert.deepEqual(lessons.filter(l=>l.levels.includes(level)).map(l=>l.topic).sort(),[...new Set(text.split('|'))].sort(),level);
 assert(lessons.every(l=>!l.id.startsWith('elio-grammar-')),'withdrawn lesson IDs must not return');
 assert(lessons.some(l=>l.id==='elio-reviewed-akkusativ-v2'));assert(lessons.some(l=>l.id==='elio-reviewed-dativ-v2'));
});
test('all teaching units have usable explanations, tables, examples and sentence writing',()=>{
 const chapters=new Map(lessons.map(l=>[l.chapterId,l]));assert.equal(chapters.size,42);
 for(const l of chapters.values()){
  assert(l.content.length>1700,l.title);assert(l.content.includes('| --- |'),l.title);assert.match(l.content,/đặt câu|quy trình tự kiểm tra/i,l.title);assert.match(l.content,/chú ý|lỗi thường gặp/i,l.title);assert(l.content.includes('→'),l.title);
  assert(l.reviewSources.every(s=>s.url.startsWith('https:')));
  for(const block of l.content.match(/(?:^\|.*\|\n?)+/gm)||[]){const lines=block.trim().split('\n'),width=lines[0].split('|').length;assert(lines.length>=3,l.title);for(const line of lines)assert.equal(line.split('|').length,width,l.title);}
 }
 for(const l of lessons.filter(l=>l.id.startsWith('elio-rewrite-'))){assert(l.focus.length>60);assert(l.subtitle);assert(l.content.includes('Các mục cùng bài giảng'));assert.equal(l.exercises.length,4);assert.equal(new Set(l.exercises.map(e=>e.id)).size,4);}
});
test('explained answers exist offline and reconstruction uses every token',()=>{
 for(const l of lessons)for(const e of l.exercises){assert(e.explanation.length>60,l.id);assert(e.answers.every(a=>a.trim()));assert.equal(e.answerSource,'authored');if(e.type==='fill')assert(e.question.includes('___'));if(e.type==='quiz'){assert.equal(new Set(e.options).size,e.options.length);assert(e.options.includes(e.answers[0]));}if(e.type==='build')assert.deepEqual([...e.tokens].sort(),e.answers[0].split(' ').sort());}
});
test('reader renders complete tables and safe source content across the whole catalogue',()=>{
 const ctx=vm.createContext({esc:v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'),document:{documentElement:{lang:'vi'}}});vm.runInContext(fs.readFileSync('public/js/learning-content.js','utf8'),ctx);
 for(const l of lessons){ctx.body=l.content;const html=vm.runInContext('LearningContent.render(body)',ctx);assert(html.includes('learning-table-wrap'),l.title);assert(html.includes('<th scope="col">'),l.title);assert(!html.includes('undefined'),l.title);}
});
test('catalogue filtering preserves account imports, IDs and read-only permissions',()=>{
 const code=fs.readFileSync('public/js/grammar.js','utf8'),records=[{id:'owned',items:[{id:'keep',title:'Original',level:'C1',content:'Original'}]}],before=JSON.stringify(records);const x=vm.createContext({ElioGrammarAtlasData:lessons,ImportHub:{collections:()=>records},Account:{canEdit:()=>true},$:()=>({value:'all'})});vm.runInContext(code.slice(code.indexOf('function grammarCanEdit'),code.indexOf('function renderLessonList')),x);
 assert.equal(vm.runInContext('grammarItems().length',x),lessons.length+1);assert.equal(JSON.stringify(records),before);assert.equal(vm.runInContext("grammarItems().find(l=>l.id==='keep').content",x),'Original');assert.equal(vm.runInContext("grammarCanEdit('elio-grammar-atlas-v1')",x),false);assert.equal(vm.runInContext("grammarCanEdit('owned')",x),true);
 for(const [level,text] of Object.entries(requested)){x.level=level;assert.equal(vm.runInContext('grammarAtlasFilter(grammarItems(),{level,source:"atlas"}).length',x),new Set(text.split('|')).size);}
 x.search='so sanh';assert(vm.runInContext('grammarAtlasFilter(grammarItems(),{query:search}).length',x)>0);assert.equal(vm.runInContext('grammarAtlasFilter(grammarItems(),{source:"imported"})[0].id',x),'keep');
});
