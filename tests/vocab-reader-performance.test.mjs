import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
test('large decks render a bounded first view, extend on demand and reuse the current reader',()=>{
 let rendered=0,callback;
 class Element{constructor(tag){this.tagName=tag;this.childNodes=[];this.textContent='';}append(...nodes){this.childNodes.push(...nodes);}replaceChildren(){this.childNodes=[];}setAttribute(){}addEventListener(){}focus(){}querySelector(){return this.tbody??=new Element('tbody');}insertAdjacentHTML(_,html){this.html=(this.html||'')+html;}get firstChild(){return this.childNodes[0];}}
 class Observer{constructor(fn){callback=fn;}observe(){}disconnect(){this.disconnected=true;}}
 const reader=new Element('section'),deck={id:'large',name:'2000 words',items:Array.from({length:2000},(_,id)=>({id,de:'Wort '+id}))};
 const ctx={reader,deck,catalogRevision:1,language:()=> 'vi',text:vi=>vi,active:'level',canManage:()=>false,esc:String,document:{createElement:tag=>new Element(tag)},window:{IntersectionObserver:Observer},IntersectionObserver:Observer,Vocabulary:{meaning:()=>{rendered++;return 'nghĩa';},typeHTML:()=>'',examplesHTML:()=>'',relatedHTML:()=>''},VocabularySpeech:{controls:()=>''}};
 vm.createContext(ctx);const source=fs.readFileSync('public/js/vocab-catalog-ui.js','utf8');vm.runInContext(source.slice(source.indexOf('function openDeck('),source.indexOf('function deckCard(')),ctx);
 vm.runInContext('openDeck(deck)',ctx);assert.equal(rendered,40);callback([{isIntersecting:true}]);assert.equal(rendered,80);vm.runInContext('openDeck(deck)',ctx);assert.equal(rendered,80);reader.renderToken=null;callback([{isIntersecting:true}]);assert.equal(rendered,80);assert.equal(deck.items.length,2000);
});
test('unrelated progress updates do not invalidate the vocabulary data revision',()=>{
 const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync('public/js/vocab-catalog.js','utf8')+';this.catalog=VocabCatalog',ctx);
 const account={profile:{id:'u',role:'user'},records:{vocab:{version:2},history:{version:1}},shared:{materials:{version:4}},pending:{}};const revision=ctx.catalog.dataRevision(account);account.records.history.version++;assert.equal(ctx.catalog.dataRevision(account),revision);account.pending.vocab={stamp:'new'};assert.notEqual(ctx.catalog.dataRevision(account),revision);
});
