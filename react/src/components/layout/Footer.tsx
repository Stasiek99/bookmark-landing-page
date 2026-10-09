import { NAV_LINKS, SOCIAL_LINKS } from '../../data/content';
import { Logo } from '../ui/Logo';
import { SocialLinks } from '../ui/SocialLinks';
import './Footer.scss';

export const Footer = () => (
  <footer className="footer">
    <div className="footer__inner">
      <div className="footer__brand">
        <Logo variant="light" />
        <nav aria-label="Footer">
          <ul className="footer__list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a href={href} className="footer__link">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <SocialLinks links={SOCIAL_LINKS} />
    </div>
  </footer>
);
