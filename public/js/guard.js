'use strict';
Account.ready.then(()=>{if(!Account.current())Account.redirectToLogin();else if(Account.profile.passwordExpired)location.replace('password.html');else if(/\/admin(?:\.html)?$/.test(location.pathname)&&Account.profile.role!=='super_admin')location.replace('index.html');// The loader reveals the page after core applies the saved theme.
});window.addEventListener('pageshow',event=>{if(event.persisted&&Account.current())Account.request('/api/auth/me').catch(()=>{});});
