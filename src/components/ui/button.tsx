import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-brand text-brand-dark hover:bg-brand-hover",
  secondary:
    "border border-border bg-surface text-text-secondary hover:bg-neutral-soft",
  danger: "bg-expense text-white hover:opacity-90",
  ghost: "text-text-faint hover:bg-neutral-soft",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = "primary", className, ...props }, ref) {
    return (
      <button
        ref={ref}
        className={`tap-target inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${VARIANT_CLASSES[variant]} ${className ?? ""}`}
        {...props}
      />
    );
  },
);
