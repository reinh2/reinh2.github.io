const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu(){ nav.classList.remove('open');menu.setAttribute('aria-expanded','false'); }
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape' && nav.classList.contains('open')){closeMenu();menu.focus();}});
document.querySelector('.replay')?.addEventListener('click',()=>{const list=document.querySelector('.activity-list');const clone=list.cloneNode(true);list.replaceWith(clone);});
const viewer=document.querySelector('.lightbox');
let opener;
for(const link of document.querySelectorAll('[data-zoom]'))link.addEventListener('click',event=>{
 if(!viewer?.showModal || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)return;
 event.preventDefault();opener=link;
 const source=link.querySelector('img');
 const image=viewer.querySelector('img');image.src=link.href;image.alt=source.alt;
 viewer.querySelector('.lightbox-caption').textContent=source.alt;
 viewer.classList.toggle('is-portrait',source.naturalHeight>source.naturalWidth);
 viewer.showModal();
});
viewer?.addEventListener('click',e=>{if(e.target===viewer)viewer.close();});
viewer?.addEventListener('close',()=>{opener?.focus();});
// Before / after tabs. Without JS every panel stays visible one after another.
for(const box of document.querySelectorAll('[data-compare]')){
 const tabs=[...box.querySelectorAll('[role=tab]')];
 const select=(tab,focus)=>{
  for(const t of tabs){const on=t===tab;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!on;}
  if(focus)tab.focus();
 };
 const reveal=tab=>tab.scrollIntoView({block:'nearest',inline:'nearest'});
 tabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>{select(tab);reveal(tab);});
  tab.addEventListener('keydown',e=>{
   const next={ArrowRight:i+1,ArrowLeft:i-1,Home:0,End:tabs.length-1}[e.key];
   if(next===undefined)return;
   e.preventDefault();const target=tabs[(next+tabs.length)%tabs.length];select(target,true);reveal(target);
  });
 });
 select(tabs[0]);
}
// Case motion video: plays muted only while on screen; respects reduced motion and a manual pause.
const motion=document.querySelector('.motion-video');
if(motion && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window){
 let userPaused=false, ours=false;
 motion.addEventListener('pause',()=>{if(!ours)userPaused=true;ours=false;});
 motion.addEventListener('play',()=>{userPaused=false;});
 new IntersectionObserver(entries=>{for(const e of entries){
  if(e.isIntersecting){if(!userPaused)motion.play().catch(()=>{});}
  else if(!motion.paused){ours=true;motion.pause();}
 }},{threshold:.4}).observe(motion);
}
// Keep the corresponding section when switching language. Real links work without JS.
for(const link of document.querySelectorAll('.languages a'))link.addEventListener('click',()=>{link.hash=location.hash;});

// Animate on entry only; content remains visible without JS or an observer.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
 const entrances = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {
   entry.target.classList.add('enter-once');
   if (entry.target.matches('#work > .section-heading')) entry.target.classList.add('checkpoint-enter');
   entrances.unobserve(entry.target);
  }
 }, { threshold: 0.12 });
 document.querySelectorAll('#work > .section-heading, #services > .section-heading, .about-copy, #process > .section-heading').forEach(el => entrances.observe(el));
 reducedMotion.addEventListener('change', event => { if (event.matches) entrances.disconnect(); });
}
