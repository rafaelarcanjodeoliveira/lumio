import type { HTMLAttributes } from "react";

type PageContainerProps = HTMLAttributes<HTMLDivElement>;

/**
 * Wrapper padrão do corpo de cada página autenticada. `pb-24` no mobile
 * reserva espaço para a bottom nav fixa não cobrir o conteúdo; a partir de
 * `md:` a sidebar substitui a bottom nav, então o padding inferior volta
 * ao normal nesse mesmo breakpoint.
 */
export function PageContainer({
  className,
  children,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={`flex-1 px-4 py-4 pb-24 sm:px-6 sm:py-6 md:pb-6 lg:px-8 ${className ?? ""}`}
      {...props}
    >
      {children}
    </div>
  );
}
