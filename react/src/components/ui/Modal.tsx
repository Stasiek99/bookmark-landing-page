import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';

import { CloseIcon } from './Icons';
import './Modal.scss';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}

export const Modal = ({ open, onClose, label, children }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const onBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- backdrop click is pointer-only; Esc and the close button cover the keyboard
    <dialog
      ref={dialogRef}
      className="modal"
      aria-label={label}
      onClose={onClose}
      onClick={onBackdropClick}
    >
      <div className="modal__body">
        <button type="button" className="modal__close" aria-label="Close dialog" onClick={onClose}>
          <CloseIcon />
        </button>
        {children}
      </div>
    </dialog>
  );
};
