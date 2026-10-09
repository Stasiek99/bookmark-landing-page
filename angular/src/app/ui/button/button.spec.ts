import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { query } from '../../../testing/dom';
import { Button } from './button';

@Component({
  imports: [Button],
  template: `
    <a appButton id="link" href="#chrome">Get it on Chrome</a>
    <button appButton id="plain">Click</button>
    <button appButton id="submit" type="submit">Send</button>
    <a
      appButton
      id="full"
      class="header__login"
      href="#login"
      variant="accent"
      size="sm"
      [fullWidth]="true"
    >
      Login
    </a>
  `,
})
class Host {}

async function render(): Promise<HTMLElement> {
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('Button', () => {
  it('keeps the native element: <a> for links, <button> otherwise', async () => {
    const root = await render();

    expect(query(root, '#link').tagName).toBe('A');
    expect(query(root, '#link').getAttribute('href')).toBe('#chrome');
    expect(query(root, '#plain').tagName).toBe('BUTTON');
  });

  it('uses the primary / md BEM modifiers by default', async () => {
    const root = await render();

    const classes = query(root, '#plain').classList;
    expect(classes).toContain('button');
    expect(classes).toContain('button--primary');
    expect(classes).toContain('button--md');
    expect(classes).not.toContain('button--full');
  });

  it('applies variant, size and full-width modifiers', async () => {
    const root = await render();

    const classes = query(root, '#full').classList;
    expect(classes).toContain('button--accent');
    expect(classes).toContain('button--sm');
    expect(classes).toContain('button--full');
    expect(classes).not.toContain('button--md');
  });

  it('keeps a mixed-in class from the parent block', async () => {
    const root = await render();

    const classes = query(root, '#full').classList;
    expect(classes).toContain('button');
    expect(classes).toContain('header__login');
  });

  it('does not interfere with the native type attribute', async () => {
    const root = await render();

    expect(query(root, '#submit').getAttribute('type')).toBe('submit');
  });
});
