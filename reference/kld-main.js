/* ════════════════════════════════════════════
   KLD — Korea Long Drive Association
   main.js
════════════════════════════════════════════ */

'use strict';

/* ── Utils ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const isMobile = () => window.innerWidth <= 767;

/* ══════════════════════════════════════════
   1. CUSTOM CURSOR (desktop only)
══════════════════════════════════════════ */
function initCursor() {
  const cursor = $('#cursor');
  const ring   = $('#cursorRing');
  if (!cursor || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  $$('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '54px';
      ring.style.height = '54px';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '36px';
      ring.style.height = '36px';
    });
  });
}


/* ══════════════════════════════════════════
   2. NAV — Hamburger + Drawer
══════════════════════════════════════════ */
function initNav() {
  const hamburger = $('#navHamburger');
  const drawer    = $('#navDrawer');
  if (!hamburger || !drawer) return;

  let open = false;

  function toggleMenu(force) {
    open = typeof force === 'boolean' ? force : !open;
    hamburger.classList.toggle('open', open);
    drawer.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => toggleMenu());

  // Close on drawer link click
  $$('a', drawer).forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  // Close on outside click
  document.addEventListener('click', e => {
    if (open && !hamburger.contains(e.target) && !drawer.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Close on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1023 && open) toggleMenu(false);
  });

  // Nav scroll style
  const nav = $('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.background = window.scrollY > 60
        ? 'rgba(8,8,8,0.98)'
        : 'linear-gradient(to bottom, rgba(8,8,8,0.97) 0%, transparent 100%)';
    }, { passive: true });
  }
}


/* ══════════════════════════════════════════
   3. COUNTDOWN TIMER
══════════════════════════════════════════ */
function initCountdown() {
  const elD = $('#cdDays');
  const elH = $('#cdHours');
  const elM = $('#cdMins');
  if (!elD) return;

  const TARGET = new Date('2025-06-29T09:00:00');

  function update() {
    const diff = TARGET - Date.now();
    if (diff <= 0) {
      elD.textContent = '00'; elH.textContent = '00'; elM.textContent = '00';
      return;
    }
    const d = Math.floor(diff / 86_400_000);
    const h = Math.floor((diff % 86_400_000) / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    elD.textContent = String(d).padStart(2, '0');
    elH.textContent = String(h).padStart(2, '0');
    elM.textContent = String(m).padStart(2, '0');
  }

  update();
  setInterval(update, 60_000);
}


/* ══════════════════════════════════════════
   4. DIVISION TABS (Rankings)
══════════════════════════════════════════ */
function initDivisionTabs() {
  $$('.div-tab').forEach(tab => {
    tab.addEventListener('click', function () {
      $$('.div-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      // TODO: filter ranking rows by division when real data is connected
    });
  });
}


/* ══════════════════════════════════════════
   5. MOBILE BOTTOM TAB BAR
══════════════════════════════════════════ */
function initBottomTabs() {
  $$('.tab-item').forEach(tab => {
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      $$('.tab-item').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });
}


/* ══════════════════════════════════════════
   6. SCROLL REVEAL
══════════════════════════════════════════ */
function initScrollReveal() {
  const targets = $$('.reveal');
  if (!targets.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);   // fire once
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => io.observe(el));
}


/* ══════════════════════════════════════════
   7. STATUS BAR CLOCK (mobile header)
══════════════════════════════════════════ */
function initStatusClock() {
  const el = $('#statusTime');
  if (!el) return;
  function tick() {
    const n = new Date();
    el.textContent = `${n.getHours()}:${String(n.getMinutes()).padStart(2, '0')}`;
  }
  tick();
  setInterval(tick, 60_000);
}


/* ══════════════════════════════════════════
   8. TOUCH FEEDBACK (mobile)
══════════════════════════════════════════ */
function initTouchFeedback() {
  $$('.rank-row, .notice-item, .player-card, .media-item').forEach(el => {
    el.addEventListener('touchstart', () => { el.style.opacity = '0.75'; }, { passive: true });
    el.addEventListener('touchend',   () => { el.style.opacity = '1'; },   { passive: true });
    el.addEventListener('touchcancel',() => { el.style.opacity = '1'; },   { passive: true });
  });
}


/* ══════════════════════════════════════════
   9. PLAYER CARDS — hover (desktop)
══════════════════════════════════════════ */
function initPlayerCards() {
  // Cards already use CSS :hover — JS hook for future interactions
  $$('.player-card').forEach(card => {
    card.addEventListener('click', () => {
      // Placeholder: navigate to player profile
      // window.location.href = `/players/${card.dataset.id}`;
    });
  });
}


/* ══════════════════════════════════════════
   10. RESPONSIVE LAYOUT FIXES
      (things CSS alone can't handle cleanly)
══════════════════════════════════════════ */
function initResponsiveFixes() {
  // On very small screens, collapse hero countdown to horizontal scroll
  function adjustHeroCountdown() {
    const cd = $('.hero-countdown');
    if (!cd) return;
    cd.style.overflowX = window.innerWidth < 420 ? 'auto' : '';
  }

  adjustHeroCountdown();
  window.addEventListener('resize', adjustHeroCountdown, { passive: true });
}


/* ══════════════════════════════════════════
   INIT — run after DOM ready
══════════════════════════════════════════ */
function init() {
  initCursor();
  initNav();
  initCountdown();
  initDivisionTabs();
  initBottomTabs();
  initScrollReveal();
  initStatusClock();
  initTouchFeedback();
  initPlayerCards();
  initResponsiveFixes();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
