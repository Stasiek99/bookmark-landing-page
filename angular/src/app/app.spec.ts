import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { query } from '../testing/dom';
import { setHoverCapable } from '../testing/match-media';
import { App } from './app';

const MODAL_DELAY_MS = 30_000;

describe('App – pop-up triggers', () => {
  let fixture: ComponentFixture<App>;
  let root: HTMLElement;

  const dialog = () => query<HTMLDialogElement>(root, 'dialog');
  const isModalOpen = () => dialog().open;
  const render = () => {
    fixture.detectChanges();
  };
  const advance = (ms: number) => {
    vi.advanceTimersByTime(ms);
    render();
  };
  const enterHeader = () => {
    query(root, 'header#top').dispatchEvent(new MouseEvent('mouseenter'));
    render();
  };
  const mouseOut = (init: MouseEventInit) => {
    document.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, ...init }));
    render();
  };

  beforeEach(() => {
    vi.useFakeTimers();
    fixture = TestBed.createComponent(App);
    root = fixture.nativeElement as HTMLElement;
    render();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the "Speedy Searching" tab content inside the modal', () => {
    expect(dialog().textContent).toContain('Intelligent search');
  });

  it('offers a "Skip to main content" link first, pointing at the main landmark', () => {
    const skipLink = query<HTMLAnchorElement>(root, 'a.skip-link');

    expect(skipLink.textContent.trim()).toBe('Skip to main content');
    expect(skipLink.getAttribute('href')).toBe('#main');
    expect(query(root, 'main').id).toBe('main');
    expect(query(root, 'a')).toBe(skipLink); // first link in the document
  });

  it('is closed on arrival', () => {
    expect(isModalOpen()).toBe(false);
  });

  describe('30 second timer', () => {
    it('does not open before 30 s (in particular not at the counter’s 20 s mark)', () => {
      advance(20_000);
      expect(isModalOpen()).toBe(false);

      advance(MODAL_DELAY_MS - 20_000 - 1);
      expect(isModalOpen()).toBe(false);
    });

    it('opens after 30 s', () => {
      advance(MODAL_DELAY_MS);

      expect(isModalOpen()).toBe(true);
    });

    it('does not open after the app is destroyed', () => {
      const detached = dialog();

      fixture.destroy();
      vi.advanceTimersByTime(MODAL_DELAY_MS * 2);

      expect(detached.open).toBe(false);
    });
  });

  describe('hovering the top of the page', () => {
    it('opens when the cursor enters the header', () => {
      enterHeader();

      expect(isModalOpen()).toBe(true);
    });

    it('does not open when hovering elsewhere on the page', () => {
      query(root, 'main').dispatchEvent(new MouseEvent('mouseenter'));
      query(root, 'footer').dispatchEvent(new MouseEvent('mouseenter'));
      render();

      expect(isModalOpen()).toBe(false);
    });

    it('does not open from a touch tap on the header (e.g. the hamburger)', () => {
      setHoverCapable(false);

      enterHeader();

      expect(isModalOpen()).toBe(false);
    });
  });

  describe('leaving through the top edge (exit intent)', () => {
    it('opens when the cursor leaves the page upwards', () => {
      mouseOut({ clientY: -1, relatedTarget: null });

      expect(isModalOpen()).toBe(true);
    });

    it('does not open when the cursor leaves sideways', () => {
      mouseOut({ clientY: 300, relatedTarget: null });

      expect(isModalOpen()).toBe(false);
    });
  });

  describe('once per visit', () => {
    it('does not reopen after being dismissed, whichever trigger fires next', () => {
      enterHeader();
      expect(isModalOpen()).toBe(true);
      query<HTMLButtonElement>(root, '.modal__close').click();
      render();
      expect(isModalOpen()).toBe(false);

      enterHeader();
      mouseOut({ clientY: -1, relatedTarget: null });
      advance(MODAL_DELAY_MS * 2);

      expect(isModalOpen()).toBe(false);
    });
  });
});
