import { vi } from 'vitest';

const state = { canHover: true, reducedMotion: false };

function install(): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: query.includes('hover: hover')
        ? state.canHover
        : query.includes('prefers-reduced-motion: reduce')
          ? state.reducedMotion
          : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

export function setHoverCapable(canHover: boolean): void {
  state.canHover = canHover;
  install();
}

export function setReducedMotion(reducedMotion: boolean): void {
  state.reducedMotion = reducedMotion;
  install();
}
