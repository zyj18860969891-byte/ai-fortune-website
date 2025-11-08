import{r as c,b as se,a as ae}from"./vendor-92c95717.js";import{L as re,u as W,a as ie,B as oe,R as ne,b as H}from"./router-ec4264b0.js";import{m as N,S as U,U as le,C as ce,M as de,a as me,b as ue,c as pe,A as xe,d as fe,e as ye}from"./ui-d1ac6027.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function a(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(o){if(o.ep)return;o.ep=!0;const n=a(o);fetch(o.href,n)}})();var Y={exports:{}},A={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var he=c,ge=Symbol.for("react.element"),be=Symbol.for("react.fragment"),ve=Object.prototype.hasOwnProperty,je=he.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,we={key:!0,ref:!0,__self:!0,__source:!0};function J(e,t,a){var i,o={},n=null,r=null;a!==void 0&&(n=""+a),t.key!==void 0&&(n=""+t.key),t.ref!==void 0&&(r=t.ref);for(i in t)ve.call(t,i)&&!we.hasOwnProperty(i)&&(o[i]=t[i]);if(e&&e.defaultProps)for(i in t=e.defaultProps,t)o[i]===void 0&&(o[i]=t[i]);return{$$typeof:ge,type:e,key:n,ref:r,props:o,_owner:je.current}}A.Fragment=be;A.jsx=J;A.jsxs=J;Y.exports=A;var s=Y.exports,z={},K=se;z.createRoot=K.createRoot,z.hydrateRoot=K.hydrateRoot;let Ne={data:""},Ee=e=>{if(typeof window=="object"){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||Ne},$e=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,ke=/\/\*[^]*?\*\/|  +/g,q=/\n+/g,E=(e,t)=>{let a="",i="",o="";for(let n in e){let r=e[n];n[0]=="@"?n[1]=="i"?a=n+" "+r+";":i+=n[1]=="f"?E(r,n):n+"{"+E(r,n[1]=="k"?"":t)+"}":typeof r=="object"?i+=E(r,t?t.replace(/([^,])+/g,l=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,d=>/&/.test(d)?d.replace(/&/g,l):l?l+" "+d:d)):n):r!=null&&(n=/^--/.test(n)?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=E.p?E.p(n,r):n+":"+r+";")}return a+(t&&o?t+"{"+o+"}":o)+i},v={},V=e=>{if(typeof e=="object"){let t="";for(let a in e)t+=a+V(e[a]);return t}return e},Oe=(e,t,a,i,o)=>{let n=V(e),r=v[n]||(v[n]=(d=>{let u=0,x=11;for(;u<d.length;)x=101*x+d.charCodeAt(u++)>>>0;return"go"+x})(n));if(!v[r]){let d=n!==e?e:(u=>{let x,m,f=[{}];for(;x=$e.exec(u.replace(ke,""));)x[4]?f.shift():x[3]?(m=x[3].replace(q," ").trim(),f.unshift(f[0][m]=f[0][m]||{})):f[0][x[1]]=x[2].replace(q," ").trim();return f[0]})(e);v[r]=E(o?{["@keyframes "+r]:d}:d,a?"":"."+r)}let l=a&&v.g?v.g:null;return a&&(v.g=v[r]),((d,u,x,m)=>{m?u.data=u.data.replace(m,d):u.data.indexOf(d)===-1&&(u.data=x?d+u.data:u.data+d)})(v[r],t,i,l),r},De=(e,t,a)=>e.reduce((i,o,n)=>{let r=t[n];if(r&&r.call){let l=r(a),d=l&&l.props&&l.props.className||/^go/.test(l)&&l;r=d?"."+d:l&&typeof l=="object"?l.props?"":E(l,""):l===!1?"":l}return i+o+(r??"")},"");function L(e){let t=this||{},a=e.call?e(t.p):e;return Oe(a.unshift?a.raw?De(a,[].slice.call(arguments,1),t.p):a.reduce((i,o)=>Object.assign(i,o&&o.call?o(t.p):o),{}):a,Ee(t.target),t.g,t.o,t.k)}let Z,M,F;L.bind({g:1});let j=L.bind({k:1});function Ce(e,t,a,i){E.p=t,Z=e,M=a,F=i}function $(e,t){let a=this||{};return function(){let i=arguments;function o(n,r){let l=Object.assign({},n),d=l.className||o.className;a.p=Object.assign({theme:M&&M()},l),a.o=/ *go\d+/.test(d),l.className=L.apply(a,i)+(d?" "+d:""),t&&(l.ref=r);let u=e;return e[0]&&(u=l.as||e,delete l.as),F&&u[0]&&F(l),Z(u,l)}return t?t(o):o}}var _e=e=>typeof e=="function",P=(e,t)=>_e(e)?e(t):e,Re=(()=>{let e=0;return()=>(++e).toString()})(),Q=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),Se=20,B="default",G=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(r=>r.id===t.toast.id?{...r,...t.toast}:r)};case 2:let{toast:i}=t;return G(e,{type:e.toasts.find(r=>r.id===i.id)?1:0,toast:i});case 3:let{toastId:o}=t;return{...e,toasts:e.toasts.map(r=>r.id===o||o===void 0?{...r,dismissed:!0,visible:!1}:r)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(r=>r.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let n=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(r=>({...r,pauseDuration:r.pauseDuration+n}))}}},I=[],X={toasts:[],pausedAt:void 0,settings:{toastLimit:Se}},b={},ee=(e,t=B)=>{b[t]=G(b[t]||X,e),I.forEach(([a,i])=>{a===t&&i(b[t])})},te=e=>Object.keys(b).forEach(t=>ee(e,t)),Ie=e=>Object.keys(b).find(t=>b[t].toasts.some(a=>a.id===e)),T=(e=B)=>t=>{ee(t,e)},Pe={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},Ae=(e={},t=B)=>{let[a,i]=c.useState(b[t]||X),o=c.useRef(b[t]);c.useEffect(()=>(o.current!==b[t]&&i(b[t]),I.push([t,i]),()=>{let r=I.findIndex(([l])=>l===t);r>-1&&I.splice(r,1)}),[t]);let n=a.toasts.map(r=>{var l,d,u;return{...e,...e[r.type],...r,removeDelay:r.removeDelay||((l=e[r.type])==null?void 0:l.removeDelay)||(e==null?void 0:e.removeDelay),duration:r.duration||((d=e[r.type])==null?void 0:d.duration)||(e==null?void 0:e.duration)||Pe[r.type],style:{...e.style,...(u=e[r.type])==null?void 0:u.style,...r.style}}});return{...a,toasts:n}},Le=(e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(a==null?void 0:a.id)||Re()}),C=e=>(t,a)=>{let i=Le(t,e,a);return T(i.toasterId||Ie(i.id))({type:2,toast:i}),i.id},h=(e,t)=>C("blank")(e,t);h.error=C("error");h.success=C("success");h.loading=C("loading");h.custom=C("custom");h.dismiss=(e,t)=>{let a={type:3,toastId:e};t?T(t)(a):te(a)};h.dismissAll=e=>h.dismiss(void 0,e);h.remove=(e,t)=>{let a={type:4,toastId:e};t?T(t)(a):te(a)};h.removeAll=e=>h.remove(void 0,e);h.promise=(e,t,a)=>{let i=h.loading(t.loading,{...a,...a==null?void 0:a.loading});return typeof e=="function"&&(e=e()),e.then(o=>{let n=t.success?P(t.success,o):void 0;return n?h.success(n,{id:i,...a,...a==null?void 0:a.success}):h.dismiss(i),o}).catch(o=>{let n=t.error?P(t.error,o):void 0;n?h.error(n,{id:i,...a,...a==null?void 0:a.error}):h.dismiss(i)}),e};var Te=1e3,ze=(e,t="default")=>{let{toasts:a,pausedAt:i}=Ae(e,t),o=c.useRef(new Map).current,n=c.useCallback((m,f=Te)=>{if(o.has(m))return;let y=setTimeout(()=>{o.delete(m),r({type:4,toastId:m})},f);o.set(m,y)},[]);c.useEffect(()=>{if(i)return;let m=Date.now(),f=a.map(y=>{if(y.duration===1/0)return;let p=(y.duration||0)+y.pauseDuration-(m-y.createdAt);if(p<0){y.visible&&h.dismiss(y.id);return}return setTimeout(()=>h.dismiss(y.id,t),p)});return()=>{f.forEach(y=>y&&clearTimeout(y))}},[a,i,t]);let r=c.useCallback(T(t),[t]),l=c.useCallback(()=>{r({type:5,time:Date.now()})},[r]),d=c.useCallback((m,f)=>{r({type:1,toast:{id:m,height:f}})},[r]),u=c.useCallback(()=>{i&&r({type:6,time:Date.now()})},[i,r]),x=c.useCallback((m,f)=>{let{reverseOrder:y=!1,gutter:p=8,defaultPosition:O}=f||{},k=a.filter(g=>(g.position||O)===(m.position||O)&&g.height),_=k.findIndex(g=>g.id===m.id),w=k.filter((g,D)=>D<_&&g.visible).length;return k.filter(g=>g.visible).slice(...y?[w+1]:[0,w]).reduce((g,D)=>g+(D.height||0)+p,0)},[a]);return c.useEffect(()=>{a.forEach(m=>{if(m.dismissed)n(m.id,m.removeDelay);else{let f=o.get(m.id);f&&(clearTimeout(f),o.delete(m.id))}})},[a,n]),{toasts:a,handlers:{updateHeight:d,startPause:l,endPause:u,calculateOffset:x}}},Me=j`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,Fe=j`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Be=j`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,He=$("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Me} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${Fe} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${Be} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,Ue=j`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Ke=$("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${Ue} 1s linear infinite;
`,qe=j`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,We=j`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Ye=$("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${qe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${We} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Je=$("div")`
  position: absolute;
`,Ve=$("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Ze=j`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Qe=$("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Ze} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Ge=({toast:e})=>{let{icon:t,type:a,iconTheme:i}=e;return t!==void 0?typeof t=="string"?c.createElement(Qe,null,t):t:a==="blank"?null:c.createElement(Ve,null,c.createElement(Ke,{...i}),a!=="loading"&&c.createElement(Je,null,a==="error"?c.createElement(He,{...i}):c.createElement(Ye,{...i})))},Xe=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,et=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,tt="0%{opacity:0;} 100%{opacity:1;}",st="0%{opacity:1;} 100%{opacity:0;}",at=$("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,rt=$("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,it=(e,t)=>{let a=e.includes("top")?1:-1,[i,o]=Q()?[tt,st]:[Xe(a),et(a)];return{animation:t?`${j(i)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${j(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},ot=c.memo(({toast:e,position:t,style:a,children:i})=>{let o=e.height?it(e.position||t||"top-center",e.visible):{opacity:0},n=c.createElement(Ge,{toast:e}),r=c.createElement(rt,{...e.ariaProps},P(e.message,e));return c.createElement(at,{className:e.className,style:{...o,...a,...e.style}},typeof i=="function"?i({icon:n,message:r}):c.createElement(c.Fragment,null,n,r))});Ce(c.createElement);var nt=({id:e,className:t,style:a,onHeightUpdate:i,children:o})=>{let n=c.useCallback(r=>{if(r){let l=()=>{let d=r.getBoundingClientRect().height;i(e,d)};l(),new MutationObserver(l).observe(r,{subtree:!0,childList:!0,characterData:!0})}},[e,i]);return c.createElement("div",{ref:n,className:t,style:a},o)},lt=(e,t)=>{let a=e.includes("top"),i=a?{top:0}:{bottom:0},o=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:Q()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(a?1:-1)}px)`,...i,...o}},ct=L`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,S=16,dt=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:i,children:o,toasterId:n,containerStyle:r,containerClassName:l})=>{let{toasts:d,handlers:u}=ze(a,n);return c.createElement("div",{"data-rht-toaster":n||"",style:{position:"fixed",zIndex:9999,top:S,left:S,right:S,bottom:S,pointerEvents:"none",...r},className:l,onMouseEnter:u.startPause,onMouseLeave:u.endPause},d.map(x=>{let m=x.position||t,f=u.calculateOffset(x,{reverseOrder:e,gutter:i,defaultPosition:t}),y=lt(m,f);return c.createElement(nt,{id:x.id,key:x.id,onHeightUpdate:u.updateHeight,className:x.visible?ct:"",style:y},x.type==="custom"?P(x.message,x):o?o(x):c.createElement(ot,{toast:x,position:m}))}))};const mt=()=>s.jsxs("div",{className:"min-h-screen mystical-bg relative overflow-hidden",children:[s.jsxs("div",{className:"absolute inset-0 opacity-20",children:[s.jsx("div",{className:"absolute top-1/4 left-1/4 w-32 h-32 bg-mystical-purple rounded-full blur-3xl animate-pulse"}),s.jsx("div",{className:"absolute top-3/4 right-1/4 w-48 h-48 bg-mystical-gold rounded-full blur-3xl animate-pulse delay-1000"}),s.jsx("div",{className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse delay-2000"})]}),s.jsxs("div",{className:"container mx-auto px-4 py-8 relative z-10",children:[s.jsxs(N.div,{initial:{opacity:0,y:30},animate:{opacity:1,y:0},transition:{duration:.8},className:"text-center mb-12",children:[s.jsx("div",{className:"flex justify-center mb-8",children:s.jsxs("div",{className:"relative",children:[s.jsx("div",{className:"w-20 h-20 bg-gradient-to-br from-mystical-purple to-mystical-gold rounded-full flex items-center justify-center animate-float",children:s.jsx("span",{className:"text-3xl",children:"📜"})}),s.jsx(U,{className:"w-6 h-6 text-mystical-gold absolute -top-1 -right-1 animate-sparkle"})]})}),s.jsx("h1",{className:"text-4xl md:text-6xl font-bold text-gradient mb-4",children:"八字命理"}),s.jsx("p",{className:"text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed mb-2",children:"基于古老八字智慧，结合现代AI技术"}),s.jsx("p",{className:"text-sm text-gray-400 max-w-2xl mx-auto",children:"解析您的生辰八字，揭示性格特质、事业运势、感情婚姻与健康状况"})]}),s.jsx(N.div,{initial:{opacity:0,y:30},animate:{opacity:1,y:0},transition:{delay:.4,duration:.8},className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12",children:[{icon:s.jsx(le,{className:"w-8 h-8"}),title:"性格分析",desc:"深度解析您的性格特质与内心世界"},{icon:s.jsx(U,{className:"w-8 h-8"}),title:"事业运势",desc:"预知事业发展趋势与最佳时机"},{icon:s.jsx(ce,{className:"w-8 h-8"}),title:"感情婚姻",desc:"分析情感运势与婚姻缘分"},{icon:s.jsx(de,{className:"w-8 h-8"}),title:"健康状况",desc:"了解身体状况与养生建议"}].map((e,t)=>s.jsxs(N.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.6+t*.1},className:"card-glass p-6 text-center group hover:scale-105 transition-transform duration-300",children:[s.jsx("div",{className:"w-16 h-16 bg-gradient-to-br from-mystical-purple to-mystical-gold rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-float",children:s.jsx("div",{className:"text-white",children:e.icon})}),s.jsx("h3",{className:"text-lg font-semibold text-white mb-2",children:e.title}),s.jsx("p",{className:"text-gray-400 text-sm leading-relaxed",children:e.desc})]},t))}),s.jsx(N.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},transition:{delay:1,duration:.8},className:"text-center",children:s.jsxs("div",{className:"card-glass p-8 md:p-12 max-w-2xl mx-auto",children:[s.jsxs("div",{className:"mb-6",children:[s.jsx(me,{className:"w-12 h-12 text-mystical-gold mx-auto mb-4 animate-float"}),s.jsx(ue,{className:"w-6 h-6 text-mystical-purple absolute transform translate-x-6 -translate-y-2 animate-sparkle"})]}),s.jsx("h2",{className:"text-2xl md:text-3xl font-semibold text-white mb-4",children:"开始您的八字命理之旅"}),s.jsxs("p",{className:"text-gray-400 mb-8 leading-relaxed",children:["只需提供您的出生日期和时间，",s.jsx("br",{}),"AI将为您进行专业的八字分析，",s.jsx("br",{}),"揭示您命运中的无限可能"]}),s.jsx(re,{to:"/fortune/bazi",children:s.jsxs(N.button,{whileHover:{scale:1.05},whileTap:{scale:.95},className:"btn-mystical text-lg px-8 py-4 group",children:[s.jsx("span",{children:"开始占卜"}),s.jsx(pe,{className:"w-5 h-5 ml-2 group-hover:animate-sparkle"})]})}),s.jsx("div",{className:"mt-6 text-xs text-gray-500",children:"💡 提示：支持多种日期格式，如 1990.05.15 或 1990年5月15日"})]})}),s.jsx(N.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:1.5},className:"text-center mt-12",children:s.jsxs("div",{className:"flex justify-center space-x-8 text-gray-500",children:[s.jsxs("div",{className:"flex items-center space-x-2",children:[s.jsx("div",{className:"w-2 h-2 bg-mystical-purple rounded-full animate-pulse"}),s.jsx("span",{className:"text-sm",children:"传统智慧"})]}),s.jsxs("div",{className:"flex items-center space-x-2",children:[s.jsx("div",{className:"w-2 h-2 bg-mystical-gold rounded-full animate-pulse delay-500"}),s.jsx("span",{className:"text-sm",children:"现代科技"})]}),s.jsxs("div",{className:"flex items-center space-x-2",children:[s.jsx("div",{className:"w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-1000"}),s.jsx("span",{className:"text-sm",children:"精准分析"})]})]})})]})]}),ut=({fortuneType:e,fortuneName:t})=>{const a=W(),[i,o]=c.useState([]),[n,r]=c.useState(""),[l,d]=c.useState(!1),u=c.useRef(null),x=()=>{var p;(p=u.current)==null||p.scrollIntoView({behavior:"smooth"})};c.useEffect(()=>{x()},[i]),c.useEffect(()=>{let p=`您好！我是${t}AI占卜师。请输入您的问题，我会为您提供专业的占卜分析和建议。`;e==="bazi"&&(p="您好！我是八字命理AI占卜师。要进行准确的八字分析，请先提供您的出生日期（格式：1990.05.15 或 1990年5月15日），确认后会为您进行专业分析。"),o([{id:"1",type:"ai",content:p,timestamp:new Date}])},[t,e]);const m=async()=>{var O;if(!n.trim()||l)return;const p={id:Date.now().toString(),type:"user",content:n.trim(),timestamp:new Date};o(k=>[...k,p]),r(""),d(!0);try{const w=await(await fetch("https://ai-fortune-website-production.up.railway.app/api/fortune/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:n.trim(),type:e,context:i.slice(-6).map(R=>`${R.type==="user"?"用户":"占卜师"}: ${R.content}`).join(`
`),sessionId:`session-${Date.now()}`})})).json();let g=w.response||((O=w.result)==null?void 0:O.prediction)||"抱歉，我现在无法提供占卜服务，请稍后再试。";e==="bazi"&&w.hasBaziData===!1&&(g="要进行准确的八字分析，请提供您的出生日期（格式：1990.05.15 或 1990年5月15日），这样我才能为您进行专业的命理分析。");const D={id:(Date.now()+1).toString(),type:"ai",content:g,timestamp:new Date};o(R=>[...R,D])}catch{const _={id:(Date.now()+1).toString(),type:"ai",content:"抱歉，网络连接有问题，请检查网络后重试。",timestamp:new Date};o(w=>[...w,_])}finally{d(!1)}},f=p=>{p.key==="Enter"&&!p.shiftKey&&(p.preventDefault(),m())},y=p=>p.toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",hour12:!1});return s.jsxs("div",{className:"flex flex-col h-screen bg-gray-50",children:[s.jsxs("div",{className:"bg-white border-b border-gray-200 px-4 py-3 flex items-center",children:[s.jsx("button",{onClick:()=>a("/"),className:"mr-3 p-1 text-gray-600 hover:text-gray-800",children:s.jsx(xe,{className:"w-6 h-6"})}),s.jsxs("h1",{className:"text-lg font-semibold text-gray-800",children:[t,"占卜师"]})]}),s.jsxs("div",{className:"flex-1 overflow-y-auto p-4 space-y-4",children:[s.jsx(fe,{children:i.map(p=>s.jsx(N.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},className:`flex ${p.type==="user"?"justify-end":"justify-start"}`,children:s.jsxs("div",{className:`max-w-xs lg:max-w-md ${p.type==="user"?"order-2":"order-1"}`,children:[s.jsx("div",{className:`text-xs text-gray-500 mb-1 ${p.type==="user"?"text-right":"text-left"}`,children:y(p.timestamp)}),s.jsx("div",{className:`px-4 py-2 rounded-2xl ${p.type==="user"?"bg-green-500 text-white rounded-br-sm":"bg-white text-gray-800 border border-gray-200 rounded-bl-sm"}`,children:s.jsx("p",{className:"text-sm leading-relaxed whitespace-pre-wrap",children:p.content})})]})},p.id))}),l&&s.jsx(N.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"flex justify-start",children:s.jsxs("div",{className:"max-w-xs lg:max-w-md",children:[s.jsx("div",{className:"text-xs text-gray-500 mb-1",children:y(new Date)}),s.jsx("div",{className:"px-4 py-2 rounded-2xl rounded-bl-sm bg-white border border-gray-200",children:s.jsxs("div",{className:"flex space-x-1",children:[s.jsx("div",{className:"w-2 h-2 bg-gray-400 rounded-full animate-bounce"}),s.jsx("div",{className:"w-2 h-2 bg-gray-400 rounded-full animate-bounce",style:{animationDelay:"0.1s"}}),s.jsx("div",{className:"w-2 h-2 bg-gray-400 rounded-full animate-bounce",style:{animationDelay:"0.2s"}})]})})]})}),s.jsx("div",{ref:u})]}),s.jsx("div",{className:"bg-white border-t border-gray-200 px-4 py-3",children:s.jsxs("div",{className:"flex items-end space-x-3",children:[s.jsx("div",{className:"flex-1",children:s.jsx("textarea",{value:n,onChange:p=>r(p.target.value),onKeyPress:f,placeholder:"输入您的问题...",className:"w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent",rows:1,style:{minHeight:"40px",maxHeight:"120px"}})}),s.jsx("button",{onClick:m,disabled:!n.trim()||l,className:"px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors",children:s.jsx(ye,{className:"w-5 h-5"})})]})})]})},pt=()=>{const{type:e}=ie(),t=W(),a=i=>({tarot:"塔罗占卜",bazi:"八字命理",astrology:"星座占星",numerology:"数字命理"})[i||"tarot"]||"塔罗占卜";return e?s.jsx(ut,{fortuneType:e,fortuneName:a(e)}):(t("/"),null)};function xt(){return s.jsx(oe,{children:s.jsxs("div",{className:"App",children:[s.jsxs(ne,{children:[s.jsx(H,{path:"/",element:s.jsx(mt,{})}),s.jsx(H,{path:"/fortune/:type",element:s.jsx(pt,{})})]}),s.jsx(dt,{position:"top-right",toastOptions:{duration:4e3,style:{background:"rgba(31, 41, 55, 0.9)",color:"#fff",border:"1px solid rgba(139, 92, 246, 0.3)",borderRadius:"8px"},success:{iconTheme:{primary:"#10B981",secondary:"#fff"}},error:{iconTheme:{primary:"#EF4444",secondary:"#fff"}}}})]})})}z.createRoot(document.getElementById("root")).render(s.jsx(ae.StrictMode,{children:s.jsx(xt,{})}));
