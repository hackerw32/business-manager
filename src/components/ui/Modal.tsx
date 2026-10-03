import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useI18n } from '../../i18n';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'md' | 'lg';
}

// Track stacked modals so Escape closes only the top-most one.
let modalSeq = 0;
const openModalStack: number[] = [];

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  const t = useI18n();
  const idRef = useRef<number | null>(null);
  if (idRef.current === null) idRef.current = ++modalSeq;

  useEffect(() => {
    if (!open) return;
    const id = idRef.current as number;
    openModalStack.push(id);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openModalStack[openModalStack.length - 1] === id) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      const index = openModalStack.indexOf(id);
      if (index >= 0) openModalStack.splice(index, 1);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="modal-scrim" onMouseDown={onClose}>
      <div
        className={`modal ${size === 'lg' ? 'modal-lg' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h2>{title}</h2>
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label={t.common.close}
          >
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer ? <div className="modal-foot">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
