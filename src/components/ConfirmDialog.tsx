import { useEffect, useRef } from 'react';

type Props = {
  title: string;
  body: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  title,
  body,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div className="modal-scrim" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="modal-card">
        <h2 id="confirm-title">{title}</h2>
        <p className="muted">{body}</p>
        <div className="modal-actions">
          <button ref={cancelRef} className="btn ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="btn danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
