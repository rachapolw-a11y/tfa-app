const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Roster-CQO535Zj.js","assets/vendor-charts-TTOrMFgA.js","assets/storage-CuUM4XZf.js","assets/vendor-firebase-02D36njY.js","assets/Modal-DI4iMov1.js","assets/Training-C4M3EWoB.js","assets/Evaluation-X5cGvqSg.js","assets/Stats-4AlAG48j.js","assets/PlayerPortal-jy_lXLvX.js"])))=>i.map(i=>d[i]);
import{g as l,r as P,e as L}from"./vendor-charts-TTOrMFgA.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const a of e.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function i(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function s(t){if(t.ep)return;t.ep=!0;const e=i(t);fetch(t.href,e)}})();var _={exports:{}},f={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var R=l,S=Symbol.for("react.element"),C=Symbol.for("react.fragment"),N=Object.prototype.hasOwnProperty,O=R.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,I={key:!0,ref:!0,__self:!0,__source:!0};function b(n,r,i){var s,t={},e=null,a=null;i!==void 0&&(e=""+i),r.key!==void 0&&(e=""+r.key),r.ref!==void 0&&(a=r.ref);for(s in r)N.call(r,s)&&!I.hasOwnProperty(s)&&(t[s]=r[s]);if(n&&n.defaultProps)for(s in r=n.defaultProps,r)t[s]===void 0&&(t[s]=r[s]);return{$$typeof:S,type:n,key:e,ref:a,props:t,_owner:O.current}}f.Fragment=C;f.jsx=b;f.jsxs=b;_.exports=f;var o=_.exports,y={},g=P;y.createRoot=g.createRoot,y.hydrateRoot=g.hydrateRoot;const A="modulepreload",T=function(n){return"/tfa-app/"+n},v={},p=function(r,i,s){let t=Promise.resolve();if(i&&i.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),c=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));t=Promise.allSettled(i.map(d=>{if(d=T(d),d in v)return;v[d]=!0;const m=d.endsWith(".css"),x=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${x}`))return;const u=document.createElement("link");if(u.rel=m?"stylesheet":A,m||(u.as="script"),u.crossOrigin="",u.href=d,c&&u.setAttribute("nonce",c),document.head.appendChild(u),m)return new Promise((j,E)=>{u.addEventListener("load",j),u.addEventListener("error",()=>E(new Error(`Unable to preload CSS for ${d}`)))})}))}function e(a){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=a,window.dispatchEvent(c),!c.defaultPrevented)throw a}return t.then(a=>{for(const c of a||[])c.status==="rejected"&&e(c.reason);return r().catch(e)})};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=n=>n.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),k=(...n)=>n.filter((r,i,s)=>!!r&&s.indexOf(r)===i).join(" ");/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var $={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=l.forwardRef(({color:n="currentColor",size:r=24,strokeWidth:i=2,absoluteStrokeWidth:s,className:t="",children:e,iconNode:a,...c},d)=>l.createElement("svg",{ref:d,...$,width:r,height:r,stroke:n,strokeWidth:s?Number(i)*24/Number(r):i,className:k("lucide",t),...c},[...a.map(([m,x])=>l.createElement(m,x)),...Array.isArray(e)?e:[e]]));/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=(n,r)=>{const i=l.forwardRef(({className:s,...t},e)=>l.createElement(D,{ref:e,iconNode:r,className:k(`lucide-${M(n)}`,s),...t}));return i.displayName=`${n}`,i};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=h("BarChart2",[["line",{x1:"18",x2:"18",y1:"20",y2:"10",key:"1xfpm4"}],["line",{x1:"12",x2:"12",y1:"20",y2:"4",key:"be30l9"}],["line",{x1:"6",x2:"6",y1:"20",y2:"14",key:"1r4le6"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=h("CalendarDays",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=h("LockOpen",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 9.9-1",key:"1mm8w8"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=h("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=h("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=h("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]),W=l.lazy(()=>p(()=>import("./Roster-CQO535Zj.js"),__vite__mapDeps([0,1,2,3,4]))),H=l.lazy(()=>p(()=>import("./Training-C4M3EWoB.js"),__vite__mapDeps([5,1,2,3,4]))),K=l.lazy(()=>p(()=>import("./Evaluation-X5cGvqSg.js"),__vite__mapDeps([6,1,2,3,4]))),J=l.lazy(()=>p(()=>import("./Stats-4AlAG48j.js"),__vite__mapDeps([7,1,2,3]))),Y=l.lazy(()=>p(()=>import("./PlayerPortal-jy_lXLvX.js"),__vite__mapDeps([8,1,2,3])));function w(){return o.jsx("div",{className:"text-center py-20 text-cream/30 text-sm",children:"Loading..."})}const Z="1234",G=[{id:"roster",label:"Squad",icon:F},{id:"training",label:"Training",icon:z},{id:"evaluation",label:"Progress",icon:q},{id:"stats",label:"Stats",icon:U}];function Q(){const[n,r]=l.useState("roster"),[i,s]=l.useState(()=>sessionStorage.getItem("tfa_role")||"parent"),t=new URLSearchParams(window.location.search).get("id");if(t)return o.jsx(l.Suspense,{fallback:o.jsx(w,{}),children:o.jsx(Y,{playerId:t})});const e=i==="coach";function a(){if(e)window.confirm("Exit coach mode?")&&(sessionStorage.setItem("tfa_role","parent"),s("parent"));else{const c=window.prompt("Enter coach PIN:");if(c===null)return;c===Z?(sessionStorage.setItem("tfa_role","coach"),s("coach")):window.alert("Incorrect PIN")}}return o.jsxs("div",{className:"min-h-screen bg-navy",children:[o.jsxs("header",{className:"bg-navy-mid border-b border-white/10",children:[o.jsxs("div",{className:"max-w-5xl mx-auto px-4 py-4 flex items-center gap-3",children:[o.jsx("div",{className:"w-10 h-10 bg-gold rounded-full flex items-center justify-center shrink-0",children:o.jsx("span",{className:"text-navy font-black text-sm leading-none",children:"TFA"})}),o.jsxs("div",{className:"flex-1",children:[o.jsx("h1",{className:"text-xl font-bold leading-none text-cream",children:"The Football Academy"}),o.jsx("p",{className:"text-gold/60 text-xs mt-0.5",children:e?"Coach Dashboard":"Parent Portal"})]}),o.jsxs("button",{onClick:a,title:e?"Exit coach mode":"Coach login",className:`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${e?"bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25":"text-cream/20 hover:text-cream/50"}`,children:[e?o.jsx(B,{size:13}):o.jsx(V,{size:13}),e?"Coach":""]})]}),o.jsx("div",{className:"max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto",children:G.map(({id:c,label:d,icon:m})=>o.jsxs("button",{onClick:()=>r(c),className:`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-t transition-colors whitespace-nowrap ${n===c?"bg-gold text-navy font-semibold":"text-cream/60 hover:text-cream hover:bg-white/5"}`,children:[o.jsx(m,{size:16}),d]},c))})]}),o.jsx("main",{className:"max-w-5xl mx-auto px-4 py-6",children:o.jsxs(l.Suspense,{fallback:o.jsx(w,{}),children:[n==="roster"&&o.jsx(W,{role:i}),n==="training"&&o.jsx(H,{role:i}),n==="evaluation"&&o.jsx(K,{role:i}),n==="stats"&&o.jsx(J,{})]})})]})}y.createRoot(document.getElementById("root")).render(o.jsx(L.StrictMode,{children:o.jsx(Q,{})}));export{h as c,o as j};
