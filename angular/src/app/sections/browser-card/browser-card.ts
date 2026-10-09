import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { Browser } from '../../data/content';
import { Button } from '../../ui/button/button';

@Component({
  selector: 'app-browser-card',
  imports: [Button],
  templateUrl: './browser-card.html',
  styleUrl: './browser-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowserCard {
  readonly browser = input.required<Browser>();
}
