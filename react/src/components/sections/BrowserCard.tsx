import { Button } from '../ui/Button';
import './BrowserCard.scss';

interface BrowserCardProps {
  name: string;
  version: number;
  logo: string;
  logoWidth: number;
  logoHeight: number;
  className?: string;
}

export const BrowserCard = ({
  name,
  version,
  logo,
  logoWidth,
  logoHeight,
  className = '',
}: BrowserCardProps) => (
  <article className={`browser-card ${className}`}>
    <img
      className="browser-card__logo"
      src={logo}
      alt=""
      width={logoWidth}
      height={logoHeight}
      loading="lazy"
    />
    <h3 className="browser-card__name">Add to {name}</h3>
    <p className="browser-card__version">Minimum version {version}</p>
    <Button href={`#${name.toLowerCase()}`} fullWidth size="md" className="browser-card__button">
      Add &amp; Install Extension
    </Button>
  </article>
);
