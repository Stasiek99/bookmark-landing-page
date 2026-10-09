import { DestroyRef, afterNextRender, inject, signal, type Signal } from '@angular/core';

function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function countUp(target: number, durationMs: number): Signal<number> {
  const reduceMotion = prefersReducedMotion();
  const value = signal(reduceMotion ? target : 0);
  const destroyRef = inject(DestroyRef);

  afterNextRender(() => {
    if (reduceMotion) return;

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      value.set(Math.round(target * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    destroyRef.onDestroy(() => cancelAnimationFrame(frame));
  });

  return value.asReadonly();
}
