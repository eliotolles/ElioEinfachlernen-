'use strict';
const Account={
 users(){try{const v=JSON.parse(localStorage.getItem('dt:_users')||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{};}catch{return {};}},
 current(){try{const u=localStorage.getItem('dt:_current');return u&&Object.hasOwn(this.users(),u)?u:null;}catch{return null;}},
 async hash(value){let h=2166136261;for(const char of value)h=Math.imul(h^char.charCodeAt(0),16777619);return(h>>>0).toString(16);},
 async authenticate(username,password,register=false){username=String(username).trim().toLowerCase();if(!/^[a-z0-9_-]{2,32}$/.test(username))throw new Error('username');if(typeof password!=='string'||password.length<4||password.length>128)throw new Error('password');const hash=await this.hash(`${username}:${password}`),users=this.users();if(register){if(Object.hasOwn(users,username))throw new Error('exists');Object.defineProperty(users,username,{value:{hash},enumerable:true,writable:true,configurable:true});localStorage.setItem('dt:_users',JSON.stringify(users));}else if(!Object.hasOwn(users,username)||users[username]?.hash!==hash)throw new Error('invalid');localStorage.setItem('dt:_current',username);return username;},
 destination(value){try{const url=new URL(value||'index.html',location.href);const name=url.pathname.split('/').filter(Boolean).at(-1)||'index.html';const allowed=['index','grammatik','wortschatz','schreiben','sprechen','pruefung','tutor','settings'];if(url.origin!==new URL(location.href).origin||!allowed.includes(name.replace(/\.html$/,'')))return 'index.html';return name+(url.search||'')+(url.hash||'');}catch{return 'index.html';}},
 authPage(){return /(?:^|\/)(?:login|register)(?:\.html)?\/?$/.test(location.pathname);},
 loginURL(){const name=location.pathname.split('/').filter(Boolean).at(-1)||'index.html';return 'login.html?next='+encodeURIComponent(this.destination(name+(location.search||'')+(location.hash||'')));},
 redirectToLogin(){document.documentElement.classList.add('auth-pending');location.replace(this.loginURL());},
 logout(){localStorage.removeItem('dt:_current');this.redirectToLogin();}
};
