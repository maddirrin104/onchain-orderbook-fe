export const fmt = {
  num(n?: number | string, d = 4){
    if(n === undefined || n === null) return '-'
    const x = typeof n === 'string' ? parseFloat(n) : n
    return Intl.NumberFormat('en-US', { maximumFractionDigits: d }).format(x)
  },
}

export const isUsdPair = (sym?: string) =>
  !!sym && sym.toUpperCase().trim().endsWith(" - USD");

export function withUsd(val?: string | number, sym?: string, digits = 6) {
  if (val === undefined || val === null || isNaN(Number(val))) return "—";
  const s = typeof val === "number"
    ? val.toLocaleString(undefined, { maximumFractionDigits: digits })
    : val; // val đã là string format sẵn (fmtUnits) -> giữ nguyên
  return `${isUsdPair(sym) ? "$" : ""}${s}`;
}
