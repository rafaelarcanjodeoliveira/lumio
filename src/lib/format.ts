const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCurrency(valor: number): string {
  return currencyFormatter.format(valor);
}
