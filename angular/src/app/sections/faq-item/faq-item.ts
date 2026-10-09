import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Icon } from '../../ui/icon/icon';

let nextId = 0;

@Component({
  selector: 'app-faq-item',
  imports: [Icon],
  templateUrl: './faq-item.html',
  styleUrl: './faq-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqItem {
  readonly question = input.required<string>();
  readonly answer = input.required<string>();
  readonly open = input(false);
  readonly toggled = output<void>();

  protected readonly panelId = `faq-panel-${nextId++}`;
}
