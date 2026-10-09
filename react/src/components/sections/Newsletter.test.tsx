import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Newsletter } from './Newsletter';

const setup = () => {
  const user = userEvent.setup();
  render(<Newsletter />);
  return {
    user,
    input: screen.getByRole('textbox', { name: 'Email address' }),
    submit: screen.getByRole('button', { name: 'Contact Us' }),
    outside: screen.getByRole('heading', { name: /stay up-to-date/i }),
  };
};

const ERROR = 'Whoops, make sure it’s an email';

describe('Newsletter', () => {
  describe('validation on submit', () => {
    it('shows the error for an empty input', async () => {
      const { user, submit } = setup();

      await user.click(submit);

      expect(screen.getByRole('alert')).toHaveTextContent(ERROR);
    });

    it('shows the error for an address without "@"', async () => {
      const { user, input, submit } = setup();

      await user.type(input, 'example.email.com');
      await user.click(submit);

      expect(screen.getByRole('alert')).toHaveTextContent(ERROR);
    });

    it('shows the error for the malformed address from the design (example@email/com)', async () => {
      const { user, input, submit } = setup();

      await user.type(input, 'example@email/com');
      await user.click(submit);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('treats whitespace only as empty', async () => {
      const { user, input, submit } = setup();

      await user.type(input, '   ');
      await user.click(submit);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('accepts a valid address, clears the field and confirms', async () => {
      const { user, input, submit } = setup();

      await user.type(input, 'stan@example.com');
      await user.click(submit);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(input).toHaveValue('');
      expect(screen.getByRole('status')).toHaveTextContent('Thanks!');
    });
  });

  describe('validation on blur', () => {
    it('stays quiet when the field was only focused and left', async () => {
      const { user, input, outside } = setup();

      await user.click(input);
      await user.click(outside);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('stays quiet while the user is still typing for the first time', async () => {
      const { user, input } = setup();

      await user.type(input, 'abc');

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('shows the error when leaving a field that was started but is invalid', async () => {
      const { user, input, outside } = setup();

      await user.type(input, 'abc');
      await user.click(outside);

      expect(screen.getByRole('alert')).toHaveTextContent(ERROR);
    });

    it('shows the error when the user typed something and then emptied the field', async () => {
      const { user, input, outside } = setup();

      await user.type(input, 'abc');
      await user.clear(input);
      await user.click(outside);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('does not show an error when leaving with a valid address', async () => {
      const { user, input, outside } = setup();

      await user.type(input, 'stan@example.com');
      await user.click(outside);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('clears the error live as soon as the address becomes valid', async () => {
      const { user, input, outside } = setup();
      await user.type(input, 'abc');
      await user.click(outside);
      expect(screen.getByRole('alert')).toBeInTheDocument();

      await user.click(input);
      await user.type(input, '@x.pl');

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('is pristine again after a successful submit', async () => {
      const { user, input, submit, outside } = setup();
      await user.type(input, 'stan@example.com');
      await user.click(submit);

      await user.click(input);
      await user.click(outside);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('marks the input invalid and links it to the message', async () => {
      const { user, input, submit } = setup();
      expect(input).toHaveAttribute('aria-invalid', 'false');
      expect(input).not.toHaveAttribute('aria-describedby');

      await user.click(submit);

      const alert = screen.getByRole('alert');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAccessibleDescription(ERROR);
      expect(input).toHaveAttribute('aria-describedby', alert.id);
    });

    it('announces the 35,000 subscriber figure to assistive technology', () => {
      setup();

      expect(screen.getByText('Over 35,000')).toBeInTheDocument();
    });
  });
});

describe('Newsletter – focus management', () => {
  it('moves focus to the email field when an invalid address is submitted', async () => {
    const { user, input, submit } = setup();

    await user.click(submit);

    expect(input).toHaveFocus();
  });

  it('does not move focus after a successful submission', async () => {
    const { user, input, submit } = setup();
    await user.type(input, 'stan@example.com');

    await user.click(submit);

    expect(submit).toHaveFocus();
  });
});
