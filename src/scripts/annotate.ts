import { annotate as rough } from 'rough-notation';

/**
 * Circles or underlines key numbers with a hand-drawn vermilion pen stroke
 * when they scroll into view. With motion off the marks appear already drawn.
 */
export function annotate(elements: NodeListOf<HTMLElement>, animate: boolean) {
  const list = Array.from(elements);
  const color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#b8452f';
  const items = list.map((el) =>
    rough(el, {
      type: (el.dataset.annotate as 'circle' | 'underline' | 'box' | 'highlight') || 'underline',
      color,
      strokeWidth: 1.6,
      padding: el.dataset.annotate === 'circle' ? 6 : 2,
      iterations: 2,
      animate,
      animationDuration: 900,
    }),
  );
  if (!animate || !('IntersectionObserver' in window)) {
    items.forEach((a) => a.show());
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const i = list.indexOf(entry.target as HTMLElement);
        window.setTimeout(() => items[i]?.show(), 250 + i * 180);
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.6 },
  );
  list.forEach((el) => io.observe(el));
}
