import { FacebookIcon, TwitterIcon } from './Icons';
import './SocialLinks.scss';

interface SocialLink {
  id: 'facebook' | 'twitter';
  label: string;
  href: string;
}

interface SocialLinksProps {
  links: readonly SocialLink[];
  className?: string;
}

const ICONS = { facebook: FacebookIcon, twitter: TwitterIcon } as const;

const NEW_TAB_HINT = '(opens in a new tab)';

export const SocialLinks = ({ links, className = '' }: SocialLinksProps) => (
  <ul className={`social-links ${className}`}>
    {links.map(({ id, label, href }) => {
      const Icon = ICONS[id];
      return (
        <li key={id}>
          <a
            href={href}
            className="social-links__link"
            aria-label={`${label} ${NEW_TAB_HINT}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon />
          </a>
        </li>
      );
    })}
  </ul>
);
