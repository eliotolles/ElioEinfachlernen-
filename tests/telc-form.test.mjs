import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function fixture(extra={}){const c={esc:escape,LearningContent:{render:escape},...extra};vm.createContext(c);vm.runInContext(fs.readFileSync('public/js/telc-exam.js','utf8')+';this.form=TelcExam;',c);return c;}
test('old Arabic-collection parts use telc forms without changing IDs, answers, pages, source language or existing choices',()=>{
 const c=fixture(),task={id:'eva-lesen',exam:'Telc',level:'B1',skill:'reading',teil:1,title:'EVA',content:'Original German text',sourcePages:[1,2],questions:[{id:'source:q1',prompt:'1. Text',options:['A','B'],answer:'B',answerSource:'document'}]},before=JSON.stringify(task);
 const normalized=c.form.normalize(task);assert.equal(normalized.taskType,'headings');assert.equal(normalized.id,task.id);assert.deepEqual(normalized.questions[0].options,['A','B']);assert.equal(normalized.questions[0].answer,'B');assert.equal(normalized.questions[0].sourceNumber,1);assert.equal(JSON.stringify(task),before);
 assert.equal(c.form.normalize({...task,exam:'Goethe'}).telcFormVersion,undefined);
});
test('matching, full a/b/c cloze and word-bank forms preserve original options and do not invent no-match answers',()=>{
 const c=fixture();
 const headings=c.form.normalize({exam:'Telc',skill:'reading',teil:1,headings:['a. Garten','b. Verkehr'],questions:[{id:'1',answer:null}]});assert.equal(headings.questions[0].options.join(','),'a,b');assert.equal(headings.questions[0].answer,null);
 const ads=c.form.normalize({exam:'Telc',skill:'reading',teil:3,ads:[{label:'a',text:'Anzeige'}],noMatchOption:'x',questions:[{id:'11'}]});assert.equal(ads.questions[0].options.join(','),'a,x');
 const without=c.form.normalize({...ads,noMatchOption:undefined,questions:[{id:'11'}]});assert.equal(without.questions[0].options.join(','),'a');
 const cloze=c.form.normalize({exam:'Telc',skill:'grammar',teil:1,questions:[{id:'21',sourceNumber:21,options:['a. aus','b. über','c. in']}]});assert.equal(cloze.taskType,'cloze');assert.equal(cloze.questions[0].options[2],'c. in');
 const bank=c.form.normalize({exam:'Telc',skill:'grammar',teil:2,wordBank:[{label:'o',word:'WELCHEN'}],questions:[{id:'31'}]});assert.equal(bank.taskType,'word-bank');assert.equal(bank.questions[0].options[0],'o');
});
test('explicit Sprachbausteine source evidence corrects a mistaken listening label but real audio remains listening',()=>{
 const c=fixture(),task={exam:'Telc',skill:'listening',teil:2,title:'Sprachbausteine Teil 2'};assert.equal(c.form.normalize(task).skill,'grammar');assert.equal(c.form.normalize({...task,audioUrl:'https://example.test/audio.mp3'}).skill,'listening');
 assert.equal(c.form.normalize({exam:'Telc',skill:'listening',teil:1,title:'Hörverstehen'}).taskType,'listening');
});
test('continuation pages combine only within a confirmed named test and retain every question and source page',()=>{
 const c=fixture(),row=(name,page)=>({setName:name,parentNameConfirmed:true,exam:'Telc',level:'B1',skill:'reading',teil:1,sourcePage:page,content:'Source '+page,questions:[{id:'q1',prompt:'Question '+page,answer:null}]}),input=[row('EVA',1),row('EVA',2),row('EVA1',3)],before=JSON.stringify(input);
 const result=c.form.assemble(input);assert.equal(result.length,2);assert.equal(result[0].questions.length,2);assert.equal(new Set(result[0].questions.map(q=>q.id)).size,2);assert.equal(result[0].questions[1].sourceQuestionId,'q1');assert.equal(result[0].sourcePages.join(','),'1,2');assert(result[0].content.includes('Source 1'));assert(result[0].content.includes('Source 2'));assert.equal(JSON.stringify(input),before);
 assert.equal(c.form.assemble([{...row('Unknown',1),parentNameConfirmed:false},{...row('Unknown',2),parentNameConfirmed:false}]).length,2);
});
test('question pages inherit the bank from their preceding page without creating source answers',()=>{
 const c=fixture(),base={exam:'Telc',level:'B1',skill:'grammar',teil:2,setName:'PETRA',parentNameConfirmed:true};
 const rows=c.form.assemble([{...base,sourcePage:5,content:'Bank',choiceBank:[{label:'a',text:'ZU'},{label:'b',text:'MIT'}]},{...base,sourcePage:6,content:'Passage',questions:[{id:'q31',sourceNumber:31,answer:null,answerSource:'none'}]}]);assert.equal(rows.length,1);assert.equal(rows[0].questions[0].options.join(','),'a,b');assert.equal(rows[0].questions[0].answer,null);
});
test('source text, original images and labelled banks remain readable and escaped',()=>{
 const c=fixture(),html=c.form.sourceHTML({exam:'Telc',skill:'reading',teil:3,title:'Source',content:'<script>alert(1)</script>',sourceImages:['javascript:alert(1)','data:image/svg+xml;base64,AAAA','data:image/webp;base64,AAAA'],ads:[{label:'a',text:'<img onerror=x>'}]});
 assert(!html.includes('<script>'));assert(!html.includes('src="javascript:'));assert(!html.includes('src="data:image/svg'));assert(html.includes('src="data:image/webp'));assert(html.includes('telc-bank-entry'));assert(html.includes('&lt;img'));
});
test('part tabs count actual answered questions and reveal the correct part without changing answers or timers',()=>{
 const host={innerHTML:'',querySelectorAll:()=>[]},sections=[{},{}],saved=[];
 const simulation={exam:'Telc',level:'B1',deadline:12345,telcParts:{reading:2},items:[{exam:'Telc',skill:'reading',teil:1,questions:[{id:'q1'}]},{exam:'Telc',skill:'reading',teil:2,questions:[{id:'q6'}]}],answers:[{q1:'b'},{}]};
 const c=fixture({simulation,examVisibleSkill:'reading',examVisibleIndices:()=>[0,1],saveSimulation:()=>saved.push(true),document:{getElementById:()=>host,querySelector:selector=>sections[Number(selector.match(/item="(\d+)"/)[1])]}}),before=JSON.stringify(simulation.answers);
 c.renderTelcParts();assert.equal(sections[0].hidden,true);assert.equal(sections[1].hidden,false);assert(host.innerHTML.includes('1/1'));assert(host.innerHTML.includes('0/1'));c.showTelcPartForItem(0);assert.equal(sections[0].hidden,false);assert.equal(sections[1].hidden,true);assert.equal(simulation.deadline,12345);assert.equal(JSON.stringify(simulation.answers),before);assert.equal(saved.length,1);
});
test('all exam import screens load the telc contract before the shared importer and the simulator uses responsive panes',()=>{
 for(const file of ['pruefung.html','schreiben.html','sprechen.html']){const html=fs.readFileSync('public/'+file,'utf8');assert(html.indexOf('js/telc-exam.js')<html.indexOf('js/import-hub.js'));}
 const importer=fs.readFileSync('public/js/import-hub.js','utf8'),simulator=fs.readFileSync('public/js/simulator.js','utf8'),css=fs.readFileSync('public/telc-exam.css','utf8');assert(importer.includes('TelcExam.extractionRule'));assert(importer.includes('TelcExam.assemble'));assert(simulator.includes('telc-source-pane'));assert(simulator.includes('telc-questions-pane'));assert(css.includes('@media(max-width:900px)'));assert(simulator.includes('slice(separator+1)'));
});

