const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu(){ nav.classList.remove('open');menu.setAttribute('aria-expanded','false'); }
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape' && nav.classList.contains('open')){closeMenu();menu.focus();}});
document.querySelector('.replay')?.addEventListener('click',()=>{const list=document.querySelector('.activity-list');const clone=list.cloneNode(true);list.replaceWith(clone);});
// Case videos get a small player of their own: the native bar sat on top of the REINH mark in every frame.
// Without JS the native controls stay. A video plays muted while it is on screen, unless the visitor
// prefers reduced motion, has data saver on, or paused it by hand.
const say=document.documentElement.lang==='ru'
 ?{play:'Воспроизвести',pause:'Пауза',soundOn:'Включить звук',soundOff:'Выключить звук',full:'Во весь экран'}
 :{play:'Play',pause:'Pause',soundOn:'Turn sound on',soundOff:'Turn sound off',full:'Full screen'};
const control=(kind,label)=>{const b=document.createElement('button');b.type='button';b.className='vbtn vbtn-'+kind;b.setAttribute('aria-label',label);b.innerHTML='<span class="ic" aria-hidden="true"></span>';return b;};
const autoplay=!(matchMedia('(prefers-reduced-motion: reduce)').matches||navigator.connection?.saveData)&&'IntersectionObserver' in window;
const players=new Map();
for(const box of document.querySelectorAll('.player')){
 const v=box.querySelector('video');
 if(!v)continue;
 const s={userPaused:false,ours:false,box}; players.set(v,s);
 v.controls=false; box.classList.add('is-enhanced','is-muted');
 // the big play button shows only while a video waits for the visitor: no autoplay, or paused by hand
 if(!autoplay)box.classList.add('is-held');
 const big=control('big',say.play), play=control('play',say.play), sound=control('sound',say.soundOn), full=control('full',say.full);
 const bar=document.createElement('div'); bar.className='vbar'; bar.append(play,sound,full);
 const track=document.createElement('div'); track.className='vprogress'; track.setAttribute('aria-hidden','true');
 const fill=document.createElement('i'); track.append(fill);
 box.append(big,bar,track);
 const toggle=()=>{if(v.paused)v.play().catch(()=>{});else v.pause();};
 big.addEventListener('click',toggle); play.addEventListener('click',toggle);
 v.addEventListener('click',()=>{if(!v.controls)toggle();});
 sound.addEventListener('click',()=>{v.muted=!v.muted;if(!v.muted&&v.paused)v.play().catch(()=>{});});
 full.addEventListener('click',()=>{if(v.requestFullscreen)v.requestFullscreen().catch(()=>{});else v.webkitEnterFullscreen?.();});
 // inside full screen the native controls are the only way to seek
 document.addEventListener('fullscreenchange',()=>{v.controls=document.fullscreenElement===v;});
 v.addEventListener('volumechange',()=>{box.classList.toggle('is-muted',v.muted);sound.setAttribute('aria-label',v.muted?say.soundOn:say.soundOff);});
 let frame=0;
 const progress=()=>{fill.style.transform=`scaleX(${v.duration?v.currentTime/v.duration:0})`;frame=requestAnimationFrame(progress);};
 v.addEventListener('play',()=>{s.userPaused=false;box.classList.remove('is-held');box.classList.add('is-playing');play.setAttribute('aria-label',say.pause);cancelAnimationFrame(frame);progress();});
 v.addEventListener('pause',()=>{if(!s.ours){s.userPaused=true;box.classList.add('is-held');}s.ours=false;box.classList.remove('is-playing');play.setAttribute('aria-label',say.play);cancelAnimationFrame(frame);});
}
if(autoplay){
 const watcher=new IntersectionObserver(entries=>{for(const e of entries){
  const v=e.target, s=players.get(v);
  if(e.isIntersecting){if(!s.userPaused)v.play().catch(()=>s.box.classList.add('is-held'));}
  else if(!v.paused){s.ours=true;v.pause();}
 }},{threshold:.4});
 for(const v of players.keys())watcher.observe(v);
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
