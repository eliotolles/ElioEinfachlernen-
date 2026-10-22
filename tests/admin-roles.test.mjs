import {test,before} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import worker from '../worker/index.js';

const db=new DatabaseSync(':memory:');
const env={ADMIN_EMAILS:'owner@example.com',ADMIN_INITIAL_PASSWORD:'Owner-test-493!',TEST_DB:async(query,args=[])=>{
 const stmt=db.prepare(query);
 if(/^SELECT/i.test(query.trim()))return {rows:stmt.all(...args),changes:0};
 return {rows:[],changes:Number(stmt.run(...args).changes)};
}};
async function call(path,method='GET',data,cookie=''){
 const response=await worker.fetch(new Request('https://elio.test'+path,{method,headers:{Origin:'https://elio.test',Cookie:cookie,'Content-Type':'application/json'},body:data===undefined?undefined:JSON.stringify(data)}),env);
 return {status:response.status,body:await response.json(),cookie:response.headers.get('Set-Cookie')?.split(';')[0]};
}
let owner;
before(async()=>{owner=await call('/api/auth/login','POST',{email:'owner@example.com',password:env.ADMIN_INITIAL_PASSWORD});});
async function register(email){return call('/api/auth/register','POST',{email,password:'Learner-test-493!'});}

test('only an admin can grant roles; grants preserve identity and progress and revoke stale sessions',async()=>{
 const learner=await register('learner@example.com'),id=learner.body.user.id;
 const progress={srs:{word1:{due:1234,interval:7}},history:[{score:9}]};
 for(const [name,value] of Object.entries(progress))await call('/api/state','PUT',{name,value,version:0},learner.cookie);
 const before=db.prepare('SELECT * FROM app_users WHERE id=?').get(id),records=db.prepare('SELECT * FROM app_records WHERE user_id=? ORDER BY name').all(id);
 assert.equal((await call('/api/admin/users','PATCH',{id,role:'super_admin'},learner.cookie)).status,403);
 assert.equal((await call('/api/admin/users','PATCH',{email:'  LEARNER@example.com ',role:'super_admin'},owner.cookie)).status,200);
 assert.deepEqual({...db.prepare('SELECT * FROM app_users WHERE id=?').get(id),role:before.role},{...before});
 assert.deepEqual(db.prepare('SELECT * FROM app_records WHERE user_id=? ORDER BY name').all(id),records);
 assert.equal((await call('/api/admin/users','GET',undefined,learner.cookie)).status,401);
 const login=await call('/api/auth/login','POST',{email:'learner@example.com',password:'Learner-test-493!'});
 assert.equal(login.body.user.role,'super_admin');
 assert.equal((await call('/api/admin/users?role=super_admin','GET',undefined,owner.cookie)).body.items.length,2);
 assert.equal((await call('/api/admin/users','PATCH',{id,role:'user'},owner.cookie)).status,200);
 assert.equal((await call('/api/admin/users','GET',undefined,login.cookie)).status,401);
 assert.equal(db.prepare('SELECT role FROM app_users WHERE id=?').get(id).role,'user');
 assert.deepEqual(db.prepare('SELECT * FROM app_records WHERE user_id=? ORDER BY name').all(id),records);
});

test('role changes reject unknown accounts, blocked accounts, ambiguous targets and unsupported fields',async()=>{
 const target=await register('locked@example.com'),id=target.body.user.id;
 for(const data of [{id,role:'admin'},{role:'super_admin'},{id,email:'locked@example.com',role:'super_admin'},{id,role:'super_admin',blocked:false},{id,role:'super_admin',password:'change'}])assert.equal((await call('/api/admin/users','PATCH',data,owner.cookie)).status,400);
 assert.equal((await call('/api/admin/users','PATCH',{email:'absent@example.com',role:'super_admin'},owner.cookie)).status,404);
 assert.equal((await call('/api/admin/users','PATCH',{id,blocked:true},owner.cookie)).status,200);
 assert.equal((await call('/api/admin/users','PATCH',{id,role:'super_admin'},owner.cookie)).status,400);
 assert.equal((await call('/api/admin/users','PATCH',{id},owner.cookie)).status,400);
 assert.equal((await call('/api/admin/users','PATCH',{id:owner.body.user.id,role:'user'},owner.cookie)).status,400);
 assert.equal((await call('/api/admin/users','DELETE',{id},owner.cookie)).status,400);
});

test('concurrent admins cannot demote each other and leave no administrator',async()=>{
 const other=await register('other-admin@example.com'),id=other.body.user.id;
 await call('/api/admin/users','PATCH',{id,role:'super_admin'},owner.cookie);
 const login=await call('/api/auth/login','POST',{email:'other-admin@example.com',password:'Learner-test-493!'});
 const results=await Promise.all([
  call('/api/admin/users','PATCH',{id,role:'user'},owner.cookie),
  call('/api/admin/users','PATCH',{id:owner.body.user.id,role:'user'},login.cookie)
 ]);
 assert.equal(results.filter(result=>result.status===200).length,1);
 assert.equal(db.prepare("SELECT count(*) AS n FROM app_users WHERE role='super_admin' AND blocked=0").get().n,1);
});

