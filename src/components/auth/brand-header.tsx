export function BrandHeader() {
  return (
    <div className="mb-10 flex flex-col items-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand">
        <svg viewBox="0 0 14 14" fill="none" className="h-6 w-6">
          <rect x="3" y="1.5" width="3" height="10" rx="1" fill="#412402" />
          <rect x="3" y="9" width="8" height="3" rx="1" fill="#412402" />
          <line x1="7" y1="0" x2="7" y2="1.5" stroke="#412402" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="11" y1="1" x2="10" y2="2.2" stroke="#412402" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="12.5" y1="4.5" x2="11" y2="4.5" stroke="#412402" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
      <span className="text-xl font-semibold tracking-tight text-brand-dark">
        Lumio
      </span>
      <p className="mt-1.5 text-[13px] text-text-muted">
        Clareza para o seu mês financeiro
      </p>
    </div>
  );
}
