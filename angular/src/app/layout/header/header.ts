import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { NAV_LINKS, SOCIAL_LINKS } from '../../data/content';
import { Button } from '../../ui/button/button';
import { Icon } from '../../ui/icon/icon';
import { Logo } from '../../ui/logo/logo';
import { SocialLinks } from '../../ui/social-links/social-links';

@Component({
  selector: 'app-header',
  imports: [Button, Icon, Logo, SocialLinks],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'onEscape()' },
})
export class Header {
  readonly hovered = output<void>();

  private readonly document = inject(DOCUMENT);

  protected readonly navLinks = NAV_LINKS;
  protected readonly socialLinks = SOCIAL_LINKS;
  protected readonly menuOpen = signal(false);

  private readonly toggle = viewChild.required<ElementRef<HTMLButtonElement>>('toggle');

  constructor() {
    effect((onCleanup) => {
      if (!this.menuOpen()) return;

      const { body } = this.document;
      body.style.overflow = 'hidden';
      const behind = this.document.querySelectorAll('main, footer, .skip-link');
      behind.forEach((element) => {
        element.setAttribute('inert', '');
      });

      onCleanup(() => {
        body.style.overflow = '';
        behind.forEach((element) => {
          element.removeAttribute('inert');
        });
      });
    });
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  /** Touch screens emulate mouseenter on tap (e.g. on the hamburger); only real hover-capable pointers count. */
  protected onMouseEnter(): void {
    if (window.matchMedia('(hover: hover)').matches) this.hovered.emit();
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  /** Escape closes an open menu and hands focus back to the button that opened it. */
  protected onEscape(): void {
    if (!this.menuOpen()) return;
    this.closeMenu();
    this.toggle().nativeElement.focus();
  }
}
