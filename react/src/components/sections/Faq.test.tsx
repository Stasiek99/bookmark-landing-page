import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { FAQS } from '../../data/content';
import { Faq } from './Faq';

const trigger = (index: number) => screen.getAllByRole('button', { expanded: undefined })[index];
const expanded = (index: number) => trigger(index).getAttribute('aria-expanded');

describe('Faq', () => {
  it('lists every question, all collapsed initially', () => {
    render(<Faq />);

    FAQS.forEach((faq, index) => {
      expect(screen.getByRole('button', { name: faq.question })).toBeInTheDocument();
      expect(expanded(index)).toBe('false');
    });
  });

  it('expands the clicked question', async () => {
    const user = userEvent.setup();
    render(<Faq />);

    await user.click(trigger(1));

    expect(expanded(1)).toBe('true');
    expect(trigger(1)).toHaveAttribute('aria-controls');
  });

  it('behaves as an accordion: opening one closes the previous one', async () => {
    const user = userEvent.setup();
    render(<Faq />);

    await user.click(trigger(0));
    await user.click(trigger(2));

    expect(expanded(0)).toBe('false');
    expect(expanded(2)).toBe('true');
  });

  it('collapses an open question when it is clicked again', async () => {
    const user = userEvent.setup();
    render(<Faq />);

    await user.click(trigger(3));
    await user.click(trigger(3));

    expect(expanded(3)).toBe('false');
  });

  it('can be driven from the keyboard', async () => {
    const user = userEvent.setup();
    render(<Faq />);

    trigger(0).focus();
    await user.keyboard('{Enter}');

    expect(expanded(0)).toBe('true');
  });
});
