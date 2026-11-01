const f = new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' });
export const nzd = (n: number) => f.format(n);
export const pct = (s: number) => `${Math.round(s * 100)}%`;
