import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from './Modal';

const getDialog = () => screen.getByRole<HTMLDialogElement>('dialog', { hidden: true });

describe('Modal', () => {
  it('stays closed while `open` is false', () => {
    render(
      <Modal open={false} onClose={vi.fn()} label="Feature highlight">
        content
      </Modal>,
    );

    expect(getDialog().open).toBe(false);
  });

  it('opens as a modal dialog when `open` is true, with an accessible name', () => {
    render(
      <Modal open onClose={vi.fn()} label="Feature highlight">
        content
      </Modal>,
    );

    expect(getDialog().open).toBe(true);
    expect(screen.getByRole('dialog', { name: 'Feature highlight' })).toBeInTheDocument();
  });

  it('renders its children', () => {
    render(
      <Modal open onClose={vi.fn()} label="Feature highlight">
        <p>Hello from the modal</p>
      </Modal>,
    );

    expect(screen.getByText('Hello from the modal')).toBeInTheDocument();
  });

  it('follows the `open` prop when it changes', () => {
    const { rerender } = render(
      <Modal open={false} onClose={vi.fn()} label="Feature highlight">
        content
      </Modal>,
    );

    rerender(
      <Modal open onClose={vi.fn()} label="Feature highlight">
        content
      </Modal>,
    );
    expect(getDialog().open).toBe(true);

    rerender(
      <Modal open={false} onClose={vi.fn()} label="Feature highlight">
        content
      </Modal>,
    );
    expect(getDialog().open).toBe(false);
  });

  it('calls onClose from the close button', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal open onClose={onClose} label="Feature highlight">
        content
      </Modal>,
    );

    await user.click(screen.getByRole('button', { name: 'Close dialog' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the native dialog closes (e.g. via Escape)', () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} label="Feature highlight">
        content
      </Modal>,
    );

    fireEvent(getDialog(), new Event('close'));

    expect(onClose).toHaveBeenCalled();
  });

  it('closes on a backdrop click but not on a click inside the dialog', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal open onClose={onClose} label="Feature highlight">
        <p>inside</p>
      </Modal>,
    );

    await user.click(screen.getByText('inside'));
    expect(onClose).not.toHaveBeenCalled();

    await user.click(getDialog());
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
