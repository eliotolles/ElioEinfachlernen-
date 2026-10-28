'use strict';
(()=>{let theme='dark';try{theme=localStorage.getItem('dt:_theme')||theme;}catch{}document.documentElement.dataset.theme=theme==='light'?'light':'dark';})();
