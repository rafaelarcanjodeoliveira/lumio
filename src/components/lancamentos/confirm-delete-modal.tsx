"use client";

type ConfirmDeleteModalProps = {
  totalParcelas: number | null;
  onClose: () => void;
  onConfirm: (scope: "este" | "grupo") => void;
};

export function ConfirmDeleteModal({
  totalParcelas,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  const isParcelado = Boolean(totalParcelas && totalParcelas > 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-5 shadow-sm">
        <h2 className="mb-1.5 text-sm font-medium text-text-primary">
          Excluir lançamento
        </h2>
        <p className="mb-5 text-[13px] text-text-muted">
          {isParcelado
            ? `Este lançamento faz parte de um grupo de ${totalParcelas} parcelas.`
            : "Tem certeza que deseja excluir este lançamento?"}
        </p>

        <div className="flex flex-col gap-2">
          {isParcelado ? (
            <>
              <button
                type="button"
                onClick={() => onConfirm("este")}
                className="w-full rounded-lg border border-border px-3 py-2 text-[13px] font-medium text-text-primary hover:bg-neutral-soft"
              >
                Excluir apenas este
              </button>
              <button
                type="button"
                onClick={() => onConfirm("grupo")}
                className="w-full rounded-lg bg-expense px-3 py-2 text-[13px] font-medium text-white hover:opacity-90"
              >
                Excluir todas as parcelas
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onConfirm("este")}
              className="w-full rounded-lg bg-expense px-3 py-2 text-[13px] font-medium text-white hover:opacity-90"
            >
              Excluir
            </button>
          )}
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