test('legacy prefix and trailing OCR labels become full option text without changing radio values or answer keys',()=>{
 const c=fixture(),questions=[{id:'q6',prompt:'6. Frage sechs. Alles A Zweites B Drittes C',options:['A','B','C'],answer:'B'},{id:'q7',prompt:'7. Frage sieben. A Erstes B Zweites C Drittes',options:['A','B','C'],answer:null}];
 const task={exam:'Telc',skill:'reading',teil:2,content:'6. Frage sechs.\nAlles A\nZweites\nB\nDrittes C\n7. Frage sieben.\nA Erstes\nB Zweites\nC Drittes',questions};
 const result=c.form.normalize(task);assert.equal(result.questions[0].prompt,'Frage sechs.');assert.equal(result.questions[0].optionTexts.B,'Zweites');assert.equal(result.questions[0].answer,'B');assert.deepEqual(result.questions[0].options,['A','B','C']);assert.equal(result.questions[1].optionTexts.C,'Drittes');assert.equal(result.questions[1].answer,null);
});
test('legacy source lines with lost list markers can be matched to an exact original question prefix',()=>{
 const c=fixture(),task={exam:'Telc',skill:'reading',teil:2,content:'Source passage\nFrage ohne Listenmarker.\nA Erstes\nB Zweites\nC Drittes',questions:[{id:'q6',prompt:'6. Frage ohne Listenmarker. A Erstes B Zweites C Drittes',options:['A','B','C']}]};
 const result=c.form.normalize(task);assert.equal(result.questions[0].prompt,'Frage ohne Listenmarker.');assert.equal(result.questions[0].optionTexts.A,'Erstes');
});
test('ambiguous multi-column OCR is retained and flagged instead of inventing option text',()=>{
 const c=fixture(),task={exam:'Telc',skill:'grammar',teil:1,content:'21. A Wort B anderes 24. A Spalte\nB mehr C unklar',questions:[{id:'q21',prompt:'Lücke 21',options:['A','B','C'],answer:null}]},result=c.form.normalize(task);
 assert.equal(result.questions[0].optionTexts,undefined);assert.equal(result.questions[0].answer,null);assert(c.form.warnings(result).some(w=>w.includes('OCR')));assert.equal(result.content,task.content);
});

