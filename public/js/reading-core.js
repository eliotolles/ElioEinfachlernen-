"use strict";
// Exact objective grader from simulator.js; tested for parity. No source mutation.
function readingObjectiveResults(attempt) {
  const rows = [];
  attempt.items.forEach((t, i) => {
    for (const [j, q] of (t.questions || []).entries()) {
      const id = q.id || "q" + j,
        provided =
          attempt.answers[i] && typeof attempt.answers[i] === "object"
            ? attempt.answers[i][id] || ""
            : "";
      const keys = (
        Array.isArray(q.answers)
          ? q.answers
          : q.answer !== undefined && q.answer !== null && q.answer !== ""
            ? [q.answer]
            : []
      ).filter(
        (k) =>
          (typeof k === "string" || typeof k === "number") &&
          String(k).trim() !== "",
      );
      const norm = (v) =>
        String(v)
          .trim()
          .toLocaleLowerCase("de")
          .normalize("NFC")
          .replace(/\s+/g, " ");
      rows.push({
        itemIndex: i,
        questionId: id,
        options: q.options || [],
        skill: t.skill,
        teil: t.teil,
        question: q.prompt || q.question || id,
        provided,
        keys,
        graded: keys.length > 0,
        correct: keys.some((k) => norm(k) === norm(provided)),
      });
    }
  });
  return rows;
}
const ReadingCore = {
  skill(value) {
    return ["reading", "lesen"].includes(String(value || "").toLowerCase());
  },
  version(task) {
    const s = JSON.stringify(task);
    let hash = 2166136261;
    for (let i = 0; i < s.length; i++) {
      hash ^= s.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16);
  },
  catalog(collections) {
    return collections.flatMap((c) =>
      (c.items || []).flatMap((original, index) => {
        if (
          !this.skill(original.skill) ||
          !["exam", "reading"].includes(c.type)
        )
          return [];
        const task = TelcExam.normalize({ ...original, skill: "reading" }, c);
        return [
          {
            id: JSON.stringify([c.id, original.id ?? index]),
            collectionId: c.id,
            collection: c.name || "",
            task,
            title: task.title || c.name || "Bài đọc",
            level: task.level || c.level || "",
            topic: task.topic || c.topic || "",
            kind:
              task.taskType ||
              task.type ||
              "Teil " + (task.teil || task.part || 1),
            version: this.version(task),
          },
        ];
      }),
    );
  },
  kindLabel(value) {
    return ({headings:'Ghép tiêu đề', 'multiple-choice':'Trắc nghiệm', advertisements:'Ghép tình huống – quảng cáo', cloze:'Điền từ', 'word-bank':'Chọn từ trong bảng', listening:'Nghe hiểu'})[value] || value;
  },
  groups(rows) {
    const groups = new Map();
    for (const row of rows) {
      const task = row.task;
      const name = task.setName || row.title.split(/\s*[·|]\s*Lesen\s*[·|]/i)[0] || row.collection;
      const key = JSON.stringify([row.collectionId, task.exam || '', row.level, name]);
      if (!groups.has(key)) groups.set(key, {name, level:row.level, exam:task.exam || '', collection:row.collection, rows:[]});
      groups.get(key).rows.push(row);
    }
    for (const group of groups.values()) group.rows.sort((a,b)=>Number(a.task.teil||a.task.part||0)-Number(b.task.teil||b.task.part||0));
    return [...groups.values()];
  },
  results: readingObjectiveResults,
};
