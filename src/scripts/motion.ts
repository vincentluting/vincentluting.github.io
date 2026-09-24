/**
 * Site-wide motion. Everything here is decoration on top of a page that is
 * complete without it: with JavaScript off, or with motion turned off, the
 * page shows the finished state (text sharp, strokes drawn, seal stamped).
 */
const root = document.documentElement;
const motionOn = () => root.dataset.motion === 'on';

// ---- reveal on scroll -------------------------------------------------------
const REVEAL = '[data-reveal], .brush, .signature, .seal-stamp';
const revealAll = () => document.querySelectorAll(REVEAL).forEach((el) => el.classList.add('is-visible'));

if (!motionOn() || !('IntersectionObserver' in window)) {
  revealAll();
} else {
  // Elements that start fully clipped (brush strokes, the signature) never
  // count as intersecting, so watch their parent and reveal them through it.
  const targets = new Map<Element, Element[]>();
  document.querySelectorAll(REVEAL).forEach((el) => {
    const watch = el.matches('.brush, .signature') && el.parentElement ? el.parentElement : el;
    targets.set(watch, [...(targets.get(watch) ?? []), el]);
  });
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          targets.get(entry.target)?.forEach((el) => el.classList.add('is-visible'));
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  targets.forEach((_, watch) => io.observe(watch));
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
    syncToggles();
    window.dispatchEvent(new CustomEvent('motionchange', { detail: next }));
  }),
);

// ---- page transitions ---------------------------------------------------------
// The CSS @view-transition rule only checks the OS setting; respect the toggle too.
type WithTransition = Event & { viewTransition?: { skipTransition(): void } | null };
const skipIfOff = (event: Event) => {
  const vt = (event as WithTransition).viewTransition;
  if (vt && !motionOn()) vt.skipTransition();
};
window.addEventListener('pageswap', skipIfOff);
window.addEventListener('pagereveal', skipIfOff);

// ---- two clocks in the footer -------------------------------------------------
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

// ---- hand-drawn marks on key numbers (stories only) -----------------------------
const marks = document.querySelectorAll<HTMLElement>('[data-annotate]');
if (marks.length) {
  import('./annotate').then((m) => m.annotate(marks, motionOn()));
}
