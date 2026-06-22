export const inputClass =
  "tap-target w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-[15px] text-text-primary placeholder:text-text-muted transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60";

type FormFieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-[13px] font-medium text-text-secondary">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-[12px] text-expense">{error}</p>}
    </div>
  );
}
