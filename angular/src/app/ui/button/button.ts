import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'accent';
export type ButtonSize = 'md' | 'sm';

@Component({
  selector: 'a[appButton], button[appButton]',
  template: '<ng-content />',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'button', '[class]': 'modifiers()' },
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly fullWidth = input(false);

  protected readonly modifiers = computed(() =>
    [`button--${this.variant()}`, `button--${this.size()}`, this.fullWidth() ? 'button--full' : '']
      .filter(Boolean)
      .join(' '),
  );
}
