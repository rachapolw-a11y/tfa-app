const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Roster-BUGeOphr.js","assets/vendor-charts-TTOrMFgA.js","assets/storage-CuUM4XZf.js","assets/vendor-firebase-02D36njY.js","assets/Modal-IwzDZb_o.js","assets/Training-BdjCfH3a.js","assets/Evaluation-BB5dt3WU.js","assets/Stats-x-mVkIxF.js","assets/PlayerPortal-D9eo2q5F.js"])))=>i.map(i=>d[i]);
import{g as l,r as R,e as P}from"./vendor-charts-TTOrMFgA.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function i(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(e){if(e.ep)return;e.ep=!0;const r=i(e);fetch(e.href,r)}})();var b={exports:{}},h={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var L=l,O=Symbol.for("react.element"),S=Symbol.for("react.fragment"),N=Object.prototype.hasOwnProperty,A=L.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,C={key:!0,ref:!0,__self:!0,__source:!0};function k(n,t,i){var s,e={},r=null,a=null;i!==void 0&&(r=""+i),t.key!==void 0&&(r=""+t.key),t.ref!==void 0&&(a=t.ref);for(s in t)N.call(t,s)&&!C.hasOwnProperty(s)&&(e[s]=t[s]);if(n&&n.defaultProps)for(s in t=n.defaultProps,t)e[s]===void 0&&(e[s]=t[s]);return{$$typeof:O,type:n,key:r,ref:a,props:e,_owner:A.current}}h.Fragment=S;h.jsx=k;h.jsxs=k;b.exports=h;var o=b.exports,x={},v=R;x.createRoot=v.createRoot,x.hydrateRoot=v.hydrateRoot;const T="modulepreload",I=function(n){return"/tfa-app/"+n},g={},p=function(t,i,s){let e=Promise.resolve();if(i&&i.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),c=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));e=Promise.allSettled(i.map(d=>{if(d=I(d),d in g)return;g[d]=!0;const m=d.endsWith(".css"),y=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${y}`))return;const u=document.createElement("link");if(u.rel=m?"stylesheet":T,m||(u.as="script"),u.crossOrigin="",u.href=d,c&&u.setAttribute("nonce",c),document.head.appendChild(u),m)return new Promise((j,E)=>{u.addEventListener("load",j),u.addEventListener("error",()=>E(new Error(`Unable to preload CSS for ${d}`)))})}))}function r(a){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=a,window.dispatchEvent(c),!c.defaultPrevented)throw a}return e.then(a=>{for(const c of a||[])c.status==="rejected"&&r(c.reason);return t().catch(r)})};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=n=>n.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),w=(...n)=>n.filter((t,i,s)=>!!t&&s.indexOf(t)===i).join(" ");/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var M={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=l.forwardRef(({color:n="currentColor",size:t=24,strokeWidth:i=2,absoluteStrokeWidth:s,className:e="",children:r,iconNode:a,...c},d)=>l.createElement("svg",{ref:d,...M,width:t,height:t,stroke:n,strokeWidth:s?Number(i)*24/Number(t):i,className:w("lucide",e),...c},[...a.map(([m,y])=>l.createElement(m,y)),...Array.isArray(r)?r:[r]]));/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=(n,t)=>{const i=l.forwardRef(({className:s,...e},r)=>l.createElement($,{ref:r,iconNode:t,className:w(`lucide-${D(n)}`,s),...e}));return i.displayName=`${n}`,i};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=f("BarChart2",[["line",{x1:"18",x2:"18",y1:"20",y2:"10",key:"1xfpm4"}],["line",{x1:"12",x2:"12",y1:"20",y2:"4",key:"be30l9"}],["line",{x1:"6",x2:"6",y1:"20",y2:"14",key:"1r4le6"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=f("CalendarDays",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=f("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=f("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]),F=l.lazy(()=>p(()=>import("./Roster-BUGeOphr.js"),__vite__mapDeps([0,1,2,3,4]))),V=l.lazy(()=>p(()=>import("./Training-BdjCfH3a.js"),__vite__mapDeps([5,1,2,3,4]))),W=l.lazy(()=>p(()=>import("./Evaluation-BB5dt3WU.js"),__vite__mapDeps([6,1,2,3,4]))),K=l.lazy(()=>p(()=>import("./Stats-x-mVkIxF.js"),__vite__mapDeps([7,1,2,3]))),H=l.lazy(()=>p(()=>import("./PlayerPortal-D9eo2q5F.js"),__vite__mapDeps([8,1,2,3])));function _(){return o.jsx("div",{className:"text-center py-20 text-cream/30 text-sm",children:"Loading..."})}const J=[{id:"roster",label:"Squad",icon:z},{id:"training",label:"Training",icon:B},{id:"evaluation",label:"Progress",icon:q},{id:"stats",label:"Stats",icon:U}];function Y(){const[n,t]=l.useState("roster"),i=new URLSearchParams(window.location.search).get("id");return i?o.jsx(l.Suspense,{fallback:o.jsx(_,{}),children:o.jsx(H,{playerId:i})}):o.jsxs("div",{className:"min-h-screen bg-navy",children:[o.jsxs("header",{className:"bg-navy-mid border-b border-white/10",children:[o.jsxs("div",{className:"max-w-5xl mx-auto px-4 py-4 flex items-center gap-3",children:[o.jsx("div",{className:"w-10 h-10 bg-gold rounded-full flex items-center justify-center shrink-0",children:o.jsx("span",{className:"text-navy font-black text-sm leading-none",children:"TFA"})}),o.jsxs("div",{children:[o.jsx("h1",{className:"text-xl font-bold leading-none text-cream",children:"The Football Academy"}),o.jsx("p",{className:"text-gold/60 text-xs mt-0.5",children:"Coach Dashboard"})]})]}),o.jsx("div",{className:"max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto",children:J.map(({id:s,label:e,icon:r})=>o.jsxs("button",{onClick:()=>t(s),className:`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-t transition-colors whitespace-nowrap ${n===s?"bg-gold text-navy font-semibold":"text-cream/60 hover:text-cream hover:bg-white/5"}`,children:[o.jsx(r,{size:16}),e]},s))})]}),o.jsx("main",{className:"max-w-5xl mx-auto px-4 py-6",children:o.jsxs(l.Suspense,{fallback:o.jsx(_,{}),children:[n==="roster"&&o.jsx(F,{}),n==="training"&&o.jsx(V,{}),n==="evaluation"&&o.jsx(W,{}),n==="stats"&&o.jsx(K,{})]})})]})}x.createRoot(document.getElementById("root")).render(o.jsx(P.StrictMode,{children:o.jsx(Y,{})}));export{f as c,o as j};
