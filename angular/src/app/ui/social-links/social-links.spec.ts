import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { queryAll } from '../../../testing/dom';
import { SOCIAL_LINKS } from '../../data/content';
import { SocialLinks } from './social-links';

describe('SocialLinks', () => {
  let fixture: ComponentFixture<SocialLinks>;
  let root: HTMLElement;

  const links = () => queryAll<HTMLAnchorElement>(root, 'a');

  beforeEach(async () => {
    fixture = TestBed.createComponent(SocialLinks);
    fixture.componentRef.setInput('links', SOCIAL_LINKS);
    root = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('renders one link per network', () => {
    expect(links()).toHaveLength(SOCIAL_LINKS.length);
  });

  it('names each icon-only link and says that it opens a new tab', () => {
    expect(links().map((link) => link.getAttribute('aria-label'))).toEqual([
      'Facebook (opens in a new tab)',
      'Twitter (opens in a new tab)',
    ]);
  });

  it('opens externally without leaking the opener', () => {
    links().forEach((link) => {
      expect(link.target).toBe('_blank');
      expect(link.rel).toContain('noopener');
    });
  });
});
