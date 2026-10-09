import { HERO } from '../../data/content';
import { BlueShape } from '../ui/BlueShape';
import { Button } from '../ui/Button';
import './Hero.scss';

export const Hero = () => (
  <section className="hero" aria-labelledby="hero-title">
    <BlueShape side="right" className="hero__shape" />
    <div className="hero__inner">
      <div className="hero__media">
        <img
          src={HERO.illustration}
          alt="Bookmark browser extension showing a list of saved sites"
          width={657}
          height={466}
        />
      </div>

      <div className="hero__content">
        <h1 id="hero-title" className="hero__title">
          {HERO.title}
        </h1>
        <p className="hero__text">{HERO.text}</p>
        <div className="hero__actions">
          <Button href="#chrome">Get it on Chrome</Button>
          <Button href="#firefox" variant="secondary">
            Get it on Firefox
          </Button>
        </div>
      </div>
    </div>
  </section>
);
