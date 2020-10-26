(window.webpackJsonp=window.webpackJsonp||[]).push([[178],{231:function(e,n,t){"use strict";t.r(n),t.d(n,"frontMatter",(function(){return l})),t.d(n,"metadata",(function(){return i})),t.d(n,"rightToc",(function(){return s})),t.d(n,"default",(function(){return c}));var a=t(2),r=t(6),o=(t(0),t(290)),l={title:"Uploads / Download"},i={unversionedId:"examples/upload-download",id:"examples/upload-download",isDocsHomePage:!1,title:"Uploads / Download",description:"Accept files from the user and downloads them locally.",source:"@site/docs/examples/upload-download.md",slug:"/examples/upload-download",permalink:"/wave/docs/examples/upload-download",editUrl:"https://github.com/h2oai/wave/edit/master/website/docs/examples/upload-download.md",version:"current",sidebar:"someSidebar",previous:{title:"Uploads / UI",permalink:"/wave/docs/examples/upload-ui"},next:{title:"Meta / Title",permalink:"/wave/docs/examples/meta-title"}},s=[],p={rightToc:s};function c(e){var n=e.components,l=Object(r.a)(e,["components"]);return Object(o.b)("wrapper",Object(a.a)({},p,l,{components:n,mdxType:"MDXLayout"}),Object(o.b)("p",null,"Accept files from the user and downloads them locally."),Object(o.b)("div",{className:"cover",style:{backgroundImage:"url("+t(460).default+")"}}),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-py"}),"import os\nimport os.path\nfrom h2o_wave import Q, listen, ui\n\nasync def serve(q: Q):\n    links = q.args.user_files\n    if links:\n        items = [ui.text_xl('Files uploaded!')]\n        for link in links:\n            local_path = await q.site.download(link, '.')\n            #\n            # The file is now available locally; process the file.\n            # To keep this example simple, we just read the file size.\n            #\n            size = os.path.getsize(local_path)\n\n            items.append(ui.link(label=f'{os.path.basename(link)} ({size} bytes)', download=True, path=link))\n            # Clean up\n            os.remove(local_path)\n\n        items.append(ui.button(name='back', label='Back', primary=True))\n        q.page['example'].items = items\n    else:\n        q.page['example'] = ui.form_card(box='1 1 4 10', items=[\n            ui.text_xl('Upload some files'),\n            ui.file_upload(name='user_files', label='Upload', multiple=True),\n        ])\n    await q.page.save()\n\n\nlisten('/demo', serve)\n")))}c.isMDXComponent=!0},290:function(e,n,t){"use strict";t.d(n,"a",(function(){return u})),t.d(n,"b",(function(){return f}));var a=t(0),r=t.n(a);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function l(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?l(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var p=r.a.createContext({}),c=function(e){var n=r.a.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},u=function(e){var n=c(e.components);return r.a.createElement(p.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.a.createElement(r.a.Fragment,{},n)}},m=r.a.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=c(t),m=a,f=u["".concat(l,".").concat(m)]||u[m]||d[m]||o;return t?r.a.createElement(f,i(i({ref:n},p),{},{components:t})):r.a.createElement(f,i({ref:n},p))}));function f(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,l=new Array(o);l[0]=m;var i={};for(var s in n)hasOwnProperty.call(n,s)&&(i[s]=n[s]);i.originalType=e,i.mdxType="string"==typeof e?e:a,l[1]=i;for(var p=2;p<o;p++)l[p]=t[p];return r.a.createElement.apply(null,l)}return r.a.createElement.apply(null,t)}m.displayName="MDXCreateElement"},460:function(e,n,t){"use strict";t.r(n),n.default=t.p+"assets/images/upload-download-ce3af4e53ce2d7a546aa933667f7758a.png"}}]);