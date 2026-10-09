import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { FEATURE_TABS } from '../../data/content';
import { FeatureTabs } from './FeatureTabs';

const tab = (index: number) => screen.getAllByRole('tab')[index];

describe('FeatureTabs', () => {
  it('renders one tab per feature with the first selected', () => {
    render(<FeatureTabs />);

    expect(screen.getAllByRole('tab')).toHaveLength(FEATURE_TABS.length);
    expect(tab(0)).toHaveAttribute('aria-selected', 'true');
    expect(tab(1)).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('heading', { name: FEATURE_TABS[0].title })).toBeInTheDocument();
  });

  it('can start on another tab (used by the modal)', () => {
    render(<FeatureTabs initialTabId="searching" />);

    expect(tab(1)).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { name: 'Intelligent search' })).toBeInTheDocument();
  });

  it('falls back to the first tab for an unknown id', () => {
    render(<FeatureTabs initialTabId="nope" />);

    expect(screen.getByRole('heading', { name: FEATURE_TABS[0].title })).toBeInTheDocument();
  });

  it('switches the panel content when a tab is clicked', async () => {
    const user = userEvent.setup();
    render(<FeatureTabs />);

    await user.click(tab(2));

    expect(tab(2)).toHaveAttribute('aria-selected', 'true');
    expect(tab(0)).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('heading', { name: 'Share your bookmarks' })).toBeInTheDocument();
  });

  it('wires tabs and panel together for assistive technology', () => {
    render(<FeatureTabs />);

    const panel = screen.getByRole('tabpanel');
    expect(tab(0)).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', tab(0).id);
    expect(panel).toHaveAccessibleName(FEATURE_TABS[0].label);
  });

  it('uses a roving tabindex: only the selected tab is in the tab order', () => {
    render(<FeatureTabs initialTabId="searching" />);

    expect(tab(0)).toHaveAttribute('tabindex', '-1');
    expect(tab(1)).toHaveAttribute('tabindex', '0');
    expect(tab(2)).toHaveAttribute('tabindex', '-1');
  });

  describe('keyboard navigation', () => {
    it('ArrowRight / ArrowLeft move selection and focus, wrapping around', async () => {
      const user = userEvent.setup();
      render(<FeatureTabs />);
      tab(0).focus();

      await user.keyboard('{ArrowRight}');
      expect(tab(1)).toHaveAttribute('aria-selected', 'true');
      expect(tab(1)).toHaveFocus();

      await user.keyboard('{ArrowRight}{ArrowRight}');
      expect(tab(0)).toHaveAttribute('aria-selected', 'true'); // wrapped past the last tab

      await user.keyboard('{ArrowLeft}');
      expect(tab(2)).toHaveAttribute('aria-selected', 'true'); // wrapped before the first tab
      expect(tab(2)).toHaveFocus();
    });

    it('Home and End jump to the first and last tab', async () => {
      const user = userEvent.setup();
      render(<FeatureTabs initialTabId="searching" />);
      tab(1).focus();

      await user.keyboard('{End}');
      expect(tab(2)).toHaveAttribute('aria-selected', 'true');
      expect(tab(2)).toHaveFocus();

      await user.keyboard('{Home}');
      expect(tab(0)).toHaveAttribute('aria-selected', 'true');
      expect(tab(0)).toHaveFocus();
    });

    it('leaves other keys alone', async () => {
      const user = userEvent.setup();
      render(<FeatureTabs />);
      tab(0).focus();

      await user.keyboard('a{ArrowDown}');

      expect(tab(0)).toHaveAttribute('aria-selected', 'true');
    });
  });
});
