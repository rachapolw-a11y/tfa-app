import{c as s,j as e}from"./index-BRx2W-9H.js";import{g as c}from"./vendor-charts-TTOrMFgA.js";/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n=s("Pencil",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=s("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=s("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r=s("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);function h({title:a,onClose:o,children:d}){return c.useEffect(()=>{const t=window.scrollY;return document.body.style.position="fixed",document.body.style.top=`-${t}px`,document.body.style.width="100%",()=>{document.body.style.position="",document.body.style.top="",document.body.style.width="",window.scrollTo(0,t)}},[]),e.jsx("div",{className:"fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4",onClick:t=>{t.target===t.currentTarget&&o()},children:e.jsxs("div",{className:"bg-navy-mid border border-white/10 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto",children:[e.jsxs("div",{className:"flex items-center justify-between p-5 border-b border-white/10 sticky top-0 bg-navy-mid z-10",children:[e.jsx("h2",{className:"font-semibold text-cream",children:a}),e.jsx("button",{onClick:o,className:"text-cream/40 hover:text-cream rounded transition-colors",children:e.jsx(r,{size:20})})]}),e.jsx("div",{className:"p-5",children:d})]})})}export{h as M,n as P,m as T,y as a};
