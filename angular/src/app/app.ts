import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';
import { Download } from './sections/download/download';
import { Faq } from './sections/faq/faq';
import { FeatureTabs } from './sections/feature-tabs/feature-tabs';
import { Features } from './sections/features/features';
import { Hero } from './sections/hero/hero';
import { Newsletter } from './sections/newsletter/newsletter';
import { Modal } from './ui/modal/modal';

const MODAL_DELAY_MS = 30_000;

@Component({
  selector: 'app-root',
  imports: [Header, Hero, Features, Download, Faq, Newsletter, Footer, Modal, FeatureTabs],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:mouseout)': 'onMouseOut($event)' },
})
export class App {
  protected readonly modalOpen = signal(false);
  private modalShown = false;

  constructor() {
    const timer = setTimeout(() => this.showModal(), MODAL_DELAY_MS);
    inject(DestroyRef).onDestroy(() => clearTimeout(timer));
  }

  protected onMouseOut(event: MouseEvent): void {
    if (!event.relatedTarget && event.clientY <= 0) this.showModal();
  }

  protected showModal(): void {
    if (this.modalShown) return;
    this.modalShown = true;
    this.modalOpen.set(true);
  }
}
