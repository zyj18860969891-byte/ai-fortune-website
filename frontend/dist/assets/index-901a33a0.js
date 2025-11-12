import{r as c,b as re,a as ie}from"./vendor-92c95717.js";import{L as oe,u as W,a as ne,B as le,R as ce,b as U}from"./router-ec4264b0.js";import{m as k,S as q,U as de,C as me,M as ue,a as pe,b as fe,c as xe,A as ye,d as he,e as ge}from"./ui-d1ac6027.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function a(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(o){if(o.ep)return;o.ep=!0;const n=a(o);fetch(o.href,n)}})();var J={exports:{}},T={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var be=c,ve=Symbol.for("react.element"),je=Symbol.for("react.fragment"),Ne=Object.prototype.hasOwnProperty,we=be.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Ee={key:!0,ref:!0,__self:!0,__source:!0};function V(e,t,a){var i,o={},n=null,r=null;a!==void 0&&(n=""+a),t.key!==void 0&&(n=""+t.key),t.ref!==void 0&&(r=t.ref);for(i in t)Ne.call(t,i)&&!Ee.hasOwnProperty(i)&&(o[i]=t[i]);if(e&&e.defaultProps)for(i in t=e.defaultProps,t)o[i]===void 0&&(o[i]=t[i]);return{$$typeof:ve,type:e,key:n,ref:r,props:o,_owner:we.current}}T.Fragment=je;T.jsx=V;T.jsxs=V;J.exports=T;var s=J.exports,z={},K=re;z.createRoot=K.createRoot,z.hydrateRoot=K.hydrateRoot;let $e={data:""},Ie=e=>{if(typeof window=="object"){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||$e},ke=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,De=/\/\*[^]*?\*\/|  +/g,Y=/\n+/g,D=(e,t)=>{let a="",i="",o="";for(let n in e){let r=e[n];n[0]=="@"?n[1]=="i"?a=n+" "+r+";":i+=n[1]=="f"?D(r,n):n+"{"+D(r,n[1]=="k"?"":t)+"}":typeof r=="object"?i+=D(r,t?t.replace(/([^,])+/g,l=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,d=>/&/.test(d)?d.replace(/&/g,l):l?l+" "+d:d)):n):r!=null&&(n=/^--/.test(n)?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=D.p?D.p(n,r):n+":"+r+";")}return a+(t&&o?t+"{"+o+"}":o)+i},$={},Z=e=>{if(typeof e=="object"){let t="";for(let a in e)t+=a+Z(e[a]);return t}return e},Oe=(e,t,a,i,o)=>{let n=Z(e),r=$[n]||($[n]=(d=>{let p=0,f=11;for(;p<d.length;)f=101*f+d.charCodeAt(p++)>>>0;return"go"+f})(n));if(!$[r]){let d=n!==e?e:(p=>{let f,m,x=[{}];for(;f=ke.exec(p.replace(De,""));)f[4]?x.shift():f[3]?(m=f[3].replace(Y," ").trim(),x.unshift(x[0][m]=x[0][m]||{})):x[0][f[1]]=f[2].replace(Y," ").trim();return x[0]})(e);$[r]=D(o?{["@keyframes "+r]:d}:d,a?"":"."+r)}let l=a&&$.g?$.g:null;return a&&($.g=$[r]),((d,p,f,m)=>{m?p.data=p.data.replace(m,d):p.data.indexOf(d)===-1&&(p.data=f?d+p.data:p.data+d)})($[r],t,i,l),r},Ce=(e,t,a)=>e.reduce((i,o,n)=>{let r=t[n];if(r&&r.call){let l=r(a),d=l&&l.props&&l.props.className||/^go/.test(l)&&l;r=d?"."+d:l&&typeof l=="object"?l.props?"":D(l,""):l===!1?"":l}return i+o+(r??"")},"");function L(e){let t=this||{},a=e.call?e(t.p):e;return Oe(a.unshift?a.raw?Ce(a,[].slice.call(arguments,1),t.p):a.reduce((i,o)=>Object.assign(i,o&&o.call?o(t.p):o),{}):a,Ie(t.target),t.g,t.o,t.k)}let Q,F,B;L.bind({g:1});let I=L.bind({k:1});function Se(e,t,a,i){D.p=t,Q=e,F=a,B=i}function O(e,t){let a=this||{};return function(){let i=arguments;function o(n,r){let l=Object.assign({},n),d=l.className||o.className;a.p=Object.assign({theme:F&&F()},l),a.o=/ *go\d+/.test(d),l.className=L.apply(a,i)+(d?" "+d:""),t&&(l.ref=r);let p=e;return e[0]&&(p=l.as||e,delete l.as),B&&p[0]&&B(l),Q(p,l)}return t?t(o):o}}var Pe=e=>typeof e=="function",A=(e,t)=>Pe(e)?e(t):e,Re=(()=>{let e=0;return()=>(++e).toString()})(),G=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),_e=20,H="default",X=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(r=>r.id===t.toast.id?{...r,...t.toast}:r)};case 2:let{toast:i}=t;return X(e,{type:e.toasts.find(r=>r.id===i.id)?1:0,toast:i});case 3:let{toastId:o}=t;return{...e,toasts:e.toasts.map(r=>r.id===o||o===void 0?{...r,dismissed:!0,visible:!1}:r)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(r=>r.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let n=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(r=>({...r,pauseDuration:r.pauseDuration+n}))}}},_=[],ee={toasts:[],pausedAt:void 0,settings:{toastLimit:_e}},E={},te=(e,t=H)=>{E[t]=X(E[t]||ee,e),_.forEach(([a,i])=>{a===t&&i(E[t])})},se=e=>Object.keys(E).forEach(t=>te(e,t)),Ae=e=>Object.keys(E).find(t=>E[t].toasts.some(a=>a.id===e)),M=(e=H)=>t=>{te(t,e)},Te={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},Le=(e={},t=H)=>{let[a,i]=c.useState(E[t]||ee),o=c.useRef(E[t]);c.useEffect(()=>(o.current!==E[t]&&i(E[t]),_.push([t,i]),()=>{let r=_.findIndex(([l])=>l===t);r>-1&&_.splice(r,1)}),[t]);let n=a.toasts.map(r=>{var l,d,p;return{...e,...e[r.type],...r,removeDelay:r.removeDelay||((l=e[r.type])==null?void 0:l.removeDelay)||(e==null?void 0:e.removeDelay),duration:r.duration||((d=e[r.type])==null?void 0:d.duration)||(e==null?void 0:e.duration)||Te[r.type],style:{...e.style,...(p=e[r.type])==null?void 0:p.style,...r.style}}});return{...a,toasts:n}},Me=(e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(a==null?void 0:a.id)||Re()}),S=e=>(t,a)=>{let i=Me(t,e,a);return M(i.toasterId||Ae(i.id))({type:2,toast:i}),i.id},g=(e,t)=>S("blank")(e,t);g.error=S("error");g.success=S("success");g.loading=S("loading");g.custom=S("custom");g.dismiss=(e,t)=>{let a={type:3,toastId:e};t?M(t)(a):se(a)};g.dismissAll=e=>g.dismiss(void 0,e);g.remove=(e,t)=>{let a={type:4,toastId:e};t?M(t)(a):se(a)};g.removeAll=e=>g.remove(void 0,e);g.promise=(e,t,a)=>{let i=g.loading(t.loading,{...a,...a==null?void 0:a.loading});return typeof e=="function"&&(e=e()),e.then(o=>{let n=t.success?A(t.success,o):void 0;return n?g.success(n,{id:i,...a,...a==null?void 0:a.success}):g.dismiss(i),o}).catch(o=>{let n=t.error?A(t.error,o):void 0;n?g.error(n,{id:i,...a,...a==null?void 0:a.error}):g.dismiss(i)}),e};var ze=1e3,Fe=(e,t="default")=>{let{toasts:a,pausedAt:i}=Le(e,t),o=c.useRef(new Map).current,n=c.useCallback((m,x=ze)=>{if(o.has(m))return;let h=setTimeout(()=>{o.delete(m),r({type:4,toastId:m})},x);o.set(m,h)},[]);c.useEffect(()=>{if(i)return;let m=Date.now(),x=a.map(h=>{if(h.duration===1/0)return;let C=(h.duration||0)+h.pauseDuration-(m-h.createdAt);if(C<0){h.visible&&g.dismiss(h.id);return}return setTimeout(()=>g.dismiss(h.id,t),C)});return()=>{x.forEach(h=>h&&clearTimeout(h))}},[a,i,t]);let r=c.useCallback(M(t),[t]),l=c.useCallback(()=>{r({type:5,time:Date.now()})},[r]),d=c.useCallback((m,x)=>{r({type:1,toast:{id:m,height:x}})},[r]),p=c.useCallback(()=>{i&&r({type:6,time:Date.now()})},[i,r]),f=c.useCallback((m,x)=>{let{reverseOrder:h=!1,gutter:C=8,defaultPosition:u}=x||{},N=a.filter(y=>(y.position||u)===(m.position||u)&&y.height),v=N.findIndex(y=>y.id===m.id),j=N.filter((y,b)=>b<v&&y.visible).length;return N.filter(y=>y.visible).slice(...h?[j+1]:[0,j]).reduce((y,b)=>y+(b.height||0)+C,0)},[a]);return c.useEffect(()=>{a.forEach(m=>{if(m.dismissed)n(m.id,m.removeDelay);else{let x=o.get(m.id);x&&(clearTimeout(x),o.delete(m.id))}})},[a,n]),{toasts:a,handlers:{updateHeight:d,startPause:l,endPause:p,calculateOffset:f}}},Be=I`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,He=I`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Ue=I`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,qe=O("div")`
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
`,Ke=I`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Ye=O("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${Ke} 1s linear infinite;
`,We=I`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Je=I`
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
}`,Ve=O("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${We} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
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
`,Ze=O("div")`
  position: absolute;
`,Qe=O("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Ge=I`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Xe=O("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Ge} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,et=({toast:e})=>{let{icon:t,type:a,iconTheme:i}=e;return t!==void 0?typeof t=="string"?c.createElement(Xe,null,t):t:a==="blank"?null:c.createElement(Qe,null,c.createElement(Ye,{...i}),a!=="loading"&&c.createElement(Ze,null,a==="error"?c.createElement(qe,{...i}):c.createElement(Ve,{...i})))},tt=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,st=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,at="0%{opacity:0;} 100%{opacity:1;}",rt="0%{opacity:1;} 100%{opacity:0;}",it=O("div")`
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
`,ot=O("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,nt=(e,t)=>{let a=e.includes("top")?1:-1,[i,o]=G()?[at,rt]:[tt(a),st(a)];return{animation:t?`${I(i)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${I(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},lt=c.memo(({toast:e,position:t,style:a,children:i})=>{let o=e.height?nt(e.position||t||"top-center",e.visible):{opacity:0},n=c.createElement(et,{toast:e}),r=c.createElement(ot,{...e.ariaProps},A(e.message,e));return c.createElement(it,{className:e.className,style:{...o,...a,...e.style}},typeof i=="function"?i({icon:n,message:r}):c.createElement(c.Fragment,null,n,r))});Se(c.createElement);var ct=({id:e,className:t,style:a,onHeightUpdate:i,children:o})=>{let n=c.useCallback(r=>{if(r){let l=()=>{let d=r.getBoundingClientRect().height;i(e,d)};l(),new MutationObserver(l).observe(r,{subtree:!0,childList:!0,characterData:!0})}},[e,i]);return c.createElement("div",{ref:n,className:t,style:a},o)},dt=(e,t)=>{let a=e.includes("top"),i=a?{top:0}:{bottom:0},o=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:G()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(a?1:-1)}px)`,...i,...o}},mt=L`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,R=16,ut=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:i,children:o,toasterId:n,containerStyle:r,containerClassName:l})=>{let{toasts:d,handlers:p}=Fe(a,n);return c.createElement("div",{"data-rht-toaster":n||"",style:{position:"fixed",zIndex:9999,top:R,left:R,right:R,bottom:R,pointerEvents:"none",...r},className:l,onMouseEnter:p.startPause,onMouseLeave:p.endPause},d.map(f=>{let m=f.position||t,x=p.calculateOffset(f,{reverseOrder:e,gutter:i,defaultPosition:t}),h=dt(m,x);return c.createElement(ct,{id:f.id,key:f.id,onHeightUpdate:p.updateHeight,className:f.visible?mt:"",style:h},f.type==="custom"?A(f.message,f):o?o(f):c.createElement(lt,{toast:f,position:m}))}))};const pt=()=>s.jsxs("div",{className:"min-h-screen mystical-bg relative overflow-hidden",children:[s.jsxs("div",{className:"absolute inset-0 opacity-20",children:[s.jsx("div",{className:"absolute top-1/4 left-1/4 w-32 h-32 bg-mystical-purple rounded-full blur-3xl animate-pulse"}),s.jsx("div",{className:"absolute top-3/4 right-1/4 w-48 h-48 bg-mystical-gold rounded-full blur-3xl animate-pulse delay-1000"}),s.jsx("div",{className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse delay-2000"})]}),s.jsxs("div",{className:"container mx-auto px-4 py-8 relative z-10",children:[s.jsxs(k.div,{initial:{opacity:0,y:30},animate:{opacity:1,y:0},transition:{duration:.8},className:"text-center mb-12",children:[s.jsx("div",{className:"flex justify-center mb-8",children:s.jsxs("div",{className:"relative",children:[s.jsx("div",{className:"w-20 h-20 bg-gradient-to-br from-mystical-purple to-mystical-gold rounded-full flex items-center justify-center animate-float",children:s.jsx("span",{className:"text-3xl",children:"📜"})}),s.jsx(q,{className:"w-6 h-6 text-mystical-gold absolute -top-1 -right-1 animate-sparkle"})]})}),s.jsx("h1",{className:"text-4xl md:text-6xl font-bold text-gradient mb-4",children:"八字命理"}),s.jsx("p",{className:"text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed mb-2",children:"基于古老八字智慧，结合现代AI技术"}),s.jsx("p",{className:"text-sm text-gray-400 max-w-2xl mx-auto",children:"解析您的生辰八字，揭示性格特质、事业运势、感情婚姻与健康状况"})]}),s.jsx(k.div,{initial:{opacity:0,y:30},animate:{opacity:1,y:0},transition:{delay:.4,duration:.8},className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12",children:[{icon:s.jsx(de,{className:"w-8 h-8"}),title:"性格分析",desc:"深度解析您的性格特质与内心世界"},{icon:s.jsx(q,{className:"w-8 h-8"}),title:"事业运势",desc:"预知事业发展趋势与最佳时机"},{icon:s.jsx(me,{className:"w-8 h-8"}),title:"感情婚姻",desc:"分析情感运势与婚姻缘分"},{icon:s.jsx(ue,{className:"w-8 h-8"}),title:"健康状况",desc:"了解身体状况与养生建议"}].map((e,t)=>s.jsxs(k.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.6+t*.1},className:"card-glass p-6 text-center group hover:scale-105 transition-transform duration-300",children:[s.jsx("div",{className:"w-16 h-16 bg-gradient-to-br from-mystical-purple to-mystical-gold rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-float",children:s.jsx("div",{className:"text-white",children:e.icon})}),s.jsx("h3",{className:"text-lg font-semibold text-white mb-2",children:e.title}),s.jsx("p",{className:"text-gray-400 text-sm leading-relaxed",children:e.desc})]},t))}),s.jsx(k.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},transition:{delay:1,duration:.8},className:"text-center",children:s.jsxs("div",{className:"card-glass p-8 md:p-12 max-w-2xl mx-auto",children:[s.jsxs("div",{className:"mb-6",children:[s.jsx(pe,{className:"w-12 h-12 text-mystical-gold mx-auto mb-4 animate-float"}),s.jsx(fe,{className:"w-6 h-6 text-mystical-purple absolute transform translate-x-6 -translate-y-2 animate-sparkle"})]}),s.jsx("h2",{className:"text-2xl md:text-3xl font-semibold text-white mb-4",children:"开始您的八字命理之旅"}),s.jsxs("p",{className:"text-gray-400 mb-8 leading-relaxed",children:["只需提供您的出生日期和时间，",s.jsx("br",{}),"AI将为您进行专业的八字分析，",s.jsx("br",{}),"揭示您命运中的无限可能"]}),s.jsx(oe,{to:"/fortune/bazi",children:s.jsxs(k.button,{whileHover:{scale:1.05},whileTap:{scale:.95},className:"btn-mystical text-lg px-8 py-4 group",children:[s.jsx("span",{children:"开始占卜"}),s.jsx(xe,{className:"w-5 h-5 ml-2 group-hover:animate-sparkle"})]})}),s.jsx("div",{className:"mt-6 text-xs text-gray-500",children:"💡 提示：支持多种日期格式，如 1990.05.15 或 1990年5月15日"})]})}),s.jsx(k.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:1.5},className:"text-center mt-12",children:s.jsxs("div",{className:"flex justify-center space-x-8 text-gray-500",children:[s.jsxs("div",{className:"flex items-center space-x-2",children:[s.jsx("div",{className:"w-2 h-2 bg-mystical-purple rounded-full animate-pulse"}),s.jsx("span",{className:"text-sm",children:"传统智慧"})]}),s.jsxs("div",{className:"flex items-center space-x-2",children:[s.jsx("div",{className:"w-2 h-2 bg-mystical-gold rounded-full animate-pulse delay-500"}),s.jsx("span",{className:"text-sm",children:"现代科技"})]}),s.jsxs("div",{className:"flex items-center space-x-2",children:[s.jsx("div",{className:"w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-1000"}),s.jsx("span",{className:"text-sm",children:"精准分析"})]})]})})]})]}),ft=({fortuneType:e,fortuneName:t})=>{const a=W(),[i,o]=c.useState([]),[n,r]=c.useState(""),[l,d]=c.useState(!1),p=c.useRef(null),f=()=>{var u;(u=p.current)==null||u.scrollIntoView({behavior:"smooth"})};c.useEffect(()=>{f()},[i]),c.useEffect(()=>{let u=`您好！我是${t}AI占卜师。请输入您的问题，我会为您提供专业的占卜分析和建议。`;e==="bazi"&&(u="您好！我是八字命理AI占卜师。要进行准确的八字分析，请先提供您的出生日期（格式：1990.05.15 或 1990年5月15日），确认后会为您进行专业分析。"),o([{id:"1",type:"ai",content:u,timestamp:new Date}])},[t,e]);const m=async()=>{var N;if(!n.trim()||l)return;const u={id:Date.now().toString(),type:"user",content:n.trim(),timestamp:new Date};o(v=>[...v,u]),r(""),d(!0);try{const v=x(n.trim());console.log("🔍 前端提取出生信息:",{inputText:n.trim(),birthInfo:v});const j={question:n.trim(),type:e,context:i.slice(-6).map(P=>`${P.type==="user"?"用户":"占卜师"}: ${P.content}`).join(`
`),sessionId:`session-${Date.now()}`};v?(j.birthInfo=v,console.log("✅ 添加birthInfo到请求:",v)):console.log("⚠️ 未提取到birthInfo，发送的请求体:",j);const b=await(await fetch("/api/fortune/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(j)})).json();let w=b.response||((N=b.result)==null?void 0:N.prediction)||"抱歉，我现在无法提供占卜服务，请稍后再试。";e==="bazi"&&b.hasBaziData===!1&&(w="要进行准确的八字分析，请提供您的出生日期（格式：1990.05.15 或 1990年5月15日），这样我才能为您进行专业的命理分析。");const ae={id:(Date.now()+1).toString(),type:"ai",content:w,timestamp:new Date};o(P=>[...P,ae])}catch{const j={id:(Date.now()+1).toString(),type:"ai",content:"抱歉，网络连接有问题，请检查网络后重试。",timestamp:new Date};o(y=>[...y,j])}finally{d(!1)}},x=u=>{const N=[/(\d{4})[年./](\d{1,2})[月./](\d{1,2})/,/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})/];console.log("🔍 extractBirthInfo 调用:",{text:u,patterns:N.map(v=>v.toString())});for(const v of N){const j=u.match(v);if(console.log("🔍 正则匹配结果:",{pattern:v.toString(),match:j}),j){const y=parseInt(j[1]),b=parseInt(j[2]),w=parseInt(j[3]);if(console.log("🔍 提取的数值:",{year:y,month:b,day:w}),!isNaN(y)&&!isNaN(b)&&!isNaN(w)&&y>=1900&&y<=2100&&b>=1&&b<=12&&w>=1&&w<=31)return{year:y,month:b,day:w,hour:0,minute:0};console.log("⚠️ 提取的数值无效:",{year:y,month:b,day:w,isNaNYear:isNaN(y),isNaNMonth:isNaN(b),isNaNDay:isNaN(w)})}}return console.log("⚠️ 未找到有效的出生日期"),null},h=u=>{u.key==="Enter"&&!u.shiftKey&&(u.preventDefault(),m())},C=u=>u.toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",hour12:!1});return s.jsxs("div",{className:"flex flex-col h-screen bg-gray-50",children:[s.jsxs("div",{className:"bg-white border-b border-gray-200 px-4 py-3 flex items-center",children:[s.jsx("button",{onClick:()=>a("/"),className:"mr-3 p-1 text-gray-600 hover:text-gray-800",children:s.jsx(ye,{className:"w-6 h-6"})}),s.jsxs("h1",{className:"text-lg font-semibold text-gray-800",children:[t,"占卜师"]})]}),s.jsxs("div",{className:"flex-1 overflow-y-auto p-4 space-y-4",children:[s.jsx(he,{children:i.map(u=>s.jsx(k.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},className:`flex ${u.type==="user"?"justify-end":"justify-start"}`,children:s.jsxs("div",{className:`max-w-xs lg:max-w-md ${u.type==="user"?"order-2":"order-1"}`,children:[s.jsx("div",{className:`text-xs text-gray-500 mb-1 ${u.type==="user"?"text-right":"text-left"}`,children:C(u.timestamp)}),s.jsx("div",{className:`px-4 py-2 rounded-2xl ${u.type==="user"?"bg-green-500 text-white rounded-br-sm":"bg-white text-gray-800 border border-gray-200 rounded-bl-sm"}`,children:s.jsx("p",{className:"text-sm leading-relaxed whitespace-pre-wrap",children:u.content})})]})},u.id))}),l&&s.jsx(k.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"flex justify-start",children:s.jsxs("div",{className:"max-w-xs lg:max-w-md",children:[s.jsx("div",{className:"text-xs text-gray-500 mb-1",children:C(new Date)}),s.jsx("div",{className:"px-4 py-2 rounded-2xl rounded-bl-sm bg-white border border-gray-200",children:s.jsxs("div",{className:"flex space-x-1",children:[s.jsx("div",{className:"w-2 h-2 bg-gray-400 rounded-full animate-bounce"}),s.jsx("div",{className:"w-2 h-2 bg-gray-400 rounded-full animate-bounce",style:{animationDelay:"0.1s"}}),s.jsx("div",{className:"w-2 h-2 bg-gray-400 rounded-full animate-bounce",style:{animationDelay:"0.2s"}})]})})]})}),s.jsx("div",{ref:p})]}),s.jsx("div",{className:"bg-white border-t border-gray-200 px-4 py-3",children:s.jsxs("div",{className:"flex items-end space-x-3",children:[s.jsx("div",{className:"flex-1",children:s.jsx("textarea",{value:n,onChange:u=>r(u.target.value),onKeyPress:h,placeholder:"输入您的问题...",className:"w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent",rows:1,style:{minHeight:"40px",maxHeight:"120px"}})}),s.jsx("button",{onClick:m,disabled:!n.trim()||l,className:"px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors",children:s.jsx(ge,{className:"w-5 h-5"})})]})})]})},xt=()=>{const{type:e}=ne(),t=W(),a=i=>({tarot:"塔罗占卜",bazi:"八字命理",astrology:"星座占星",numerology:"数字命理"})[i||"tarot"]||"塔罗占卜";return e?s.jsx(ft,{fortuneType:e,fortuneName:a(e)}):(t("/"),null)};function yt(){return s.jsx(le,{children:s.jsxs("div",{className:"App",children:[s.jsxs(ce,{children:[s.jsx(U,{path:"/",element:s.jsx(pt,{})}),s.jsx(U,{path:"/fortune/:type",element:s.jsx(xt,{})})]}),s.jsx(ut,{position:"top-right",toastOptions:{duration:4e3,style:{background:"rgba(31, 41, 55, 0.9)",color:"#fff",border:"1px solid rgba(139, 92, 246, 0.3)",borderRadius:"8px"},success:{iconTheme:{primary:"#10B981",secondary:"#fff"}},error:{iconTheme:{primary:"#EF4444",secondary:"#fff"}}}})]})})}z.createRoot(document.getElementById("root")).render(s.jsx(ie.StrictMode,{children:s.jsx(yt,{})}));
