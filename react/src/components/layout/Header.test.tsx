import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { setHoverCapable } from '../../test/matchMedia';
import { Header } from './Header';

describe('Header', () => {
  describe('mobile menu', () => {
    it('is closed initially', () => {
      render(<Header />);

      const toggle = screen.getByRole('button', { name: 'Open menu' });
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });

    it('opens and closes with the toggle, keeping the label and aria-expanded in sync', async () => {
      const user = userEvent.setup();
      render(<Header />);

      await user.click(screen.getByRole('button', { name: 'Open menu' }));
      const close = screen.getByRole('button', { name: 'Close menu' });
      expect(close).toHaveAttribute('aria-expanded', 'true');

      await user.click(close);
      expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });

    it('locks page scroll while open and restores it afterwards', async () => {
      const user = userEvent.setup();
      render(<Header />);

      await user.click(screen.getByRole('button', { name: 'Open menu' }));
      expect(document.body.style.overflow).toBe('hidden');

      await user.click(screen.getByRole('button', { name: 'Close menu' }));
      expect(document.body.style.overflow).toBe('');
    });

    it('closes on Escape', async () => {
      const user = userEvent.setup();
      render(<Header />);
      await user.click(screen.getByRole('button', { name: 'Open menu' }));

      await user.keyboard('{Escape}');

      expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
      expect(document.body.style.overflow).toBe('');
    });

    it('closes after a navigation link is chosen', async () => {
      const user = userEvent.setup();
      render(<Header />);
      await user.click(screen.getByRole('button', { name: 'Open menu' }));

      await user.click(screen.getByRole('link', { name: 'Pricing' }));

      expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
    });

    it('releases the scroll lock if unmounted while open', async () => {
      const user = userEvent.setup();
      const { unmount } = render(<Header />);
      await user.click(screen.getByRole('button', { name: 'Open menu' }));

      unmount();

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('navigation', () => {
    it('exposes the primary links and the login call to action', () => {
      render(<Header />);

      const nav = screen.getByRole('navigation', { name: 'Primary' });
      ['Features', 'Pricing', 'Contact', 'Login'].forEach((name) => {
        expect(nav).toContainElement(screen.getByRole('link', { name }));
      });
    });
  });

  describe('hover trigger (top part of the page)', () => {
    it('notifies when a hover-capable pointer enters the header', async () => {
      const onHover = vi.fn();
      const user = userEvent.setup();
      render(<Header onHover={onHover} />);

      await user.hover(screen.getByRole('banner'));

      expect(onHover).toHaveBeenCalled();
    });

    it('ignores the synthetic mouseenter that touch screens emit on tap', async () => {
      setHoverCapable(false);
      const onHover = vi.fn();
      const user = userEvent.setup();
      render(<Header onHover={onHover} />);

      await user.hover(screen.getByRole('banner'));

      expect(onHover).not.toHaveBeenCalled();
    });

    it('works without a handler', async () => {
      const user = userEvent.setup();
      render(<Header />);

      await expect(user.hover(screen.getByRole('banner'))).resolves.toBeUndefined();
    });
  });
});

describe('Header – page behind the open menu', () => {
  let main: HTMLElement;
  let footer: HTMLElement;
  let skipLink: HTMLElement;

  beforeEach(() => {
    main = document.createElement('main');
    footer = document.createElement('footer');
    skipLink = document.createElement('a');
    skipLink.className = 'skip-link';
    document.body.append(skipLink, main, footer);
  });

  afterEach(() => {
    skipLink.remove();
    main.remove();
    footer.remove();
  });

  it('makes <main>, <footer> and the skip link inert while the menu is open and restores them on close', async () => {
    const user = userEvent.setup();
    render(<Header />);
    expect(main).not.toHaveAttribute('inert');

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(main).toHaveAttribute('inert');
    expect(footer).toHaveAttribute('inert');
    expect(skipLink).toHaveAttribute('inert');

    await user.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(main).not.toHaveAttribute('inert');
    expect(footer).not.toHaveAttribute('inert');
    expect(skipLink).not.toHaveAttribute('inert');
  });

  it('releases the inert state if the header unmounts while the menu is open', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    unmount();

    expect(main).not.toHaveAttribute('inert');
    expect(footer).not.toHaveAttribute('inert');
  });

  it('returns focus to the toggle when Escape closes the menu', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    screen.getByRole('link', { name: 'Features' }).focus();

    await user.keyboard('{Escape}');

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveFocus();
  });
});
