"use client";

type ConfirmModalProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmModal({
  title,
  description,
  confirmLabel = "Confirmar",
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-5 shadow-sm">
        <h2 className="mb-1.5 text-sm font-medium text-text-primary">{title}</h2>
        <p className="mb-5 text-[13px] text-text-muted">{description}</p>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full rounded-lg bg-expense px-3 py-2 text-[13px] font-medium text-white hover:opacity-90"
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg px-3 py-2 text-[13px] font-medium text-text-muted hover:bg-neutral-soft"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
