import{r as c,b as de,a as me}from"./vendor-92c95717.js";import{L as ue,u as X,a as pe,B as fe,R as xe,b as V}from"./router-ec4264b0.js";import{m as D,S as Z,U as he,C as ge,M as ye,a as be,b as ve,c as je,A as we,d as Ne,e as Ie}from"./ui-d1ac6027.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function s(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(i){if(i.ep)return;i.ep=!0;const n=s(i);fetch(i.href,n)}})();var ee={exports:{}},B={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ee=c,$e=Symbol.for("react.element"),ke=Symbol.for("react.fragment"),Oe=Object.prototype.hasOwnProperty,Ce=Ee.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,De={key:!0,ref:!0,__self:!0,__source:!0};function te(e,t,s){var o,i={},n=null,r=null;s!==void 0&&(n=""+s),t.key!==void 0&&(n=""+t.key),t.ref!==void 0&&(r=t.ref);for(o in t)Oe.call(t,o)&&!De.hasOwnProperty(o)&&(i[o]=t[o]);if(e&&e.defaultProps)for(o in t=e.defaultProps,t)i[o]===void 0&&(i[o]=t[o]);return{$$typeof:$e,type:e,key:n,ref:r,props:i,_owner:Ce.current}}B.Fragment=ke;B.jsx=te;B.jsxs=te;ee.exports=B;var a=ee.exports,K={},Q=de;K.createRoot=Q.createRoot,K.hydrateRoot=Q.hydrateRoot;let Se={data:""},Re=e=>{if(typeof window=="object"){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||Se},Pe=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,Ae=/\/\*[^]*?\*\/|  +/g,G=/\n+/g,S=(e,t)=>{let s="",o="",i="";for(let n in e){let r=e[n];n[0]=="@"?n[1]=="i"?s=n+" "+r+";":o+=n[1]=="f"?S(r,n):n+"{"+S(r,n[1]=="k"?"":t)+"}":typeof r=="object"?o+=S(r,t?t.replace(/([^,])+/g,l=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,d=>/&/.test(d)?d.replace(/&/g,l):l?l+" "+d:d)):n):r!=null&&(n=/^--/.test(n)?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),i+=S.p?S.p(n,r):n+":"+r+";")}return s+(t&&i?t+"{"+i+"}":i)+o},$={},se=e=>{if(typeof e=="object"){let t="";for(let s in e)t+=s+se(e[s]);return t}return e},_e=(e,t,s,o,i)=>{let n=se(e),r=$[n]||($[n]=(d=>{let p=0,f=11;for(;p<d.length;)f=101*f+d.charCodeAt(p++)>>>0;return"go"+f})(n));if(!$[r]){let d=n!==e?e:(p=>{let f,u,x=[{}];for(;f=Pe.exec(p.replace(Ae,""));)f[4]?x.shift():f[3]?(u=f[3].replace(G," ").trim(),x.unshift(x[0][u]=x[0][u]||{})):x[0][f[1]]=f[2].replace(G," ").trim();return x[0]})(e);$[r]=S(i?{["@keyframes "+r]:d}:d,s?"":"."+r)}let l=s&&$.g?$.g:null;return s&&($.g=$[r]),((d,p,f,u)=>{u?p.data=p.data.replace(u,d):p.data.indexOf(d)===-1&&(p.data=f?d+p.data:p.data+d)})($[r],t,o,l),r},Te=(e,t,s)=>e.reduce((o,i,n)=>{let r=t[n];if(r&&r.call){let l=r(s),d=l&&l.props&&l.props.className||/^go/.test(l)&&l;r=d?"."+d:l&&typeof l=="object"?l.props?"":S(l,""):l===!1?"":l}return o+i+(r??"")},"");function F(e){let t=this||{},s=e.call?e(t.p):e;return _e(s.unshift?s.raw?Te(s,[].slice.call(arguments,1),t.p):s.reduce((o,i)=>Object.assign(o,i&&i.call?i(t.p):i),{}):s,Re(t.target),t.g,t.o,t.k)}let ae,U,q;F.bind({g:1});let k=F.bind({k:1});function Le(e,t,s,o){S.p=t,ae=e,U=s,q=o}function R(e,t){let s=this||{};return function(){let o=arguments;function i(n,r){let l=Object.assign({},n),d=l.className||i.className;s.p=Object.assign({theme:U&&U()},l),s.o=/ *go\d+/.test(d),l.className=F.apply(s,o)+(d?" "+d:""),t&&(l.ref=r);let p=e;return e[0]&&(p=l.as||e,delete l.as),q&&p[0]&&q(l),ae(p,l)}return t?t(i):i}}var Me=e=>typeof e=="function",z=(e,t)=>Me(e)?e(t):e,ze=(()=>{let e=0;return()=>(++e).toString()})(),re=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),Be=20,Y="default",oe=(e,t)=>{let{toastLimit:s}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,s)};case 1:return{...e,toasts:e.toasts.map(r=>r.id===t.toast.id?{...r,...t.toast}:r)};case 2:let{toast:o}=t;return oe(e,{type:e.toasts.find(r=>r.id===o.id)?1:0,toast:o});case 3:let{toastId:i}=t;return{...e,toasts:e.toasts.map(r=>r.id===i||i===void 0?{...r,dismissed:!0,visible:!1}:r)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(r=>r.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let n=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(r=>({...r,pauseDuration:r.pauseDuration+n}))}}},M=[],ie={toasts:[],pausedAt:void 0,settings:{toastLimit:Be}},E={},ne=(e,t=Y)=>{E[t]=oe(E[t]||ie,e),M.forEach(([s,o])=>{s===t&&o(E[t])})},le=e=>Object.keys(E).forEach(t=>ne(e,t)),Fe=e=>Object.keys(E).find(t=>E[t].toasts.some(s=>s.id===e)),H=(e=Y)=>t=>{ne(t,e)},He={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},Ke=(e={},t=Y)=>{let[s,o]=c.useState(E[t]||ie),i=c.useRef(E[t]);c.useEffect(()=>(i.current!==E[t]&&o(E[t]),M.push([t,o]),()=>{let r=M.findIndex(([l])=>l===t);r>-1&&M.splice(r,1)}),[t]);let n=s.toasts.map(r=>{var l,d,p;return{...e,...e[r.type],...r,removeDelay:r.removeDelay||((l=e[r.type])==null?void 0:l.removeDelay)||(e==null?void 0:e.removeDelay),duration:r.duration||((d=e[r.type])==null?void 0:d.duration)||(e==null?void 0:e.duration)||He[r.type],style:{...e.style,...(p=e[r.type])==null?void 0:p.style,...r.style}}});return{...s,toasts:n}},Ue=(e,t="blank",s)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...s,id:(s==null?void 0:s.id)||ze()}),T=e=>(t,s)=>{let o=Ue(t,e,s);return H(o.toasterId||Fe(o.id))({type:2,toast:o}),o.id},v=(e,t)=>T("blank")(e,t);v.error=T("error");v.success=T("success");v.loading=T("loading");v.custom=T("custom");v.dismiss=(e,t)=>{let s={type:3,toastId:e};t?H(t)(s):le(s)};v.dismissAll=e=>v.dismiss(void 0,e);v.remove=(e,t)=>{let s={type:4,toastId:e};t?H(t)(s):le(s)};v.removeAll=e=>v.remove(void 0,e);v.promise=(e,t,s)=>{let o=v.loading(t.loading,{...s,...s==null?void 0:s.loading});return typeof e=="function"&&(e=e()),e.then(i=>{let n=t.success?z(t.success,i):void 0;return n?v.success(n,{id:o,...s,...s==null?void 0:s.success}):v.dismiss(o),i}).catch(i=>{let n=t.error?z(t.error,i):void 0;n?v.error(n,{id:o,...s,...s==null?void 0:s.error}):v.dismiss(o)}),e};var qe=1e3,Ye=(e,t="default")=>{let{toasts:s,pausedAt:o}=Ke(e,t),i=c.useRef(new Map).current,n=c.useCallback((u,x=qe)=>{if(i.has(u))return;let y=setTimeout(()=>{i.delete(u),r({type:4,toastId:u})},x);i.set(u,y)},[]);c.useEffect(()=>{if(o)return;let u=Date.now(),x=s.map(y=>{if(y.duration===1/0)return;let P=(y.duration||0)+y.pauseDuration-(u-y.createdAt);if(P<0){y.visible&&v.dismiss(y.id);return}return setTimeout(()=>v.dismiss(y.id,t),P)});return()=>{x.forEach(y=>y&&clearTimeout(y))}},[s,o,t]);let r=c.useCallback(H(t),[t]),l=c.useCallback(()=>{r({type:5,time:Date.now()})},[r]),d=c.useCallback((u,x)=>{r({type:1,toast:{id:u,height:x}})},[r]),p=c.useCallback(()=>{o&&r({type:6,time:Date.now()})},[o,r]),f=c.useCallback((u,x)=>{let{reverseOrder:y=!1,gutter:P=8,defaultPosition:m}=x||{},I=s.filter(h=>(h.position||m)===(u.position||m)&&h.height),g=I.findIndex(h=>h.id===u.id),b=I.filter((h,w)=>w<g&&h.visible).length;return I.filter(h=>h.visible).slice(...y?[b+1]:[0,b]).reduce((h,w)=>h+(w.height||0)+P,0)},[s]);return c.useEffect(()=>{s.forEach(u=>{if(u.dismissed)n(u.id,u.removeDelay);else{let x=i.get(u.id);x&&(clearTimeout(x),i.delete(u.id))}})},[s,n]),{toasts:s,handlers:{updateHeight:d,startPause:l,endPause:p,calculateOffset:f}}},We=k`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,Je=k`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Ve=k`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Ze=R("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${We} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${Je} 0.15s ease-out forwards;
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
    animation: ${Ve} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,Qe=k`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Ge=R("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${Qe} 1s linear infinite;
`,Xe=k`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,et=k`
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
}`,tt=R("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Xe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${et} 0.2s ease-out forwards;
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
`,st=R("div")`
  position: absolute;
`,at=R("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,rt=k`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ot=R("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${rt} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,it=({toast:e})=>{let{icon:t,type:s,iconTheme:o}=e;return t!==void 0?typeof t=="string"?c.createElement(ot,null,t):t:s==="blank"?null:c.createElement(at,null,c.createElement(Ge,{...o}),s!=="loading"&&c.createElement(st,null,s==="error"?c.createElement(Ze,{...o}):c.createElement(tt,{...o})))},nt=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,lt=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,ct="0%{opacity:0;} 100%{opacity:1;}",dt="0%{opacity:1;} 100%{opacity:0;}",mt=R("div")`
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
`,ut=R("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,pt=(e,t)=>{let s=e.includes("top")?1:-1,[o,i]=re()?[ct,dt]:[nt(s),lt(s)];return{animation:t?`${k(o)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${k(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},ft=c.memo(({toast:e,position:t,style:s,children:o})=>{let i=e.height?pt(e.position||t||"top-center",e.visible):{opacity:0},n=c.createElement(it,{toast:e}),r=c.createElement(ut,{...e.ariaProps},z(e.message,e));return c.createElement(mt,{className:e.className,style:{...i,...s,...e.style}},typeof o=="function"?o({icon:n,message:r}):c.createElement(c.Fragment,null,n,r))});Le(c.createElement);var xt=({id:e,className:t,style:s,onHeightUpdate:o,children:i})=>{let n=c.useCallback(r=>{if(r){let l=()=>{let d=r.getBoundingClientRect().height;o(e,d)};l(),new MutationObserver(l).observe(r,{subtree:!0,childList:!0,characterData:!0})}},[e,o]);return c.createElement("div",{ref:n,className:t,style:s},i)},ht=(e,t)=>{let s=e.includes("top"),o=s?{top:0}:{bottom:0},i=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:re()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(s?1:-1)}px)`,...o,...i}},gt=F`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,L=16,yt=({reverseOrder:e,position:t="top-center",toastOptions:s,gutter:o,children:i,toasterId:n,containerStyle:r,containerClassName:l})=>{let{toasts:d,handlers:p}=Ye(s,n);return c.createElement("div",{"data-rht-toaster":n||"",style:{position:"fixed",zIndex:9999,top:L,left:L,right:L,bottom:L,pointerEvents:"none",...r},className:l,onMouseEnter:p.startPause,onMouseLeave:p.endPause},d.map(f=>{let u=f.position||t,x=p.calculateOffset(f,{reverseOrder:e,gutter:o,defaultPosition:t}),y=ht(u,x);return c.createElement(xt,{id:f.id,key:f.id,onHeightUpdate:p.updateHeight,className:f.visible?gt:"",style:y},f.type==="custom"?z(f.message,f):i?i(f):c.createElement(ft,{toast:f,position:u}))}))};const bt=()=>a.jsxs("div",{className:"min-h-screen mystical-bg relative overflow-hidden",children:[a.jsxs("div",{className:"absolute inset-0 opacity-20",children:[a.jsx("div",{className:"absolute top-1/4 left-1/4 w-32 h-32 bg-mystical-purple rounded-full blur-3xl animate-pulse"}),a.jsx("div",{className:"absolute top-3/4 right-1/4 w-48 h-48 bg-mystical-gold rounded-full blur-3xl animate-pulse delay-1000"}),a.jsx("div",{className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse delay-2000"})]}),a.jsxs("div",{className:"container mx-auto px-4 py-8 relative z-10",children:[a.jsxs(D.div,{initial:{opacity:0,y:30},animate:{opacity:1,y:0},transition:{duration:.8},className:"text-center mb-12",children:[a.jsx("div",{className:"flex justify-center mb-8",children:a.jsxs("div",{className:"relative",children:[a.jsx("div",{className:"w-20 h-20 bg-gradient-to-br from-mystical-purple to-mystical-gold rounded-full flex items-center justify-center animate-float",children:a.jsx("span",{className:"text-3xl",children:"📜"})}),a.jsx(Z,{className:"w-6 h-6 text-mystical-gold absolute -top-1 -right-1 animate-sparkle"})]})}),a.jsx("h1",{className:"text-4xl md:text-6xl font-bold text-gradient mb-4",children:"八字命理"}),a.jsx("p",{className:"text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed mb-2",children:"基于古老八字智慧，结合现代AI技术"}),a.jsx("p",{className:"text-sm text-gray-400 max-w-2xl mx-auto",children:"解析您的生辰八字，揭示性格特质、事业运势、感情婚姻与健康状况"})]}),a.jsx(D.div,{initial:{opacity:0,y:30},animate:{opacity:1,y:0},transition:{delay:.4,duration:.8},className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12",children:[{icon:a.jsx(he,{className:"w-8 h-8"}),title:"性格分析",desc:"深度解析您的性格特质与内心世界"},{icon:a.jsx(Z,{className:"w-8 h-8"}),title:"事业运势",desc:"预知事业发展趋势与最佳时机"},{icon:a.jsx(ge,{className:"w-8 h-8"}),title:"感情婚姻",desc:"分析情感运势与婚姻缘分"},{icon:a.jsx(ye,{className:"w-8 h-8"}),title:"健康状况",desc:"了解身体状况与养生建议"}].map((e,t)=>a.jsxs(D.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.6+t*.1},className:"card-glass p-6 text-center group hover:scale-105 transition-transform duration-300",children:[a.jsx("div",{className:"w-16 h-16 bg-gradient-to-br from-mystical-purple to-mystical-gold rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-float",children:a.jsx("div",{className:"text-white",children:e.icon})}),a.jsx("h3",{className:"text-lg font-semibold text-white mb-2",children:e.title}),a.jsx("p",{className:"text-gray-400 text-sm leading-relaxed",children:e.desc})]},t))}),a.jsx(D.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},transition:{delay:1,duration:.8},className:"text-center",children:a.jsxs("div",{className:"card-glass p-8 md:p-12 max-w-2xl mx-auto",children:[a.jsxs("div",{className:"mb-6",children:[a.jsx(be,{className:"w-12 h-12 text-mystical-gold mx-auto mb-4 animate-float"}),a.jsx(ve,{className:"w-6 h-6 text-mystical-purple absolute transform translate-x-6 -translate-y-2 animate-sparkle"})]}),a.jsx("h2",{className:"text-2xl md:text-3xl font-semibold text-white mb-4",children:"开始您的八字命理之旅"}),a.jsxs("p",{className:"text-gray-400 mb-8 leading-relaxed",children:["只需提供您的出生日期和时间，",a.jsx("br",{}),"AI将为您进行专业的八字分析，",a.jsx("br",{}),"揭示您命运中的无限可能"]}),a.jsx(ue,{to:"/fortune/bazi",children:a.jsxs(D.button,{whileHover:{scale:1.05},whileTap:{scale:.95},className:"btn-mystical text-lg px-8 py-4 group",children:[a.jsx("span",{children:"开始占卜"}),a.jsx(je,{className:"w-5 h-5 ml-2 group-hover:animate-sparkle"})]})}),a.jsx("div",{className:"mt-6 text-xs text-gray-500",children:"💡 提示：支持多种日期格式，如 1990.05.15 或 1990年5月15日"})]})}),a.jsx(D.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:1.5},className:"text-center mt-12",children:a.jsxs("div",{className:"flex justify-center space-x-8 text-gray-500",children:[a.jsxs("div",{className:"flex items-center space-x-2",children:[a.jsx("div",{className:"w-2 h-2 bg-mystical-purple rounded-full animate-pulse"}),a.jsx("span",{className:"text-sm",children:"传统智慧"})]}),a.jsxs("div",{className:"flex items-center space-x-2",children:[a.jsx("div",{className:"w-2 h-2 bg-mystical-gold rounded-full animate-pulse delay-500"}),a.jsx("span",{className:"text-sm",children:"现代科技"})]}),a.jsxs("div",{className:"flex items-center space-x-2",children:[a.jsx("div",{className:"w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-1000"}),a.jsx("span",{className:"text-sm",children:"精准分析"})]})]})})]})]}),vt=({fortuneType:e,fortuneName:t})=>{const s=X(),[o,i]=c.useState([]),[n,r]=c.useState(""),[l,d]=c.useState(!1),p=c.useRef(null),f=()=>{var m;(m=p.current)==null||m.scrollIntoView({behavior:"smooth"})};c.useEffect(()=>{f()},[o]),c.useEffect(()=>{let m=`您好！我是${t}AI占卜师。请输入您的问题，我会为您提供专业的占卜分析和建议。`;e==="bazi"&&(m="您好！我是八字命理AI占卜师。要进行准确的八字分析，请先提供您的出生日期（格式：1990.05.15 或 1990年5月15日），确认后会为您进行专业分析。"),i([{id:"1",type:"ai",content:m,timestamp:new Date}])},[t,e]);const u=async()=>{var I;if(!n.trim()||l)return;const m={id:Date.now().toString(),type:"user",content:n.trim(),timestamp:new Date};i(g=>[...g,m]),r(""),d(!0);try{const g=x(n.trim());console.log("🔍 前端提取出生信息:",{inputText:n.trim(),birthInfo:g});const b={question:n.trim(),type:e,context:o.slice(-6).map(j=>`${j.type==="user"?"用户":"占卜师"}: ${j.content}`).join(`
`),sessionId:`session-${Date.now()}`},h=jt(m.content,b.context);if(console.log("🔍 是否为关系分析请求:",h),h){console.log("💑 检测到关系分析请求，准备双人出生信息");let j=null;if(g)j=g,console.log("✅ 使用当前消息提取的birthInfo作为self:",j);else{const A=o.slice(-20).filter(_=>_.type==="user");for(const _ of A){const J=x(_.content);if(J){j=J,console.log("✅ 从历史用户消息中找到自己的出生信息:",j);break}}}let O=wt(m.content);O&&console.log("✅ 提取对方的出生数据:",O);const C={};j&&(C.self=j),O&&(C.other=O),Object.keys(C).length>0?(b.birthInfos=C,delete b.birthInfo,console.log("✅ 添加birthInfos到请求:",C),console.log("🗑️ 删除单独的birthInfo字段，避免覆盖逻辑")):(console.log("⚠️ 未找到双人出生信息，尝试单人分析"),g&&(b.birthInfo=g,console.log("✅ 回退：添加birthInfo到请求:",g)))}else{let j=null;if(!g){console.log("🔍 当前消息未提取到出生信息，尝试从用户消息中查找");const C=o.slice(-10).filter(A=>A.type==="user");if(C.length>0){const A=C.map(_=>_.content).join(" ");j=x(A),console.log("🔍 从用户消息中提取的出生信息:",j)}else console.log("⚠️ 没有找到用户消息，无法从上下文提取出生信息")}const O=g||j;O?(b.birthInfo=O,console.log("✅ 添加birthInfo到请求:",{source:g?"当前消息":"上下文",birthInfo:O})):console.log("⚠️ 未提取到birthInfo，发送的请求体:",b)}const N=await(await fetch("/api/fortune/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)})).json();let W=N.response||((I=N.result)==null?void 0:I.prediction)||"抱歉，我现在无法提供占卜服务，请稍后再试。";e==="bazi"&&N.hasBaziData===!1&&(W="要进行准确的八字分析，请提供您的出生日期（格式：1990.05.15 或 1990年5月15日），这样我才能为您进行专业的命理分析。");const ce={id:(Date.now()+1).toString(),type:"ai",content:W,timestamp:new Date};i(j=>[...j,ce])}catch{const b={id:(Date.now()+1).toString(),type:"ai",content:"抱歉，网络连接有问题，请检查网络后重试。",timestamp:new Date};i(h=>[...h,b])}finally{d(!1)}},x=m=>{const I=[/(\d{4})[年./](\d{1,2})[月./](\d{1,2})/,/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})/];console.log("🔍 extractBirthInfo 调用:",{text:m,patterns:I.map(g=>g.toString())});for(const g of I){const b=m.match(g);if(console.log("🔍 正则匹配结果:",{pattern:g.toString(),match:b}),b){const h=parseInt(b[1]),w=parseInt(b[2]),N=parseInt(b[3]);if(console.log("🔍 提取的数值:",{year:h,month:w,day:N}),!isNaN(h)&&!isNaN(w)&&!isNaN(N)&&h>=1900&&h<=2100&&w>=1&&w<=12&&N>=1&&N<=31)return{year:h,month:w,day:N,hour:0,minute:0};console.log("⚠️ 提取的数值无效:",{year:h,month:w,day:N,isNaNYear:isNaN(h),isNaNMonth:isNaN(w),isNaNDay:isNaN(N)})}}return console.log("⚠️ 未找到有效的出生日期"),null},y=m=>{m.key==="Enter"&&!m.shiftKey&&(m.preventDefault(),u())},P=m=>m.toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",hour12:!1});return a.jsxs("div",{className:"flex flex-col h-screen bg-gray-50",children:[a.jsxs("div",{className:"bg-white border-b border-gray-200 px-4 py-3 flex items-center",children:[a.jsx("button",{onClick:()=>s("/"),className:"mr-3 p-1 text-gray-600 hover:text-gray-800",children:a.jsx(we,{className:"w-6 h-6"})}),a.jsxs("h1",{className:"text-lg font-semibold text-gray-800",children:[t,"占卜师"]})]}),a.jsxs("div",{className:"flex-1 overflow-y-auto p-4 space-y-4",children:[a.jsx(Ne,{children:o.map(m=>a.jsx(D.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},className:`flex ${m.type==="user"?"justify-end":"justify-start"}`,children:a.jsxs("div",{className:`max-w-xs lg:max-w-md ${m.type==="user"?"order-2":"order-1"}`,children:[a.jsx("div",{className:`text-xs text-gray-500 mb-1 ${m.type==="user"?"text-right":"text-left"}`,children:P(m.timestamp)}),a.jsx("div",{className:`px-4 py-2 rounded-2xl ${m.type==="user"?"bg-green-500 text-white rounded-br-sm":"bg-white text-gray-800 border border-gray-200 rounded-bl-sm"}`,children:a.jsx("p",{className:"text-sm leading-relaxed whitespace-pre-wrap",children:m.content})})]})},m.id))}),l&&a.jsx(D.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"flex justify-start",children:a.jsxs("div",{className:"max-w-xs lg:max-w-md",children:[a.jsx("div",{className:"text-xs text-gray-500 mb-1",children:P(new Date)}),a.jsx("div",{className:"px-4 py-2 rounded-2xl rounded-bl-sm bg-white border border-gray-200",children:a.jsxs("div",{className:"flex space-x-1",children:[a.jsx("div",{className:"w-2 h-2 bg-gray-400 rounded-full animate-bounce"}),a.jsx("div",{className:"w-2 h-2 bg-gray-400 rounded-full animate-bounce",style:{animationDelay:"0.1s"}}),a.jsx("div",{className:"w-2 h-2 bg-gray-400 rounded-full animate-bounce",style:{animationDelay:"0.2s"}})]})})]})}),a.jsx("div",{ref:p})]}),a.jsx("div",{className:"bg-white border-t border-gray-200 px-4 py-3",children:a.jsxs("div",{className:"flex items-end space-x-3",children:[a.jsx("div",{className:"flex-1",children:a.jsx("textarea",{value:n,onChange:m=>r(m.target.value),onKeyPress:y,placeholder:"输入您的问题...",className:"w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent",rows:1,style:{minHeight:"40px",maxHeight:"120px"}})}),a.jsx("button",{onClick:u,disabled:!n.trim()||l,className:"px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors",children:a.jsx(Ie,{className:"w-5 h-5"})})]})})]})};function jt(e,t){const s=["喜欢","爱","感情","恋爱","婚姻","配偶","对象","男朋友","女朋友","结婚","缘分","合婚","配对","两个人","你们","我和他","我和她","对方","恋人","情侣","交往","追求","暗恋","心动","crush"],o=(e+" "+t).toLowerCase();return s.filter(n=>o.includes(n.toLowerCase())).length>0}function wt(e){const t=[/喜欢.*?(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,/爱.*?(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,/一个.*?(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,/(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2}).*?的.*?人/g,/(\d{4})年(\d{1,2})月(\d{1,2})日.*?的.*?人/g,/(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2}).*?(女人|男人|女孩|男孩|女生|男生)/g,/(女人|男人|女孩|男孩|女生|男生).*?(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,/(她|他|对方|那个他|那个她).*?出生.*?(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,/(她|他|对方|那个他|那个她).*?(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,/(\d{4})年(\d{1,2})月(\d{1,2})日.*?出生/g,/出生于.*?(\d{4})年(\d{1,2})月(\d{1,2})日/g];for(const s of t){const o=s.exec(e);if(o){let i,n,r;if(s.source.includes("年")&&s.source.includes("月")&&s.source.includes("日"),i=parseInt(o[1]),n=parseInt(o[2]),r=parseInt(o[3]),i>=1900&&i<=2100&&n>=1&&n<=12&&r>=1&&r<=31)return console.log("✅ 从问题中提取对方出生日期:",{year:i,month:n,day:r}),{year:i,month:n,day:r,hour:0,minute:0,gender:"female",timezone:"Asia/Shanghai"}}}return null}const Nt=()=>{const{type:e}=pe(),t=X(),s=o=>({tarot:"塔罗占卜",bazi:"八字命理",astrology:"星座占星",numerology:"数字命理"})[o||"tarot"]||"塔罗占卜";return e?a.jsx(vt,{fortuneType:e,fortuneName:s(e)}):(t("/"),null)};function It(){return a.jsx(fe,{children:a.jsxs("div",{className:"App",children:[a.jsxs(xe,{children:[a.jsx(V,{path:"/",element:a.jsx(bt,{})}),a.jsx(V,{path:"/fortune/:type",element:a.jsx(Nt,{})})]}),a.jsx(yt,{position:"top-right",toastOptions:{duration:4e3,style:{background:"rgba(31, 41, 55, 0.9)",color:"#fff",border:"1px solid rgba(139, 92, 246, 0.3)",borderRadius:"8px"},success:{iconTheme:{primary:"#10B981",secondary:"#fff"}},error:{iconTheme:{primary:"#EF4444",secondary:"#fff"}}}})]})})}K.createRoot(document.getElementById("root")).render(a.jsx(me.StrictMode,{children:a.jsx(It,{})}));
