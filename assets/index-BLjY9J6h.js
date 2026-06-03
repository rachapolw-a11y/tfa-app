const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Roster-CSpC0yB5.js","assets/vendor-charts-TTOrMFgA.js","assets/storage-AE5--CA6.js","assets/vendor-firebase-02D36njY.js","assets/Modal-BFUmUapJ.js","assets/pencil-DMl6qWYy.js","assets/Training-CRLkO0lf.js","assets/Evaluation-DwNRJAC2.js","assets/PlayerPortal-D9zuzzfS.js"])))=>i.map(i=>d[i]);
import{g as c,r as R,e as P}from"./vendor-charts-TTOrMFgA.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function i(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(e){if(e.ep)return;e.ep=!0;const r=i(e);fetch(e.href,r)}})();var b={exports:{}},p={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var L=c,O=Symbol.for("react.element"),N=Symbol.for("react.fragment"),S=Object.prototype.hasOwnProperty,A=L.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,T={key:!0,ref:!0,__self:!0,__source:!0};function k(s,t,i){var o,e={},r=null,a=null;i!==void 0&&(r=""+i),t.key!==void 0&&(r=""+t.key),t.ref!==void 0&&(a=t.ref);for(o in t)S.call(t,o)&&!T.hasOwnProperty(o)&&(e[o]=t[o]);if(s&&s.defaultProps)for(o in t=s.defaultProps,t)e[o]===void 0&&(e[o]=t[o]);return{$$typeof:O,type:s,key:r,ref:a,props:e,_owner:A.current}}p.Fragment=N;p.jsx=k;p.jsxs=k;b.exports=p;var n=b.exports,y={},v=R;y.createRoot=v.createRoot,y.hydrateRoot=v.hydrateRoot;const C="modulepreload",I=function(s){return"/tfa-app/"+s},g={},h=function(t,i,o){let e=Promise.resolve();if(i&&i.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),l=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));e=Promise.allSettled(i.map(d=>{if(d=I(d),d in g)return;g[d]=!0;const m=d.endsWith(".css"),f=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${f}`))return;const u=document.createElement("link");if(u.rel=m?"stylesheet":C,m||(u.as="script"),u.crossOrigin="",u.href=d,l&&u.setAttribute("nonce",l),document.head.appendChild(u),m)return new Promise((j,E)=>{u.addEventListener("load",j),u.addEventListener("error",()=>E(new Error(`Unable to preload CSS for ${d}`)))})}))}function r(a){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=a,window.dispatchEvent(l),!l.defaultPrevented)throw a}return e.then(a=>{for(const l of a||[])l.status==="rejected"&&r(l.reason);return t().catch(r)})};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=s=>s.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),w=(...s)=>s.filter((t,i,o)=>!!t&&o.indexOf(t)===i).join(" ");/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var $={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=c.forwardRef(({color:s="currentColor",size:t=24,strokeWidth:i=2,absoluteStrokeWidth:o,className:e="",children:r,iconNode:a,...l},d)=>c.createElement("svg",{ref:d,...$,width:t,height:t,stroke:s,strokeWidth:o?Number(i)*24/Number(t):i,className:w("lucide",e),...l},[...a.map(([m,f])=>c.createElement(m,f)),...Array.isArray(r)?r:[r]]));/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=(s,t)=>{const i=c.forwardRef(({className:o,...e},r)=>c.createElement(D,{ref:r,iconNode:t,className:w(`lucide-${M(s)}`,o),...e}));return i.displayName=`${s}`,i};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=x("CalendarDays",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=x("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=x("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]),z=c.lazy(()=>h(()=>import("./Roster-CSpC0yB5.js"),__vite__mapDeps([0,1,2,3,4,5]))),F=c.lazy(()=>h(()=>import("./Training-CRLkO0lf.js"),__vite__mapDeps([6,1,2,3,4,5]))),V=c.lazy(()=>h(()=>import("./Evaluation-DwNRJAC2.js"),__vite__mapDeps([7,1,2,3,4]))),W=c.lazy(()=>h(()=>import("./PlayerPortal-D9zuzzfS.js"),__vite__mapDeps([8,1,2,3])));function _(){return n.jsx("div",{className:"text-center py-20 text-cream/30 text-sm",children:"Loading..."})}const K=[{id:"roster",label:"Squad",icon:B},{id:"training",label:"Training",icon:U},{id:"evaluation",label:"Progress",icon:q}];function H(){const[s,t]=c.useState("roster"),i=new URLSearchParams(window.location.search).get("id");return i?n.jsx(c.Suspense,{fallback:n.jsx(_,{}),children:n.jsx(W,{playerId:i})}):n.jsxs("div",{className:"min-h-screen bg-navy",children:[n.jsxs("header",{className:"bg-navy-mid border-b border-white/10",children:[n.jsxs("div",{className:"max-w-5xl mx-auto px-4 py-4 flex items-center gap-3",children:[n.jsx("div",{className:"w-10 h-10 bg-gold rounded-full flex items-center justify-center shrink-0",children:n.jsx("span",{className:"text-navy font-black text-sm leading-none",children:"TFA"})}),n.jsxs("div",{children:[n.jsx("h1",{className:"text-xl font-bold leading-none text-cream",children:"The Football Academy"}),n.jsx("p",{className:"text-gold/60 text-xs mt-0.5",children:"Coach Dashboard"})]})]}),n.jsx("div",{className:"max-w-5xl mx-auto px-4 flex gap-1",children:K.map(({id:o,label:e,icon:r})=>n.jsxs("button",{onClick:()=>t(o),className:`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-t transition-colors ${s===o?"bg-gold text-navy font-semibold":"text-cream/60 hover:text-cream hover:bg-white/5"}`,children:[n.jsx(r,{size:16}),e]},o))})]}),n.jsx("main",{className:"max-w-5xl mx-auto px-4 py-6",children:n.jsxs(c.Suspense,{fallback:n.jsx(_,{}),children:[s==="roster"&&n.jsx(z,{}),s==="training"&&n.jsx(F,{}),s==="evaluation"&&n.jsx(V,{})]})})]})}y.createRoot(document.getElementById("root")).render(n.jsx(P.StrictMode,{children:n.jsx(H,{})}));export{x as c,n as j};
