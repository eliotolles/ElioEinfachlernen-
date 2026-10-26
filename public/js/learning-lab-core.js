'use strict';
const LearningLabCore={
 normalize(s){return String(s||'').normalize('NFC').toLocaleLowerCase('de').replace(/[.,!?;:„“"']/g,'').replace(/\s+/g,' ').trim();},
 shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;},
 pool(data,personal=[]){const rows=[...personal.filter(w=>w&&typeof w.de==='string'&&typeof w.vi==='string'&&w.de.trim()&&w.vi.trim()),...data.nouns.map(w=>({...w,de:w.article+' '+w.de})),...data.verbs];const seen=new Set();return rows.filter(w=>{const key=this.normalize(w.de);if(seen.has(key))return false;seen.add(key);return true;});},
 choices(answer,others){return this.shuffle([answer,...this.shuffle([...new Set(others.filter(s=>s!==answer))]).slice(0,3)]);},
 question(mode,data,words,index=0){const noun=data.nouns[index%data.nouns.length],verb=data.verbs[index%data.verbs.length],word=words[index%words.length];
  if(mode==='article')return {prompt:noun.de,hint:noun.vi,answer:noun.article,choices:this.shuffle(['der','die','das']),why:noun.article+' '+noun.de+' · Plural: '+noun.plural};
  if(mode==='participle')return {prompt:verb.de,hint:verb.vi,answer:verb.participle,choices:this.choices(verb.participle,data.verbs.map(v=>v.participle)),why:verb.de+' → '+verb.past+' → '+verb.participle+' · '+verb.aux};
  if(mode==='auxiliary')return {prompt:verb.de+' → '+verb.participle,hint:verb.vi,answer:verb.aux,choices:this.shuffle(['haben','sein']),why:verb.aux+' + '+verb.participle+'. Dạng được học theo nghĩa cơ bản nêu trong kho; trợ động từ của một số động từ thay đổi theo cách dùng.'};
  if(mode==='meaning')return {prompt:word.de,answer:word.vi,choices:this.choices(word.vi,words.map(w=>w.vi)),why:word.de+' — '+word.vi};
  if(mode==='spelling'||mode==='listening')return {prompt:mode==='listening'?'Nghe và viết từ bạn nghe được.':word.vi,audio:word.de,answer:word.de,hint:mode==='spelling'?'Viết cả mạo từ nếu đáp án là danh từ.':'Có thể nghe lại nhiều lần. Viết cả mạo từ nếu có.',why:word.de+' — '+word.vi};
  if(mode==='sentence'){const s=data.sentences[index%data.sentences.length];return {prompt:s.vi,answer:s.de,tokens:this.shuffle(s.de.split(/\s+/)),why:s.de+' — '+s.vi};}
  const lesson=data.lessons[index%data.lessons.length];return {prompt:lesson.quiz.question,hint:lesson.title,answer:lesson.quiz.choices[lesson.quiz.answer],choices:this.shuffle(lesson.quiz.choices),why:lesson.quiz.why};
 },
 check(answer,target){return this.normalize(answer)===this.normalize(target);},
 initial(value){const v=value&&typeof value==='object'&&!Array.isArray(value)?value:{};return {lessons:v.lessons||{},attempts:Array.isArray(v.attempts)?v.attempts:[],drafts:v.drafts||{},notes:v.notes||{}};},
 record(state,result){return {...state,attempts:[...state.attempts,{...result,time:Date.now()}].slice(-300)};}
};
