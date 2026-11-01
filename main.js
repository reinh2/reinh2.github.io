// Reinh test site: mobile menu, header offset for anchors, before/after tabs, image viewer, video players and short
// entrances. Everything here is an enhancement: without JS the page shows all content, the native video controls and
// every before/after pair, and the snapshots open as plain image links.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;

// ---------- header height → anchor offset (scroll-padding-top uses --head-h) ----------
const bar = document.querySelector('.top');
const syncHead = () => root.style.setProperty('--head-h', bar.offsetHeight + 'px');
if (bar) { syncHead(); new ResizeObserver(syncHead).observe(bar); }

// ---------- mobile menu ----------
const menuBtn = document.querySelector('.menu-btn');
const nav = document.getElementById('site-nav');
if (menuBtn && nav) {
  menuBtn.hidden = false;
  const small = matchMedia('(max-width: 900px)');
  const isOpen = () => menuBtn.getAttribute('aria-expanded') === 'true';
  const setOpen = (open, { focus } = {}) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    nav.classList.toggle('open', open);
    if (open && focus) nav.querySelector('a')?.focus();
    if (!open && focus) menuBtn.focus();
  };
  setOpen(false);
  menuBtn.addEventListener('click', () => setOpen(!isOpen(), { focus: !isOpen() && menuBtn.matches(':focus-visible') }));
  // choosing a section closes the menu; the browser then scrolls to the anchor below the sticky header
  nav.addEventListener('click', (e) => { if (e.target.closest('a') && small.matches) setOpen(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) { e.preventDefault(); setOpen(false, { focus: true }); }
  });
  // a click or focus outside the header closes it
  document.addEventListener('pointerdown', (e) => { if (isOpen() && !bar.contains(e.target)) setOpen(false); });
  bar.addEventListener('focusout', (e) => { if (isOpen() && !bar.contains(e.relatedTarget)) setOpen(false); });
  small.addEventListener('change', () => setOpen(false));
}

// ---------- before / after tabs ----------
for (const box of document.querySelectorAll('[data-compare]')) {
  const wrap = box.querySelector('.tabs-wrap');
  const list = box.querySelector('[role=tablist]');
  const tabs = [...box.querySelectorAll('[role=tab]')];
  const panel = (t) => document.getElementById(t.getAttribute('aria-controls'));
  wrap.hidden = false;
  const select = (tab, focus) => {
    for (const t of tabs) {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panel(t).hidden = !on;
    }
    if (focus) tab.focus();
    // keep the chosen tab fully visible inside the scrolling row (no page scroll)
    const l = tab.offsetLeft - list.offsetLeft, r = l + tab.offsetWidth;
    if (l < list.scrollLeft) list.scrollTo({ left: l - 4, behavior: reduced ? 'auto' : 'smooth' });
    else if (r > list.scrollLeft + list.clientWidth) list.scrollTo({ left: r - list.clientWidth + 4, behavior: reduced ? 'auto' : 'smooth' });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (to === undefined) return;
      e.preventDefault();
      select(tabs[(to + tabs.length) % tabs.length], true);
    });
  });
  // fade on the right edge while more tabs are hidden there
  const edge = () => wrap.classList.toggle('more', list.scrollLeft + list.clientWidth < list.scrollWidth - 2);
  list.addEventListener('scroll', edge, { passive: true });
  new ResizeObserver(edge).observe(list);
  select(tabs[0]);
}

// ---------- image viewer for the before/after shots ----------
const viewer = document.querySelector('.viewer');
if (viewer?.showModal) {
  const img = viewer.querySelector('img');
  const cap = viewer.querySelector('.viewer-cap');
  let opener = null;
  for (const link of document.querySelectorAll('[data-zoom]')) {
    const thumb = link.querySelector('img');
    link.setAttribute('aria-label', 'Открыть крупно. ' + thumb.alt);
    link.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // new tab / window still works
      e.preventDefault();
      opener = link;
      img.src = link.href;
      img.alt = thumb.alt;
      cap.textContent = thumb.alt;
      viewer.classList.toggle('portrait', thumb.naturalHeight > thumb.naturalWidth || +thumb.getAttribute('height') > +thumb.getAttribute('width'));
      viewer.showModal();
      viewer.querySelector('[data-close]').focus();
    });
  }
  viewer.querySelector('[data-close]').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', (e) => { if (e.target === viewer) viewer.close(); }); // backdrop
  viewer.addEventListener('close', () => { img.removeAttribute('src'); opener?.focus(); });
}

// ---------- video players ----------
// Native controls are in the HTML for the no-JS case. Here they are swapped for a play pill; after a click the video
// plays with sound and native controls. Starting one video pauses the others. A failed load or a refused play() shows
// a message and turns the pill into «Повторить».
const players = [...document.querySelectorAll('[data-player]')];
for (const box of players) {
  const v = box.querySelector('video');
  const b = box.querySelector('.play');
  const label = b.querySelector('.play-label');
  const msg = box.querySelector('.player-msg');
  const idle = label.textContent;
  v.controls = false;
  b.hidden = false;
  const fail = (text) => {
    box.classList.remove('playing');
    box.classList.add('failed');
    v.controls = false;
    msg.textContent = text;
    label.textContent = 'Повторить';
    b.hidden = false;
  };
  const start = () => {
    for (const other of document.querySelectorAll('[data-player] video')) if (other !== v) other.pause();
    msg.textContent = '';
    if (box.classList.contains('failed')) { box.classList.remove('failed'); v.load(); }
    v.muted = false;
    v.loop = false;
    v.controls = true;
    box.classList.add('playing');
    const p = v.play();
    if (p) p.catch((err) => {
      if (err && err.name === 'AbortError') return; // interrupted by another play/pause, not an error
      fail(err && err.name === 'NotAllowedError' ? 'Браузер не разрешил запуск. Нажмите ещё раз.' : 'Видео не удалось запустить.');
    });
  };
  b.addEventListener('click', start);
  v.addEventListener('play', () => {
    for (const other of document.querySelectorAll('[data-player] video')) if (other !== v) other.pause();
  });
  // network or decode error: on the <video> itself, or on the last <source> when none could be loaded
  v.addEventListener('error', () => fail('Видео не загрузилось. Проверьте соединение и повторите.'));
  v.querySelector('source:last-of-type')?.addEventListener('error', () => fail('Видео не загрузилось. Проверьте соединение и повторите.'));
  v.addEventListener('ended', () => {
    box.classList.remove('playing');
    v.controls = false;
    label.textContent = 'Посмотреть ещё раз';
    v.load(); // back to the poster
    b.focus({ preventScroll: true });
  });
  // keep the idle label in sync if a replay starts from the native controls
  v.addEventListener('playing', () => { label.textContent = idle; msg.textContent = ''; box.classList.remove('failed'); });
}

// ---------- short entrances ----------
// Only blocks that start below the first screen are hidden, and only while JS runs; each is shown as soon as any part
// of it enters the viewport (threshold 0), so tall blocks, short screens and zoom never keep content hidden.
if (!reduced && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.remove('pending');
      io.unobserve(e.target);
    }
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
  for (const el of document.querySelectorAll('.reveal')) {
    if (el.getBoundingClientRect().top < innerHeight) continue;
    el.classList.add('pending');
    io.observe(el);
  }
  // anchor jumps (menu, service links) land on content that must be visible right away
  addEventListener('hashchange', () => {
    const t = document.querySelector(location.hash);
    t?.closest('.reveal')?.classList.remove('pending');
    t?.querySelectorAll('.reveal.pending').forEach((el) => el.classList.remove('pending'));
  });
}
