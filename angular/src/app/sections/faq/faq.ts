import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { FAQ_INTRO, FAQS } from '../../data/content';
import { Button } from '../../ui/button/button';
import { SectionHeading } from '../../ui/section-heading/section-heading';
import { FaqItem } from '../faq-item/faq-item';

@Component({
  selector: 'app-faq',
  imports: [SectionHeading, FaqItem, Button],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Faq {
  protected readonly intro = FAQ_INTRO;
  protected readonly faqs = FAQS;
  protected readonly openId = signal<string | null>(null);

  protected toggle(id: string): void {
    this.openId.update((current) => (current === id ? null : id));
  }
}
