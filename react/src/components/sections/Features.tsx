import { FEATURES_INTRO } from '../../data/content';
import { SectionHeading } from '../ui/SectionHeading';
import { FeatureTabs } from './FeatureTabs';
import './Features.scss';

export const Features = () => (
  <section id="features" className="features" aria-labelledby="features-title">
    <div className="features__inner">
      <SectionHeading id="features-title" title={FEATURES_INTRO.title} text={FEATURES_INTRO.text} />
      <FeatureTabs className="features__tabs" />
    </div>
  </section>
);
