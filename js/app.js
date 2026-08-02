(function(){
'use strict';
var CATS=[
 {id:'note',label:'Notes',badge:'badge-note',folder:'notes'},
 {id:'mind',label:'Mind Maps',badge:'badge-mind',folder:'mindmaps'},
 {id:'short',label:'Short Notes',badge:'badge-short',folder:'short-notes'},
 {id:'pyq',label:'PYQs',badge:'badge-pyq',folder:'pyqs'}
];
var COLORS=['#E8B75E','#7FBF9E','#9C8CFF','#FF6B5E','#6FB3D9','#D98CC0'];
var entries=Array.isArray(window.REVISE_CONTENT)?window.REVISE_CONTENT:[];
var subjects=(window.REVISE_SUBJECTS||[]).slice();
if(!subjects.length){
 var seen={}; entries.forEach(function(e){if(!seen[e.subject]){seen[e.subject]=1;subjects.push(e.subject);}});
}
if(!subjects.length) subjects=['Science','Mathematics','Social Science','English','Hindi'];
var ui={subject:subjects[0],category:'note'};
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function catMeta(id){return CATS.find(function(x){return x.id===id;})||CATS[0];}
function badgeLabel(t){return t==='note'?'NOTE':t==='short'?'SHORT':t==='pyq'?'PYQ':'MIND MAP';}
function listFor(){return entries.filter(function(e){return e.subject===ui.subject&&e.type===ui.category;});}
function iconFor(e){var x=(e.ext||'').toLowerCase();if(e.type==='mind'||['jpg','jpeg','png','webp','gif','svg'].includes(x))return '🖼️';if(x==='pdf')return '📄';if(['doc','docx'].includes(x))return '📝';if(['ppt','pptx'].includes(x))return '📊';return '📎';}
function render(){
 renderSidebar();
 document.getElementById('subjectTitle').textContent=ui.subject;
 var subjectCount=entries.filter(function(e){return e.subject===ui.subject;}).length;
 document.getElementById('subjectSub').textContent=subjectCount+' files saved in this subject';
 var tabs=document.getElementById('categoryTabs');tabs.innerHTML='';
 CATS.forEach(function(c){var count=entries.filter(function(e){return e.subject===ui.subject&&e.type===c.id;}).length;var el=document.createElement('div');el.className='tab'+(ui.category===c.id?' active':'');el.innerHTML=c.label+' <span class="count">'+count+'</span>';el.onclick=function(){ui.category=c.id;render();};tabs.appendChild(el);});
 var grid=document.getElementById('cardsGrid');grid.innerHTML='';var list=listFor();
 if(!list.length){var msgs={note:['📄','No notes yet','Put note files in content/notes/'+ui.subject],short:['⚡','No short notes yet','Put files in content/short-notes/'+ui.subject],pyq:['📝','No PYQs yet','Put PYQ files in content/pyqs/'+ui.subject],mind:['🖼️','No mind maps yet','Put images in content/mindmaps/'+ui.subject]};var m=msgs[ui.category];grid.innerHTML='<div class="empty-state"><div class="es-icon">'+m[0]+'</div><div class="es-title">'+m[1]+'</div><div class="es-sub mono">'+esc(m[2])+'</div></div>';return;}
 list.forEach(function(e){var card=document.createElement('div');card.className='card file-card';var c=catMeta(e.type);card.innerHTML='<div class="card-top"><div class="card-title">'+iconFor(e)+' '+esc(e.title)+'</div><span class="card-badge '+c.badge+'">'+badgeLabel(e.type)+'</span></div><div class="card-tag">'+esc((e.ext||'file').toUpperCase())+'</div><div class="card-snippet">'+esc(e.filename||e.path)+'</div><div class="file-actions"><button class="file-btn js-preview">Preview / Open</button><a class="file-btn" href="'+encodeURI(e.path)+'" download>Download</a></div>';
 card.querySelector('.js-preview').onclick=function(ev){ev.stopPropagation();openPreview(e);};grid.appendChild(card);});
}
function renderSidebar(){var list=document.getElementById('subjectList');list.innerHTML='';subjects.forEach(function(s,i){var item=document.createElement('div');item.className='subject-item'+(s===ui.subject?' active':'');var count=entries.filter(function(e){return e.subject===s;}).length;item.innerHTML='<span class="subj-dot" style="background:'+COLORS[i%COLORS.length]+'"></span><span class="subj-name">'+esc(s)+'</span><span class="subj-count">'+count+'</span>';item.onclick=function(){ui.subject=s;ui.category='note';render();closeMobileSidebar();};list.appendChild(item);});document.getElementById('statTotal').textContent=entries.length;document.getElementById('statSubjects').textContent=subjects.length;}
function openPreview(e){var root=document.getElementById('modalRoot');var ext=(e.ext||'').toLowerCase();var body;if(e.type==='mind'||['jpg','jpeg','png','webp','gif','svg'].includes(ext)){body='<img class="preview-image" src="'+encodeURI(e.path)+'" alt="'+esc(e.title)+'">';}else if(ext==='pdf'){body='<iframe class="preview-frame" src="'+encodeURI(e.path)+'"></iframe>';}else{body='<div class="empty-state" style="padding:30px"><div class="es-icon">📎</div><div class="es-title">Browser preview may not support this file</div><div class="es-sub">Use Open or Download.</div></div>';}
 root.innerHTML='<div class="overlay" id="previewOverlay"><div class="modal view-modal" style="max-width:900px"><h2>'+esc(e.title)+'</h2>'+body+'<div class="modal-actions"><button class="btn" id="previewClose">Close</button><a class="btn primary" href="'+encodeURI(e.path)+'" target="_blank" rel="noopener">Open</a><a class="btn" href="'+encodeURI(e.path)+'" download>Download</a></div></div></div>';document.getElementById('previewClose').onclick=closeModal;document.getElementById('previewOverlay').onclick=function(ev){if(ev.target.id==='previewOverlay')closeModal();};}
function closeModal(){document.getElementById('modalRoot').innerHTML='';}
var searchInput=document.getElementById('searchInput'),searchResults=document.getElementById('searchResults');searchInput.addEventListener('input',function(){var q=searchInput.value.trim().toLowerCase();if(!q){searchResults.style.display='none';return;}var matches=entries.filter(function(e){return ((e.title||'')+' '+(e.subject||'')+' '+(e.filename||'')).toLowerCase().includes(q);}).slice(0,12);searchResults.innerHTML=matches.length?matches.map(function(e,i){return '<div class="sr-item" data-i="'+i+'"><div class="sr-title">'+esc(e.title)+'</div><div class="sr-meta">'+esc(e.subject)+' · '+badgeLabel(e.type)+'</div></div>';}).join(''):'<div class="sr-empty">No matches</div>';Array.from(searchResults.querySelectorAll('.sr-item')).forEach(function(el){el.onclick=function(){var e=matches[+el.dataset.i];ui.subject=e.subject;ui.category=e.type;searchInput.value='';searchResults.style.display='none';render();openPreview(e);};});searchResults.style.display='block';});document.addEventListener('click',function(e){if(!e.target.closest('.search-wrap'))searchResults.style.display='none';});
var sidebar=document.getElementById('sidebar'),scrim=document.getElementById('sidebarScrim');document.getElementById('hamburgerBtn').onclick=function(){sidebar.classList.add('open');scrim.classList.add('show');};document.getElementById('sidebarClose').onclick=closeMobileSidebar;scrim.onclick=closeMobileSidebar;function closeMobileSidebar(){sidebar.classList.remove('open');scrim.classList.remove('show');}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal();});render();
})();
