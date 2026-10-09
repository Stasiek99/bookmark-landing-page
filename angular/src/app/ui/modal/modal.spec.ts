import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { query } from '../../../testing/dom';
import { Modal } from './modal';

@Component({
  imports: [Modal],
  template: `
    <app-modal [open]="open()" label="Feature highlight" (closed)="closedCount = closedCount + 1">
      <p id="inside">Hello from the modal</p>
    </app-modal>
  `,
})
class Host {
  readonly open = signal(false);
  closedCount = 0;
}

describe('Modal', () => {
  let fixture: ComponentFixture<Host>;
  let root: HTMLElement;

  const dialog = () => query<HTMLDialogElement>(root, 'dialog');
  const settle = () => fixture.whenStable();

  const create = async (open: boolean) => {
    fixture = TestBed.createComponent(Host);
    fixture.componentInstance.open.set(open);
    root = fixture.nativeElement as HTMLElement;
    await settle();
  };

  it('stays closed while `open` is false', async () => {
    await create(false);

    expect(dialog().open).toBe(false);
  });

  it('opens as a modal dialog when `open` is true, with an accessible name', async () => {
    await create(true);

    expect(dialog().open).toBe(true);
    expect(dialog().getAttribute('aria-label')).toBe('Feature highlight');
  });

  it('projects its content', async () => {
    await create(true);

    expect(query(root, '#inside').textContent).toBe('Hello from the modal');
  });

  it('follows the `open` input when it changes', async () => {
    await create(false);

    fixture.componentInstance.open.set(true);
    await settle();
    expect(dialog().open).toBe(true);

    fixture.componentInstance.open.set(false);
    await settle();
    expect(dialog().open).toBe(false);
  });

  describe('closing', () => {
    beforeEach(() => create(true));

    it('emits `closed` from the close button', () => {
      query<HTMLButtonElement>(root, '.modal__close').click();

      expect(fixture.componentInstance.closedCount).toBe(1);
    });

    it('emits `closed` when the native dialog closes (e.g. via Escape)', () => {
      dialog().dispatchEvent(new Event('close'));

      expect(fixture.componentInstance.closedCount).toBe(1);
    });

    it('closes on a backdrop click but not on a click inside the dialog', () => {
      query(root, '#inside').click();
      expect(fixture.componentInstance.closedCount).toBe(0);

      dialog().click();
      expect(fixture.componentInstance.closedCount).toBe(1);
    });
  });
});
