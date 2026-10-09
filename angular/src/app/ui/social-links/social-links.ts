import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { SocialLink } from '../../data/content';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-social-links',
  imports: [Icon],
  templateUrl: './social-links.html',
  styleUrl: './social-links.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialLinks {
  readonly links = input.required<readonly SocialLink[]>();

  protected readonly newTabHint = '(opens in a new tab)';
}
