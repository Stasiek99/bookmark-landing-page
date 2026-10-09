import { useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';

import { useCountUp } from '../../hooks/useCountUp';
import { Button } from '../ui/Button';
import { ErrorIcon } from '../ui/Icons';
import './Newsletter.scss';

const TOTAL_SUBSCRIBERS = 35_000;
const COUNT_DURATION_MS = 20_000;
const ERROR_MESSAGE = 'Whoops, make sure it’s an email';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = (value: string) => EMAIL_PATTERN.test(value.trim());

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dirty, setDirty] = useState(false);
  const subscribers = useCountUp(TOTAL_SUBSCRIBERS, COUNT_DURATION_MS);
  const inputId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setDirty(true);
    setSubmitted(false);
    if (error) setError(!isValidEmail(event.target.value));
  };

  const onBlur = () => {
    if (dirty) setError(!isValidEmail(email));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const valid = isValidEmail(email);
    setError(!valid);
    setSubmitted(valid);
    if (valid) {
      setEmail('');
      setDirty(false);
    } else {
      inputRef.current?.focus();
    }
  };

  return (
    <section id="contact" className="newsletter" aria-labelledby="newsletter-title">
      <div className="newsletter__inner">
        <p className="newsletter__counter">
          <span aria-hidden="true">{subscribers.toLocaleString('en-US')}+</span>
          <span className="visually-hidden">Over 35,000</span> already joined
        </p>
        <h2 id="newsletter-title" className="newsletter__title">
          Stay up-to-date with what we’re doing
        </h2>

        <form className="newsletter__form" onSubmit={onSubmit} noValidate>
          <div className={`newsletter__field ${error ? 'newsletter__field--error' : ''}`}>
            <label htmlFor={inputId} className="visually-hidden">
              Email address
            </label>
            <input
              ref={inputRef}
              id={inputId}
              type="email"
              name="email"
              className="newsletter__input"
              placeholder="Enter your email address"
              autoComplete="email"
              value={email}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={error}
              aria-describedby={error ? errorId : undefined}
            />
            {error && <ErrorIcon className="newsletter__error-icon" />}
            {error && (
              <p id={errorId} className="newsletter__error-message" role="alert">
                {ERROR_MESSAGE}
              </p>
            )}
          </div>
          <Button type="submit" variant="accent" className="newsletter__submit">
            Contact Us
          </Button>
        </form>

        <p className="newsletter__success" role="status">
          {submitted ? 'Thanks! We’ll be in touch.' : ''}
        </p>
      </div>
    </section>
  );
};
