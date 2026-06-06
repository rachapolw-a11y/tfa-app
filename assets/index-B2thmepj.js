const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Roster-DMkIvxvW.js","assets/vendor-charts-TTOrMFgA.js","assets/Modal-D-IAJ8wo.js","assets/vendor-firebase-kdkOEpUJ.js","assets/Training-CpDPE96M.js","assets/Evaluation-M1qG15ch.js","assets/Stats-erPKW0Tt.js","assets/PlayerPortal-CRgVre35.js"])))=>i.map(i=>d[i]);
import{g as _,r as $e,e as ze}from"./vendor-charts-TTOrMFgA.js";import{b as qe,C as He,r as ie,S as Ve,a as We,F as Ke,k as L,_ as Xe,i as Ge,h as Ze,m as _e,p as Ye,e as Je,l as Qe,j as et,o as tt,d as j,u as Q,g as C,c as z,f as q,s as H}from"./vendor-firebase-kdkOEpUJ.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}})();var ye={exports:{}},V={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var nt=_,st=Symbol.for("react.element"),rt=Symbol.for("react.fragment"),ot=Object.prototype.hasOwnProperty,it=nt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,at={key:!0,ref:!0,__self:!0,__source:!0};function be(e,t,n){var s,r={},o=null,i=null;n!==void 0&&(o=""+n),t.key!==void 0&&(o=""+t.key),t.ref!==void 0&&(i=t.ref);for(s in t)ot.call(t,s)&&!at.hasOwnProperty(s)&&(r[s]=t[s]);if(e&&e.defaultProps)for(s in t=e.defaultProps,t)r[s]===void 0&&(r[s]=t[s]);return{$$typeof:st,type:e,key:o,ref:i,props:r,_owner:it.current}}V.Fragment=rt;V.jsx=be;V.jsxs=be;ye.exports=V;var l=ye.exports,Y={},ae=$e;Y.createRoot=ae.createRoot,Y.hydrateRoot=ae.hydrateRoot;const ct="modulepreload",lt=function(e){return"/tfa-app/"+e},ce={},B=function(t,n,s){let r=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),a=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));r=Promise.allSettled(n.map(c=>{if(c=lt(c),c in ce)return;ce[c]=!0;const u=c.endsWith(".css"),p=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${p}`))return;const d=document.createElement("link");if(d.rel=u?"stylesheet":ct,u||(d.as="script"),d.crossOrigin="",d.href=c,a&&d.setAttribute("nonce",a),document.head.appendChild(d),u)return new Promise((g,w)=>{d.addEventListener("load",g),d.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${c}`)))})}))}function o(i){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=i,window.dispatchEvent(a),!a.defaultPrevented)throw i}return r.then(i=>{for(const a of i||[])a.status==="rejected"&&o(a.reason);return t().catch(o)})};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ut=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),xe=(...e)=>e.filter((t,n,s)=>!!t&&s.indexOf(t)===n).join(" ");/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var dt={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ht=_.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:n=2,absoluteStrokeWidth:s,className:r="",children:o,iconNode:i,...a},c)=>_.createElement("svg",{ref:c,...dt,width:t,height:t,stroke:e,strokeWidth:s?Number(n)*24/Number(t):n,className:xe("lucide",r),...a},[...i.map(([u,p])=>_.createElement(u,p)),...Array.isArray(o)?o:[o]]));/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=(e,t)=>{const n=_.forwardRef(({className:s,...r},o)=>_.createElement(ht,{ref:o,iconNode:t,className:xe(`lucide-${ut(e)}`,s),...r}));return n.displayName=`${e}`,n};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pt=N("BarChart2",[["line",{x1:"18",x2:"18",y1:"20",y2:"10",key:"1xfpm4"}],["line",{x1:"12",x2:"12",y1:"20",y2:"4",key:"be30l9"}],["line",{x1:"6",x2:"6",y1:"20",y2:"14",key:"1r4le6"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ft=N("CalendarDays",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mt=N("LockOpen",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 9.9-1",key:"1mm8w8"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gt=N("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=N("Megaphone",[["path",{d:"m3 11 18-5v12L3 14v-3z",key:"n962bs"}],["path",{d:"M11.6 16.8a3 3 0 1 1-5.8-1.6",key:"1yl0tm"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _t=N("Send",[["path",{d:"m22 2-7 20-4-9-9-4Z",key:"1q3vgg"}],["path",{d:"M22 2 11 13",key:"nzbqef"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yt=N("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bt=N("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ue=N("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const we="firebasestorage.googleapis.com",ke="storageBucket",xt=2*60*1e3,wt=10*60*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class m extends Ke{constructor(t,n,s=0){super(G(t),`Firebase Storage: ${n} (${G(t)})`),this.status_=s,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,m.prototype)}get status(){return this.status_}set status(t){this.status_=t}_codeEquals(t){return G(t)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(t){this.customData.serverResponse=t,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var f;(function(e){e.UNKNOWN="unknown",e.OBJECT_NOT_FOUND="object-not-found",e.BUCKET_NOT_FOUND="bucket-not-found",e.PROJECT_NOT_FOUND="project-not-found",e.QUOTA_EXCEEDED="quota-exceeded",e.UNAUTHENTICATED="unauthenticated",e.UNAUTHORIZED="unauthorized",e.UNAUTHORIZED_APP="unauthorized-app",e.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",e.INVALID_CHECKSUM="invalid-checksum",e.CANCELED="canceled",e.INVALID_EVENT_NAME="invalid-event-name",e.INVALID_URL="invalid-url",e.INVALID_DEFAULT_BUCKET="invalid-default-bucket",e.NO_DEFAULT_BUCKET="no-default-bucket",e.CANNOT_SLICE_BLOB="cannot-slice-blob",e.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",e.NO_DOWNLOAD_URL="no-download-url",e.INVALID_ARGUMENT="invalid-argument",e.INVALID_ARGUMENT_COUNT="invalid-argument-count",e.APP_DELETED="app-deleted",e.INVALID_ROOT_OPERATION="invalid-root-operation",e.INVALID_FORMAT="invalid-format",e.INTERNAL_ERROR="internal-error",e.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(f||(f={}));function G(e){return"storage/"+e}function ee(){const e="An unknown error occurred, please check the error payload for server response.";return new m(f.UNKNOWN,e)}function kt(e){return new m(f.OBJECT_NOT_FOUND,"Object '"+e+"' does not exist.")}function Rt(e){return new m(f.QUOTA_EXCEEDED,"Quota for bucket '"+e+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function Tt(){const e="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new m(f.UNAUTHENTICATED,e)}function Et(){return new m(f.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function vt(e){return new m(f.UNAUTHORIZED,"User does not have permission to access '"+e+"'.")}function At(){return new m(f.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function Nt(){return new m(f.CANCELED,"User canceled the upload/download.")}function Ot(e){return new m(f.INVALID_URL,"Invalid URL '"+e+"'.")}function It(e){return new m(f.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+e+"'.")}function Pt(){return new m(f.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+ke+"' property when initializing the app?")}function Ut(){return new m(f.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function Ct(){return new m(f.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function St(e){return new m(f.UNSUPPORTED_ENVIRONMENT,`${e} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function J(e){return new m(f.INVALID_ARGUMENT,e)}function Re(){return new m(f.APP_DELETED,"The Firebase app was deleted.")}function Dt(e){return new m(f.INVALID_ROOT_OPERATION,"The operation '"+e+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function D(e,t){return new m(f.INVALID_FORMAT,"String does not match format '"+e+"': "+t)}function S(e){throw new m(f.INTERNAL_ERROR,"Internal error: "+e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class R{constructor(t,n){this.bucket=t,this.path_=n}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const t=encodeURIComponent;return"/b/"+t(this.bucket)+"/o/"+t(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(t,n){let s;try{s=R.makeFromUrl(t,n)}catch{return new R(t,"")}if(s.path==="")return s;throw It(t)}static makeFromUrl(t,n){let s=null;const r="([A-Za-z0-9.\\-_]+)";function o(y){y.path.charAt(y.path.length-1)==="/"&&(y.path_=y.path_.slice(0,-1))}const i="(/(.*))?$",a=new RegExp("^gs://"+r+i,"i"),c={bucket:1,path:3};function u(y){y.path_=decodeURIComponent(y.path)}const p="v[A-Za-z0-9_]+",d=n.replace(/[.]/g,"\\."),g="(/([^?#]*).*)?$",w=new RegExp(`^https?://${d}/${p}/b/${r}/o${g}`,"i"),T={bucket:1,path:3},v=n===we?"(?:storage.googleapis.com|storage.cloud.google.com)":n,b="([^?#]*)",O=new RegExp(`^https?://${v}/${r}/${b}`,"i"),k=[{regex:a,indices:c,postModify:o},{regex:w,indices:T,postModify:u},{regex:O,indices:{bucket:1,path:2},postModify:u}];for(let y=0;y<k.length;y++){const M=k[y],K=M.regex.exec(t);if(K){const Fe=K[M.indices.bucket];let X=K[M.indices.path];X||(X=""),s=new R(Fe,X),M.postModify(s);break}}if(s==null)throw Ot(t);return s}}class Lt{constructor(t){this.promise_=Promise.reject(t)}getPromise(){return this.promise_}cancel(t=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jt(e,t,n){let s=1,r=null,o=null,i=!1,a=0;function c(){return a===2}let u=!1;function p(...b){u||(u=!0,t.apply(null,b))}function d(b){r=setTimeout(()=>{r=null,e(w,c())},b)}function g(){o&&clearTimeout(o)}function w(b,...O){if(u){g();return}if(b){g(),p.call(null,b,...O);return}if(c()||i){g(),p.call(null,b,...O);return}s<64&&(s*=2);let k;a===1?(a=2,k=0):k=(s+Math.random())*1e3,d(k)}let T=!1;function v(b){T||(T=!0,g(),!u&&(r!==null?(b||(a=2),clearTimeout(r),d(0)):b||(a=1)))}return d(0),o=setTimeout(()=>{i=!0,v(!0)},n),v}function Bt(e){e(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mt(e){return e!==void 0}function Ft(e){return typeof e=="object"&&!Array.isArray(e)}function te(e){return typeof e=="string"||e instanceof String}function de(e){return ne()&&e instanceof Blob}function ne(){return typeof Blob<"u"}function he(e,t,n,s){if(s<t)throw J(`Invalid value for '${e}'. Expected ${t} or greater.`);if(s>n)throw J(`Invalid value for '${e}'. Expected ${n} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function W(e,t,n){let s=t;return n==null&&(s=`https://${t}`),`${n}://${s}/v0${e}`}function Te(e){const t=encodeURIComponent;let n="?";for(const s in e)if(e.hasOwnProperty(s)){const r=t(s)+"="+t(e[s]);n=n+r+"&"}return n=n.slice(0,-1),n}var P;(function(e){e[e.NO_ERROR=0]="NO_ERROR",e[e.NETWORK_ERROR=1]="NETWORK_ERROR",e[e.ABORT=2]="ABORT"})(P||(P={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $t(e,t){const n=e>=500&&e<600,r=[408,429].indexOf(e)!==-1,o=t.indexOf(e)!==-1;return n||r||o}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zt{constructor(t,n,s,r,o,i,a,c,u,p,d,g=!0,w=!1){this.url_=t,this.method_=n,this.headers_=s,this.body_=r,this.successCodes_=o,this.additionalRetryCodes_=i,this.callback_=a,this.errorCallback_=c,this.timeout_=u,this.progressCallback_=p,this.connectionFactory_=d,this.retry=g,this.isUsingEmulator=w,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((T,v)=>{this.resolve_=T,this.reject_=v,this.start_()})}start_(){const t=(s,r)=>{if(r){s(!1,new F(!1,null,!0));return}const o=this.connectionFactory_();this.pendingConnection_=o;const i=a=>{const c=a.loaded,u=a.lengthComputable?a.total:-1;this.progressCallback_!==null&&this.progressCallback_(c,u)};this.progressCallback_!==null&&o.addUploadProgressListener(i),o.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&o.removeUploadProgressListener(i),this.pendingConnection_=null;const a=o.getErrorCode()===P.NO_ERROR,c=o.getStatus();if(!a||$t(c,this.additionalRetryCodes_)&&this.retry){const p=o.getErrorCode()===P.ABORT;s(!1,new F(!1,null,p));return}const u=this.successCodes_.indexOf(c)!==-1;s(!0,new F(u,o))})},n=(s,r)=>{const o=this.resolve_,i=this.reject_,a=r.connection;if(r.wasSuccessCode)try{const c=this.callback_(a,a.getResponse());Mt(c)?o(c):o()}catch(c){i(c)}else if(a!==null){const c=ee();c.serverResponse=a.getErrorText(),this.errorCallback_?i(this.errorCallback_(a,c)):i(c)}else if(r.canceled){const c=this.appDelete_?Re():Nt();i(c)}else{const c=At();i(c)}};this.canceled_?n(!1,new F(!1,null,!0)):this.backoffId_=jt(t,n,this.timeout_)}getPromise(){return this.promise_}cancel(t){this.canceled_=!0,this.appDelete_=t||!1,this.backoffId_!==null&&Bt(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class F{constructor(t,n,s){this.wasSuccessCode=t,this.connection=n,this.canceled=!!s}}function qt(e,t){t!==null&&t.length>0&&(e.Authorization="Firebase "+t)}function Ht(e,t){e["X-Firebase-Storage-Version"]="webjs/"+(t??"AppManager")}function Vt(e,t){t&&(e["X-Firebase-GMPID"]=t)}function Wt(e,t){t!==null&&(e["X-Firebase-AppCheck"]=t)}function Kt(e,t,n,s,r,o,i=!0,a=!1){const c=Te(e.urlParams),u=e.url+c,p=Object.assign({},e.headers);return Vt(p,t),qt(p,n),Ht(p,o),Wt(p,s),new zt(u,e.method,p,e.body,e.successCodes,e.additionalRetryCodes,e.handler,e.errorHandler,e.timeout,e.progressCallback,r,i,a)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xt(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function Gt(...e){const t=Xt();if(t!==void 0){const n=new t;for(let s=0;s<e.length;s++)n.append(e[s]);return n.getBlob()}else{if(ne())return new Blob(e);throw new m(f.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function Zt(e,t,n){return e.webkitSlice?e.webkitSlice(t,n):e.mozSlice?e.mozSlice(t,n):e.slice?e.slice(t,n):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yt(e){if(typeof atob>"u")throw St("base-64");return atob(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const A={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class Z{constructor(t,n){this.data=t,this.contentType=n||null}}function Jt(e,t){switch(e){case A.RAW:return new Z(Ee(t));case A.BASE64:case A.BASE64URL:return new Z(ve(e,t));case A.DATA_URL:return new Z(en(t),tn(t))}throw ee()}function Ee(e){const t=[];for(let n=0;n<e.length;n++){let s=e.charCodeAt(n);if(s<=127)t.push(s);else if(s<=2047)t.push(192|s>>6,128|s&63);else if((s&64512)===55296)if(!(n<e.length-1&&(e.charCodeAt(n+1)&64512)===56320))t.push(239,191,189);else{const o=s,i=e.charCodeAt(++n);s=65536|(o&1023)<<10|i&1023,t.push(240|s>>18,128|s>>12&63,128|s>>6&63,128|s&63)}else(s&64512)===56320?t.push(239,191,189):t.push(224|s>>12,128|s>>6&63,128|s&63)}return new Uint8Array(t)}function Qt(e){let t;try{t=decodeURIComponent(e)}catch{throw D(A.DATA_URL,"Malformed data URL.")}return Ee(t)}function ve(e,t){switch(e){case A.BASE64:{const r=t.indexOf("-")!==-1,o=t.indexOf("_")!==-1;if(r||o)throw D(e,"Invalid character '"+(r?"-":"_")+"' found: is it base64url encoded?");break}case A.BASE64URL:{const r=t.indexOf("+")!==-1,o=t.indexOf("/")!==-1;if(r||o)throw D(e,"Invalid character '"+(r?"+":"/")+"' found: is it base64 encoded?");t=t.replace(/-/g,"+").replace(/_/g,"/");break}}let n;try{n=Yt(t)}catch(r){throw r.message.includes("polyfill")?r:D(e,"Invalid character found")}const s=new Uint8Array(n.length);for(let r=0;r<n.length;r++)s[r]=n.charCodeAt(r);return s}class Ae{constructor(t){this.base64=!1,this.contentType=null;const n=t.match(/^data:([^,]+)?,/);if(n===null)throw D(A.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const s=n[1]||null;s!=null&&(this.base64=nn(s,";base64"),this.contentType=this.base64?s.substring(0,s.length-7):s),this.rest=t.substring(t.indexOf(",")+1)}}function en(e){const t=new Ae(e);return t.base64?ve(A.BASE64,t.rest):Qt(t.rest)}function tn(e){return new Ae(e).contentType}function nn(e,t){return e.length>=t.length?e.substring(e.length-t.length)===t:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class I{constructor(t,n){let s=0,r="";de(t)?(this.data_=t,s=t.size,r=t.type):t instanceof ArrayBuffer?(n?this.data_=new Uint8Array(t):(this.data_=new Uint8Array(t.byteLength),this.data_.set(new Uint8Array(t))),s=this.data_.length):t instanceof Uint8Array&&(n?this.data_=t:(this.data_=new Uint8Array(t.length),this.data_.set(t)),s=t.length),this.size_=s,this.type_=r}size(){return this.size_}type(){return this.type_}slice(t,n){if(de(this.data_)){const s=this.data_,r=Zt(s,t,n);return r===null?null:new I(r)}else{const s=new Uint8Array(this.data_.buffer,t,n-t);return new I(s,!0)}}static getBlob(...t){if(ne()){const n=t.map(s=>s instanceof I?s.data_:s);return new I(Gt.apply(null,n))}else{const n=t.map(i=>te(i)?Jt(A.RAW,i).data:i.data_);let s=0;n.forEach(i=>{s+=i.byteLength});const r=new Uint8Array(s);let o=0;return n.forEach(i=>{for(let a=0;a<i.length;a++)r[o++]=i[a]}),new I(r,!0)}}uploadData(){return this.data_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ne(e){let t;try{t=JSON.parse(e)}catch{return null}return Ft(t)?t:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sn(e){if(e.length===0)return null;const t=e.lastIndexOf("/");return t===-1?"":e.slice(0,t)}function rn(e,t){const n=t.split("/").filter(s=>s.length>0).join("/");return e.length===0?n:e+"/"+n}function Oe(e){const t=e.lastIndexOf("/",e.length-2);return t===-1?e:e.slice(t+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function on(e,t){return t}class x{constructor(t,n,s,r){this.server=t,this.local=n||t,this.writable=!!s,this.xform=r||on}}let $=null;function an(e){return!te(e)||e.length<2?e:Oe(e)}function Ie(){if($)return $;const e=[];e.push(new x("bucket")),e.push(new x("generation")),e.push(new x("metageneration")),e.push(new x("name","fullPath",!0));function t(o,i){return an(i)}const n=new x("name");n.xform=t,e.push(n);function s(o,i){return i!==void 0?Number(i):i}const r=new x("size");return r.xform=s,e.push(r),e.push(new x("timeCreated")),e.push(new x("updated")),e.push(new x("md5Hash",null,!0)),e.push(new x("cacheControl",null,!0)),e.push(new x("contentDisposition",null,!0)),e.push(new x("contentEncoding",null,!0)),e.push(new x("contentLanguage",null,!0)),e.push(new x("contentType",null,!0)),e.push(new x("metadata","customMetadata",!0)),$=e,$}function cn(e,t){function n(){const s=e.bucket,r=e.fullPath,o=new R(s,r);return t._makeStorageReference(o)}Object.defineProperty(e,"ref",{get:n})}function ln(e,t,n){const s={};s.type="file";const r=n.length;for(let o=0;o<r;o++){const i=n[o];s[i.local]=i.xform(s,t[i.server])}return cn(s,e),s}function Pe(e,t,n){const s=Ne(t);return s===null?null:ln(e,s,n)}function un(e,t,n,s){const r=Ne(t);if(r===null||!te(r.downloadTokens))return null;const o=r.downloadTokens;if(o.length===0)return null;const i=encodeURIComponent;return o.split(",").map(u=>{const p=e.bucket,d=e.fullPath,g="/b/"+i(p)+"/o/"+i(d),w=W(g,n,s),T=Te({alt:"media",token:u});return w+T})[0]}function dn(e,t){const n={},s=t.length;for(let r=0;r<s;r++){const o=t[r];o.writable&&(n[o.server]=e[o.local])}return JSON.stringify(n)}class se{constructor(t,n,s,r){this.url=t,this.method=n,this.handler=s,this.timeout=r,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ue(e){if(!e)throw ee()}function hn(e,t){function n(s,r){const o=Pe(e,r,t);return Ue(o!==null),o}return n}function pn(e,t){function n(s,r){const o=Pe(e,r,t);return Ue(o!==null),un(o,r,e.host,e._protocol)}return n}function Ce(e){function t(n,s){let r;return n.getStatus()===401?n.getErrorText().includes("Firebase App Check token is invalid")?r=Et():r=Tt():n.getStatus()===402?r=Rt(e.bucket):n.getStatus()===403?r=vt(e.path):r=s,r.status=n.getStatus(),r.serverResponse=s.serverResponse,r}return t}function Se(e){const t=Ce(e);function n(s,r){let o=t(s,r);return s.getStatus()===404&&(o=kt(e.path)),o.serverResponse=r.serverResponse,o}return n}function fn(e,t,n){const s=t.fullServerUrl(),r=W(s,e.host,e._protocol),o="GET",i=e.maxOperationRetryTime,a=new se(r,o,pn(e,n),i);return a.errorHandler=Se(t),a}function mn(e,t){const n=t.fullServerUrl(),s=W(n,e.host,e._protocol),r="DELETE",o=e.maxOperationRetryTime;function i(c,u){}const a=new se(s,r,i,o);return a.successCodes=[200,204],a.errorHandler=Se(t),a}function gn(e,t){return e&&e.contentType||t&&t.type()||"application/octet-stream"}function _n(e,t,n){const s=Object.assign({},n);return s.fullPath=e.path,s.size=t.size(),s.contentType||(s.contentType=gn(null,t)),s}function yn(e,t,n,s,r){const o=t.bucketOnlyServerUrl(),i={"X-Goog-Upload-Protocol":"multipart"};function a(){let k="";for(let y=0;y<2;y++)k=k+Math.random().toString().slice(2);return k}const c=a();i["Content-Type"]="multipart/related; boundary="+c;const u=_n(t,s,r),p=dn(u,n),d="--"+c+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+p+`\r
--`+c+`\r
Content-Type: `+u.contentType+`\r
\r
`,g=`\r
--`+c+"--",w=I.getBlob(d,s,g);if(w===null)throw Ut();const T={name:u.fullPath},v=W(o,e.host,e._protocol),b="POST",O=e.maxUploadRetryTime,h=new se(v,b,hn(e,n),O);return h.urlParams=T,h.headers=i,h.body=w.uploadData(),h.errorHandler=Ce(t),h}class bn{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=P.NO_ERROR,this.sendPromise_=new Promise(t=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=P.ABORT,t()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=P.NETWORK_ERROR,t()}),this.xhr_.addEventListener("load",()=>{t()})})}send(t,n,s,r,o){if(this.sent_)throw S("cannot .send() more than once");if(_e(t)&&s&&(this.xhr_.withCredentials=!0),this.sent_=!0,this.xhr_.open(n,t,!0),o!==void 0)for(const i in o)o.hasOwnProperty(i)&&this.xhr_.setRequestHeader(i,o[i].toString());return r!==void 0?this.xhr_.send(r):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw S("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw S("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw S("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw S("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(t){return this.xhr_.getResponseHeader(t)}addUploadProgressListener(t){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",t)}removeUploadProgressListener(t){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",t)}}class xn extends bn{initXhr(){this.xhr_.responseType="text"}}function re(){return new xn}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U{constructor(t,n){this._service=t,n instanceof R?this._location=n:this._location=R.makeFromUrl(n,t.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(t,n){return new U(t,n)}get root(){const t=new R(this._location.bucket,"");return this._newRef(this._service,t)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return Oe(this._location.path)}get storage(){return this._service}get parent(){const t=sn(this._location.path);if(t===null)return null;const n=new R(this._location.bucket,t);return new U(this._service,n)}_throwIfRoot(t){if(this._location.path==="")throw Dt(t)}}function wn(e,t,n){e._throwIfRoot("uploadBytes");const s=yn(e.storage,e._location,Ie(),new I(t,!0),n);return e.storage.makeRequestWithTokens(s,re).then(r=>({metadata:r,ref:e}))}function kn(e){e._throwIfRoot("getDownloadURL");const t=fn(e.storage,e._location,Ie());return e.storage.makeRequestWithTokens(t,re).then(n=>{if(n===null)throw Ct();return n})}function Rn(e){e._throwIfRoot("deleteObject");const t=mn(e.storage,e._location);return e.storage.makeRequestWithTokens(t,re)}function Tn(e,t){const n=rn(e._location.path,t),s=new R(e._location.bucket,n);return new U(e.storage,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function En(e){return/^[A-Za-z]+:\/\//.test(e)}function vn(e,t){return new U(e,t)}function De(e,t){if(e instanceof oe){const n=e;if(n._bucket==null)throw Pt();const s=new U(n,n._bucket);return t!=null?De(s,t):s}else return t!==void 0?Tn(e,t):e}function An(e,t){if(t&&En(t)){if(e instanceof oe)return vn(e,t);throw J("To use ref(service, url), the first argument must be a Storage instance.")}else return De(e,t)}function pe(e,t){const n=t==null?void 0:t[ke];return n==null?null:R.makeFromBucketSpec(n,e)}function Nn(e,t,n,s={}){e.host=`${t}:${n}`;const r=_e(t);r&&Ye(`https://${e.host}/b`),e._isUsingEmulator=!0,e._protocol=r?"https":"http";const{mockUserToken:o}=s;o&&(e._overrideAuthToken=typeof o=="string"?o:Je(o,e.app.options.projectId))}class oe{constructor(t,n,s,r,o,i=!1){this.app=t,this._authProvider=n,this._appCheckProvider=s,this._url=r,this._firebaseVersion=o,this._isUsingEmulator=i,this._bucket=null,this._host=we,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=xt,this._maxUploadRetryTime=wt,this._requests=new Set,r!=null?this._bucket=R.makeFromBucketSpec(r,this._host):this._bucket=pe(this._host,this.app.options)}get host(){return this._host}set host(t){this._host=t,this._url!=null?this._bucket=R.makeFromBucketSpec(this._url,t):this._bucket=pe(t,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(t){he("time",0,Number.POSITIVE_INFINITY,t),this._maxUploadRetryTime=t}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(t){he("time",0,Number.POSITIVE_INFINITY,t),this._maxOperationRetryTime=t}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const t=this._authProvider.getImmediate({optional:!0});if(t){const n=await t.getToken();if(n!==null)return n.accessToken}return null}async _getAppCheckToken(){if(We(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=this._appCheckProvider.getImmediate({optional:!0});return t?(await t.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(t=>t.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(t){return new U(this,t)}_makeRequest(t,n,s,r,o=!0){if(this._deleted)return new Lt(Re());{const i=Kt(t,this._appId,s,r,n,this._firebaseVersion,o,this._isUsingEmulator);return this._requests.add(i),i.getPromise().then(()=>this._requests.delete(i),()=>this._requests.delete(i)),i}}async makeRequestWithTokens(t,n){const[s,r]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(t,n,s,r).getPromise()}}const fe="@firebase/storage",me="0.14.3";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Le="storage";function On(e,t,n){return e=L(e),wn(e,t,n)}function In(e){return e=L(e),kn(e)}function Pn(e){return e=L(e),Rn(e)}function je(e,t){return e=L(e),An(e,t)}function Un(e=Ze(),t){e=L(e);const s=Xe(e,Le).getImmediate({identifier:t}),r=Ge("storage");return r&&Cn(s,...r),s}function Cn(e,t,n,s={}){Nn(e,t,n,s)}function Sn(e,{instanceIdentifier:t}){const n=e.getProvider("app").getImmediate(),s=e.getProvider("auth-internal"),r=e.getProvider("app-check-internal");return new oe(n,s,r,t,Ve)}function Dn(){qe(new He(Le,Sn,"PUBLIC").setMultipleInstances(!0)),ie(fe,me,""),ie(fe,me,"esm2020")}Dn();const Ln={apiKey:"AIzaSyBFNUsqBSIGQkD0cf8AswlroicLmyzNzE8",authDomain:"tfa-academy.firebaseapp.com",projectId:"tfa-academy",storageBucket:"tfa-academy.firebasestorage.app",messagingSenderId:"983148814427",appId:"1:983148814427:web:d69e7d6665527b8490df7e"},Be=Qe(Ln),E=et(Be),Me=Un(Be);function jn(e,t){return tt(j(E,e),n=>{t(n.docs.map(s=>({id:s.id,...s.data()})))})}const Yn=e=>z(j(E,"players"),{...e,createdAt:H()}),Jn=(e,t)=>{const{id:n,createdAt:s,...r}=t;return Q(C(E,"players",e),r)},Qn=e=>q(C(E,"players",e)),es=e=>z(j(E,"sessions"),{...e,createdAt:H()}),ts=(e,t)=>{const{id:n,createdAt:s,...r}=t;return Q(C(E,"sessions",e),r)},ns=e=>q(C(E,"sessions",e)),ss=e=>z(j(E,"evaluations"),{...e,createdAt:H()}),rs=(e,t)=>{const{id:n,createdAt:s,...r}=t;return Q(C(E,"evaluations",e),r)},os=e=>q(C(E,"evaluations",e));async function is(e,t){const n=t.type==="image/png"?"png":"jpg",s=je(Me,`players/${e}/photo.${n}`);return await On(s,t,{contentType:t.type}),In(s)}async function as(e){for(const t of["jpg","png","jpeg","webp"])try{await Pn(je(Me,`players/${e}/photo.${t}`))}catch{}}const Bn=e=>z(j(E,"notices"),{...e,createdAt:H()}),Mn=e=>q(C(E,"notices",e)),Fn="/tfa-app/assets/tfa-logo-DPPaTwsE.png",$n=_.lazy(()=>B(()=>import("./Roster-DMkIvxvW.js"),__vite__mapDeps([0,1,2,3]))),zn=_.lazy(()=>B(()=>import("./Training-CpDPE96M.js"),__vite__mapDeps([4,1,2,3]))),qn=_.lazy(()=>B(()=>import("./Evaluation-M1qG15ch.js"),__vite__mapDeps([5,1,2,3]))),Hn=_.lazy(()=>B(()=>import("./Stats-erPKW0Tt.js"),__vite__mapDeps([6,1,3]))),Vn=_.lazy(()=>B(()=>import("./PlayerPortal-CRgVre35.js"),__vite__mapDeps([7,1,0,2,3])));function ge(){return l.jsx("div",{className:"text-center py-20 text-cream/30 text-sm",children:"Loading..."})}const Wn="1234",Kn=[{id:"roster",label:"Squad",icon:bt},{id:"training",label:"Training",icon:ft},{id:"evaluation",label:"Progress",icon:yt},{id:"stats",label:"Stats",icon:pt}];function Xn(){const[e,t]=_.useState("roster"),[n,s]=_.useState(()=>sessionStorage.getItem("tfa_role")||"parent"),[r,o]=_.useState([]),[i,a]=_.useState(""),[c,u]=_.useState(!1),p=new URLSearchParams(window.location.search).get("id");if(p)return l.jsx(_.Suspense,{fallback:l.jsx(ge,{}),children:l.jsx(Vn,{playerId:p})});const d=n==="coach";_.useEffect(()=>jn("notices",h=>{o(h.sort((k,y)=>new Date(y.date)-new Date(k.date)))}),[]);const g=r[0]||null,w=sessionStorage.getItem("tfa_dismissed_notice"),T=g&&g.id!==w;function v(){sessionStorage.setItem("tfa_dismissed_notice",g.id),o(h=>[...h])}async function b(h){h.preventDefault(),i.trim()&&(await Bn({message:i.trim(),date:new Date().toISOString().split("T")[0]}),a(""),u(!1))}function O(){if(d)window.confirm("Exit coach mode?")&&(sessionStorage.setItem("tfa_role","parent"),s("parent"));else{const h=window.prompt("Enter coach PIN:");if(h===null)return;h===Wn?(sessionStorage.setItem("tfa_role","coach"),s("coach")):window.alert("Incorrect PIN")}}return l.jsxs("div",{className:"min-h-screen bg-navy",children:[l.jsxs("header",{className:"bg-navy-mid border-b border-white/10",style:{paddingTop:"env(safe-area-inset-top)"},children:[l.jsxs("div",{className:"max-w-5xl mx-auto px-4 py-4 flex items-center gap-3",children:[l.jsx("img",{src:Fn,alt:"TFA",className:"w-10 h-10 object-contain shrink-0"}),l.jsxs("div",{className:"flex-1",children:[l.jsx("h1",{className:"text-xl font-bold leading-none text-cream",children:"The Football Academy"}),l.jsx("p",{className:"text-gold/60 text-xs mt-0.5",children:d?"Coach Dashboard":"Parent Portal"})]}),d&&l.jsx("button",{onClick:()=>u(h=>!h),title:"Post announcement",className:`p-2 rounded-lg transition-colors ${c?"bg-gold/20 text-gold":"text-cream/30 hover:text-gold"}`,children:l.jsx(le,{size:16})}),l.jsxs("button",{onClick:O,title:d?"Exit coach mode":"Coach login",className:`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${d?"bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25":"text-cream/20 hover:text-cream/50"}`,children:[d?l.jsx(mt,{size:13}):l.jsx(gt,{size:13}),d?"Coach":""]})]}),d&&c&&l.jsxs("div",{className:"max-w-5xl mx-auto px-4 pb-3",children:[l.jsxs("form",{onSubmit:b,className:"flex gap-2",children:[l.jsx("input",{className:"input flex-1 text-sm py-2",placeholder:"Post an announcement to parents…",value:i,onChange:h=>a(h.target.value),maxLength:280,autoFocus:!0}),l.jsxs("button",{type:"submit",className:"flex items-center gap-1.5 bg-gold text-navy px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gold-light shrink-0",children:[l.jsx(_t,{size:13})," Post"]})]}),r.length>0&&l.jsx("div",{className:"mt-2 space-y-1 max-h-32 overflow-y-auto",children:r.map(h=>l.jsxs("div",{className:"flex items-center justify-between gap-2 bg-navy rounded-lg px-3 py-2 text-xs text-cream/60",children:[l.jsx("span",{className:"flex-1 truncate",children:h.message}),l.jsx("span",{className:"text-cream/30 shrink-0",children:h.date}),l.jsx("button",{onClick:()=>Mn(h.id),className:"text-cream/20 hover:text-red-400 shrink-0 ml-1",children:l.jsx(ue,{size:12})})]},h.id))})]}),l.jsx("div",{className:"max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto",children:Kn.map(({id:h,label:k,icon:y})=>l.jsxs("button",{onClick:()=>t(h),className:`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-t transition-colors whitespace-nowrap ${e===h?"bg-gold text-navy font-semibold":"text-cream/60 hover:text-cream hover:bg-white/5"}`,children:[l.jsx(y,{size:16}),k]},h))})]}),T&&l.jsx("div",{className:"bg-gold/10 border-b border-gold/20 max-w-full",children:l.jsxs("div",{className:"max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-3",children:[l.jsx(le,{size:14,className:"text-gold shrink-0"}),l.jsx("p",{className:"flex-1 text-sm text-cream/90",children:g.message}),l.jsx("span",{className:"text-xs text-cream/30 shrink-0",children:g.date}),l.jsx("button",{onClick:v,className:"text-cream/30 hover:text-cream shrink-0 ml-1",children:l.jsx(ue,{size:14})})]})}),l.jsx("main",{className:"max-w-5xl mx-auto px-4 py-6",children:l.jsxs(_.Suspense,{fallback:l.jsx(ge,{}),children:[e==="roster"&&l.jsx($n,{role:n}),e==="training"&&l.jsx(zn,{role:n}),e==="evaluation"&&l.jsx(qn,{role:n}),e==="stats"&&l.jsx(Hn,{})]})})]})}Y.createRoot(document.getElementById("root")).render(l.jsx(ze.StrictMode,{children:l.jsx(Xn,{})}));export{ue as X,ss as a,Yn as b,es as c,N as d,os as e,Qn as f,as as g,ns as h,Jn as i,l as j,ts as k,is as l,jn as s,Fn as t,rs as u};
