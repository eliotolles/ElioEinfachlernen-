'use strict';
const PersonalVocabulary={
 levels:['A1','A2','B1','B2','C1','C2'],
 key(value){return String(value||'').normalize('NFC').trim().replace(/\s+/g,' ').toLocaleLowerCase('de');},
 folders(){return [...new Set(Account.own('materials',[]).filter(c=>c.type==='vocabulary'&&c.scope==='personal'&&c.category).map(c=>c.category))];},
 createFolder(name,user=Auth.user){
  if(!user||user!==Auth.user||user!==Account.current())throw Error('Vui lòng đăng nhập lại.');
  name=String(name||'').trim().replace(/\s+/g,' ');if(!name||name.length>80)throw Error('Tên bộ từ cần từ 1 đến 80 ký tự.');
  const all=Account.own('materials',[]);const existing=all.find(c=>c.type==='vocabulary'&&c.scope==='personal'&&this.key(c.category)===this.key(name));if(existing)name=existing.category;
  const added=this.levels.filter(level=>!all.some(c=>c.type==='vocabulary'&&c.scope==='personal'&&this.key(c.category)===this.key(name)&&c.level===level)).map(level=>({id:crypto.randomUUID(),type:'vocabulary',scope:'personal',catalog:'mine',category:name,name:name+' · '+level,level,items:[],createdAt:Date.now()}));
  if(added.length){Account.setPersonal('materials',[...all,...added]);document.dispatchEvent(new Event('vocabchange'));}
  return name;
 },
 save(word,{folder,level,source}={},user=Auth.user){
  if(!word||typeof word.de!=='string'||!word.de.trim()||typeof word.vi!=='string'||!word.vi.trim())throw Error('Chưa có nghĩa để lưu.');
  if(!this.levels.includes(level))throw Error('Chọn cấp độ A1–C2.');folder=this.createFolder(folder,user);
  const deck=Account.own('materials',[]).find(c=>c.type==='vocabulary'&&c.scope==='personal'&&c.category===folder&&c.level===level),all=Account.own('vocab',[]);
  const existing=all.find(w=>w.deckId===deck.id&&this.key(w.de)===this.key(word.de)&&this.key(w.vi)===this.key(word.vi));if(existing)return {added:false,deckId:deck.id,word:existing};
  const saved={...structuredClone(word),id:crypto.randomUUID(),scope:'personal',deckId:deck.id,deckName:deck.name,level,source:source?structuredClone(source):null};
  Account.setPersonal('vocab',[...all,saved]);document.dispatchEvent(new Event('vocabchange'));return {added:true,deckId:deck.id,word:saved};
 }
};
