import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { keydown, query, queryAll } from '../../../testing/dom';
import { setHoverCapable } from '../../../testing/match-media';
import { Header } from './header';

describe('Header', () => {
  let fixture: ComponentFixture<Header>;
  let root: HTMLElement;

  const toggle = () => query<HTMLButtonElement>(root, '.header__toggle');
  const header = () => query(root, 'header');
  const settle = () => fixture.whenStable();

  beforeEach(async () => {
    fixture = TestBed.createComponent(Header);
    root = fixture.nativeElement as HTMLElement;
    await settle();
  });

  describe('mobile menu', () => {
    it('is closed initially', () => {
      expect(toggle().getAttribute('aria-expanded')).toBe('false');
      expect(toggle().getAttribute('aria-label')).toBe('Open menu');
    });

    it('opens and closes with the toggle, keeping the label and aria-expanded in sync', async () => {
      toggle().click();
      await settle();
      expect(toggle().getAttribute('aria-expanded')).toBe('true');
      expect(toggle().getAttribute('aria-label')).toBe('Close menu');
      expect(query(root, '.header__nav').classList).toContain('header__nav--open');

      toggle().click();
      await settle();
      expect(toggle().getAttribute('aria-expanded')).toBe('false');
      expect(query(root, '.header__nav').classList).not.toContain('header__nav--open');
    });

    it('locks page scroll while open and restores it afterwards', async () => {
      toggle().click();
      await settle();
      expect(document.body.style.overflow).toBe('hidden');

      toggle().click();
      await settle();
      expect(document.body.style.overflow).toBe('');
    });

    it('closes on Escape', async () => {
      toggle().click();
      await settle();

      keydown(document, 'Escape');
      await settle();

      expect(toggle().getAttribute('aria-expanded')).toBe('false');
      expect(document.body.style.overflow).toBe('');
    });

    it('closes after a navigation link is chosen', async () => {
      toggle().click();
      await settle();

      queryAll<HTMLAnchorElement>(root, '.header__link')[1].click();
      await settle();

      expect(toggle().getAttribute('aria-expanded')).toBe('false');
    });

    it('releases the scroll lock if destroyed while open', async () => {
      toggle().click();
      await settle();

      fixture.destroy();

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('navigation', () => {
    it('exposes the primary links and the login call to action', () => {
      const nav = query(root, 'nav[aria-label="Primary"]');
      const labels = queryAll(nav, 'a').map((link) => link.textContent.trim());

      expect(labels).toEqual(expect.arrayContaining(['Features', 'Pricing', 'Contact', 'Login']));
    });
  });

  describe('hover trigger (top part of the page)', () => {
    it('emits `hovered` when a hover-capable pointer enters the header', () => {
      const hovered = vi.fn();
      fixture.componentInstance.hovered.subscribe(hovered);

      header().dispatchEvent(new MouseEvent('mouseenter'));

      expect(hovered).toHaveBeenCalledTimes(1);
    });

    it('ignores the synthetic mouseenter that touch screens emit on tap', () => {
      setHoverCapable(false);
      const hovered = vi.fn();
      fixture.componentInstance.hovered.subscribe(hovered);

      header().dispatchEvent(new MouseEvent('mouseenter'));

      expect(hovered).not.toHaveBeenCalled();
    });
  });
});

describe('Header – page behind the open menu', () => {
  let fixture: ComponentFixture<Header>;
  let root: HTMLElement;
  let main: HTMLElement;
  let footer: HTMLElement;
  let skipLink: HTMLElement;

  const toggle = () => query<HTMLButtonElement>(root, '.header__toggle');
  const settle = () => fixture.whenStable();

  beforeEach(async () => {
    main = document.createElement('main');
    footer = document.createElement('footer');
    skipLink = document.createElement('a');
    skipLink.className = 'skip-link';
    document.body.append(skipLink, main, footer);

    fixture = TestBed.createComponent(Header);
    root = fixture.nativeElement as HTMLElement;
    await settle();
  });

  afterEach(() => {
    skipLink.remove();
    main.remove();
    footer.remove();
  });

  it('makes <main>, <footer> and the skip link inert while the menu is open and restores them on close', async () => {
    expect(main.hasAttribute('inert')).toBe(false);

    toggle().click();
    await settle();
    expect(main.hasAttribute('inert')).toBe(true);
    expect(footer.hasAttribute('inert')).toBe(true);
    expect(skipLink.hasAttribute('inert')).toBe(true);

    toggle().click();
    await settle();
    expect(main.hasAttribute('inert')).toBe(false);
    expect(footer.hasAttribute('inert')).toBe(false);
    expect(skipLink.hasAttribute('inert')).toBe(false);
  });

  it('releases the inert state if the header is destroyed while the menu is open', async () => {
    toggle().click();
    await settle();

    fixture.destroy();

    expect(main.hasAttribute('inert')).toBe(false);
    expect(footer.hasAttribute('inert')).toBe(false);
  });

  it('returns focus to the toggle when Escape closes the menu', async () => {
    toggle().click();
    await settle();
    queryAll<HTMLAnchorElement>(root, '.header__link')[0].focus();

    keydown(document, 'Escape');
    await settle();

    expect(document.activeElement).toBe(toggle());
  });

  it('does not steal focus on Escape while the menu is closed', async () => {
    const link = queryAll<HTMLAnchorElement>(root, '.header__link')[0];
    link.focus();

    keydown(document, 'Escape');
    await settle();

    expect(document.activeElement).toBe(link);
  });
});
