import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renders a link when `href` is given', () => {
    render(<Button href="#chrome">Get it on Chrome</Button>);

    const link = screen.getByRole('link', { name: 'Get it on Chrome' });
    expect(link).toHaveAttribute('href', '#chrome');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders a native button otherwise, defaulting to type="button"', () => {
    render(<Button>Click</Button>);

    expect(screen.getByRole('button', { name: 'Click' })).toHaveAttribute('type', 'button');
  });

  it('lets the caller override the type, e.g. for form submission', () => {
    render(<Button type="submit">Send</Button>);

    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'submit');
  });

  it('uses the primary / md BEM modifiers by default', () => {
    render(<Button>Click</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('button', 'button--primary', 'button--md');
    expect(button).not.toHaveClass('button--full');
  });

  it('applies variant, size and full-width modifiers', () => {
    render(
      <Button variant="accent" size="sm" fullWidth>
        Login
      </Button>,
    );

    expect(screen.getByRole('button')).toHaveClass('button--accent', 'button--sm', 'button--full');
  });

  it('keeps a mixed-in class from the parent block', () => {
    render(<Button className="header__login">Login</Button>);

    expect(screen.getByRole('button')).toHaveClass('button', 'header__login');
  });
});
