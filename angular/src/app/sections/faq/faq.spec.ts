import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { keydown, queryAll } from '../../../testing/dom';
import { FAQS } from '../../data/content';
import { Faq } from './faq';

describe('Faq', () => {
  let fixture: ComponentFixture<Faq>;
  let root: HTMLElement;

  const triggers = () => queryAll<HTMLButtonElement>(root, '.faq-item__trigger');
  const expanded = (index: number) => triggers()[index].getAttribute('aria-expanded');
  const settle = () => fixture.whenStable();

  beforeEach(async () => {
    fixture = TestBed.createComponent(Faq);
    root = fixture.nativeElement as HTMLElement;
    await settle();
  });

  it('lists every question, all collapsed initially', () => {
    expect(triggers()).toHaveLength(FAQS.length);
    FAQS.forEach((faq, index) => {
      expect(triggers()[index].textContent).toContain(faq.question);
      expect(expanded(index)).toBe('false');
    });
  });

  it('expands the clicked question and links the trigger to its panel', async () => {
    triggers()[1].click();
    await settle();

    expect(expanded(1)).toBe('true');
    const panelId = triggers()[1].getAttribute('aria-controls');
    expect(root.querySelector(`#${panelId ?? ''}`)?.getAttribute('aria-hidden')).toBe('false');
  });

  it('behaves as an accordion: opening one closes the previous one', async () => {
    triggers()[0].click();
    await settle();
    triggers()[2].click();
    await settle();

    expect(expanded(0)).toBe('false');
    expect(expanded(2)).toBe('true');
  });

  it('collapses an open question when it is clicked again', async () => {
    triggers()[3].click();
    await settle();
    triggers()[3].click();
    await settle();

    expect(expanded(3)).toBe('false');
  });

  it('marks only the open item with the BEM open modifier', async () => {
    triggers()[0].click();
    await settle();

    const items = queryAll(root, '.faq-item');
    expect(items[0].classList).toContain('faq-item--open');
    expect(items[1].classList).not.toContain('faq-item--open');
  });

  it('uses real buttons, so the keyboard works natively', () => {
    triggers().forEach((trigger) => {
      expect(trigger.tagName).toBe('BUTTON');
      expect(trigger.type).toBe('button');
    });
    keydown(triggers()[0], 'Enter');
    expect(expanded(0)).toBe('false');
  });
});
