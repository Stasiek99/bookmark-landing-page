import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';

import { Button } from '../../ui/button/button';
import { Icon } from '../../ui/icon/icon';
import { countUp } from '../../utils/count-up';

const TOTAL_SUBSCRIBERS = 35_000;
const COUNT_DURATION_MS = 20_000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let nextId = 0;

@Component({
  selector: 'app-newsletter',
  imports: [Button, Icon, DecimalPipe],
  templateUrl: './newsletter.html',
  styleUrl: './newsletter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Newsletter {
  protected readonly inputId = `newsletter-email-${nextId}`;
  protected readonly errorId = `newsletter-error-${nextId++}`;

  protected readonly email = signal('');
  protected readonly error = signal(false);
  protected readonly submitted = signal(false);
  private readonly dirty = signal(false);
  private readonly emailInput = viewChild.required<ElementRef<HTMLInputElement>>('emailInput');
  protected readonly subscribers = countUp(TOTAL_SUBSCRIBERS, COUNT_DURATION_MS);

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.email.set(value);
    this.dirty.set(true);
    this.submitted.set(false);
    if (this.error()) this.error.set(!this.isValid(value));
  }

  protected onBlur(): void {
    if (this.dirty()) this.error.set(!this.isValid(this.email()));
  }

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    const valid = this.isValid(this.email());
    this.error.set(!valid);
    this.submitted.set(valid);
    if (valid) {
      this.email.set('');
      this.dirty.set(false);
    } else {
      // Send keyboard and screen-reader users straight to the field that needs fixing.
      this.emailInput().nativeElement.focus();
    }
  }

  private isValid(value: string): boolean {
    return EMAIL_PATTERN.test(value.trim());
  }
}
