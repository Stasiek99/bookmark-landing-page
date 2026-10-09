import { useEffect, useRef, useState } from 'react';
import { NAV_LINKS, SOCIAL_LINKS } from '../../data/content';
import { Button } from '../ui/Button';
import { CloseIcon, HamburgerIcon } from '../ui/Icons';
import { Logo } from '../ui/Logo';
import { SocialLinks } from '../ui/SocialLinks';
import './Header.scss';

interface HeaderProps {
  onHover?: () => void;
}

export const Header = ({ onHover }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return undefined;

    document.body.style.overflow = 'hidden';
    const behind = document.querySelectorAll('main, footer, .skip-link');
    behind.forEach((element) => {
      element.setAttribute('inert', '');
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      behind.forEach((element) => {
        element.removeAttribute('inert');
      });
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const onMouseEnter = () => {
    if (window.matchMedia('(hover: hover)').matches) onHover?.();
  };

  return (
    <header className="header" id="top" onMouseEnter={onMouseEnter}>
      <div className="header__inner">
        <Logo variant={menuOpen ? 'inverted' : 'dark'} className="header__logo" />

        <button
          ref={toggleRef}
          type="button"
          className={`header__toggle ${menuOpen ? 'header__toggle--open' : ''}`}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
        </button>

        <nav
          id="primary-navigation"
          className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}
          aria-label="Primary"
        >
          <ul className="header__list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href} className="header__item">
                <a href={href} className="header__link" onClick={closeMenu}>
                  {label}
                </a>
              </li>
            ))}
            <li className="header__item">
              <Button
                href="#login"
                variant="accent"
                size="sm"
                fullWidth
                className="header__login"
                onClick={closeMenu}
              >
                Login
              </Button>
            </li>
          </ul>
          <SocialLinks links={SOCIAL_LINKS} className="header__social" />
        </nav>
      </div>
    </header>
  );
};
