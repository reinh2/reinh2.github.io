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
 viewer.showModal();
});
viewer?.addEventListener('click',e=>{if(e.target===viewer)viewer.close();});
viewer?.addEventListener('close',()=>{opener?.focus();});
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
