import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { query } from '../../../testing/dom';
import { Newsletter } from './newsletter';

const ERROR = 'Whoops, make sure it’s an email';

describe('Newsletter', () => {
  let fixture: ComponentFixture<Newsletter>;
  let root: HTMLElement;

  const input = () => query<HTMLInputElement>(root, 'input');
  const alert = () => root.querySelector('[role="alert"]');
  const status = () => query(root, '[role="status"]');

  const settle = () => fixture.whenStable();

  const type = async (value: string) => {
    input().value = value;
    input().dispatchEvent(new Event('input'));
    await settle();
  };
  const leaveField = async () => {
    input().dispatchEvent(new FocusEvent('blur'));
    await settle();
  };
  const submit = async () => {
    query<HTMLButtonElement>(root, 'button[type="submit"]').click();
    await settle();
  };

  beforeEach(async () => {
    fixture = TestBed.createComponent(Newsletter);
    root = fixture.nativeElement as HTMLElement;
    await settle();
  });

  describe('validation on submit', () => {
    it('shows the error for an empty input', async () => {
      await submit();

      expect(alert()?.textContent).toContain(ERROR);
    });

    it('shows the error for an address without "@"', async () => {
      await type('example.email.com');
      await submit();

      expect(alert()).not.toBeNull();
    });

    it('shows the error for the malformed address from the design (example@email/com)', async () => {
      await type('example@email/com');
      await submit();

      expect(alert()).not.toBeNull();
    });

    it('treats whitespace only as empty', async () => {
      await type('   ');
      await submit();

      expect(alert()).not.toBeNull();
    });

    it('accepts a valid address, clears the field and confirms', async () => {
      await type('stan@example.com');
      await submit();

      expect(alert()).toBeNull();
      expect(input().value).toBe('');
      expect(status().textContent).toContain('Thanks!');
    });
  });

  describe('validation on blur', () => {
    it('stays quiet when the field was only focused and left', async () => {
      await leaveField();

      expect(alert()).toBeNull();
    });

    it('stays quiet while the user is still typing for the first time', async () => {
      await type('abc');

      expect(alert()).toBeNull();
    });

    it('shows the error when leaving a field that was started but is invalid', async () => {
      await type('abc');
      await leaveField();

      expect(alert()?.textContent).toContain(ERROR);
    });

    it('shows the error when the user typed something and then emptied the field', async () => {
      await type('abc');
      await type('');
      await leaveField();

      expect(alert()).not.toBeNull();
    });

    it('does not show an error when leaving with a valid address', async () => {
      await type('stan@example.com');
      await leaveField();

      expect(alert()).toBeNull();
    });

    it('clears the error live as soon as the address becomes valid', async () => {
      await type('abc');
      await leaveField();
      expect(alert()).not.toBeNull();

      await type('abc@x.pl');

      expect(alert()).toBeNull();
    });

    it('is pristine again after a successful submit', async () => {
      await type('stan@example.com');
      await submit();

      await leaveField();

      expect(alert()).toBeNull();
    });
  });

  describe('accessibility', () => {
    it('marks the input invalid and links it to the message', async () => {
      expect(input().getAttribute('aria-invalid')).toBe('false');
      expect(input().hasAttribute('aria-describedby')).toBe(false);

      await submit();

      const message = query(root, '[role="alert"]');
      expect(input().getAttribute('aria-invalid')).toBe('true');
      expect(input().getAttribute('aria-describedby')).toBe(message.id);
    });

    it('labels the input for screen readers', () => {
      const label = query<HTMLLabelElement>(root, 'label');

      expect(label.htmlFor).toBe(input().id);
      expect(label.textContent).toContain('Email address');
    });

    it('announces the 35,000 subscriber figure to assistive technology', () => {
      expect(root.textContent).toContain('Over 35,000');
    });
  });
});

describe('Newsletter – focus management', () => {
  let fixture: ComponentFixture<Newsletter>;
  let root: HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Newsletter);
    root = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('moves focus to the email field when an invalid address is submitted', async () => {
    query<HTMLButtonElement>(root, 'button[type="submit"]').click();
    await fixture.whenStable();

    expect(document.activeElement).toBe(query<HTMLInputElement>(root, 'input'));
  });

  it('does not move focus after a successful submission', async () => {
    const input = query<HTMLInputElement>(root, 'input');
    const submit = query<HTMLButtonElement>(root, 'button[type="submit"]');
    input.value = 'stan@example.com';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    submit.focus();

    submit.click();
    await fixture.whenStable();

    expect(document.activeElement).toBe(submit);
  });
});
