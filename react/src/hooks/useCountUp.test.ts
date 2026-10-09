import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { setReducedMotion } from '../test/matchMedia';
import { useCountUp } from './useCountUp';

const TARGET = 35_000;
const DURATION = 20_000;

const advance = (ms: number) => {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
};

describe('useCountUp', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts at 0', () => {
    const { result } = renderHook(() => useCountUp(TARGET, DURATION));

    expect(result.current).toBe(0);
  });

  it('counts up roughly linearly', () => {
    const { result } = renderHook(() => useCountUp(TARGET, DURATION));

    advance(DURATION / 2);

    expect(result.current).toBeGreaterThan(TARGET * 0.49);
    expect(result.current).toBeLessThan(TARGET * 0.51);
  });

  it('never decreases while counting', () => {
    const { result } = renderHook(() => useCountUp(TARGET, DURATION));
    const samples: number[] = [];

    for (let i = 0; i < 20; i += 1) {
      advance(1_000);
      samples.push(result.current);
    }

    expect(samples).toEqual([...samples].sort((a, b) => a - b));
  });

  it('reaches the target after the duration and stays there', () => {
    const { result } = renderHook(() => useCountUp(TARGET, DURATION));

    advance(DURATION + 100);
    expect(result.current).toBe(TARGET);

    advance(10_000);
    expect(result.current).toBe(TARGET);
  });

  it('never overshoots the target, even when frames do not line up with the duration', () => {
    advance(5);
    const { result } = renderHook(() => useCountUp(TARGET, DURATION));

    advance(DURATION + 100);

    expect(result.current).toBe(TARGET);
  });

  it('shows the final value at once, without animating, when the user prefers reduced motion', () => {
    setReducedMotion(true);
    const requestFrame = vi.spyOn(window, 'requestAnimationFrame');
    const { result } = renderHook(() => useCountUp(TARGET, DURATION));

    expect(result.current).toBe(TARGET);
    advance(DURATION);
    expect(result.current).toBe(TARGET);
    expect(requestFrame).not.toHaveBeenCalled();
  });

  it('cancels the pending frame on unmount', () => {
    const cancel = vi.spyOn(window, 'cancelAnimationFrame');
    const { unmount } = renderHook(() => useCountUp(TARGET, DURATION));

    unmount();

    expect(cancel).toHaveBeenCalled();
  });
});
