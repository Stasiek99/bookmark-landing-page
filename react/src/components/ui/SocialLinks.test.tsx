import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SOCIAL_LINKS } from '../../data/content';
import { SocialLinks } from './SocialLinks';

describe('SocialLinks', () => {
  it('renders one link per network', () => {
    render(<SocialLinks links={SOCIAL_LINKS} />);

    expect(screen.getAllByRole('link')).toHaveLength(SOCIAL_LINKS.length);
  });

  it('names each icon-only link and says that it opens a new tab', () => {
    render(<SocialLinks links={SOCIAL_LINKS} />);

    expect(screen.getByRole('link', { name: 'Facebook (opens in a new tab)' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Twitter (opens in a new tab)' })).toBeInTheDocument();
  });

  it('opens externally without leaking the opener', () => {
    render(<SocialLinks links={SOCIAL_LINKS} />);

    screen.getAllByRole('link').forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });
  });

  it('keeps a mixed-in class from the parent block', () => {
    render(<SocialLinks links={SOCIAL_LINKS} className="header__social" />);

    expect(screen.getAllByRole('list')[0]).toHaveClass('social-links', 'header__social');
  });
});
