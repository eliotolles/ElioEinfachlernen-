'use strict';
// Read-only projections of existing lesson/session/history records.
const GrammarWorkspaceCore={
 status(lesson,completed,session,attempts){
  if(completed?.[lesson.id])return 'done';
  const active=session?.lessonId===lesson.id&&(session.answer||session.feedback||session.built?.length||Object.values(session.responses||{}).some(r=>r.answer||r.feedback||r.built?.length));
  return active||(attempts||[]).some(a=>a.lessonId===lesson.id)?'active':'new';
 },
 group(lesson,collections){const c=collections.find(c=>c.id===lesson.collectionId);return {key:String(lesson.group||c?.id||lesson.collectionId||'other'),title:String(lesson.groupName||lesson.groupTitle||c?.name||lesson.group||'Tài liệu khác')};},
 results(lesson,session){if(session?.lessonId!==lesson.id)return [];return visibleGrammarExercises(lesson).flatMap((ex,index)=>{const r=session.responses?.[index]||(session.exerciseIndex===index?session:null);return r?.feedback&&r.exerciseKey===grammarExerciseKey(ex)?[{index,exercise:ex,...r.feedback}]:[];});},
 route(hash){const p=new URLSearchParams(String(hash||'').replace(/^#/,''));return {lesson:p.get('lesson')||'',collection:p.get('collection')||'',tab:['lecture','mindmap','practice','results'].includes(p.get('tab'))?p.get('tab'):'lecture',level:p.get('level')||'',query:p.get('q')||'',status:['new','active','done'].includes(p.get('status'))?p.get('status'):'all'};}
};
