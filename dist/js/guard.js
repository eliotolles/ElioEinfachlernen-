'use strict';
if(!Account.authPage()){if(!Account.current())Account.redirectToLogin();else document.documentElement.classList.remove('auth-pending');}
window.addEventListener('pageshow',()=>{if(!Account.authPage()&&!Account.current())Account.redirectToLogin();});
