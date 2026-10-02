import { useI18n } from '../../i18n';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  danger,
  busy,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const t = useI18n();

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={busy}
          >
            {t.common.cancel}
          </button>
          <button
            type="button"
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? t.common.loading : (confirmLabel ?? t.common.confirm)}
          </button>
        </>
      }
    >
      <p className="muted">{message}</p>
    </Modal>
  );
}
