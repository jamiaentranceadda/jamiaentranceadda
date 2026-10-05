var S=JSON.parse(document.getElementById('state').textContent),owner=false,wantAdmin=false,filt='all',tab='pages',pi=0,rt='';
var BASE=/github\.io$/.test(location.hostname)?'/'+location.pathname.split('/')[1]+'/':'/';
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function $(i){return document.getElementById(i)}
function toast(m){var t=$('toast');t.textContent=m;t.style.display='block';setTimeout(function(){t.style.display='none'},4000)}
function tel(s){return 'tel:'+String(s).replace(/[^+\d]/g,'')}
function prose(b){return String(b||'').split(/\n\n+/).map(function(p){return p.indexOf('## ')===0?'<h3>'+esc(p.slice(3))+'</h3>':'<p>'+esc(p).replace(/\n/g,'<br>')+'</p>'}).join('')}
function U(r){return BASE+(r?r+'/':'')}
function im(s){return !s?'':/^(data:|http|\/)/.test(s)?s:BASE+s}
function abs(p){return /^http/.test(p)?p:S.domain.replace(/\/+$/,'')+'/'+p}
function slug(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')}

function find(r){var g=S.pages.filter(function(p){return p.slug===r})[0];if(g)return{k:'page',g:g};var m=r.match(/^blog\/(.+)$/);if(m){var p=S.posts.filter(function(x){return x.slug===m[1]})[0];if(p)return{k:'post',p:p}}return{k:'404'}}
function getRoute(){var r=window.ROUTE;if(r==null){r=location.pathname;if(r.indexOf(BASE)===0)r=r.slice(BASE.length);r=r.replace(/index\.html$/,'').replace(/^\/+|\/+$/g,'')}
var prod=/(jamiaentranceadda\.in|github\.io)$/.test(location.hostname);
if(!prod){owner=true;wantAdmin=true;if(window.ROUTE==null&&find(r).k==='404')r=''}
if(r==='admin'||/[?&]admin/.test(location.search)){wantAdmin=true;if(r==='admin')r=''}return r}
function metaFor(r){var f=find(r),t,d,type='website',og=S.ogImage,ld=null;
if(f.k==='post'){t=f.p.st||f.p.t;d=f.p.sd||S.siteDesc;type='article';og=f.p.cover||og;ld={'@context':'https://schema.org','@type':'BlogPosting',headline:f.p.t,datePublished:f.p.date,image:og?abs(og):undefined,publisher:{'@type':'Organization',name:'Jamia Entrance Adda'}}}
else if(f.k==='page'){t=f.g.st||(r===''?S.siteTitle:f.g.t);d=f.g.sd||S.siteDesc}
t=t||S.siteTitle;d=d||S.siteDesc;if(r!==''&&t.indexOf('Jamia Entrance Adda')<0)t+=' | Jamia Entrance Adda';
if(r==='')ld={'@context':'https://schema.org','@type':'EducationalOrganization',name:'Jamia Entrance Adda',url:S.domain,telephone:S.phone1,email:S.email,address:S.address};
return{t:t,d:d,type:type,og:og,ld:ld}}

var pq={},saved=null;
function richHtml(b){return /^\s*</.test(String(b||''))?clean(b):prose(b)}
function bodyHtml(b){return richHtml(b)}
function clean(h){if(typeof DOMParser==='undefined')return '';var d=new DOMParser().parseFromString('<body>'+h+'</body>','text/html');
