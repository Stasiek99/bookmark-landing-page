import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FEATURES_INTRO } from '../../data/content';
import { SectionHeading } from '../../ui/section-heading/section-heading';
import { FeatureTabs } from '../feature-tabs/feature-tabs';

@Component({
  selector: 'app-features',
  imports: [SectionHeading, FeatureTabs],
  templateUrl: './features.html',
  styleUrl: './features.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Features {
  protected readonly intro = FEATURES_INTRO;
}
