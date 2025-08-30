export const money = (n) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR" }).format(n);
