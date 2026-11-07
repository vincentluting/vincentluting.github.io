/**
 * Site-wide motion. Everything here is decoration on top of a page that is
 * complete without it: with JavaScript off, or with motion turned off, the
 * page shows the finished state (text sharp, strokes drawn, seal stamped).
 */
const root = document.documentElement;
const motionOn = () => root.dataset.motion === 'on';

// ---- reveal on scroll -------------------------------------------------------
const REVEAL = '[data-reveal], .brush, .signature, .seal-stamp';
// Cards marked [data-drop] are placed by the cinematic layer (cinema.ts).
const revealAll = () =>
  document.querySelectorAll(`${REVEAL}, [data-drop]`).forEach((el) => el.classList.add('is-visible'));

if (!motionOn() || !('IntersectionObserver' in window)) {
  revealAll();
} else {
  // Elements that start fully clipped (brush strokes, the signature) never
  // count as intersecting, so watch their parent and reveal them through it.
  // Fail open: anything already on screen is marked visible before the hidden
  // state is armed, so text the visitor can see is never hidden, and if this
  // script never runs nothing is hidden at all.
  const onScreen = (el: Element) => {
    const r = el.getBoundingClientRect();
    return r.top < innerHeight && r.bottom > 0;
  };
  document.querySelectorAll(REVEAL).forEach((el) => {
    const watch = el.matches('.brush, .signature') && el.parentElement ? el.parentElement : el;
    if (onScreen(watch)) el.classList.add('is-visible');
  });
  root.dataset.revealArmed = '';
  const targets = new Map<Element, Element[]>();
  document.querySelectorAll(REVEAL).forEach((el) => {
    if (el.classList.contains('is-visible')) return;
    const watch = el.matches('.brush, .signature') && el.parentElement ? el.parentElement : el;
    targets.set(watch, [...(targets.get(watch) ?? []), el]);
  });
  const show = (watch: Element) => {
    targets.get(watch)?.forEach((el) => el.classList.add('is-visible'));
    targets.delete(watch);
    io.unobserve(watch);
  };
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) show(entry.target);
    },
    { rootMargin: '0px 0px 0px 0px', threshold: 0.05 },
  );
  targets.forEach((_, watch) => io.observe(watch));
  // A fast fling can carry a short element from below the fold to above it
  // between two frames, so the observer never sees it intersect. After each
  // scroll, anything already above the viewport is marked visible as well, so
  // it is readable the moment the visitor scrolls back up.
  let sweeping = false;
  window.addEventListener(
    'scroll',
    () => {
      if (sweeping || !targets.size) return;
      sweeping = true;
      requestAnimationFrame(() => {
        sweeping = false;
        for (const watch of [...targets.keys()]) {
          const r = watch.getBoundingClientRect();
          if (r.bottom < 0 || (r.top < innerHeight && r.bottom > 0)) show(watch);
        }
      });
    },
    { passive: true },
  );
}

// ---- ink-bleed title --------------------------------------------------------
// The h1 is visible and readable from the first paint (only its edges are
// soft), so this never delays Largest Contentful Paint.
const title = document.querySelector<HTMLElement>('[data-ink-title]');
const anims = document.querySelectorAll<SVGAnimateElement>('[data-ink-anim]');
if (title && anims.length && motionOn()) {
  title.classList.add('is-bleeding');
  requestAnimationFrame(() => anims.forEach((a) => a.beginElement()));
  window.setTimeout(() => title.classList.remove('is-bleeding'), 1700);
}

// ---- motion toggle ----------------------------------------------------------
const toggles = document.querySelectorAll<HTMLButtonElement>('[data-motion-toggle]');
const syncToggles = () =>
  toggles.forEach((b) => {
    b.setAttribute('aria-pressed', String(motionOn()));
    b.title = motionOn() ? 'Turn animations off' : 'Turn animations on';
    b.setAttribute('aria-label', b.title);
  });
syncToggles();
toggles.forEach((btn) =>
  btn.addEventListener('click', () => {
    const next = motionOn() ? 'off' : 'on';
    root.dataset.motion = next;
    try {
      localStorage.setItem('motion', next);
    } catch {}
    if (next === 'off') {
      revealAll();
      title?.classList.remove('is-bleeding');
    }
    cinema(next === 'on');
    syncToggles();
    window.dispatchEvent(new CustomEvent('motionchange', { detail: next }));
  }),
);

// ---- the cinematic layer (GSAP line reveals, scroll scenes, pointer effects) ---
// Loaded only while motion is on. If it cannot load, the cards it would have
// placed are simply shown.
type Cinema = typeof import('./cinema');
let cinemaModule: Promise<Cinema> | null = null;
function cinema(on: boolean) {
  if (!on && !cinemaModule) return;
  cinemaModule ??= import('./cinema');
  cinemaModule
    .then((m) => (on ? m.start() : m.stop()))
    .catch(() => document.querySelectorAll('[data-drop]').forEach((el) => el.classList.add('is-visible')));
}
if (motionOn()) cinema(true);

// ---- page transitions ---------------------------------------------------------
// The CSS @view-transition rule only checks the OS setting; respect the toggle too.
type WithTransition = Event & { viewTransition?: { skipTransition(): void } | null };
const skipIfOff = (event: Event) => {
  const vt = (event as WithTransition).viewTransition;
  if (vt && !motionOn()) vt.skipTransition();
};
window.addEventListener('pageswap', skipIfOff);
window.addEventListener('pagereveal', skipIfOff);

// ---- clock in the footer -------------------------------------------------
const clocks = document.querySelectorAll<HTMLElement>('[data-clock]');
if (clocks.length) {
  const tick = () =>
    clocks.forEach((el) => {
      el.textContent = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: el.dataset.clock,
      }).format(new Date());
    });
  tick();
  window.setInterval(tick, 30_000);
}
