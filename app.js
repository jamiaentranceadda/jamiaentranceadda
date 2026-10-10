(function(){function cl(e,s){var t=e.target;return t&&t.closest?t.closest(s):null}
window.onerror=function(m,s,l){try{if(/[?&](admin|debug)/.test(location.search)){var d=document.createElement('div');d.style.cssText='position:fixed;left:0;right:0;top:0;z-index:99;background:#b00020;color:#fff;padding:8px 12px;font:13px monospace';d.textContent='JS error: '+m+' (line '+l+')';document.body.appendChild(d)}}catch(x){}};
document.addEventListener('click',function(e){var b=cl(e,'#hbtn'),m=cl(e,'#mbtn'),q=document.getElementById('mmm'),mm=document.getElementById('mm');
if(b&&q){e.preventDefault();var on=q.className.indexOf('on')<0;q.className=on?'mmenu on':'mmenu';b.setAttribute('aria-expanded',on);if(mm)mm.className='mm';return}
if(m&&mm){e.preventDefault();var on2=mm.className.indexOf('on')<0;mm.className=on2?'mm on':'mm';m.setAttribute('aria-expanded',on2);if(q)q.className='mmenu';return}
if(q&&q.className.indexOf('on')>-1&&(!cl(e,'#mmm')||cl(e,'#mmm a')))q.className='mmenu';
if(mm&&mm.className.indexOf('on')>-1&&!cl(e,'.more'))mm.className='mm'},false)})();
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

function find(r){if(r==='write')return{k:'write'};var g=S.pages.filter(function(p){return p.slug===r})[0];if(g)return{k:'page',g:g};var m=r.match(/^blog\/(.+)$/);if(m){var p=S.posts.filter(function(x){return x.slug===m[1]})[0];if(p)return{k:'post',p:p}}return{k:'404'}}
function getRoute(){var r=window.ROUTE;if(r==null){r=location.pathname;if(r.indexOf(BASE)===0)r=r.slice(BASE.length);r=r.replace(/index\.html$/,'').replace(/^\/+|\/+$/g,'')}
var prod=/(jamiaentranceadda\.in|github\.io)$/.test(location.hostname);
if(!prod){owner=true;wantAdmin=true;if(window.ROUTE==null&&find(r).k==='404')r=''}
if(r==='admin'||/[?&]admin/.test(location.search)){wantAdmin=true;if(r==='admin')r=''}return r}
function metaFor(r){var f=find(r),t,d,type='website',og=S.ogImage,ld=null;
if(f.k==='post'){t=f.p.st||f.p.t;d=f.p.sd||S.siteDesc;type='article';og=f.p.cover||og;ld={'@context':'https://schema.org','@type':'BlogPosting',headline:f.p.t,datePublished:f.p.date,image:og?abs(og):undefined,author:{'@type':'Person',name:f.p.au||'Jamia Entrance Adda'},publisher:{'@type':'Organization',name:'Jamia Entrance Adda'}}}
else if(f.k==='page'){t=f.g.st||(r===''?S.siteTitle:f.g.t);d=f.g.sd||S.siteDesc}
else if(f.k==='write'){t='Write for us';d='Write and submit articles for Jamia Entrance Adda.'}
t=t||S.siteTitle;d=d||S.siteDesc;if(r!==''&&t.indexOf('Jamia Entrance Adda')<0)t+=' | Jamia Entrance Adda';
if(r==='')ld={'@context':'https://schema.org','@type':'EducationalOrganization',name:'Jamia Entrance Adda',url:S.domain,telephone:S.phone1,email:S.email,address:S.address};
return{t:t,d:d,type:type,og:og,ld:ld}}

