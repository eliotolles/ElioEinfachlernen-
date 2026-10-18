'use strict';
const ExamMedia={
 async db(){return new Promise((resolve,reject)=>{if(!window.indexedDB){reject(new Error('IndexedDB unavailable.'));return;}const req=indexedDB.open('elio-exam-media',1);req.onupgradeneeded=()=>req.result.createObjectStore('media');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(new Error('Media storage unavailable.'));});},
 async get(key){const db=await this.db();try{return await new Promise((resolve,reject)=>{const tx=db.transaction('media','readonly'),req=tx.objectStore('media').get(key);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);});}finally{db.close();}},
 async put(key,file){const db=await this.db();try{return await new Promise((resolve,reject)=>{const tx=db.transaction('media','readwrite');tx.objectStore('media').put(file,key);tx.oncomplete=resolve;tx.onerror=()=>reject(new Error('Cannot store audio/image. Storage may be full.'));});}finally{db.close();}}
};
