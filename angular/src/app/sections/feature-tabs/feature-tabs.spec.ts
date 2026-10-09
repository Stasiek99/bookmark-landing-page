import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { keydown, query, queryAll } from '../../../testing/dom';
import { FEATURE_TABS } from '../../data/content';
import { FeatureTabs } from './feature-tabs';

describe('FeatureTabs', () => {
  let fixture: ComponentFixture<FeatureTabs>;
  let root: HTMLElement;

  const tabs = () => queryAll<HTMLButtonElement>(root, '[role="tab"]');
  const selectedIndex = () =>
    tabs().findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
  const heading = () => query(root, 'h3').textContent.trim();
  const settle = () => fixture.whenStable();

  async function create(initialTabId?: string) {
    fixture = TestBed.createComponent(FeatureTabs);
    if (initialTabId) fixture.componentRef.setInput('initialTabId', initialTabId);
    root = fixture.nativeElement as HTMLElement;
    await settle();
  }

  describe('rendering', () => {
    beforeEach(() => create());

    it('renders one tab per feature with the first selected', () => {
      expect(tabs()).toHaveLength(FEATURE_TABS.length);
      expect(selectedIndex()).toBe(0);
      expect(heading()).toBe(FEATURE_TABS[0].title);
    });

    it('wires tabs and panel together for assistive technology', () => {
      const panel = query(root, '[role="tabpanel"]');

      expect(tabs()[0].getAttribute('aria-controls')).toBe(panel.id);
      expect(panel.getAttribute('aria-labelledby')).toBe(tabs()[0].id);
    });

    it('uses the BEM active modifier on the selected tab only', () => {
      expect(tabs()[0].classList).toContain('feature-tabs__tab--active');
      expect(tabs()[1].classList).not.toContain('feature-tabs__tab--active');
    });
  });

  describe('initial tab', () => {
    it('can start on another tab (used by the modal)', async () => {
      await create('searching');

      expect(selectedIndex()).toBe(1);
      expect(heading()).toBe('Intelligent search');
    });

    it('falls back to the first tab for an unknown id', async () => {
      await create('nope');

      expect(heading()).toBe(FEATURE_TABS[0].title);
    });

    it('uses a roving tabindex: only the selected tab is in the tab order', async () => {
      await create('searching');

      expect(tabs().map((tab) => tab.tabIndex)).toEqual([-1, 0, -1]);
    });
  });

  describe('mouse', () => {
    beforeEach(() => create());

    it('switches the panel content when a tab is clicked', async () => {
      tabs()[2].click();
      await settle();

      expect(selectedIndex()).toBe(2);
      expect(heading()).toBe('Share your bookmarks');
    });

    it('scales the illustration relative to the first tab (used by the mobile layout)', async () => {
      tabs()[1].click();
      await settle();

      const image = query<HTMLImageElement>(root, 'img');
      const scale = Number(image.style.getPropertyValue('--scale'));
      expect(scale).toBeCloseTo(FEATURE_TABS[1].imageWidth / FEATURE_TABS[0].imageWidth, 5);
    });
  });

  describe('keyboard navigation', () => {
    beforeEach(() => create());

    it('ArrowRight / ArrowLeft move selection and focus, wrapping around', async () => {
      tabs()[0].focus();

      keydown(tabs()[0], 'ArrowRight');
      await settle();
      expect(selectedIndex()).toBe(1);
      expect(document.activeElement).toBe(tabs()[1]);

      keydown(tabs()[1], 'ArrowRight');
      await settle();
      keydown(tabs()[2], 'ArrowRight');
      await settle();
      expect(selectedIndex()).toBe(0);

      keydown(tabs()[0], 'ArrowLeft');
      await settle();
      expect(selectedIndex()).toBe(2);
      expect(document.activeElement).toBe(tabs()[2]);
    });

    it('Home and End jump to the first and last tab', async () => {
      tabs()[1].click();
      await settle();

      keydown(tabs()[1], 'End');
      await settle();
      expect(selectedIndex()).toBe(2);
      expect(document.activeElement).toBe(tabs()[2]);

      keydown(tabs()[2], 'Home');
      await settle();
      expect(selectedIndex()).toBe(0);
      expect(document.activeElement).toBe(tabs()[0]);
    });

    it('leaves other keys alone (and does not swallow them)', async () => {
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
      });

      tabs()[0].dispatchEvent(event);
      await settle();

      expect(selectedIndex()).toBe(0);
      expect(event.defaultPrevented).toBe(false);
    });

    it('prevents the page from scrolling on the keys it handles', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        cancelable: true,
      });

      tabs()[0].dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
    });
  });
});
