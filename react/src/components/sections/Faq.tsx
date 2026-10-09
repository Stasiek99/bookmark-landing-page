import { useState } from 'react';

import { FAQ_INTRO, FAQS } from '../../data/content';
import { Button } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';
import { FaqItem } from './FaqItem';
import './Faq.scss';

export const Faq = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="faq" className="faq" aria-labelledby="faq-title">
      <div className="faq__inner">
        <SectionHeading id="faq-title" title={FAQ_INTRO.title} text={FAQ_INTRO.text} />
        <div className="faq__list">
          {FAQS.map(({ id, question, answer }) => (
            <FaqItem
              key={id}
              question={question}
              answer={answer}
              open={openId === id}
              onToggle={() => setOpenId((current) => (current === id ? null : id))}
            />
          ))}
        </div>
        <Button href="#more-info" className="faq__more">
          More Info
        </Button>
      </div>
    </section>
  );
};
