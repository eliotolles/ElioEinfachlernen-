import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const ctx={module:{exports:{}},Date,Set,Math};vm.runInNewContext(fs.readFileSync('public/js/editorial-pages.js','utf8'),ctx);const P=ctx.module.exports;
test('dashboard projects saved data without writes or invented exam dates',()=>{
 const stored={studyPlan:null,srs:{one:{dueAt:0,repetitions:2,intervalDays:3},two:{dueAt:Date.now()+86400000,repetitions:4,intervalDays:28}},examAttempts:[]};
 const before=JSON.stringify(stored),account={get:(key,fallback)=>stored[key]??fallback,project:(_key,select)=>select([{de:'Haus'},{de:'Kind'}])};
 const data=P.snapshot(account,{streak:3,events:[]});assert.equal(data.due,1);assert.equal(data.mastered,1);assert.equal(data.total,2);assert.equal(data.countdown,null);assert.equal(JSON.stringify(stored),before);
 const html=P.dashboard(data,'<img src=x onerror=alert(1)>');assert(html.includes('&lt;img'));assert(!html.includes('<img src=x'));assert(html.includes('Chưa đặt'));assert(!html.includes('D-45'));
});
test('readiness keeps absent scores absent and never asserts that someone passed',()=>{
 const data=P.snapshot({get:(_k,f)=>f,project:(_k,select)=>select([])},{streak:0,events:[]});
 const html=P.readiness(data);assert(html.includes('Chưa đủ điểm'));assert(!html.includes('Đủ điều kiện đỗ'));assert(html.includes('>—</strong>'));
});
test('every skill card links to an existing application module rather than a placeholder',()=>{
 for(const [url]of P.skills)assert(fs.existsSync('public/'+url.split('#')[0]),url);
 assert.equal(P.skills.length,10);
});
test('new CSS and all adapters participate in versioned startup before reveal',()=>{
 const loader=fs.readFileSync('public/js/loader.js','utf8');for(const name of ['editorial-pages.js','editorial-ui.js','editorial-exams.js','editorial-refresh.css'])assert(loader.includes(name));
 assert(loader.indexOf("'js/editorial-pages.js'")<loader.indexOf("'js/editorial-ui.js'"));assert(loader.includes('bookStyle,refreshStyle'));
});
