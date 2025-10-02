// src/lib/units.ts
export function fmtUnits(bi: bigint, decimals: number, frac = 6) {
  const neg = bi < 0n;
  let x = neg ? -bi : bi;
  const base = 10n ** BigInt(decimals);
  const int = x / base;
  const fracPart = x % base;

  let fracStr = fracPart.toString().padStart(decimals, "0");
  // cắt bớt chữ số thập phân cho UI
  if (fracStr.length > frac) fracStr = fracStr.slice(0, frac);
  fracStr = fracStr.replace(/0+$/, "");

  return `${neg ? "-" : ""}${int.toString()}${fracStr ? "." + fracStr : ""}`;
}
