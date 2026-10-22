import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync('public/js/book-ui.js','utf8');
const start=source.indexOf(' function renderMobileDashboard(){');
const end=source.indexOf("\n if(file==='history.html')",start);
function render(records={},language='vi'){
 const panel={innerHTML:'<div class="book-study-row">REAL ACCOUNT TASK</div>'},dashboard={innerHTML:''};
 const c={mobileDashboard:dashboard,document:{getElementById:()=>panel},mobileTitles:()=>({}),App:{stats:()=>({streak:3,xp:147,mastered:29}),t:k=>k},Auth:{get:(key,fallback)=>records[key]??fallback},Account:{displayName:()=> 'Đạt <test>'},tr:(vi,de,en)=>({vi,de,en})[language],esc:value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'),mobileLinks:()=>'<a href="quiz.html">Quiz</a>',studioIcon:()=>'<svg></svg>'};
 vm.runInNewContext(source.slice(start,end)+'\nrenderMobileDashboard();',c);return dashboard.innerHTML;
}
test('mobile dashboard uses actual account progress and escapes the profile name',()=>{const html=render();assert(html.includes('Đạt &lt;test&gt;'));for(const n of [3,147,29])assert(html.includes('<strong>'+n+'</strong>'));assert(html.includes('REAL ACCOUNT TASK'));assert(!html.includes('860'));});
test('saved writing draft resumes the writing module without copying or resetting it',()=>{const draft={drafts:{task:{essay:'Sehr geehrte Damen und Herren'}}};const before=JSON.stringify(draft),html=render(draft);assert.match(html,/href="schreiben.html" class="studio-primary"/);assert(html.includes('Viết tiếp bài của bạn'));assert.equal(JSON.stringify(draft),before);});
test('grammar session resumes when no writing draft exists, otherwise the contents is the starting point',()=>{assert.match(render({grammarSession:{lessonId:'existing-id'}}),/href="grammatik.html" class="studio-primary"/);assert.match(render(),/href="index.html#contents" class="studio-primary"/);});
test('mobile home translates the CTA and slogan for German and English',()=>{const de=render({},'de'),en=render({},'en');assert(de.includes('Jetzt lernen'));assert(de.includes('Lerne heute etwas Neues'));assert(en.includes('Start learning'));assert(en.includes('Learn something today'));});
