// v4 motion layer. Content is visible without this script; it only adds reveal classes to
// elements that are still below the fold, so nothing on screen ever disappears.
(() => {
 const root = document.documentElement;
 const motion = root.classList.contains('motion-ok') && 'IntersectionObserver' in window;
 const header = document.querySelector('header');

 // ---------- reading progress + compact header + process line + contact parallax (one rAF loop)
 const bar = document.createElement('div'); bar.className = 'read-progress'; bar.setAttribute('aria-hidden', 'true');
 header?.appendChild(bar);
 const plist = document.querySelector('.process-list');
 const mark = document.querySelector('.contact-mark img');
 let ticking = false;
 const frame = () => {
  ticking = false;
  const y = scrollY, max = root.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
  header?.classList.toggle('is-scrolled', y > 8);
  if (!motion) return;
  if (plist) {
   const r = plist.getBoundingClientRect(), start = innerHeight * .75;
   const p = Math.min(1, Math.max(0, (start - r.top) / r.height));
   plist.style.setProperty('--p', p.toFixed(3));
   plist.querySelectorAll('li').forEach(li => li.classList.toggle('is-passed', li.getBoundingClientRect().top < start));
  }
  if (mark) {
   const r = mark.parentElement.getBoundingClientRect();
   if (r.bottom > 0 && r.top < innerHeight) {
    const k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
    mark.style.transform = `translateY(${(k * -36).toFixed(1)}px)`;
   }
  }
 };
 addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
 addEventListener('resize', frame, { passive: true });
 frame();

 // ---------- current section in the navigation
 const links = [...document.querySelectorAll('.main-nav a[href^="#"]')];
 const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
 if ('IntersectionObserver' in window && sections.length) {
  const nav = new IntersectionObserver(entries => {
   for (const e of entries) if (e.isIntersecting) links.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === '#' + e.target.id));
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => nav.observe(s));
 }

 if (!motion) return;
 root.classList.add('anim-ready');

 // ---------- scroll reveal
 const below = el => el.getBoundingClientRect().top > innerHeight * .92;
 const groups = [
  ['.featured-case .case-story > *', 'up'], ['.split-copy > :not(.process-line)', 'up'], ['.lead-proof', 'up'], ['.case-status', 'up'],
  ['.lead-media', 'media'], ['.case-motion', 'media'], ['.video-label', 'up'],
  ['.service-list article', 'up'], ['.about-facts > div', 'up'], ['.process-list li', 'up'], ['.contact-copy > *', 'up'], ['.proof-strip', 'up'],
 ];
 const io = new IntersectionObserver(entries => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
 }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
 for (const [sel, kind] of groups) {
  const els = [...document.querySelectorAll(sel)];
  els.forEach(el => {
   if (el.closest('[data-reveal]') || !below(el)) return;
   const sib = [...el.parentElement.children].filter(c => c.matches(sel)).indexOf(el);
   el.dataset.reveal = kind; el.style.setProperty('--d', (Math.max(0, sib) * 0.07).toFixed(2) + 's');
   io.observe(el);
  });
 }

 // ---------- drawing rules and stepped process lines
 const draw = new IntersectionObserver(entries => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add(e.target.matches('.process-line') ? 'is-in' : 'is-drawn'); draw.unobserve(e.target); }
 }, { threshold: .2 });
 document.querySelectorAll('.case-header, .split-case').forEach(el => draw.observe(el));
 document.querySelectorAll('.process-line').forEach(ol => {
  [...ol.children].forEach((li, i) => li.style.setProperty('--i', i));
  draw.observe(ol);
 });
})();
