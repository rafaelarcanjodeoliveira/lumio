import type { HTMLAttributes } from "react";

type PageContainerProps = HTMLAttributes<HTMLDivElement>;

/**
 * Wrapper padrão do corpo de cada página autenticada. `pb-24` no mobile
 * reserva espaço para a bottom nav fixa não cobrir o conteúdo; em desktop
 * (lg:) não há bottom nav, então o padding inferior volta ao normal.
 */
export function PageContainer({
  className,
  children,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={`flex-1 px-4 py-4 pb-24 sm:px-6 sm:py-6 lg:px-8 lg:pb-6 ${className ?? ""}`}
      {...props}
    >
      {children}
    </div>
  );
}
