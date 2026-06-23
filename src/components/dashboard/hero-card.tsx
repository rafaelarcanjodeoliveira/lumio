import { formatCurrency } from "@/lib/format";

type HeroCardProps = {
  saldoAtual: number;
  entradasRealizadas: number;
  saidasRealizadas: number;
  saldoPrevisto: number;
};

export function HeroCard({
  saldoAtual,
  entradasRealizadas,
  saidasRealizadas,
  saldoPrevisto,
}: HeroCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[20px] bg-hero p-5">
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-brand opacity-10" />
      <div className="pointer-events-none absolute -bottom-8 right-2 h-24 w-24 rounded-full bg-brand opacity-[0.07]" />

      <div className="relative">
        <p className="mb-1 text-[11px] tracking-wide text-hero-accent">
          SALDO ATUAL
        </p>
        <p
          className="mb-1 truncate text-[32px] leading-none font-normal tracking-tight text-white sm:text-[38px]"
          style={{ fontFamily: "Georgia, serif" }}
          title={formatCurrency(saldoAtual)}
        >
          {formatCurrency(saldoAtual)}
        </p>
        <p className="mb-4 text-[11px] text-white/50">realizado até hoje</p>

        <div className="mb-3.5 h-px bg-white/10" />

        <div className="flex">
          <div className="flex-1 border-r border-white/10 pr-3">
            <p className="mb-1 text-[10px] tracking-wide text-hero-accent/80">
              ENTRADAS
            </p>
            <p className="truncate text-[13px] font-medium text-hero-green">
              +{formatCurrency(entradasRealizadas)}
            </p>
          </div>
          <div className="flex-1 border-r border-white/10 px-3">
            <p className="mb-1 text-[10px] tracking-wide text-hero-accent/80">
              SAÍDAS
            </p>
            <p className="truncate text-[13px] font-medium text-hero-red">
              −{formatCurrency(saidasRealizadas)}
            </p>
          </div>
          <div className="flex-1 pl-3">
            <p className="mb-1 text-[10px] tracking-wide text-hero-accent/80">
              PREVISTO
            </p>
            <p className="truncate text-[13px] font-medium text-hero-accent">
              {formatCurrency(saldoPrevisto)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
