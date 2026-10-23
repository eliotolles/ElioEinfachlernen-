import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const s=fs.readFileSync(new URL('../public/js/session.js',import.meta.url),'utf8');const start=s.indexOf(' async request('),end=s.indexOf('\n async hash',start);const method=s.slice(start,end).trim().replace(/,$/,'');
for(const status of [200,502,524])test('HTML response '+status+' retains retry metadata and readable error',async()=>{const c={fetch:async()=>({ok:status===200,status,json:async()=>{throw new SyntaxError('Unexpected token <');}})};vm.createContext(c);const account=vm.runInContext('({'+method+'})',c);account.current=()=>null;await assert.rejects(account.request('/api/listening/transcribe','POST',{}),e=>e.status===(status===200?502:status)&&e.data.retryable===true&&e.data.retryAfter===30&&!e.message.includes('Unexpected token'));});

test('hung requests have bounded deadlines and return retryable timeouts',async()=>{
 const deadlines=[],signals=[];const c={AbortSignal:{timeout:ms=>{deadlines.push(ms);return {deadline:ms};}},fetch:async(url,options)=>{signals.push(options.signal);throw Object.assign(Error('timed out'),{name:'TimeoutError'});}};
 vm.createContext(c);const account=vm.runInContext('({'+method+'})',c);account.current=()=>null;
 for(const path of ['/api/state','/api/ai','/api/listening/transcribe'])await assert.rejects(account.request(path,'POST',{}),e=>e.status===504&&e.data.retryable===true&&!e.offline);
 assert.deepEqual(deadlines,[30000,180000,180000]);assert(signals.every(Boolean));
});
