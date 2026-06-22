import type { HTMLAttributes } from "react";

type CardPadding = "sm" | "md" | "lg";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: CardPadding;
};

const PADDING_CLASSES: Record<CardPadding, string> = {
  sm: "p-4",
  md: "p-5",
  lg: "p-7",
};

export function Card({
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface shadow-card ${PADDING_CLASSES[padding]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </div>
  );
}
