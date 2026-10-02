import { useEffect, type ReactNode } from 'react';
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

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  const t = useI18n();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
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
    </div>
  );
}
