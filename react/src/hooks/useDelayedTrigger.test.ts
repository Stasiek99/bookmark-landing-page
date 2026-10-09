import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDelayedTrigger } from './useDelayedTrigger';

describe('useDelayedTrigger', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not fire before the delay', () => {
    const callback = vi.fn();
    renderHook(() => {
      useDelayedTrigger(callback, 30_000);
    });

    vi.advanceTimersByTime(29_999);

    expect(callback).not.toHaveBeenCalled();
  });

  it('fires exactly once after the delay', () => {
    const callback = vi.fn();
    renderHook(() => {
      useDelayedTrigger(callback, 30_000);
    });

    vi.advanceTimersByTime(30_000);
    vi.advanceTimersByTime(60_000);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('calls the latest callback without restarting the timer', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(
      ({ callback }) => {
        useDelayedTrigger(callback, 1_000);
      },
      { initialProps: { callback: first } },
    );

    vi.advanceTimersByTime(600);
    rerender({ callback: second });
    vi.advanceTimersByTime(400);

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('does not fire after unmount', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => {
      useDelayedTrigger(callback, 1_000);
    });

    unmount();
    vi.advanceTimersByTime(5_000);

    expect(callback).not.toHaveBeenCalled();
  });
});
