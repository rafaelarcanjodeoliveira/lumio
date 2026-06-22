const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCurrency(valor: number): string {
  return currencyFormatter.format(valor);
}

const compactNumberFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 0,
});

/**
 * Versão sem "R$" e sem centavos, para espaços muito estreitos (ex.: célula
 * de calendário em mobile) onde o valor completo formatado não cabe.
 */
export function formatCompactNumber(valor: number): string {
  return compactNumberFormatter.format(valor);
}
