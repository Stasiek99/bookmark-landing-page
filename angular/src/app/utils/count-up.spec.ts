import { ApplicationRef, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { setReducedMotion } from '../../testing/match-media';
import { countUp } from './count-up';

const TARGET = 35_000;
const DURATION = 20_000;

function start() {
  const value = TestBed.runInInjectionContext(() => countUp(TARGET, DURATION));
  TestBed.inject(ApplicationRef).tick();
  return value;
}

@Component({ template: '' })
class Host {
  readonly value = countUp(TARGET, DURATION);
}

describe('countUp', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts at 0', () => {
    const value = start();

    expect(value()).toBe(0);
  });

  it('counts up roughly linearly', () => {
    const value = start();

    vi.advanceTimersByTime(DURATION / 2);

    expect(value()).toBeGreaterThan(TARGET * 0.49);
    expect(value()).toBeLessThan(TARGET * 0.51);
  });

  it('never decreases while counting', () => {
    const value = start();
    const samples: number[] = [];

    for (let i = 0; i < 20; i += 1) {
      vi.advanceTimersByTime(1_000);
      samples.push(value());
    }

    expect(samples).toEqual([...samples].sort((a, b) => a - b));
  });

  it('reaches the target after the duration and stays there', () => {
    const value = start();

    vi.advanceTimersByTime(DURATION + 100);
    expect(value()).toBe(TARGET);

    vi.advanceTimersByTime(10_000);
    expect(value()).toBe(TARGET);
  });

  it('never overshoots the target, even when frames do not line up with the duration', () => {
    vi.advanceTimersByTime(5);
    const value = start();

    vi.advanceTimersByTime(DURATION + 100);

    expect(value()).toBe(TARGET);
  });

  it('shows the final value at once, without animating, when the user prefers reduced motion', () => {
    setReducedMotion(true);

    const value = start();
    expect(value()).toBe(TARGET);

    vi.advanceTimersByTime(DURATION / 2);
    expect(value()).toBe(TARGET);
    vi.advanceTimersByTime(DURATION);
    expect(value()).toBe(TARGET);
  });

  it('cancels the pending frame when the owning component is destroyed', async () => {
    const cancel = vi.spyOn(window, 'cancelAnimationFrame');
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    vi.advanceTimersByTime(1_000); // counting is in progress

    fixture.destroy();

    expect(cancel).toHaveBeenCalled();
  });
});
