import { BROWSERS, DOWNLOAD_INTRO } from '../../data/content';
import { SectionHeading } from '../ui/SectionHeading';
import { BrowserCard } from './BrowserCard';
import './Download.scss';

export const Download = () => (
  <section id="download" className="download" aria-labelledby="download-title">
    <div className="download__inner">
      <SectionHeading id="download-title" title={DOWNLOAD_INTRO.title} text={DOWNLOAD_INTRO.text} />
      <ul className="download__cards">
        {BROWSERS.map((browser, index) => (
          <li
            key={browser.name}
            className="download__item"
            style={{ ['--offset' as string]: index }}
          >
            <BrowserCard
              name={browser.name}
              version={browser.version}
              logo={browser.logo}
              logoWidth={browser.width}
              logoHeight={browser.height}
            />
          </li>
        ))}
      </ul>
    </div>
  </section>
);
