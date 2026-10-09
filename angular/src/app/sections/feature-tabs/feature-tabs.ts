import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  input,
  linkedSignal,
  viewChildren,
} from '@angular/core';

import { FEATURE_TABS } from '../../data/content';
import { BlueShape } from '../../ui/blue-shape/blue-shape';
import { Button } from '../../ui/button/button';

let nextInstanceId = 0;

@Component({
  selector: 'app-feature-tabs',
  imports: [BlueShape, Button],
  templateUrl: './feature-tabs.html',
  styleUrl: './feature-tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureTabs {
  readonly initialTabId = input(FEATURE_TABS[0].id);

  protected readonly tabs = FEATURE_TABS;
  protected readonly baseId = `feature-tabs-${nextInstanceId++}`;

  protected readonly activeId = linkedSignal(() => this.initialTabId());
  protected readonly activeTab = computed(
    () => this.tabs.find((tab) => tab.id === this.activeId()) ?? this.tabs[0],
  );

  protected readonly imageScale = computed(
    () => this.activeTab().imageWidth / this.tabs[0].imageWidth,
  );

  private readonly tabButtons = viewChildren<ElementRef<HTMLButtonElement>>('tab');

  protected onKeydown(event: KeyboardEvent): void {
    const index = this.tabs.findIndex((tab) => tab.id === this.activeId());
    let next: number;

    switch (event.key) {
      case 'ArrowRight':
        next = (index + 1) % this.tabs.length;
        break;
      case 'ArrowLeft':
        next = (index - 1 + this.tabs.length) % this.tabs.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = this.tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.activeId.set(this.tabs[next].id);
    this.tabButtons()[next]?.nativeElement.focus();
  }
}
