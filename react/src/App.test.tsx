import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { App } from './App';
import { setHoverCapable } from './test/matchMedia';

const MODAL_DELAY_MS = 30_000;

const getModal = () => screen.getByRole<HTMLDialogElement>('dialog', { hidden: true });
const isModalOpen = () => getModal().open;

const advance = (ms: number) => {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
};

const getHeaderTarget = () => screen.getByRole('navigation', { name: 'Primary' });

const mouseOut = (init: MouseEventInit) => {
  act(() => {
    document.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, ...init }));
  });
};

describe('App – pop-up triggers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the "Speedy Searching" tab content inside the modal', () => {
    render(<App />);

    const modal = getModal();
    expect(modal).toHaveTextContent('Intelligent search');
  });

  it('offers a "Skip to main content" link first, pointing at the main landmark', () => {
    render(<App />);

    const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
    expect(skipLink).toHaveAttribute('href', '#main');
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
    expect(screen.getAllByRole('link')[0]).toBe(skipLink);
  });

  it('is closed on arrival', () => {
    render(<App />);

    expect(isModalOpen()).toBe(false);
  });

  describe('30 second timer', () => {
    it('does not open before 30 s (in particular not at the counter’s 20 s mark)', () => {
      render(<App />);

      advance(20_000);
      expect(isModalOpen()).toBe(false);

      advance(MODAL_DELAY_MS - 20_000 - 1);
      expect(isModalOpen()).toBe(false);
    });

    it('opens after 30 s', () => {
      render(<App />);

      advance(MODAL_DELAY_MS);

      expect(isModalOpen()).toBe(true);
    });

    it('does not open after the app is unmounted', () => {
      const { unmount } = render(<App />);

      unmount();
      advance(MODAL_DELAY_MS * 2);

      expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument();
    });
  });

  describe('hovering the top of the page', () => {
    it('opens when the cursor enters the header', () => {
      render(<App />);

      fireEvent.mouseEnter(getHeaderTarget());

      expect(isModalOpen()).toBe(true);
    });

    it('does not open when hovering elsewhere on the page', () => {
      render(<App />);

      fireEvent.mouseEnter(screen.getByRole('main'));
      fireEvent.mouseEnter(screen.getByRole('contentinfo'));

      expect(isModalOpen()).toBe(false);
    });

    it('does not open from a touch tap on the header (e.g. the hamburger)', () => {
      setHoverCapable(false);
      render(<App />);

      fireEvent.mouseEnter(getHeaderTarget());

      expect(isModalOpen()).toBe(false);
    });
  });

  describe('leaving through the top edge (exit intent)', () => {
    it('opens when the cursor leaves the page upwards', () => {
      render(<App />);

      mouseOut({ clientY: -1, relatedTarget: null });

      expect(isModalOpen()).toBe(true);
    });

    it('does not open when the cursor leaves sideways', () => {
      render(<App />);

      mouseOut({ clientY: 300, relatedTarget: null });

      expect(isModalOpen()).toBe(false);
    });
  });

  describe('once per visit', () => {
    it('does not reopen after being dismissed, whichever trigger fires next', () => {
      render(<App />);

      fireEvent.mouseEnter(getHeaderTarget());
      expect(isModalOpen()).toBe(true);
      fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
      expect(isModalOpen()).toBe(false);

      fireEvent.mouseLeave(getHeaderTarget());
      fireEvent.mouseEnter(getHeaderTarget());
      mouseOut({ clientY: -1, relatedTarget: null });
      advance(MODAL_DELAY_MS * 2);

      expect(isModalOpen()).toBe(false);
    });
  });
});
