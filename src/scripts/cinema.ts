/**
 * The cinematic layer: smooth scrolling (Lenis), line-by-line text reveals
 * (GSAP SplitText) and scroll-linked scenes (GSAP ScrollTrigger), plus the
 * ink cursor on fine pointers.
 *
 * motion.ts loads this module only while motion is on, so visitors who turn
 * motion off (or ask their OS for less) never download it. Everything here is
 * created inside one gsap.matchMedia() so stop() puts every element back
 * exactly as the HTML left it.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { startCursor } from './cursor';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const EASE = 'expo.out';

let lenis: Lenis | null = null;
let mm: gsap.MatchMedia | null = null;
let stopCursor: (() => void) | null = null;
const splits: SplitText[] = [];

const raf = (time: number) => lenis?.raf(time * 1000);

const inView = (el: Element) => {
  const r = el.getBoundingClientRect();
  return r.top < innerHeight * 0.92 && r.bottom > 0;
};

// ---- smooth scroll ------------------------------------------------------------
function startLenis() {
  lenis = new Lenis({ lerp: 0.09, anchors: true, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
}

// ---- headings and paragraphs, line by line -----------------------------------
// Only text that is still below the fold is split, so nothing the visitor is
// already reading jumps.
function splitLines() {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    if (inView(el)) return;
    const body = el.dataset.split === 'body';
    const split = SplitText.create(el, {
      type: 'lines',
      mask: body ? undefined : 'lines',
      autoSplit: true,
      linesClass: 'split-line',
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: body ? 0 : 105,
          y: body ? 14 : 0,
          opacity: body ? 0 : 1,
          duration: body ? 0.9 : 1.1,
          stagger: body ? 0.05 : 0.08,
          ease: EASE,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      },
    });
    splits.push(split);
  });
}

// ---- cards dropping onto the desk --------------------------------------------
function dropCards() {
  const cards = gsap.utils.toArray<HTMLElement>('[data-drop]').filter((el) => !inView(el));
  gsap.utils.toArray<HTMLElement>('[data-drop]').forEach((el) => el.classList.add('is-visible'));
  if (!cards.length) return;
  gsap.set(cards, { opacity: 0, y: 44, rotation: (i) => (i % 2 ? 1.6 : -1.4), transformOrigin: '50% 100%' });
  ScrollTrigger.batch(cards, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, rotation: 0, duration: 1.1, stagger: 0.09, ease: EASE, overwrite: true }),
  });
}

// ---- the hero: text lifts away, the portrait sheet drifts the other way -------
function heroScene() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;
  const text = hero.querySelector('[data-hero-text]');
  const sheet = hero.querySelector('[data-hero-sheet]');
  const ink = hero.closest('.ink')?.querySelectorAll('.ink__sim, .ink-mountains, .ink__fallback');
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 },
  });
  if (text) tl.to(text, { yPercent: -14, opacity: 0.25 }, 0);
  if (sheet) tl.to(sheet, { yPercent: 10, rotation: -1.2 }, 0); // undoes the sheet's 1.2° rest angle
  if (ink?.length) tl.to(ink, { yPercent: 16 }, 0);
}

// ---- the signature is written as you scroll past it -------------------------
function signatureScene() {
  document.querySelectorAll<SVGElement>('.signature').forEach((sig) => {
    if (inView(sig)) return;
    gsap.fromTo(
      sig,
      { clipPath: 'inset(0 100% 0 0)', transition: 'none' },
      {
        clipPath: 'inset(0 0% 0 0)',
        ease: 'power1.inOut',
        scrollTrigger: { trigger: sig, start: 'top 90%', end: 'top 55%', scrub: 0.8 },
      },
    );
  });
}

// ---- contact: the closing line settles into place ------------------------------
function closingScene() {
  document.querySelectorAll<HTMLElement>('[data-settle]').forEach((el) => {
    gsap.fromTo(
      el,
      { scale: 0.94, transformOrigin: '0% 100%' },
      { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 45%', scrub: 0.8 } },
    );
  });
}

// ---- header: tucks away going down, returns going up ------------------------
function headerScene() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  const panel = header.querySelector<HTMLElement>('[data-nav-panel]');
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate(self) {
      const y = self.scroll();
      header.classList.toggle('is-scrolled', y > 40);
      const menuOpen = panel && !panel.classList.contains('hidden');
      const hide = self.direction === 1 && y > 240 && !menuOpen && !header.contains(document.activeElement);
      header.classList.toggle('is-tucked', hide);
    },
  });
  return () => header.classList.remove('is-scrolled', 'is-tucked');
}

export function start() {
  if (lenis) return;
  root.dataset.cinema = '';
  startLenis();
  mm = gsap.matchMedia();
  let resetHeader: (() => void) | undefined;
  mm.add('all', () => {
    splitLines();
    dropCards();
    signatureScene();
    closingScene();
    resetHeader = headerScene();
    return () => resetHeader?.();
  });
  mm.add('(min-width: 1024px)', () => heroScene());
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) stopCursor = startCursor();
  // Fonts change line breaks; measure again once they are in.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

export function stop() {
  if (!lenis) return;
  delete root.dataset.cinema;
  stopCursor?.();
  stopCursor = null;
  splits.splice(0).forEach((s) => s.revert());
  mm?.revert();
  mm = null;
  gsap.ticker.remove(raf);
  lenis.destroy();
  lenis = null;
}
