/**
 * The ink cursor (fine pointers only): a drop of ink that follows the pointer
 * and a wash around it that trails behind. Over links the wash spreads and
 * turns vermilion; over cards it carries a small label. Buttons marked
 * [data-magnetic] lean towards the pointer, and cards marked [data-tilt]
 * tip slightly like a sheet lifted by one corner.
 *
 * The cursor never takes pointer events, so clicks on the hero still drop ink.
 */
import { gsap } from 'gsap';

const INTERACTIVE = 'a, button, [role="button"], label, summary, [data-cursor]';
const TEXT_INPUT = 'input, textarea, select, [contenteditable="true"]';

export function startCursor(): () => void {
  const cursor = document.querySelector<HTMLElement>('[data-ink-cursor]');
  if (!cursor) return () => {};
  const dot = cursor.querySelector<HTMLElement>('.ink-cursor__dot')!;
  const wash = cursor.querySelector<HTMLElement>('.ink-cursor__wash')!;
  const label = cursor.querySelector<HTMLElement>('.ink-cursor__label')!;
  const root = document.documentElement;
  const ac = new AbortController();
  const on = { signal: ac.signal, passive: true } as const;

  const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
  const washX = gsap.quickTo(wash, 'x', { duration: 0.5, ease: 'power3' });
  const washY = gsap.quickTo(wash, 'y', { duration: 0.5, ease: 'power3' });

  let shown = false;
  let state = '';
  const setState = (next: string, text = '') => {
    if (next === state && label.textContent === text) return;
    state = next;
    cursor.dataset.state = next;
    label.textContent = text;
  };

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      if (!shown) {
        shown = true;
        gsap.set([dot, wash], { x: e.clientX, y: e.clientY });
        root.dataset.cursorOn = '';
      }
      dotX(e.clientX);
      dotY(e.clientY);
      washX(e.clientX);
      washY(e.clientY);
      const target = e.target as Element | null;
      if (target?.closest(TEXT_INPUT)) return setState('text');
      const hit = target?.closest<HTMLElement>(INTERACTIVE);
      if (hit?.dataset.cursor) return setState('label', hit.dataset.cursor);
      const labelled = target?.closest<HTMLElement>('[data-cursor]');
      if (labelled) return setState('label', labelled.dataset.cursor);
      setState(hit ? 'link' : '');
    },
    on,
  );
  document.documentElement.addEventListener('pointerleave', () => cursor.classList.add('is-away'), on);
  document.documentElement.addEventListener('pointerenter', () => cursor.classList.remove('is-away'), on);
  window.addEventListener('pointerdown', () => cursor.classList.add('is-pressed'), on);
  window.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'), on);

  // ---- magnetic buttons ----------------------------------------------------------
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((btn) => {
    const inner = btn.querySelector<HTMLElement>('[data-magnetic-inner]');
    // The button itself moves through the CSS `translate` property so GSAP
    // never folds its hover `rotate` into a transform.
    const move = (x: number, y: number) => (btn.style.translate = x || y ? `${x}px ${y}px` : '');
    const ix = inner && gsap.quickTo(inner, 'x', { duration: 0.45, ease: 'power3' });
    const iy = inner && gsap.quickTo(inner, 'y', { duration: 0.45, ease: 'power3' });
    btn.addEventListener(
      'pointermove',
      (e) => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        move(dx * 6, dy * 5);
        ix?.(dx * 3);
        iy?.(dy * 2.5);
      },
      on,
    );
    btn.addEventListener(
      'pointerleave',
      () => {
        move(0, 0);
        if (inner) gsap.to(inner, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)', overwrite: true });
      },
      on,
    );
  });

  // ---- cards tip towards the pointer ------------------------------------------
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' });
    card.addEventListener(
      'pointermove',
      (e) => {
        if (!card.dataset.tilting) {
          card.dataset.tilting = '';
          gsap.set(card, { transformPerspective: 900 });
        }
        const r = card.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 5);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 4);
      },
      on,
    );
    card.addEventListener('pointerleave', () => (rx(0), ry(0)), on);
  });

  return () => {
    ac.abort();
    delete root.dataset.cursorOn;
    setState('');
    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((b) => (b.style.translate = ''));
    document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((c) => delete c.dataset.tilting);
    gsap.set('[data-magnetic-inner], [data-tilt]', { clearProps: 'transform,translate,rotate,scale' });
  };
}
