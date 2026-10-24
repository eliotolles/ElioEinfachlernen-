import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

test('import into an existing collection updates its category and videos without duplicating or losing captions',()=>{
 const source=fs.readFileSync('public/js/listening-v2.js','utf8');
 const snippet=source.slice(source.indexOf('function ensureCollection('),source.indexOf(' async function playlist('));
 const cues=[{start:1,end:3,text:'Hallo!'}],collection={id:'postcard',kind:'collection',title:'Postcard',category:'youtube'},video={id:'v1',kind:'video',collectionId:'postcard',youtubeId:'nUqaukZsg_8',category:'youtube',cues,transcriptComplete:true};
 const other={id:'nico',kind:'video',collectionId:'nicos',category:'youtube'};
 const context={common:[collection,video,other],mine:{collections:[],videos:[]},crypto};vm.createContext(context);vm.runInContext(snippet+';this.ensure=ensureCollection;this.add=addVideo;',context);
 assert.equal(context.ensure(' Postcard ','shared','podcast'),collection);
 assert.equal(collection.category,'podcast');assert.equal(video.category,'podcast');assert.equal(other.category,'youtube');
 assert.equal(context.add({youtubeId:'nUqaukZsg_8',title:'Duplicate'},collection,'B1','shared'),video);
 assert.equal(context.common.length,3);assert.equal(video.cues,cues);assert.equal(video.transcriptComplete,true);
 const personal=context.ensure('Postcard','private','podcast');assert.notEqual(personal.id,collection.id);assert.equal(context.mine.collections.length,1);
});
