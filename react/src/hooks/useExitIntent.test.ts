import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useExitIntent } from './useExitIntent';

const mouseOut = (init: MouseEventInit) => {
  document.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, ...init }));
};

describe('useExitIntent', () => {
  it('fires when the cursor leaves the document through the top edge', () => {
    const callback = vi.fn();
    renderHook(() => {
      useExitIntent(callback);
    });

    mouseOut({ clientY: -1, relatedTarget: null });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('fires when the cursor leaves exactly at the top edge (y = 0)', () => {
    const callback = vi.fn();
    renderHook(() => {
      useExitIntent(callback);
    });

    mouseOut({ clientY: 0, relatedTarget: null });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('ignores the cursor leaving through the sides or bottom', () => {
    const callback = vi.fn();
    renderHook(() => {
      useExitIntent(callback);
    });

    mouseOut({ clientY: 400, relatedTarget: null });

    expect(callback).not.toHaveBeenCalled();
  });

  it('ignores moves between elements inside the page', () => {
    const callback = vi.fn();
    renderHook(() => {
      useExitIntent(callback);
    });

    mouseOut({ clientY: 0, relatedTarget: document.body });

    expect(callback).not.toHaveBeenCalled();
  });

  it('does nothing while disabled', () => {
    const callback = vi.fn();
    renderHook(() => {
      useExitIntent(callback, false);
    });

    mouseOut({ clientY: -1, relatedTarget: null });

    expect(callback).not.toHaveBeenCalled();
  });

  it('stops listening after unmount', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => {
      useExitIntent(callback);
    });

    unmount();
    mouseOut({ clientY: -1, relatedTarget: null });

    expect(callback).not.toHaveBeenCalled();
  });
});