test('full option text uses the source question number, escapes HTML and retains the stored choice value',()=>{
 const source=fs.readFileSync('public/js/simulator.js','utf8'),line=source.split('\n').find(x=>x.startsWith('function renderQuestion(')),c={esc:escape,simulation:{finished:false}};vm.createContext(c);vm.runInContext(line,c);
 const html=c.renderQuestion({id:'q6',sourceNumber:6,prompt:'Original question',options:['A','B','C'],optionTexts:{A:'<script>',B:'Second',C:'Third'}},1,0,{q6:'B'});
 assert(html.includes('6. Original question'));assert(html.includes('value="B" checked'));assert(html.includes('&lt;script&gt;'));assert(!html.includes('exam-matching-options'));
});
test('listening source links allow only YouTube references and never pretend to be per-Teil audio',()=>{
 const c=fixture({URL});
 const task={skill:'listening',listeningPlaylistUrl:'https://www.youtube.com/playlist?list=PLtest_123',listeningReferenceVideo:{id:'YB6k0ibd3Bc'}};
 const html=c.form.listeningSourcesHTML(task);assert(html.includes('watch?v=YB6k0ibd3Bc'));assert(html.includes('playlist?list=PLtest_123'));assert(html.includes('chưa chia mốc'));assert(!html.includes('<iframe'));assert(!html.includes('<audio'));assert.equal(task.audioUrl,undefined);
 for(const url of ['javascript:alert(1)','https://youtube.com.evil.test/playlist?list=PLtest','https://evil.test/playlist?list=PLtest','https://youtube.com/playlist?list=%22%3E'])assert.equal(c.form.listeningSourcesHTML({listeningPlaylistUrl:url}), '');
 assert.equal(c.form.listeningSourcesHTML({listeningReferenceVideo:{id:'"><script>'}}),'');
});
