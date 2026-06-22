"use client";

import { Button } from "@/components/ui/button";

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
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-5 shadow-card">
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
              <Button
                type="button"
                variant="secondary"
                onClick={() => onConfirm("este")}
              >
                Excluir apenas este
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={() => onConfirm("grupo")}
              >
                Excluir todas as parcelas
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="danger"
              onClick={() => onConfirm("este")}
            >
              Excluir
            </Button>
          )}
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
