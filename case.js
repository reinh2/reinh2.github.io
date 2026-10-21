// Maxi-Plast client case: image viewer for the before/after shots and the tabs between them.
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
