import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync('public/js/grammar-mindmap.js','utf8')+';this.map=GrammarMindmap;',ctx);
test('mind map organizes real lesson sections and preserves German, Vietnamese and tables',()=>{
 const source='## Nebensätze\n### 1. Cách dùng\nDiễn đạt nguyên nhân.\n### 2. Công thức\nweil + S + … + Verb\n| Satz | Nghĩa |\n| --- | --- |\n| Ich bleibe, weil es regnet. | Tôi ở lại vì trời mưa. |\n### 3. Ví dụ\nEr sagt, dass er kommt.\n(Anh ấy nói anh ấy sẽ đến.)\n### 4. Lỗi thường gặp\nĐộng từ chia đứng cuối.\n### Thêm\nGhi chú riêng';
 const lesson={id:'existing',title:'Nebensätze',level:'B1'},before=JSON.stringify(lesson),m=ctx.map.model(lesson,source,'Ich lerne.');
 assert.equal(JSON.stringify(lesson),before);assert.equal(m.groups[0][0].body,'Diễn đạt nguyên nhân.');assert(m.groups[1][0].body.includes('| Tôi ở lại vì trời mưa. |'));assert(m.groups[2][0].body.includes('(Anh ấy nói anh ấy sẽ đến.)'));assert.equal(m.groups[3][0].body,'Động từ chia đứng cuối.');assert.equal(m.groups[4][0].body,'Ghi chú riêng');assert.equal(m.groups[2][1].body,'Ich lerne.');
});
test('unstructured imports remain intact, empty lessons do not get invented rules',()=>{
 const m=ctx.map.model({title:'Import'},'Raw imported text\nAnother line','');assert.equal(m.groups[4][0].body,'Raw imported text\nAnother line');assert(ctx.map.model({},'', '').groups.every(g=>!g.length));
});

test('legacy bold and emoji headings produce separate branches',()=>{
 const m=ctx.map.model({},'Giới thiệu.\n\n**Ví dụ**\nDer Student lernt.\n\n🔹 Quy tắc chia đuôi\nThêm -en.\n\nLưu ý\nNgoại lệ.','');
 assert.equal(m.groups[2][0].body,'Der Student lernt.');assert.equal(m.groups[1][0].body,'Thêm -en.');assert.equal(m.groups[3][0].body,'Ngoại lệ.');assert.equal(m.groups[4][0].body,'Giới thiệu.');
});

test('mind map shows the complete declared level scope for shared topic entries',()=>{
 const ctx={console};vm.createContext(ctx);vm.runInContext(fs.readFileSync('public/js/grammar-mindmap.js','utf8'),ctx);
 const model=vm.runInContext("GrammarMindmap.model({title:'Gerundiv',level:'B2',levels:['B2','C1']},'## Gerundiv\\nText','')",ctx);
 assert.equal(model.level,'B2 · C1');
});
