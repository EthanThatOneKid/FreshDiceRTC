import"./chunk-QI2WNBYA.js";import{a as U,b as B,c as A,d as b,e as $,f as k}from"./chunk-WFGDLHPR.js";typeof globalThis>"u"&&(window.globalThis=window);var Y="453a5edfadb1bfdb358344bbadd58db01e8190c5";var X="/_frsh",z="__frsh_c";function j(e){if(!e.startsWith("/")||e.startsWith("//"))return e;try{let t=new URL(e,"https://freshassetcache.local");return t.protocol!=="https:"||t.host!=="freshassetcache.local"||t.searchParams.has(z)?e:(t.searchParams.set(z,Y),t.pathname+t.search+t.hash)}catch(t){return console.warn(`Failed to create asset() URL, falling back to regular path ('${e}'):`,t),e}}function ae(e){if(e.includes("("))return e;let t=e.split(","),r=[];for(let n of t){let o=n.trimStart(),d=n.length-o.length;if(o==="")return e;let i=o.indexOf(" ");i===-1&&(i=o.length);let s=n.substring(0,d),l=o.substring(0,i),a=o.substring(i);r.push(s+j(l)+a)}return r.join(",")}function G(e){if(e.type==="img"||e.type==="source"){let{props:t}=e;if(t["data-fresh-disable-lock"])return;typeof t.src=="string"&&(t.src=j(t.src)),typeof t.srcset=="string"&&(t.srcset=ae(t.srcset))}}var J="fresh-partial",w="f-partial",_="f-loading",M="f-client-nav",F="data-fresh-key",x="data-current",E="data-ancestor";function K(e,t){let r=new URL(t,"http://localhost").pathname;return r!=="/"&&r.endsWith("/")&&(r=r.slice(0,-1)),e!=="/"&&e.endsWith("/")&&(e=e.slice(0,-1)),e===r?2:e.startsWith(r+"/")||r==="/"?1:0}function Q(e,t){let r=e.props,n=r.href;if(typeof n=="string"&&n.startsWith("/")){let o=K(t,n);o===2?r[x]="true":o===1&&(r[E]="true")}}function de(e,t,r){return e.__k={_frshRootFrag:!0,nodeType:1,parentNode:e,nextSibling:null,get firstChild(){let n=t.nextSibling;return n===r?null:n},get childNodes(){let n=[],o=t.nextSibling;for(;o!==null&&o!==r;)n.push(o),o=o.nextSibling;return n},insertBefore(n,o){e.insertBefore(n,o??r)},appendChild(n){e.insertBefore(n,r)},removeChild(n){e.removeChild(n)}}}function re(e){return e.nodeType===Node.COMMENT_NODE}function ce(e){return e.nodeType===Node.TEXT_NODE}function oe(e){return e.nodeType===Node.ELEMENT_NODE&&!("_frshRootFrag"in e)}function we(e,t){let r=[];S(e,t,[],[A(b,null)],document.body,r);for(let n=0;n<r.length;n++){let{vnode:o,marker:d,rootFragment:i}=r[n],s=()=>{k(o,i),d.kind===2&&v.set(d.text,o.__c)};"scheduler"in window?scheduler.postTask(s):setTimeout(s,0)}}function se(e){return e.children}se.displayName="PreactServerComponent";function P(e,t){let r=e.props;r.children==null?r.children=t:Array.isArray(r.children)?r.children.push(t):r.children=[r.children,t]}var W=class extends ${render(){return this.props.children}};var Z=!1,v=new Map;function O(e){let{startNode:t,endNode:r}=e,n=r.parentNode;if(!Z&&t!==null&&t.nodeType===Node.COMMENT_NODE){let o=new Text("");e.startNode=o,n.insertBefore(o,t),t.remove()}if(!Z&&r!==null&&r.nodeType===Node.COMMENT_NODE){let o=new Text("");e.endNode=o,n.insertBefore(o,r),r.remove()}}function ee(e,t,r,n,o,d){let[i,s,l]=o.slice(6).split(":"),a=`#frsh-slot-${i}-${s}-${l}-children`,c=document.querySelector(a);if(c!==null){r.push({kind:1,endNode:null,startNode:null,text:o.slice(1)});let p=c.content.cloneNode(!0);S(e,t,r,n,p,d),r.pop()}}function S(e,t,r,n,o,d){let i=o;for(;i!==null;){let s=r.length>0?r[r.length-1]:null;if(re(i)){let l=i.data;if(l.startsWith("!--")&&(l=l.slice(3,-2)),l.startsWith("frsh-slot"))r.push({startNode:i,text:l,endNode:null,kind:1}),n.push(A(se,{id:l}));else if(l.startsWith("frsh-partial")){let[a,c,p,m]=l.split(":");r.push({startNode:i,text:c,endNode:null,kind:2}),n.push(A(W,{name:c,key:m,mode:+p}))}else if(l.startsWith("frsh-key")){let a=l.slice(9);n.push(A(b,{key:a}))}else if(l.startsWith("/frsh-key")){let a=n.pop(),c=n[n.length-1];P(c,a),i=i.nextSibling;continue}else if(s!==null&&(l.startsWith("/frsh")||s.text===l)){if(s.endNode=i,r.pop(),s.kind===1){let a=n.pop(),c=n[n.length-1];c.props.children=a,O(s),i=s.endNode.nextSibling;continue}else if(s!==null&&(s.kind===0||s.kind===2))if(r.length===0){let a=n[n.length-1];a.props.children==null&&ee(e,t,r,n,l,d),n.pop();let c=i.parentNode;O(s);let p=de(c,s.startNode,s.endNode);d.push({vnode:a,marker:s,rootFragment:p}),i=s.endNode.nextSibling;continue}else{let a=n[n.length-1];a&&a.props.children==null?(ee(e,t,r,n,l,d),a.props.children==null&&n.pop()):n.pop(),s.endNode=i,O(s);let c=n[n.length-1];P(c,a),s.kind===2&&v.set(s.text,a.__c),i=s.endNode.nextSibling;continue}}else if(l.startsWith("frsh")){let[a,c,p,m]=l.slice(5).split(":"),h=t[Number(p)];r.push({startNode:i,endNode:null,text:l,kind:0});let u=A(e[a][c],h);m&&(u.key=m),n.push(u)}}else if(ce(i)){let l=n[n.length-1];s!==null&&(s.kind===1||s.kind===2)&&P(l,i.data)}else{let l=n[n.length-1];if(oe(i))if(s!==null&&(s.kind===1||s.kind===2)){let c={children:i.childNodes.length<=1?null:[]},p=!1;for(let h=0;h<i.attributes.length;h++){let u=i.attributes[h];if(u.nodeName===F){p=!0,c.key=u.nodeValue;continue}else if(u.nodeName===_){let f=u.nodeValue,g=t[Number(f)][_].value;i._freshIndicator=g}c[u.nodeName]=typeof i[u.nodeName]=="boolean"?!0:u.nodeValue}p&&i.removeAttribute(F);let m=A(i.localName,c);P(l,m),n.push(m)}else{let a=i.getAttribute(_);if(a!==null){let c=t[Number(a)][_].value;i._freshIndicator=c}}i.firstChild&&i.nodeName!=="SCRIPT"&&S(e,t,r,n,i.firstChild,d),s!==null&&s.kind!==0&&n.pop()}i!==null&&(i=i.nextSibling)}}var te="Unable to process partial response.";async function I(e,t){e.searchParams.set(J,"true");let r=await fetch(e,t);await ue(r)}function ie(e){document.querySelectorAll("a").forEach(t=>{let r=K(e.pathname,t.href);r===2?(t.setAttribute(x,"true"),t.removeAttribute(E)):r===1?(t.setAttribute(E,"true"),t.removeAttribute(x)):(t.removeAttribute(x),t.removeAttribute(E))})}function le(e,t,r,n){let o=null,d=n.firstChild,i=0;for(;d!==null;){if(re(d)){let s=d.data;if(s.startsWith("frsh-partial"))o=d,i++;else if(s.startsWith("/frsh-partial")){i--;let l={_frshRootFrag:!0,nodeType:1,nextSibling:null,firstChild:o,parentNode:n,get childNodes(){let a=[o],c=o;for(;(c=c.nextSibling)!==null;)a.push(c);return a}};S(t,r[0]??[],[],[A(b,null)],l,e)}}else i===0&&oe(d)&&le(e,t,r,d);d=d.nextSibling}}var H=class extends Error{};async function ue(e){if(!e.ok)throw new Error(te);if(e.headers.get("Content-Type")!=="text/html; charset=utf-8")throw new Error(te);let r=await e.text(),n=new DOMParser().parseFromString(r,"text/html"),o=[],d={},i=n.getElementById("__FRSH_PARTIAL_DATA"),s=null;i!==null&&(s=JSON.parse(i.textContent),o.push(...Array.from(Object.entries(s.islands)).map(async h=>{d[h[0]]=await import(`${h[1]}`)})));let l=n.getElementById("__FRSH_STATE")?.textContent,a=[[],[]],c;s!==null&&s.signals!==null&&o.push(import(s.signals).then(h=>{c=h.signal}));let p;l&&s&&s.deserializer!==null&&o.push(import(s.deserializer).then(h=>p=h.deserialize)),await Promise.all(o),l&&(a=p?p(l,c):JSON.parse(l)?.v);let m=[];if(le(m,d,a,n.body),m.length===0)throw new H(`Found no partials in HTML response. Please make sure to render at least one partial. Requested url: ${e.url}`);document.title=n.title,Array.from(n.head.childNodes).forEach(h=>{let u=h;if(u.nodeName!=="TITLE"){if(u.nodeName==="META"){let f=u;if(f.hasAttribute("charset"))return;let g=f.name;if(g!==""){let y=document.head.querySelector(`meta[name="${g}"]`);y!==null?y.content!==f.content&&(y.content=f.content):document.head.appendChild(f)}else{let y=u.getAttribute("property"),N=document.head.querySelector(`meta[property="${y}"]`);N!==null?N.content!==f.content&&(N.content=f.content):document.head.appendChild(f)}}else if(u.nodeName==="LINK"){let f=u;if(f.rel==="modulepreload")return;f.rel==="stylesheet"&&Array.from(document.head.querySelectorAll("link")).find(y=>y.href===f.href)===void 0&&document.head.appendChild(f)}else if(u.nodeName==="SCRIPT"){if(u.src===`${X}/refresh.js`)return}else if(u.nodeName==="STYLE"){let f=u;f.id===""&&document.head.appendChild(f)}}});for(let h=0;h<m.length;h++){let{vnode:u,marker:f}=m[h],g=v.get(f.text);if(!g)console.warn(`Partial "${f.text}" not found. Skipping...`);else{let y=u.props.mode,N=u.props.children;if(y===0)g.props.children=N;else{let D=g.props.children,R=Array.isArray(D)?D:[D];if(y===1)R.push(N);else{B(N)||(N=A(b,null,N)),N.key==null&&(N.key=R.length);let V=g.__v.__k;if(Array.isArray(V))for(let T=0;T<V.length;T++){let C=V[T];if(C.key==null)C.key=T;else break}for(let T=0;T<R.length;T++){let C=R[T];if(C.key==null)C.key=T;else break}R.unshift(N)}g.props.children=R}g.setState({})}}}var ne=U.vnode;U.vnode=e=>{G(e),e.type==="a"&&Q(e,location.pathname),ne&&ne(e)};function q(){return document.querySelector(`[${M}]`)!==null}var L=history.state?.index||0;if(!history.state){let e={index:L,scrollX,scrollY};history.replaceState(e,document.title)}document.addEventListener("click",async e=>{let t=e.target;if(t&&t instanceof HTMLElement){let r=t;if(t.nodeName!=="A"&&(t=t.closest("a")),t&&t instanceof HTMLAnchorElement&&t.href&&(!t.target||t.target==="_self")&&t.origin===location.origin&&e.button===0&&!(e.ctrlKey||e.metaKey||e.altKey||e.shiftKey||e.button)&&!e.defaultPrevented){let n=t.getAttribute(w);if(t.getAttribute("href")?.startsWith("#")||!q()||t.closest(`[${M}="true"]`)===null)return;let o=t._freshIndicator;o!==void 0&&(o.value=!0),e.preventDefault();let d=new URL(t.href);try{if(t.href!==window.location.href){let s={index:L,scrollX:window.scrollX,scrollY:window.scrollY};history.replaceState({...s},"",location.href),L++,s.scrollX=0,s.scrollY=0,history.pushState(s,"",d.href)}let i=new URL(n||d.href,location.href);await I(i),ie(d),scrollTo({left:0,top:0,behavior:"instant"})}finally{o!==void 0&&(o.value=!1)}}else{let n=r;if(n.nodeName!=="A"&&(n=n.closest("button")),n!==null&&n instanceof HTMLButtonElement){let o=n.getAttribute(w);if(o===null||!q()||n.closest(`[${M}="true"]`)===null)return;let d=new URL(o,location.href);await I(d)}}}});addEventListener("popstate",async e=>{if(e.state===null){history.scrollRestoration&&(history.scrollRestoration="auto");return}let t=history.state;if(L=t.index??L+1,!q()){location.reload();return}history.scrollRestoration&&(history.scrollRestoration="manual");let n=new URL(location.href,location.origin);try{await I(n),ie(n),scrollTo({left:t.scrollX??0,top:t.scrollY??0,behavior:"instant"})}catch(o){if(o instanceof H){location.reload();return}throw o}});document.addEventListener("submit",async e=>{let t=e.target;if(t!==null&&t instanceof HTMLFormElement&&!e.defaultPrevented){let r=t.getAttribute(w);if(r!==null){e.preventDefault();let n=new URL(r,location.href);await I(n)}}});export{ue as applyPartials,we as revive};
