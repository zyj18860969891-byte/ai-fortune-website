import{r as c,b as re,a as ie}from"./vendor-92c95717.js";import{L as oe,u as Y,a as ne,B as le,R as ce,b as U}from"./router-ec4264b0.js";import{m as $,S as q,U as de,C as me,M as ue,a as pe,b as xe,c as fe,A as ye,d as he,e as ge}from"./ui-d1ac6027.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function a(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(o){if(o.ep)return;o.ep=!0;const n=a(o);fetch(o.href,n)}})();var J={exports:{}},A={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var be=c,ve=Symbol.for("react.element"),je=Symbol.for("react.fragment"),we=Object.prototype.hasOwnProperty,Ne=be.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Ee={key:!0,ref:!0,__self:!0,__source:!0};function V(e,t,a){var i,o={},n=null,r=null;a!==void 0&&(n=""+a),t.key!==void 0&&(n=""+t.key),t.ref!==void 0&&(r=t.ref);for(i in t)we.call(t,i)&&!Ee.hasOwnProperty(i)&&(o[i]=t[i]);if(e&&e.defaultProps)for(i in t=e.defaultProps,t)o[i]===void 0&&(o[i]=t[i]);return{$$typeof:ve,type:e,key:n,ref:r,props:o,_owner:Ne.current}}A.Fragment=je;A.jsx=V;A.jsxs=V;J.exports=A;var s=J.exports,z={},K=re;z.createRoot=K.createRoot,z.hydrateRoot=K.hydrateRoot;let $e={data:""},ke=e=>{if(typeof window=="object"){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||$e},Ie=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,Oe=/\/\*[^]*?\*\/|  +/g,W=/\n+/g,k=(e,t)=>{let a="",i="",o="";for(let n in e){let r=e[n];n[0]=="@"?n[1]=="i"?a=n+" "+r+";":i+=n[1]=="f"?k(r,n):n+"{"+k(r,n[1]=="k"?"":t)+"}":typeof r=="object"?i+=k(r,t?t.replace(/([^,])+/g,l=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,d=>/&/.test(d)?d.replace(/&/g,l):l?l+" "+d:d)):n):r!=null&&(n=/^--/.test(n)?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=k.p?k.p(n,r):n+":"+r+";")}return a+(t&&o?t+"{"+o+"}":o)+i},N={},Z=e=>{if(typeof e=="object"){let t="";for(let a in e)t+=a+Z(e[a]);return t}return e},De=(e,t,a,i,o)=>{let n=Z(e),r=N[n]||(N[n]=(d=>{let u=0,x=11;for(;u<d.length;)x=101*x+d.charCodeAt(u++)>>>0;return"go"+x})(n));if(!N[r]){let d=n!==e?e:(u=>{let x,m,f=[{}];for(;x=Ie.exec(u.replace(Oe,""));)x[4]?f.shift():x[3]?(m=x[3].replace(W," ").trim(),f.unshift(f[0][m]=f[0][m]||{})):f[0][x[1]]=x[2].replace(W," ").trim();return f[0]})(e);N[r]=k(o?{["@keyframes "+r]:d}:d,a?"":"."+r)}let l=a&&N.g?N.g:null;return a&&(N.g=N[r]),((d,u,x,m)=>{m?u.data=u.data.replace(m,d):u.data.indexOf(d)===-1&&(u.data=x?d+u.data:u.data+d)})(N[r],t,i,l),r},Ce=(e,t,a)=>e.reduce((i,o,n)=>{let r=t[n];if(r&&r.call){let l=r(a),d=l&&l.props&&l.props.className||/^go/.test(l)&&l;r=d?"."+d:l&&typeof l=="object"?l.props?"":k(l,""):l===!1?"":l}return i+o+(r??"")},"");function T(e){let t=this||{},a=e.call?e(t.p):e;return De(a.unshift?a.raw?Ce(a,[].slice.call(arguments,1),t.p):a.reduce((i,o)=>Object.assign(i,o&&o.call?o(t.p):o),{}):a,ke(t.target),t.g,t.o,t.k)}let Q,M,F;T.bind({g:1});let E=T.bind({k:1});function Pe(e,t,a,i){k.p=t,Q=e,M=a,F=i}function I(e,t){let a=this||{};return function(){let i=arguments;function o(n,r){let l=Object.assign({},n),d=l.className||o.className;a.p=Object.assign({theme:M&&M()},l),a.o=/ *go\d+/.test(d),l.className=T.apply(a,i)+(d?" "+d:""),t&&(l.ref=r);let u=e;return e[0]&&(u=l.as||e,delete l.as),F&&u[0]&&F(l),Q(u,l)}return t?t(o):o}}var Re=e=>typeof e=="function",_=(e,t)=>Re(e)?e(t):e,Se=(()=>{let e=0;return()=>(++e).toString()})(),G=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),_e=20,B="default",X=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(r=>r.id===t.toast.id?{...r,...t.toast}:r)};case 2:let{toast:i}=t;return X(e,{type:e.toasts.find(r=>r.id===i.id)?1:0,toast:i});case 3:let{toastId:o}=t;return{...e,toasts:e.toasts.map(r=>r.id===o||o===void 0?{...r,dismissed:!0,visible:!1}:r)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(r=>r.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let n=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(r=>({...r,pauseDuration:r.pauseDuration+n}))}}},S=[],ee={toasts:[],pausedAt:void 0,settings:{toastLimit:_e}},j={},te=(e,t=B)=>{j[t]=X(j[t]||ee,e),S.forEach(([a,i])=>{a===t&&i(j[t])})},se=e=>Object.keys(j).forEach(t=>te(e,t)),Ae=e=>Object.keys(j).find(t=>j[t].toasts.some(a=>a.id===e)),L=(e=B)=>t=>{te(t,e)},Te={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},Le=(e={},t=B)=>{let[a,i]=c.useState(j[t]||ee),o=c.useRef(j[t]);c.useEffect(()=>(o.current!==j[t]&&i(j[t]),S.push([t,i]),()=>{let r=S.findIndex(([l])=>l===t);r>-1&&S.splice(r,1)}),[t]);let n=a.toasts.map(r=>{var l,d,u;return{...e,...e[r.type],...r,removeDelay:r.removeDelay||((l=e[r.type])==null?void 0:l.removeDelay)||(e==null?void 0:e.removeDelay),duration:r.duration||((d=e[r.type])==null?void 0:d.duration)||(e==null?void 0:e.duration)||Te[r.type],style:{...e.style,...(u=e[r.type])==null?void 0:u.style,...r.style}}});return{...a,toasts:n}},ze=(e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(a==null?void 0:a.id)||Se()}),C=e=>(t,a)=>{let i=ze(t,e,a);return L(i.toasterId||Ae(i.id))({type:2,toast:i}),i.id},h=(e,t)=>C("blank")(e,t);h.error=C("error");h.success=C("success");h.loading=C("loading");h.custom=C("custom");h.dismiss=(e,t)=>{let a={type:3,toastId:e};t?L(t)(a):se(a)};h.dismissAll=e=>h.dismiss(void 0,e);h.remove=(e,t)=>{let a={type:4,toastId:e};t?L(t)(a):se(a)};h.removeAll=e=>h.remove(void 0,e);h.promise=(e,t,a)=>{let i=h.loading(t.loading,{...a,...a==null?void 0:a.loading});return typeof e=="function"&&(e=e()),e.then(o=>{let n=t.success?_(t.success,o):void 0;return n?h.success(n,{id:i,...a,...a==null?void 0:a.success}):h.dismiss(i),o}).catch(o=>{let n=t.error?_(t.error,o):void 0;n?h.error(n,{id:i,...a,...a==null?void 0:a.error}):h.dismiss(i)}),e};var Me=1e3,Fe=(e,t="default")=>{let{toasts:a,pausedAt:i}=Le(e,t),o=c.useRef(new Map).current,n=c.useCallback((m,f=Me)=>{if(o.has(m))return;let y=setTimeout(()=>{o.delete(m),r({type:4,toastId:m})},f);o.set(m,y)},[]);c.useEffect(()=>{if(i)return;let m=Date.now(),f=a.map(y=>{if(y.duration===1/0)return;let O=(y.duration||0)+y.pauseDuration-(m-y.createdAt);if(O<0){y.visible&&h.dismiss(y.id);return}return setTimeout(()=>h.dismiss(y.id,t),O)});return()=>{f.forEach(y=>y&&clearTimeout(y))}},[a,i,t]);let r=c.useCallback(L(t),[t]),l=c.useCallback(()=>{r({type:5,time:Date.now()})},[r]),d=c.useCallback((m,f)=>{r({type:1,toast:{id:m,height:f}})},[r]),u=c.useCallback(()=>{i&&r({type:6,time:Date.now()})},[i,r]),x=c.useCallback((m,f)=>{let{reverseOrder:y=!1,gutter:O=8,defaultPosition:p}=f||{},w=a.filter(b=>(b.position||p)===(m.position||p)&&b.height),v=w.findIndex(b=>b.id===m.id),g=w.filter((b,D)=>D<v&&b.visible).length;return w.filter(b=>b.visible).slice(...y?[g+1]:[0,g]).reduce((b,D)=>b+(D.height||0)+O,0)},[a]);return c.useEffect(()=>{a.forEach(m=>{if(m.dismissed)n(m.id,m.removeDelay);else{let f=o.get(m.id);f&&(clearTimeout(f),o.delete(m.id))}})},[a,n]),{toasts:a,handlers:{updateHeight:d,startPause:l,endPause:u,calculateOffset:x}}},Be=E`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,He=E`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Ue=E`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,qe=I("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Be} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${He} 0.15s ease-out forwards;
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
    animation: ${Ue} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,Ke=E`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,We=I("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${Ke} 1s linear infinite;
`,Ye=E`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Je=E`
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
}`,Ve=I("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Ye} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Je} 0.2s ease-out forwards;
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
`,Ze=I("div")`
  position: absolute;
`,Qe=I("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Ge=E`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Xe=I("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Ge} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,et=({toast:e})=>{let{icon:t,type:a,iconTheme:i}=e;return t!==void 0?typeof t=="string"?c.createElement(Xe,null,t):t:a==="blank"?null:c.createElement(Qe,null,c.createElement(We,{...i}),a!=="loading"&&c.createElement(Ze,null,a==="error"?c.createElement(qe,{...i}):c.createElement(Ve,{...i})))},tt=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,st=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,at="0%{opacity:0;} 100%{opacity:1;}",rt="0%{opacity:1;} 100%{opacity:0;}",it=I("div")`
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
`,ot=I("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,nt=(e,t)=>{let a=e.includes("top")?1:-1,[i,o]=G()?[at,rt]:[tt(a),st(a)];return{animation:t?`${E(i)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${E(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},lt=c.memo(({toast:e,position:t,style:a,children:i})=>{let o=e.height?nt(e.position||t||"top-center",e.visible):{opacity:0},n=c.createElement(et,{toast:e}),r=c.createElement(ot,{...e.ariaProps},_(e.message,e));return c.createElement(it,{className:e.className,style:{...o,...a,...e.style}},typeof i=="function"?i({icon:n,message:r}):c.createElement(c.Fragment,null,n,r))});Pe(c.createElement);var ct=({id:e,className:t,style:a,onHeightUpdate:i,children:o})=>{let n=c.useCallback(r=>{if(r){let l=()=>{let d=r.getBoundingClientRect().height;i(e,d)};l(),new MutationObserver(l).observe(r,{subtree:!0,childList:!0,characterData:!0})}},[e,i]);return c.createElement("div",{ref:n,className:t,style:a},o)},dt=(e,t)=>{let a=e.includes("top"),i=a?{top:0}:{bottom:0},o=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:G()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(a?1:-1)}px)`,...i,...o}},mt=T`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,R=16,ut=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:i,children:o,toasterId:n,containerStyle:r,containerClassName:l})=>{let{toasts:d,handlers:u}=Fe(a,n);return c.createElement("div",{"data-rht-toaster":n||"",style:{position:"fixed",zIndex:9999,top:R,left:R,right:R,bottom:R,pointerEvents:"none",...r},className:l,onMouseEnter:u.startPause,onMouseLeave:u.endPause},d.map(x=>{let m=x.position||t,f=u.calculateOffset(x,{reverseOrder:e,gutter:i,defaultPosition:t}),y=dt(m,f);return c.createElement(ct,{id:x.id,key:x.id,onHeightUpdate:u.updateHeight,className:x.visible?mt:"",style:y},x.type==="custom"?_(x.message,x):o?o(x):c.createElement(lt,{toast:x,position:m}))}))};const pt=()=>s.jsxs("div",{className:"min-h-screen mystical-bg relative overflow-hidden",children:[s.jsxs("div",{className:"absolute inset-0 opacity-20",children:[s.jsx("div",{className:"absolute top-1/4 left-1/4 w-32 h-32 bg-mystical-purple rounded-full blur-3xl animate-pulse"}),s.jsx("div",{className:"absolute top-3/4 right-1/4 w-48 h-48 bg-mystical-gold rounded-full blur-3xl animate-pulse delay-1000"}),s.jsx("div",{className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse delay-2000"})]}),s.jsxs("div",{className:"container mx-auto px-4 py-8 relative z-10",children:[s.jsxs($.div,{initial:{opacity:0,y:30},animate:{opacity:1,y:0},transition:{duration:.8},className:"text-center mb-12",children:[s.jsx("div",{className:"flex justify-center mb-8",children:s.jsxs("div",{className:"relative",children:[s.jsx("div",{className:"w-20 h-20 bg-gradient-to-br from-mystical-purple to-mystical-gold rounded-full flex items-center justify-center animate-float",children:s.jsx("span",{className:"text-3xl",children:"📜"})}),s.jsx(q,{className:"w-6 h-6 text-mystical-gold absolute -top-1 -right-1 animate-sparkle"})]})}),s.jsx("h1",{className:"text-4xl md:text-6xl font-bold text-gradient mb-4",children:"八字命理"}),s.jsx("p",{className:"text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed mb-2",children:"基于古老八字智慧，结合现代AI技术"}),s.jsx("p",{className:"text-sm text-gray-400 max-w-2xl mx-auto",children:"解析您的生辰八字，揭示性格特质、事业运势、感情婚姻与健康状况"})]}),s.jsx($.div,{initial:{opacity:0,y:30},animate:{opacity:1,y:0},transition:{delay:.4,duration:.8},className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12",children:[{icon:s.jsx(de,{className:"w-8 h-8"}),title:"性格分析",desc:"深度解析您的性格特质与内心世界"},{icon:s.jsx(q,{className:"w-8 h-8"}),title:"事业运势",desc:"预知事业发展趋势与最佳时机"},{icon:s.jsx(me,{className:"w-8 h-8"}),title:"感情婚姻",desc:"分析情感运势与婚姻缘分"},{icon:s.jsx(ue,{className:"w-8 h-8"}),title:"健康状况",desc:"了解身体状况与养生建议"}].map((e,t)=>s.jsxs($.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.6+t*.1},className:"card-glass p-6 text-center group hover:scale-105 transition-transform duration-300",children:[s.jsx("div",{className:"w-16 h-16 bg-gradient-to-br from-mystical-purple to-mystical-gold rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-float",children:s.jsx("div",{className:"text-white",children:e.icon})}),s.jsx("h3",{className:"text-lg font-semibold text-white mb-2",children:e.title}),s.jsx("p",{className:"text-gray-400 text-sm leading-relaxed",children:e.desc})]},t))}),s.jsx($.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},transition:{delay:1,duration:.8},className:"text-center",children:s.jsxs("div",{className:"card-glass p-8 md:p-12 max-w-2xl mx-auto",children:[s.jsxs("div",{className:"mb-6",children:[s.jsx(pe,{className:"w-12 h-12 text-mystical-gold mx-auto mb-4 animate-float"}),s.jsx(xe,{className:"w-6 h-6 text-mystical-purple absolute transform translate-x-6 -translate-y-2 animate-sparkle"})]}),s.jsx("h2",{className:"text-2xl md:text-3xl font-semibold text-white mb-4",children:"开始您的八字命理之旅"}),s.jsxs("p",{className:"text-gray-400 mb-8 leading-relaxed",children:["只需提供您的出生日期和时间，",s.jsx("br",{}),"AI将为您进行专业的八字分析，",s.jsx("br",{}),"揭示您命运中的无限可能"]}),s.jsx(oe,{to:"/fortune/bazi",children:s.jsxs($.button,{whileHover:{scale:1.05},whileTap:{scale:.95},className:"btn-mystical text-lg px-8 py-4 group",children:[s.jsx("span",{children:"开始占卜"}),s.jsx(fe,{className:"w-5 h-5 ml-2 group-hover:animate-sparkle"})]})}),s.jsx("div",{className:"mt-6 text-xs text-gray-500",children:"💡 提示：支持多种日期格式，如 1990.05.15 或 1990年5月15日"})]})}),s.jsx($.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:1.5},className:"text-center mt-12",children:s.jsxs("div",{className:"flex justify-center space-x-8 text-gray-500",children:[s.jsxs("div",{className:"flex items-center space-x-2",children:[s.jsx("div",{className:"w-2 h-2 bg-mystical-purple rounded-full animate-pulse"}),s.jsx("span",{className:"text-sm",children:"传统智慧"})]}),s.jsxs("div",{className:"flex items-center space-x-2",children:[s.jsx("div",{className:"w-2 h-2 bg-mystical-gold rounded-full animate-pulse delay-500"}),s.jsx("span",{className:"text-sm",children:"现代科技"})]}),s.jsxs("div",{className:"flex items-center space-x-2",children:[s.jsx("div",{className:"w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-1000"}),s.jsx("span",{className:"text-sm",children:"精准分析"})]})]})})]})]}),xt=({fortuneType:e,fortuneName:t})=>{const a=Y(),[i,o]=c.useState([]),[n,r]=c.useState(""),[l,d]=c.useState(!1),u=c.useRef(null),x=()=>{var p;(p=u.current)==null||p.scrollIntoView({behavior:"smooth"})};c.useEffect(()=>{x()},[i]),c.useEffect(()=>{let p=`您好！我是${t}AI占卜师。请输入您的问题，我会为您提供专业的占卜分析和建议。`;e==="bazi"&&(p="您好！我是八字命理AI占卜师。要进行准确的八字分析，请先提供您的出生日期（格式：1990.05.15 或 1990年5月15日），确认后会为您进行专业分析。"),o([{id:"1",type:"ai",content:p,timestamp:new Date}])},[t,e]);const m=async()=>{var w;if(!n.trim()||l)return;const p={id:Date.now().toString(),type:"user",content:n.trim(),timestamp:new Date};o(v=>[...v,p]),r(""),d(!0);try{const v=f(n.trim());console.log("🔍 前端提取出生信息:",{inputText:n.trim(),birthInfo:v});const g={question:n.trim(),type:e,context:i.slice(-6).map(P=>`${P.type==="user"?"用户":"占卜师"}: ${P.content}`).join(`
`),sessionId:`session-${Date.now()}`};v?(g.birthInfo=v,console.log("✅ 添加birthInfo到请求:",v)):console.log("⚠️ 未提取到birthInfo，发送的请求体:",g);const D=await(await fetch("/api/fortune/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(g)})).json();let H=D.response||((w=D.result)==null?void 0:w.prediction)||"抱歉，我现在无法提供占卜服务，请稍后再试。";e==="bazi"&&D.hasBaziData===!1&&(H="要进行准确的八字分析，请提供您的出生日期（格式：1990.05.15 或 1990年5月15日），这样我才能为您进行专业的命理分析。");const ae={id:(Date.now()+1).toString(),type:"ai",content:H,timestamp:new Date};o(P=>[...P,ae])}catch{const g={id:(Date.now()+1).toString(),type:"ai",content:"抱歉，网络连接有问题，请检查网络后重试。",timestamp:new Date};o(b=>[...b,g])}finally{d(!1)}},f=p=>{const w=[/(\d{4})[年./](\d{1,2})[月./](\d{1,2})/,/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})/];for(const v of w){const g=p.match(v);if(g)return{year:parseInt(g[1]),month:parseInt(g[2]),day:parseInt(g[3]),hour:0,minute:0}}return null},y=p=>{p.key==="Enter"&&!p.shiftKey&&(p.preventDefault(),m())},O=p=>p.toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",hour12:!1});return s.jsxs("div",{className:"flex flex-col h-screen bg-gray-50",children:[s.jsxs("div",{className:"bg-white border-b border-gray-200 px-4 py-3 flex items-center",children:[s.jsx("button",{onClick:()=>a("/"),className:"mr-3 p-1 text-gray-600 hover:text-gray-800",children:s.jsx(ye,{className:"w-6 h-6"})}),s.jsxs("h1",{className:"text-lg font-semibold text-gray-800",children:[t,"占卜师"]})]}),s.jsxs("div",{className:"flex-1 overflow-y-auto p-4 space-y-4",children:[s.jsx(he,{children:i.map(p=>s.jsx($.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},className:`flex ${p.type==="user"?"justify-end":"justify-start"}`,children:s.jsxs("div",{className:`max-w-xs lg:max-w-md ${p.type==="user"?"order-2":"order-1"}`,children:[s.jsx("div",{className:`text-xs text-gray-500 mb-1 ${p.type==="user"?"text-right":"text-left"}`,children:O(p.timestamp)}),s.jsx("div",{className:`px-4 py-2 rounded-2xl ${p.type==="user"?"bg-green-500 text-white rounded-br-sm":"bg-white text-gray-800 border border-gray-200 rounded-bl-sm"}`,children:s.jsx("p",{className:"text-sm leading-relaxed whitespace-pre-wrap",children:p.content})})]})},p.id))}),l&&s.jsx($.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"flex justify-start",children:s.jsxs("div",{className:"max-w-xs lg:max-w-md",children:[s.jsx("div",{className:"text-xs text-gray-500 mb-1",children:O(new Date)}),s.jsx("div",{className:"px-4 py-2 rounded-2xl rounded-bl-sm bg-white border border-gray-200",children:s.jsxs("div",{className:"flex space-x-1",children:[s.jsx("div",{className:"w-2 h-2 bg-gray-400 rounded-full animate-bounce"}),s.jsx("div",{className:"w-2 h-2 bg-gray-400 rounded-full animate-bounce",style:{animationDelay:"0.1s"}}),s.jsx("div",{className:"w-2 h-2 bg-gray-400 rounded-full animate-bounce",style:{animationDelay:"0.2s"}})]})})]})}),s.jsx("div",{ref:u})]}),s.jsx("div",{className:"bg-white border-t border-gray-200 px-4 py-3",children:s.jsxs("div",{className:"flex items-end space-x-3",children:[s.jsx("div",{className:"flex-1",children:s.jsx("textarea",{value:n,onChange:p=>r(p.target.value),onKeyPress:y,placeholder:"输入您的问题...",className:"w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent",rows:1,style:{minHeight:"40px",maxHeight:"120px"}})}),s.jsx("button",{onClick:m,disabled:!n.trim()||l,className:"px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors",children:s.jsx(ge,{className:"w-5 h-5"})})]})})]})},ft=()=>{const{type:e}=ne(),t=Y(),a=i=>({tarot:"塔罗占卜",bazi:"八字命理",astrology:"星座占星",numerology:"数字命理"})[i||"tarot"]||"塔罗占卜";return e?s.jsx(xt,{fortuneType:e,fortuneName:a(e)}):(t("/"),null)};function yt(){return s.jsx(le,{children:s.jsxs("div",{className:"App",children:[s.jsxs(ce,{children:[s.jsx(U,{path:"/",element:s.jsx(pt,{})}),s.jsx(U,{path:"/fortune/:type",element:s.jsx(ft,{})})]}),s.jsx(ut,{position:"top-right",toastOptions:{duration:4e3,style:{background:"rgba(31, 41, 55, 0.9)",color:"#fff",border:"1px solid rgba(139, 92, 246, 0.3)",borderRadius:"8px"},success:{iconTheme:{primary:"#10B981",secondary:"#fff"}},error:{iconTheme:{primary:"#EF4444",secondary:"#fff"}}}})]})})}z.createRoot(document.getElementById("root")).render(s.jsx(ie.StrictMode,{children:s.jsx(yt,{})}));
