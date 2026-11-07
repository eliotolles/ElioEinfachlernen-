import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
function setup() {
  const c = {};
  vm.createContext(c);
  vm.runInContext(fs.readFileSync("public/js/telc-exam.js", "utf8"), c);
  vm.runInContext(fs.readFileSync("public/js/reading-core.js", "utf8"), c);
  return { c, run: (s) => JSON.parse(JSON.stringify(vm.runInContext(s, c))) };
}
test("reading grading has exact parity with existing simulator for alternatives, blanks and missing keys", () => {
  const h = setup(),
    source = fs.readFileSync("public/js/simulator.js", "utf8");
  vm.runInContext(
    source.slice(
      source.indexOf("function objectiveResults("),
      source.indexOf("\nfunction renderExamFeedback"),
    ),
    h.c,
  );
  h.c.attempt = {
    items: [
      {
        skill: "reading",
        teil: 2,
        questions: [
          { id: "0", answer: "Straße" },
          { id: "q2", answers: ["A", "a. test"] },
          { id: "q3" },
          { id: "q4", answer: "B" },
          { id: "q5", answer: 0 },
        ],
      },
    ],
    answers: [{ 0: " STRAßE ", q2: "a.  test", q5: "0" }],
  };
  assert.deepEqual(
    h.run("ReadingCore.results(attempt)"),
    h.run("objectiveResults(attempt)"),
  );
  assert.equal(
    h.run("ReadingCore.results(attempt).filter(r=>r.correct).length"),
    3,
  );
  assert.equal(
    h.run("ReadingCore.results(attempt).filter(r=>!r.graded).length"),
    1,
  );
});
test("reading catalog preserves source IDs including zero and does not mutate source questions or images", () => {
  const h = setup();
  h.c.collections = [
    {
      id: "set/0",
      name: "Source",
      type: "exam",
      level: "B1",
      items: [
        {
          id: 0,
          skill: "lesen",
          title: "Quelle",
          content: "Original text",
          imageUrl: "https://example.invalid/source.png",
          questions: [{ id: "q", options: ["A", "B"], answer: "B" }],
        },
        { id: "not-reading", skill: "listening", content: "Not a reading" },
      ],
    },
  ];
  const snapshot = JSON.stringify(h.c.collections);
  const rows = h.run("ReadingCore.catalog(collections)");
  assert.equal(rows.length, 1);
  assert.equal(rows[0].id, JSON.stringify(["set/0", 0]));
  assert.equal(rows[0].task.questions[0].answer, "B");
  assert.equal(rows[0].task.imageUrl, "https://example.invalid/source.png");
  assert.equal(JSON.stringify(h.c.collections), snapshot);
  assert.notEqual(
    h.run('ReadingCore.version({content:"A"})'),
    h.run('ReadingCore.version({content:"B"})'),
  );
});
test("reading entry is included in Skills, sidebar and retained module navigation", () => {
  const source = fs.readFileSync("public/js/editorial-ui.js", "utf8");
  assert(
    source.includes("['lesen.html','book','Luyện đọc','Lesen','Reading']"),
  );
  assert(source.includes("['lesen.html','book',tr('Luyện đọc'"));
  assert(
    fs.readFileSync("public/js/navigation.js", "utf8").includes("'lesen'"),
  );
  const page = fs.readFileSync("public/lesen.html", "utf8");
  assert(page.includes("js/guard.js"));
  assert(page.includes("js/reading-core.js"));
});
test('reading page loads the complete existing authored-bank dependencies',()=>{const c={};vm.createContext(c);for(const file of ['public/js/exams.js','public/js/exam-formats.js','public/js/exam-bank.js','public/js/telc-exam.js','public/js/reading-core.js'])vm.runInContext(fs.readFileSync(file,'utf8'),c);const count=vm.runInContext(`Object.values(EXAM_FORMATS).flatMap(p=>ReadingCore.catalog([{id:p.exam+p.level,type:'exam',name:p.name,items:examPracticeBank(p)}])).length`,c);assert(count>0);const html=fs.readFileSync('public/lesen.html','utf8');assert(html.includes('js/exams.js'));});
test('groups keep exam collections and variants distinct, sort parts without changing source or progress identity',()=>{
 const h=setup();
 h.c.rows=[{id:'two',collectionId:'one',collection:'Library',level:'B1',title:'PETRA · Lesen · Teil 2',task:{exam:'telc',teil:2}},{id:'one',collectionId:'one',collection:'Library',level:'B1',title:'PETRA · Lesen · Teil 1',task:{exam:'telc',teil:1}},{id:'variant',collectionId:'one',collection:'Library',level:'B1',title:'PETRA · Lesen · Teil 2 · Biến thể',task:{exam:'telc',teil:2}},{id:'other',collectionId:'two',collection:'Other',level:'B1',title:'PETRA · Lesen · Teil 1',task:{exam:'telc',teil:1}}];
 const before=JSON.stringify(h.c.rows),groups=h.run('ReadingCore.groups(rows)');
 assert.equal(groups.length,2);assert.deepEqual(groups[0].rows.map(r=>r.id),['one','two','variant']);assert.equal(JSON.stringify(h.c.rows),before);
});
test('presentation separates only explicit source notes and preserves source text and answers',()=>{
 const h=setup();h.c.task={content:'> Đáp án nguồn: original.pdf, trang 13.\n\n## Lesen Teil 1\nText A\n1. Frage\na. Ja\nb. Nein',questions:[{id:'q',answer:'b'}]};
 const before=JSON.stringify(h.c.task),p=h.run('TelcExam.presentationContent(task.content)');
 assert.deepEqual(p.notes,['Đáp án nguồn: original.pdf, trang 13.']);assert(p.body.includes('1. Frage\na. Ja\nb. Nein'));assert.equal(JSON.stringify(h.c.task),before);
});
