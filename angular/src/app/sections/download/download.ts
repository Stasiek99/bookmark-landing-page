import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BROWSERS, DOWNLOAD_INTRO } from '../../data/content';
import { SectionHeading } from '../../ui/section-heading/section-heading';
import { BrowserCard } from '../browser-card/browser-card';

@Component({
  selector: 'app-download',
  imports: [SectionHeading, BrowserCard],
  templateUrl: './download.html',
  styleUrl: './download.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Download {
  protected readonly intro = DOWNLOAD_INTRO;
  protected readonly browsers = BROWSERS;
}