var pq={},saved=null;
S.banners=S.banners||[];S.theme=S.theme||{};
var FONTS=['Playfair Display','Poppins','Montserrat','Lora','Merriweather','Raleway','Oswald','DM Serif Display','Hind','Fraunces','Noto Sans Devanagari','Caveat'];
var FW={'DM Serif Display':'','Playfair Display':':wght@400;600;800','Poppins':':wght@400;500;600;700','Montserrat':':wght@400;600;700;800','Lora':':wght@400;600;700','Merriweather':':wght@400;700','Raleway':':wght@400;600;700','Oswald':':wght@400;600;700','Hind':':wght@400;500;600;700','Fraunces':':wght@600;800','Noto Sans Devanagari':':wght@400;600;700','Caveat':':wght@600'};
var SZ={1:'.8em',2:'.9em',3:'1em',4:'1.15em',5:'1.4em',6:'1.8em',7:'2.3em'};
var PRE={royal:{bg:'#0a0f1f',soft:'#0f1730',card:'#131c3a',line:'#26335c',text:'#f3efe4',mute:'#a9b3d1',brand:'#d4af37',brand2:'#b8932a',ink:'#1a1405',gold:'#d4af37',hf:'Playfair Display',bf:'Poppins'},
ivory:{bg:'#fbf8f2',soft:'#f3ede0',card:'#ffffff',line:'#e6dcc6',text:'#1c1a16',mute:'#6b6458',brand:'#7a1f3d',brand2:'#5d152d',ink:'#ffffff',gold:'#b8902f',hf:'Playfair Display',bf:'Poppins'},
ocean:{bg:'#f4f7ff',soft:'#e8eefc',card:'#ffffff',line:'#d3def5',text:'#0f1b3d',mute:'#53618a',brand:'#1d4ed8',brand2:'#1e3a9f',ink:'#ffffff',gold:'#f59e0b',hf:'Montserrat',bf:'Poppins'},
charcoal:{bg:'#111113',soft:'#18181b',card:'#1f1f23',line:'#34343a',text:'#f5f5f4',mute:'#a1a1aa',brand:'#ff7a1a',brand2:'#e0640a',ink:'#1a0d02',gold:'#ff7a1a',hf:'Oswald',bf:'Poppins'}};
function okc(c){return /^#[0-9a-f]{3,8}$/i.test(String(c||''))}
function lum(h){h=String(h).replace('#','');if(h.length===3)h=h.replace(/(.)/g,'$1$1');var r=parseInt(h.substr(0,2),16),g=parseInt(h.substr(2,2),16),b=parseInt(h.substr(4,2),16);return (0.299*r+0.587*g+0.114*b)/255}
function fontsHref(){return 'https://fonts.googleapis.com/css2?'+FONTS.map(function(f){return 'family='+f.replace(/ /g,'+')+FW[f]}).join('&')+'&display=swap'}
function fq(f){return "'"+f+"',"}
function themeCss(){var t=S.theme||{},p=PRE[t.preset]||PRE.royal,v={};for(var k in p)v[k]=p[k];
if(okc(t.text)){v.text=t.text;v.mute='color-mix(in srgb,'+t.text+' 62%,'+v.bg+')'}
if(okc(t.bg)){v.bg=t.bg;v.soft='color-mix(in srgb,'+t.bg+' 91%,'+v.text+' 9%)';v.card='color-mix(in srgb,'+t.bg+' 86%,'+v.text+' 14%)';v.line='color-mix(in srgb,'+t.bg+' 78%,'+v.text+' 22%)'}
if(okc(t.brand)){v.brand=t.brand;v.brand2='color-mix(in srgb,'+t.brand+' 80%,#000)';v.ink=lum(t.brand)>0.55?'#111111':'#ffffff';v.gold=t.brand}
var hf=FONTS.indexOf(t.hf)>-1?t.hf:p.hf,bf=FONTS.indexOf(t.bf)>-1?t.bf:p.bf;
return ':root:root:root{--bg:'+v.bg+';--soft:'+v.soft+';--card:'+v.card+';--line:'+v.line+';--text:'+v.text+';--mute:'+v.mute+';--brand:'+v.brand+';--brand2:'+v.brand2+';--ink:'+v.ink+';--gold:'+v.gold+'}body{font-family:'+fq(bf)+"'Noto Sans Devanagari',system-ui,sans-serif}h1,h2,h3,.logo,.big{font-family:"+fq(hf)+"Georgia,serif}"}
function applyTheme(){var s=document.getElementById('theme');if(!s){s=document.createElement('style');s.id='theme';document.head.appendChild(s)}s.textContent=themeCss();if(!document.getElementById('gf')){var l=document.createElement('link');l.id='gf';l.rel='stylesheet';l.href=fontsHref();document.head.appendChild(l)}}
function fontOpts(sel){return '<option value="">Default</option>'+FONTS.map(function(f){return '<option value="'+f+'"'+(sel===f?' selected':'')+'>'+f+'</option>'}).join('')}
var isPreview=!/(jamiaentranceadda\.in|github\.io)$/.test(location.hostname);

document.addEventListener('selectionchange',function(){var s=getSelection();if(s&&s.rangeCount){var r=s.getRangeAt(0),n=r.commonAncestorContainer,el=n.nodeType===1?n:n.parentNode;if(el&&el.closest&&el.closest('.rte'))saved=r.cloneRange()}});
var SV='<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">';
var ICON={
yt:SV+'<path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg>',
ig:SV+'<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg>',
fb:SV+'<path fill="currentColor" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z"/></svg>',
wa:SV+'<path d="M12 2.5a9.5 9.5 0 0 0-8.1 14.4L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path fill="currentColor" d="M8.7 7.6c-.3.3-.9 1-.9 1.8 0 1.6 1.3 3.2 2.6 4.4 1.3 1.1 3 2.1 4.4 2.1.9 0 1.5-.5 1.8-1l-.1-.8-1.8-.9-.9 1c-1.1-.4-2.7-1.9-3.2-3l.9-.9-.8-1.9z"/></svg>',
play:SV+'<path fill="#2196F3" d="M3.6 2.2v19.6l10.3-9.8L3.6 2.2z"/><path fill="#FFC107" d="M17.2 8.7 13.9 12l3.3 3.3 3.9-2.2c1.1-.6 1.1-2.2 0-2.8l-3.9-2.2z"/><path fill="#F44336" d="M3.6 21.8c.3.1.6.1.9-.1l12.7-6.4L13.9 12 3.6 21.8z"/><path fill="#4CAF50" d="M3.6 2.2l10.3 9.8 3.3-3.3L4.5 2.3c-.3-.2-.6-.2-.9-.1z"/></svg>',
tg:SV+'<path d="M21 4 3 11l6 2 2 6 3-4 5 4 2-15z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 13 21 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
li:SV+'<rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="8.2" r="1.3" fill="currentColor"/><path d="M7 11v6M11 17v-6M11 13.5c0-1.5 1-2.5 2.5-2.5S16 12 16 13.5V17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
web:SV+'<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'};
function iconOf(n,u){var s=(String(n)+' '+String(u)).toLowerCase();return /youtu/.test(s)?['yt','#ff0000']:/insta/.test(s)?['ig','#e1306c']:/facebook|fb\.com|fb\.me/.test(s)?['fb','#1877f2']:/whatsapp|wa\.me/.test(s)?['wa','#25d366']:/play\.google|playstore|play store/.test(s)?['play','']:/telegram|t\.me/.test(s)?['tg','#229ED9']:/linkedin|linkdin/.test(s)?['li','#0A66C2']:['web','var(--brand)']}

function richHtml(b){return /^\s*</.test(String(b||''))?clean(b):prose(b)}
function bodyHtml(b){return richHtml(b)}
function clean(h){if(typeof DOMParser==='undefined')return '';var d=new DOMParser().parseFromString('<body>'+h+'</body>','text/html');
function W(n){var o='';n.childNodes.forEach(function(c){if(c.nodeType===3)o+=esc(c.nodeValue);else if(c.nodeType===1){var t=c.tagName,i=W(c);
if(t==='A'){var hr=(c.getAttribute('href')||'').trim();if(!hr||/^javascript:/i.test(hr))o+=i;else if(/^https:\/\/internal\.link\//i.test(hr)){var r=hr.replace(/^https:\/\/internal\.link\//i,'').replace(/^\/+|\/+$/g,'');o+='<a href="'+U(r)+'" data-r="'+esc(r)+'">'+i+'</a>'}else if(/^(https?:|mailto:|tel:)/i.test(hr)){var yv=ytId(hr);o+=yv?'<a href="https://www.youtube.com/watch?v='+yv+'" data-yt="'+yv+'">'+i+'</a>':'<a href="'+esc(hr)+'" target="_blank" rel="noopener">'+i+'</a>'}else o+=i}
else if(t==='B'||t==='STRONG')o+='<strong>'+i+'</strong>';else if(t==='I'||t==='EM')o+='<em>'+i+'</em>';else if(t==='U')o+='<u>'+i+'</u>';
else if(t==='H1'||t==='H2')o+='<h2>'+i+'</h2>';else if(t==='H3'||t==='H4')o+='<h3>'+i+'</h3>';
else if(t==='P'||t==='DIV')o+='<p>'+i+'</p>';else if(t==='UL'||t==='OL'||t==='LI'||t==='BLOCKQUOTE')o+='<'+t.toLowerCase()+'>'+i+'</'+t.toLowerCase()+'>';else if(t==='BR')o+='<br>';
else if(t==='FONT'||t==='SPAN'){var st=[],col=c.getAttribute('color')||(c.style&&c.style.color)||'',fc=c.getAttribute('face')||(c.style&&c.style.fontFamily)||'',sz=c.getAttribute('size');col=String(col).trim();if(/^(#[0-9a-f]{3,8}|rgb\([\d\s,.%]+\))$/i.test(col))st.push('color:'+col);fc=String(fc).replace(/["']/g,'').split(',')[0].trim();if(FONTS.indexOf(fc)>-1)st.push("font-family:'"+fc+"'");if(sz&&SZ[sz])st.push('font-size:'+SZ[sz]);o+=st.length?'<span style="'+st.join(';')+'">'+i+'</span>':i}
else if(!/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED)$/.test(t))o+=i}});return o}
return W(d.body).replace(/<p>(<br>)?<\/p>/g,'')}
function driveId(l){var m=String(l).match(/\/d\/([\w-]{10,})/)||String(l).match(/[?&]id=([\w-]{10,})/);return m?m[1]:''}
function pdfInfo(l){var id=driveId(l);if(id)return{src:'https://drive.google.com/file/d/'+id+'/preview',open:'https://drive.google.com/file/d/'+id+'/view',dl:'https://drive.google.com/uc?export=download&id='+id};var u=im(l),a=/^http/.test(u)?u:location.origin+u;return{src:'https://docs.google.com/gview?embedded=true&url='+encodeURIComponent(a),open:u,dl:u}}
function openPv(nd){var f=pdfInfo(nd.link);$('pvt').textContent=nd.n;$('pvf').src=f.src;$('pvo').href=f.open;$('pvd').href=f.dl;$('pv').className='modal on'}
function openYt(id){$('yvb').innerHTML='<div class="vid"><iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>';$('yv').className='modal on'}
function ytId(u){var m=String(u||'').match(/(?:v=|youtu\.be\/|embed\/|live\/|shorts\/)([\w-]{11})/);return m?m[1]:''}

function anc(l,cls,inner,extra){l=String(l||'').trim();var c=' class="'+cls+'"'+(extra||'');if(!l)return '<div'+c+'>'+inner+'</div>';var yy=ytId(l);if(yy)return '<a'+c+' href="https://www.youtube.com/watch?v='+yy+'" data-yt="'+yy+'">'+inner+'</a>';
if(/^(https?:|\/\/)/.test(l))return '<a'+c+' href="'+esc(l)+'" target="_blank" rel="noopener">'+inner+'</a>';
if(l.charAt(0)==='#')return '<a'+c+' href="'+esc(l)+'" data-s="'+esc(l.slice(1))+'">'+inner+'</a>';
var r=l.replace(/^\/+|\/+$/g,'');return '<a'+c+' href="'+U(r)+'" data-r="'+esc(r)+'">'+inner+'</a>'}
function bannerHtml(){var b=(S.banners||[]).filter(function(x){return x.img});if(!b.length)return '';return '<div class="bn"><div class="bn-track">'+b.map(function(x,k){return anc(x.link,'bn-s','<img src="'+esc(im(x.img))+'" alt="Banner '+(k+1)+'"'+(k?' loading="lazy"':'')+'>')}).join('')+'</div>'+(b.length>1?'<div class="bn-dots">'+b.map(function(x,k){return '<i'+(k?'':' class="on"')+'></i>'}).join('')+'</div>':'')+'</div>'}
var bnT=null;
function initBanner(){clearInterval(bnT);var tr=document.querySelector('.bn-track');if(!tr)return;var n=tr.children.length,dots=[].slice.call(document.querySelectorAll('.bn-dots i')),hold=0;if(n<2)return;
function step(){return tr.children[0].offsetWidth+12}
function go2(i){tr.scrollTo({left:i*step(),behavior:'smooth'})}
tr.addEventListener('scroll',function(){var i=Math.round(tr.scrollLeft/step());dots.forEach(function(d,k){d.className=k===i?'on':''})});
['touchstart','mousedown'].forEach(function(e){tr.addEventListener(e,function(){hold=Date.now()+6000})});
dots.forEach(function(d,k){d.onclick=function(){hold=Date.now()+6000;go2(k)}});
bnT=setInterval(function(){if(Date.now()<hold)return;var i=Math.round(tr.scrollLeft/step())+1;go2(i>=n?0:i)},4500)}

function popupCfg(){var o={on:'y',title:'Start your journey with Jamia Entrance Adda',text:'Fill out the details below and our academic counsellor will contact you.',button:'Request free counselling',delay:'2',freq:'session',opts:'JMI (Jamia Millia Islamia)\nAMU (Aligarh Muslim University)\nCUET UG\nCLAT / Law entrance exams'},u=S.popup||{};for(var k in u)o[k]=u[k];return o}
function promoCfg(){var o={on:'n',img:'',title:'Get our app',text:'Live classes, tests and notes on your phone.',button:'Open',link:'',delay:'8',freq:'session'},u=S.promo||{};for(var k in u)o[k]=u[k];return o}
function cpHtml(){var c=popupCfg();return '<div class="modal" id="cp"><div class="mbox"><button class="x" id="cpx" aria-label="Close">&times;</button><h2 style="font-size:26px;margin:6px 34px 6px 0">'+esc(c.title)+'</h2><p class="sub" style="margin:0 0 14px">'+esc(c.text)+'</p><form id="cf" style="gap:12px"><label>Full name<input id="cn" placeholder="Enter your full name" required></label><label>WhatsApp / phone number<div class="ph10"><span>+91</span><input id="cph" inputmode="numeric" maxlength="10" pattern="[0-9]{10}" placeholder="10-digit number" required></div></label><label>Email address<input id="ce" type="email" placeholder="you@example.com"></label><label>Preparing for<select id="cc"><option value="">Select your exam...</option>'+String(c.opts||'').split('\n').map(function(x){return x.trim()}).filter(Boolean).map(function(x){return '<option>'+esc(x)+'</option>'}).join('')+'</select></label><button class="btn" type="submit">'+esc(c.button)+' &rarr;</button></form></div></div>'}
function ppHtml(){var c=promoCfg();if(c.on!=='y'||(!c.img&&!c.title))return '';return '<div class="sheetp" id="pp"><button class="x" id="ppx" aria-label="Close">&times;</button>'+(c.img?anc(c.link,'pimg','<img src="'+esc(im(c.img))+'" alt="'+esc(c.title)+'">'):'')+'<div class="pb">'+(c.title?'<b style="font-size:18px">'+esc(c.title)+'</b>':'')+(c.text?'<p style="margin:4px 0 12px;color:var(--mute)">'+esc(c.text)+'</p>':'')+'<div class="row">'+(c.link?lk(c.link,c.button||'Open','btn sm'):'')+(S.playUrl?'<a class="btn ghost sm" href="'+esc(S.playUrl)+'" target="_blank" rel="noopener">'+ICON.play+'<span>'+esc(S.playText||'Get the app')+'</span></a>':'')+'</div></div></div>'}
var popDone=false;
function showOnce(k,fr){if(fr==='always')return true;try{if(fr==='daily'){var t=+localStorage['jea_'+k]||0;if(Date.now()-t<864e5)return false;localStorage['jea_'+k]=Date.now();return true}if(sessionStorage['jea_'+k])return false;sessionStorage['jea_'+k]='1'}catch(e){}return true}
function initPopups(){if(popDone)return;if(!isPreview&&(owner||wantAdmin))return;popDone=true;var c=popupCfg(),p=promoCfg();
if(c.on!=='n'&&showOnce('cp',c.freq))setTimeout(function(){var m=$('cp');if(m)m.className='modal on'},(+c.delay||2)*1000);
if(p.on==='y'&&showOnce('pp',p.freq))setTimeout(function(){var m=$('pp');if(m&&!document.querySelector('.modal.on'))m.className='sheetp on';else if(m)setTimeout(function(){var z=$('pp');if(z)z.className='sheetp on'},6000)},(+p.delay||8)*1000)}
function wirePop(){if($('cpx')){$('cpx').onclick=function(){$('cp').className='modal'};$('cp').onclick=function(e){if(e.target===$('cp'))$('cp').className='modal'};
$('cf').onsubmit=function(e){e.preventDefault();var ph=$('cph').value.replace(/\D/g,'');if(ph.length!==10){toast('10 digit ka number daalo');return}sendLead({form:'Counselling popup',name:$('cn').value,phone:'+91'+ph,email:$('ce').value,course:$('cc').value});afterLead('Counselling request\nName: '+$('cn').value+'\nPhone: +91'+ph+(($('ce').value)?'\nEmail: '+$('ce').value:'')+(($('cc').value)?'\nPreparing for: '+$('cc').value:''));$('cp').className='modal'}}
if($('ppx'))$('ppx').onclick=function(){$('pp').className='sheetp'}}
function initAnim(){if(!window.IntersectionObserver||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches))return;document.querySelectorAll('.big').forEach(function(el){var m=el.textContent.match(/^(\D*)([\d,.]+)(.*)$/);if(!m)return;var end=parseFloat(m[2].replace(/,/g,'')),dec=(m[2].split('.')[1]||'').length,comma=m[2].indexOf(',')>-1;if(isNaN(end))return;el.textContent=m[1]+'0'+m[3];var o=new IntersectionObserver(function(en){if(en[0].isIntersecting){o.disconnect();var t0=null;(function f(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/1400),v=end*(1-Math.pow(1-p,3)),s=v.toFixed(dec);if(comma)s=Number(s).toLocaleString('en-IN');el.textContent=m[1]+s+m[3];if(p<1)requestAnimationFrame(f)})(performance.now())}},{threshold:.4});o.observe(el)});
var els=document.querySelectorAll('main section .eyebrow,main section h2,main section .sub,main section .card,main section .tc,main section .prose,main section .split>*,main section .cta,main section figure,main section .cover,main section .vid,main section .stats .card,main section .crumbs');var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
els.forEach(function(el,k){var r=el.getBoundingClientRect();if(r.top>innerHeight*0.92){el.classList.add('rv');el.style.animationDelay=((k%4)*90)+'ms';io.obser
