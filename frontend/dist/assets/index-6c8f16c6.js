import{r as c,b as ne,a as le}from"./vendor-92c95717.js";import{L as ce,u as V,a as de,B as me,R as ue,b as K}from"./router-ec4264b0.js";import{m as k,S as Y,U as pe,C as fe,M as xe,a as ye,b as he,c as ge,A as be,d as ve,e as je}from"./ui-d1ac6027.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function a(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(o){if(o.ep)return;o.ep=!0;const n=a(o);fetch(o.href,n)}})();var Z={exports:{}},T={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ne=c,we=Symbol.for("react.element"),Ee=Symbol.for("react.fragment"),$e=Object.prototype.hasOwnProperty,Ie=Ne.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,ke={key:!0,ref:!0,__self:!0,__source:!0};function Q(e,t,a){var i,o={},n=null,r=null;a!==void 0&&(n=""+a),t.key!==void 0&&(n=""+t.key),t.ref!==void 0&&(r=t.ref);for(i in t)$e.call(t,i)&&!ke.hasOwnProperty(i)&&(o[i]=t[i]);if(e&&e.defaultProps)for(i in t=e.defaultProps,t)o[i]===void 0&&(o[i]=t[i]);return{$$typeof:we,type:e,key:n,ref:r,props:o,_owner:Ie.current}}T.Fragment=Ee;T.jsx=Q;T.jsxs=Q;Z.exports=T;var s=Z.exports,B={},W=ne;B.createRoot=W.createRoot,B.hydrateRoot=W.hydrateRoot;let De={data:""},Oe=e=>{if(typeof window=="object"){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||De},Ce=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,Se=/\/\*[^]*?\*\/|  +/g,J=/\n+/g,D=(e,t)=>{let a="",i="",o="";for(let n in e){let r=e[n];n[0]=="@"?n[1]=="i"?a=n+" "+r+";":i+=n[1]=="f"?D(r,n):n+"{"+D(r,n[1]=="k"?"":t)+"}":typeof r=="object"?i+=D(r,t?t.replace(/([^,])+/g,l=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,d=>/&/.test(d)?d.replace(/&/g,l):l?l+" "+d:d)):n):r!=null&&(n=/^--/.test(n)?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=D.p?D.p(n,r):n+":"+r+";")}return a+(t&&o?t+"{"+o+"}":o)+i},E={},G=e=>{if(typeof e=="object"){let t="";for(let a in e)t+=a+G(e[a]);return t}return e},Pe=(e,t,a,i,o)=>{let n=G(e),r=E[n]||(E[n]=(d=>{let p=0,f=11;for(;p<d.length;)f=101*f+d.charCodeAt(p++)>>>0;return"go"+f})(n));if(!E[r]){let d=n!==e?e:(p=>{let f,m,y=[{}];for(;f=Ce.exec(p.replace(Se,""));)f[4]?y.shift():f[3]?(m=f[3].replace(J," ").trim(),y.unshift(y[0][m]=y[0][m]||{})):y[0][f[1]]=f[2].replace(J," ").trim();return y[0]})(e);E[r]=D(o?{["@keyframes "+r]:d}:d,a?"":"."+r)}let l=a&&E.g?E.g:null;return a&&(E.g=E[r]),((d,p,f,m)=>{m?p.data=p.data.replace(m,d):p.data.indexOf(d)===-1&&(p.data=f?d+p.data:p.data+d)})(E[r],t,i,l),r},Re=(e,t,a)=>e.reduce((i,o,n)=>{let r=t[n];if(r&&r.call){let l=r(a),d=l&&l.props&&l.props.className||/^go/.test(l)&&l;r=d?"."+d:l&&typeof l=="object"?l.props?"":D(l,""):l===!1?"":l}return i+o+(r??"")},"");function L(e){let t=this||{},a=e.call?e(t.p):e;return Pe(a.unshift?a.raw?Re(a,[].slice.call(arguments,1),t.p):a.reduce((i,o)=>Object.assign(i,o&&o.call?o(t.p):o),{}):a,Oe(t.target),t.g,t.o,t.k)}let X,F,H;L.bind({g:1});let $=L.bind({k:1});function _e(e,t,a,i){D.p=t,X=e,F=a,H=i}function O(e,t){let a=this||{};return function(){let i=arguments;function o(n,r){let l=Object.assign({},n),d=l.className||o.className;a.p=Object.assign({theme:F&&F()},l),a.o=/ *go\d+/.test(d),l.className=L.apply(a,i)+(d?" "+d:""),t&&(l.ref=r);let p=e;return e[0]&&(p=l.as||e,delete l.as),H&&p[0]&&H(l),X(p,l)}return t?t(o):o}}var Ae=e=>typeof e=="function",A=(e,t)=>Ae(e)?e(t):e,Te=(()=>{let e=0;return()=>(++e).toString()})(),ee=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),Le=20,U="default",te=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(r=>r.id===t.toast.id?{...r,...t.toast}:r)};case 2:let{toast:i}=t;return te(e,{type:e.toasts.find(r=>r.id===i.id)?1:0,toast:i});case 3:let{toastId:o}=t;return{...e,toasts:e.toasts.map(r=>r.id===o||o===void 0?{...r,dismissed:!0,visible:!1}:r)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(r=>r.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let n=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(r=>({...r,pauseDuration:r.pauseDuration+n}))}}},_=[],se={toasts:[],pausedAt:void 0,settings:{toastLimit:Le}},w={},ae=(e,t=U)=>{w[t]=te(w[t]||se,e),_.forEach(([a,i])=>{a===t&&i(w[t])})},re=e=>Object.keys(w).forEach(t=>ae(e,t)),Me=e=>Object.keys(w).find(t=>w[t].toasts.some(a=>a.id===e)),M=(e=U)=>t=>{ae(t,e)},ze={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},Be=(e={},t=U)=>{let[a,i]=c.useState(w[t]||se),o=c.useRef(w[t]);c.useEffect(()=>(o.current!==w[t]&&i(w[t]),_.push([t,i]),()=>{let r=_.findIndex(([l])=>l===t);r>-1&&_.splice(r,1)}),[t]);let n=a.toasts.map(r=>{var l,d,p;return{...e,...e[r.type],...r,removeDelay:r.removeDelay||((l=e[r.type])==null?void 0:l.removeDelay)||(e==null?void 0:e.removeDelay),duration:r.duration||((d=e[r.type])==null?void 0:d.duration)||(e==null?void 0:e.duration)||ze[r.type],style:{...e.style,...(p=e[r.type])==null?void 0:p.style,...r.style}}});return{...a,toasts:n}},Fe=(e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(a==null?void 0:a.id)||Te()}),P=e=>(t,a)=>{let i=Fe(t,e,a);return M(i.toasterId||Me(i.id))({type:2,toast:i}),i.id},g=(e,t)=>P("blank")(e,t);g.error=P("error");g.success=P("success");g.loading=P("loading");g.custom=P("custom");g.dismiss=(e,t)=>{let a={type:3,toastId:e};t?M(t)(a):re(a)};g.dismissAll=e=>g.dismiss(void 0,e);g.remove=(e,t)=>{let a={type:4,toastId:e};t?M(t)(a):re(a)};g.removeAll=e=>g.remove(void 0,e);g.promise=(e,t,a)=>{let i=g.loading(t.loading,{...a,...a==null?void 0:a.loading});return typeof e=="function"&&(e=e()),e.then(o=>{let n=t.success?A(t.success,o):void 0;return n?g.success(n,{id:i,...a,...a==null?void 0:a.success}):g.dismiss(i),o}).catch(o=>{let n=t.error?A(t.error,o):void 0;n?g.error(n,{id:i,...a,...a==null?void 0:a.error}):g.dismiss(i)}),e};var He=1e3,Ue=(e,t="default")=>{let{toasts:a,pausedAt:i}=Be(e,t),o=c.useRef(new Map).current,n=c.useCallback((m,y=He)=>{if(o.has(m))return;let h=setTimeout(()=>{o.delete(m),r({type:4,toastId:m})},y);o.set(m,h)},[]);c.useEffect(()=>{if(i)return;let m=Date.now(),y=a.map(h=>{if(h.duration===1/0)return;let C=(h.duration||0)+h.pauseDuration-(m-h.createdAt);if(C<0){h.visible&&g.dismiss(h.id);return}return setTimeout(()=>g.dismiss(h.id,t),C)});return()=>{y.forEach(h=>h&&clearTimeout(h))}},[a,i,t]);let r=c.useCallback(M(t),[t]),l=c.useCallback(()=>{r({type:5,time:Date.now()})},[r]),d=c.useCallback((m,y)=>{r({type:1,toast:{id:m,height:y}})},[r]),p=c.useCallback(()=>{i&&r({type:6,time:Date.now()})},[i,r]),f=c.useCallback((m,y)=>{let{reverseOrder:h=!1,gutter:C=8,defaultPosition:u}=y||{},N=a.filter(x=>(x.position||u)===(m.position||u)&&x.height),v=N.findIndex(x=>x.id===m.id),j=N.filter((x,b)=>b<v&&x.visible).length;return N.filter(x=>x.visible).slice(...h?[j+1]:[0,j]).reduce((x,b)=>x+(b.height||0)+C,0)},[a]);return c.useEffect(()=>{a.forEach(m=>{if(m.dismissed)n(m.id,m.removeDelay);else{let y=o.get(m.id);y&&(clearTimeout(y),o.delete(m.id))}})},[a,n]),{toasts:a,handlers:{updateHeight:d,startPause:l,endPause:p,calculateOffset:f}}},qe=$`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,Ke=$`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Ye=$`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,We=O("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${qe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${Ke} 0.15s ease-out forwards;
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
    animation: ${Ye} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,Je=$`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Ve=O("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${Je} 1s linear infinite;
`,Ze=$`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Qe=$`
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
}`,Ge=O("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Ze} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Qe} 0.2s ease-out forwards;
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
`,Xe=O("div")`
  position: absolute;
`,et=O("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,tt=$`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,st=O("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${tt} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,at=({toast:e})=>{let{icon:t,type:a,iconTheme:i}=e;return t!==void 0?typeof t=="string"?c.createElement(st,null,t):t:a==="blank"?null:c.createElement(et,null,c.createElement(Ve,{...i}),a!=="loading"&&c.createElement(Xe,null,a==="error"?c.createElement(We,{...i}):c.createElement(Ge,{...i})))},rt=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,it=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,ot="0%{opacity:0;} 100%{opacity:1;}",nt="0%{opacity:1;} 100%{opacity:0;}",lt=O("div")`
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
`,ct=O("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,dt=(e,t)=>{let a=e.includes("top")?1:-1,[i,o]=ee()?[ot,nt]:[rt(a),it(a)];return{animation:t?`${$(i)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${$(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},mt=c.memo(({toast:e,position:t,style:a,children:i})=>{let o=e.height?dt(e.position||t||"top-center",e.visible):{opacity:0},n=c.createElement(at,{toast:e}),r=c.createElement(ct,{...e.ariaProps},A(e.message,e));return c.createElement(lt,{className:e.className,style:{...o,...a,...e.style}},typeof i=="function"?i({icon:n,message:r}):c.createElement(c.Fragment,null,n,r))});_e(c.createElement);var ut=({id:e,className:t,style:a,onHeightUpdate:i,children:o})=>{let n=c.useCallback(r=>{if(r){let l=()=>{let d=r.getBoundingClientRect().height;i(e,d)};l(),new MutationObserver(l).observe(r,{subtree:!0,childList:!0,characterData:!0})}},[e,i]);return c.createElement("div",{ref:n,className:t,style:a},o)},pt=(e,t)=>{let a=e.includes("top"),i=a?{top:0}:{bottom:0},o=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:ee()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(a?1:-1)}px)`,...i,...o}},ft=L`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,R=16,xt=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:i,children:o,toasterId:n,containerStyle:r,containerClassName:l})=>{let{toasts:d,handlers:p}=Ue(a,n);return c.createElement("div",{"data-rht-toaster":n||"",style:{position:"fixed",zIndex:9999,top:R,left:R,right:R,bottom:R,pointerEvents:"none",...r},className:l,onMouseEnter:p.startPause,onMouseLeave:p.endPause},d.map(f=>{let m=f.position||t,y=p.calculateOffset(f,{reverseOrder:e,gutter:i,defaultPosition:t}),h=pt(m,y);return c.createElement(ut,{id:f.id,key:f.id,onHeightUpdate:p.updateHeight,className:f.visible?ft:"",style:h},f.type==="custom"?A(f.message,f):o?o(f):c.createElement(mt,{toast:f,position:m}))}))};const yt=()=>s.jsxs("div",{className:"min-h-screen mystical-bg relative overflow-hidden",children:[s.jsxs("div",{className:"absolute inset-0 opacity-20",children:[s.jsx("div",{className:"absolute top-1/4 left-1/4 w-32 h-32 bg-mystical-purple rounded-full blur-3xl animate-pulse"}),s.jsx("div",{className:"absolute top-3/4 right-1/4 w-48 h-48 bg-mystical-gold rounded-full blur-3xl animate-pulse delay-1000"}),s.jsx("div",{className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse delay-2000"})]}),s.jsxs("div",{className:"container mx-auto px-4 py-8 relative z-10",children:[s.jsxs(k.div,{initial:{opacity:0,y:30},animate:{opacity:1,y:0},transition:{duration:.8},className:"text-center mb-12",children:[s.jsx("div",{className:"flex justify-center mb-8",children:s.jsxs("div",{className:"relative",children:[s.jsx("div",{className:"w-20 h-20 bg-gradient-to-br from-mystical-purple to-mystical-gold rounded-full flex items-center justify-center animate-float",children:s.jsx("span",{className:"text-3xl",children:"📜"})}),s.jsx(Y,{className:"w-6 h-6 text-mystical-gold absolute -top-1 -right-1 animate-sparkle"})]})}),s.jsx("h1",{className:"text-4xl md:text-6xl font-bold text-gradient mb-4",children:"八字命理"}),s.jsx("p",{className:"text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed mb-2",children:"基于古老八字智慧，结合现代AI技术"}),s.jsx("p",{className:"text-sm text-gray-400 max-w-2xl mx-auto",children:"解析您的生辰八字，揭示性格特质、事业运势、感情婚姻与健康状况"})]}),s.jsx(k.div,{initial:{opacity:0,y:30},animate:{opacity:1,y:0},transition:{delay:.4,duration:.8},className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12",children:[{icon:s.jsx(pe,{className:"w-8 h-8"}),title:"性格分析",desc:"深度解析您的性格特质与内心世界"},{icon:s.jsx(Y,{className:"w-8 h-8"}),title:"事业运势",desc:"预知事业发展趋势与最佳时机"},{icon:s.jsx(fe,{className:"w-8 h-8"}),title:"感情婚姻",desc:"分析情感运势与婚姻缘分"},{icon:s.jsx(xe,{className:"w-8 h-8"}),title:"健康状况",desc:"了解身体状况与养生建议"}].map((e,t)=>s.jsxs(k.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.6+t*.1},className:"card-glass p-6 text-center group hover:scale-105 transition-transform duration-300",children:[s.jsx("div",{className:"w-16 h-16 bg-gradient-to-br from-mystical-purple to-mystical-gold rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-float",children:s.jsx("div",{className:"text-white",children:e.icon})}),s.jsx("h3",{className:"text-lg font-semibold text-white mb-2",children:e.title}),s.jsx("p",{className:"text-gray-400 text-sm leading-relaxed",children:e.desc})]},t))}),s.jsx(k.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},transition:{delay:1,duration:.8},className:"text-center",children:s.jsxs("div",{className:"card-glass p-8 md:p-12 max-w-2xl mx-auto",children:[s.jsxs("div",{className:"mb-6",children:[s.jsx(ye,{className:"w-12 h-12 text-mystical-gold mx-auto mb-4 animate-float"}),s.jsx(he,{className:"w-6 h-6 text-mystical-purple absolute transform translate-x-6 -translate-y-2 animate-sparkle"})]}),s.jsx("h2",{className:"text-2xl md:text-3xl font-semibold text-white mb-4",children:"开始您的八字命理之旅"}),s.jsxs("p",{className:"text-gray-400 mb-8 leading-relaxed",children:["只需提供您的出生日期和时间，",s.jsx("br",{}),"AI将为您进行专业的八字分析，",s.jsx("br",{}),"揭示您命运中的无限可能"]}),s.jsx(ce,{to:"/fortune/bazi",children:s.jsxs(k.button,{whileHover:{scale:1.05},whileTap:{scale:.95},className:"btn-mystical text-lg px-8 py-4 group",children:[s.jsx("span",{children:"开始占卜"}),s.jsx(ge,{className:"w-5 h-5 ml-2 group-hover:animate-sparkle"})]})}),s.jsx("div",{className:"mt-6 text-xs text-gray-500",children:"💡 提示：支持多种日期格式，如 1990.05.15 或 1990年5月15日"})]})}),s.jsx(k.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:1.5},className:"text-center mt-12",children:s.jsxs("div",{className:"flex justify-center space-x-8 text-gray-500",children:[s.jsxs("div",{className:"flex items-center space-x-2",children:[s.jsx("div",{className:"w-2 h-2 bg-mystical-purple rounded-full animate-pulse"}),s.jsx("span",{className:"text-sm",children:"传统智慧"})]}),s.jsxs("div",{className:"flex items-center space-x-2",children:[s.jsx("div",{className:"w-2 h-2 bg-mystical-gold rounded-full animate-pulse delay-500"}),s.jsx("span",{className:"text-sm",children:"现代科技"})]}),s.jsxs("div",{className:"flex items-center space-x-2",children:[s.jsx("div",{className:"w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-1000"}),s.jsx("span",{className:"text-sm",children:"精准分析"})]})]})})]})]}),ht=({fortuneType:e,fortuneName:t})=>{const a=V(),[i,o]=c.useState([]),[n,r]=c.useState(""),[l,d]=c.useState(!1),p=c.useRef(null),f=()=>{var u;(u=p.current)==null||u.scrollIntoView({behavior:"smooth"})};c.useEffect(()=>{f()},[i]),c.useEffect(()=>{let u=`您好！我是${t}AI占卜师。请输入您的问题，我会为您提供专业的占卜分析和建议。`;e==="bazi"&&(u="您好！我是八字命理AI占卜师。要进行准确的八字分析，请先提供您的出生日期（格式：1990.05.15 或 1990年5月15日），确认后会为您进行专业分析。"),o([{id:"1",type:"ai",content:u,timestamp:new Date}])},[t,e]);const m=async()=>{var N;if(!n.trim()||l)return;const u={id:Date.now().toString(),type:"user",content:n.trim(),timestamp:new Date};o(v=>[...v,u]),r(""),d(!0);try{const v=y(n.trim());console.log("🔍 前端提取出生信息:",{inputText:n.trim(),birthInfo:v});const j={question:n.trim(),type:e,context:i.slice(-6).map(S=>`${S.type==="user"?"用户":"占卜师"}: ${S.content}`).join(`
`),sessionId:`session-${Date.now()}`};let x=null;if(!v){console.log("🔍 当前消息未提取到出生信息，尝试从上下文中查找");const S=i.slice(-10).map(oe=>oe.content).join(" ");x=y(S),console.log("🔍 从上下文提取的出生信息:",x)}const b=v||x;b?(j.birthInfo=b,console.log("✅ 添加birthInfo到请求:",{source:v?"当前消息":"上下文",birthInfo:b})):console.log("⚠️ 未提取到birthInfo，发送的请求体:",j);const z=await(await fetch("/api/fortune/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(j)})).json();let q=z.response||((N=z.result)==null?void 0:N.prediction)||"抱歉，我现在无法提供占卜服务，请稍后再试。";e==="bazi"&&z.hasBaziData===!1&&(q="要进行准确的八字分析，请提供您的出生日期（格式：1990.05.15 或 1990年5月15日），这样我才能为您进行专业的命理分析。");const ie={id:(Date.now()+1).toString(),type:"ai",content:q,timestamp:new Date};o(S=>[...S,ie])}catch{const j={id:(Date.now()+1).toString(),type:"ai",content:"抱歉，网络连接有问题，请检查网络后重试。",timestamp:new Date};o(x=>[...x,j])}finally{d(!1)}},y=u=>{const N=[/(\d{4})[年./](\d{1,2})[月./](\d{1,2})/,/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})/];console.log("🔍 extractBirthInfo 调用:",{text:u,patterns:N.map(v=>v.toString())});for(const v of N){const j=u.match(v);if(console.log("🔍 正则匹配结果:",{pattern:v.toString(),match:j}),j){const x=parseInt(j[1]),b=parseInt(j[2]),I=parseInt(j[3]);if(console.log("🔍 提取的数值:",{year:x,month:b,day:I}),!isNaN(x)&&!isNaN(b)&&!isNaN(I)&&x>=1900&&x<=2100&&b>=1&&b<=12&&I>=1&&I<=31)return{year:x,month:b,day:I,hour:0,minute:0};console.log("⚠️ 提取的数值无效:",{year:x,month:b,day:I,isNaNYear:isNaN(x),isNaNMonth:isNaN(b),isNaNDay:isNaN(I)})}}return console.log("⚠️ 未找到有效的出生日期"),null},h=u=>{u.key==="Enter"&&!u.shiftKey&&(u.preventDefault(),m())},C=u=>u.toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",hour12:!1});return s.jsxs("div",{className:"flex flex-col h-screen bg-gray-50",children:[s.jsxs("div",{className:"bg-white border-b border-gray-200 px-4 py-3 flex items-center",children:[s.jsx("button",{onClick:()=>a("/"),className:"mr-3 p-1 text-gray-600 hover:text-gray-800",children:s.jsx(be,{className:"w-6 h-6"})}),s.jsxs("h1",{className:"text-lg font-semibold text-gray-800",children:[t,"占卜师"]})]}),s.jsxs("div",{className:"flex-1 overflow-y-auto p-4 space-y-4",children:[s.jsx(ve,{children:i.map(u=>s.jsx(k.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},className:`flex ${u.type==="user"?"justify-end":"justify-start"}`,children:s.jsxs("div",{className:`max-w-xs lg:max-w-md ${u.type==="user"?"order-2":"order-1"}`,children:[s.jsx("div",{className:`text-xs text-gray-500 mb-1 ${u.type==="user"?"text-right":"text-left"}`,children:C(u.timestamp)}),s.jsx("div",{className:`px-4 py-2 rounded-2xl ${u.type==="user"?"bg-green-500 text-white rounded-br-sm":"bg-white text-gray-800 border border-gray-200 rounded-bl-sm"}`,children:s.jsx("p",{className:"text-sm leading-relaxed whitespace-pre-wrap",children:u.content})})]})},u.id))}),l&&s.jsx(k.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"flex justify-start",children:s.jsxs("div",{className:"max-w-xs lg:max-w-md",children:[s.jsx("div",{className:"text-xs text-gray-500 mb-1",children:C(new Date)}),s.jsx("div",{className:"px-4 py-2 rounded-2xl rounded-bl-sm bg-white border border-gray-200",children:s.jsxs("div",{className:"flex space-x-1",children:[s.jsx("div",{className:"w-2 h-2 bg-gray-400 rounded-full animate-bounce"}),s.jsx("div",{className:"w-2 h-2 bg-gray-400 rounded-full animate-bounce",style:{animationDelay:"0.1s"}}),s.jsx("div",{className:"w-2 h-2 bg-gray-400 rounded-full animate-bounce",style:{animationDelay:"0.2s"}})]})})]})}),s.jsx("div",{ref:p})]}),s.jsx("div",{className:"bg-white border-t border-gray-200 px-4 py-3",children:s.jsxs("div",{className:"flex items-end space-x-3",children:[s.jsx("div",{className:"flex-1",children:s.jsx("textarea",{value:n,onChange:u=>r(u.target.value),onKeyPress:h,placeholder:"输入您的问题...",className:"w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent",rows:1,style:{minHeight:"40px",maxHeight:"120px"}})}),s.jsx("button",{onClick:m,disabled:!n.trim()||l,className:"px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors",children:s.jsx(je,{className:"w-5 h-5"})})]})})]})},gt=()=>{const{type:e}=de(),t=V(),a=i=>({tarot:"塔罗占卜",bazi:"八字命理",astrology:"星座占星",numerology:"数字命理"})[i||"tarot"]||"塔罗占卜";return e?s.jsx(ht,{fortuneType:e,fortuneName:a(e)}):(t("/"),null)};function bt(){return s.jsx(me,{children:s.jsxs("div",{className:"App",children:[s.jsxs(ue,{children:[s.jsx(K,{path:"/",element:s.jsx(yt,{})}),s.jsx(K,{path:"/fortune/:type",element:s.jsx(gt,{})})]}),s.jsx(xt,{position:"top-right",toastOptions:{duration:4e3,style:{background:"rgba(31, 41, 55, 0.9)",color:"#fff",border:"1px solid rgba(139, 92, 246, 0.3)",borderRadius:"8px"},success:{iconTheme:{primary:"#10B981",secondary:"#fff"}},error:{iconTheme:{primary:"#EF4444",secondary:"#fff"}}}})]})})}B.createRoot(document.getElementById("root")).render(s.jsx(le.StrictMode,{children:s.jsx(bt,{})}));
