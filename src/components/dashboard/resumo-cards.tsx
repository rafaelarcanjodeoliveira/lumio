import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  Calendar,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { ResumoMensal } from "@/lib/dashboard/calculations";

type ResumoCardsProps = {
  resumo: ResumoMensal;
};

type CardConfig = {
  label: string;
  valor: number;
  icon: LucideIcon;
  valueClassName: string;
  highlight?: boolean;
};

export function ResumoCards({ resumo }: ResumoCardsProps) {
  const cards: CardConfig[] = [
    {
      label: "Entradas realizadas",
      valor: resumo.entradasRealizadas,
      icon: TrendingUp,
      valueClassName: "text-income",
    },
    {
      label: "Saídas realizadas",
      valor: resumo.saidasRealizadas,
      icon: TrendingDown,
      valueClassName: "text-expense",
    },
    {
      label: "Provisionado líquido",
      valor: resumo.provisionadoLiquido,
      icon: Clock,
      valueClassName: "text-brand-text",
    },
    {
      label: "Saldo atual",
      valor: resumo.saldoAtual,
      icon: CheckCircle2,
      valueClassName: "text-balance",
      highlight: true,
    },
    {
      label: "Saldo previsto",
      valor: resumo.saldoPrevisto,
      icon: Calendar,
      valueClassName: "text-text-primary",
    },
    {
      label: "Disponível hoje",
      valor: resumo.disponivelHoje,
      icon: Wallet,
      valueClassName: "text-text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {cards.map(({ label, valor, icon: Icon, valueClassName, highlight }) => (
        <div
          key={label}
          className={`rounded-xl border bg-surface p-3.5 ${
            highlight ? "border-brand" : "border-border"
          }`}
        >
          <div className="mb-2 flex items-center gap-1.5 text-[11px] text-text-muted">
            <Icon className="h-3.5 w-3.5" />
            {label}
          </div>
          <p className={`text-xl font-medium ${valueClassName}`}>
            {formatCurrency(valor)}
          </p>
        </div>
      ))}
    </div>
  );
}
