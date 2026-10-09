import { useId } from 'react';

import { ArrowIcon } from '../ui/Icons';
import './FaqItem.scss';

interface FaqItemProps {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}

export const FaqItem = ({ question, answer, open, onToggle }: FaqItemProps) => {
  const id = useId();

  return (
    <div className={`faq-item ${open ? 'faq-item--open' : ''}`}>
      <h3 className="faq-item__heading">
        <button
          type="button"
          className="faq-item__trigger"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
        >
          <span className="faq-item__question">{question}</span>
          <ArrowIcon className="faq-item__arrow" />
        </button>
      </h3>
      <div id={id} className="faq-item__panel" role="region" aria-hidden={!open}>
        <div className="faq-item__panel-inner">
          <p className="faq-item__answer">{answer}</p>
        </div>
      </div>
    </div>
  );
};
