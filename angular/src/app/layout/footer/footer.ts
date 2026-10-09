import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NAV_LINKS, SOCIAL_LINKS } from '../../data/content';
import { Logo } from '../../ui/logo/logo';
import { SocialLinks } from '../../ui/social-links/social-links';

@Component({
  selector: 'app-footer',
  imports: [Logo, SocialLinks],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly navLinks = NAV_LINKS;
  protected readonly socialLinks = SOCIAL_LINKS;
}
