import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate, stagger } from 'motion';

gsap.registerPlugin(ScrollTrigger);
const root = document.documentElement;
const base = document.currentScript && document.currentScript.src;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const out = [0.23, 1, 0.32, 1];

/* GSAP: the page title rises letter by letter from behind a mask, once. */
function title() {
  const h1 = document.querySelector('.hero h1, .archive-title h1');
  if (!h1 || reduce) return;
  const text = h1.textContent.trim();
  h1.setAttribute('aria-label', text);
  h1.textContent = '';
  const chars = [...text].map(c => {
    const mask = document.createElement('span'), inner = document.createElement('span');
    mask.className = 'ch'; mask.setAttribute('aria-hidden', 'true');
    inner.textContent = c === ' ' ? '\u00a0' : c;
    mask.append(inner); h1.append(mask);
    return inner;
  });
  root.classList.add('fx-ready');
  gsap.from(chars, { yPercent: 130, duration: 1, ease: 'expo.out', stagger: 0.05, delay: 0.05 });
}

/* GSAP + ScrollTrigger: images wipe in once, the timeline draws as you read. */
function scroll() {
  if (reduce) return;
  document.querySelectorAll('.case-image').forEach(el => {
    const st = { trigger: el, start: 'top 85%', once: true };
    gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'expo.out', scrollTrigger: st });
    gsap.fromTo(el.querySelector('img'), { scale: 1.14 }, { scale: 1, duration: 1.6, ease: 'expo.out', scrollTrigger: st });
  });
  const list = document.querySelector('.experience-list');
  if (!list) return;
  list.style.setProperty('--p', '0');
  ScrollTrigger.create({ trigger: list, start: 'top 60%', end: 'bottom 60%', scrub: true,
    onUpdate: s => list.style.setProperty('--p', s.progress.toFixed(3)) });
  list.querySelectorAll('.experience-item').forEach(item =>
    ScrollTrigger.create({ trigger: item, start: 'top 60%', toggleClass: { targets: item, className: 'is-passed' } }));
}

/* Motion: springs on buttons, staggered rows after a filter, staggered mobile menu. */
function interactions() {
  if (reduce) return;
  if (fine) document.querySelectorAll('.button').forEach(b => {
    const spring = { type: 'spring', stiffness: 260, damping: 18 };
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      animate(b, { x: (e.clientX - r.left - r.width / 2) * 0.18, y: (e.clientY - r.top - r.height / 2) * 0.28 }, spring);
    });
    b.addEventListener('pointerleave', () => animate(b, { x: 0, y: 0, scale: 1 }, spring));
    b.addEventListener('pointerdown', () => animate(b, { scale: 0.97 }, { duration: 0.1 }));
    b.addEventListener('pointerup', () => animate(b, { scale: 1 }, { duration: 0.18, ease: out }));
  });
  const rows = [...document.querySelectorAll('.project-row')];
  if (rows.length) {
    const mo = new MutationObserver(list => {
      const shown = [...new Set(list.map(m => m.target))].filter(r => !r.hidden).slice(0, 14);
      if (shown.length) animate(shown, { opacity: [0, 1], y: [10, 0] }, { duration: 0.32, delay: stagger(0.03), ease: out });
    });
    rows.forEach(r => mo.observe(r, { attributes: true, attributeFilter: ['hidden'] }));
  }
  new MutationObserver(() => {
    if (document.body.classList.contains('menu-open'))
      animate('.nav-links a', { opacity: [0, 1], x: [-14, 0] }, { duration: 0.3, delay: stagger(0.05), ease: out });
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
}

/* three.js: loaded last, only on the home page, in its own file. */
function field() {
  const hero = document.querySelector('.hero');
  if (!hero || !base) return;
  const s = document.createElement('script');
  s.src = new URL('field.js', base).href;
  s.onload = () => {
    const canvas = window.HeroField && window.HeroField.mountField(hero, reduce);
    if (canvas && !reduce) gsap.to(canvas, { opacity: 0, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'bottom 75%', end: 'bottom 15%', scrub: true } });
  };
  document.head.append(s);
}

title(); scroll(); interactions();
document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
(window.requestIdleCallback || setTimeout)(field, 400);
