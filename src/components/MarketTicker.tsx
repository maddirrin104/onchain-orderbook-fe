// src/components/MarketTicker.tsx
import { useEffect, useMemo, useState } from "react";
import { usePairIndex } from "../hooks/usePairIndex";
import { useTicker } from "../hooks/useTicker";
import { useTrades } from "../hooks/useTrades";

// shadcn/ui
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Label } from "../components/ui/label";

type Props = {
  defaultSymbol?: string; // preselect symbol nếu có
  showStats?: boolean;    // ẩn/hiện H/L/Vol (tính từ recent trades)
};

export default function MarketTicker({ defaultSymbol = "ETH - USD", showStats = true }: Props) {
  const { symbols, idBySymbol, loading: loadingPairs } = usePairIndex();

  // chọn symbol mặc định nếu có, không thì chọn symbol đầu tiên
  const initialSymbol = useMemo(() => {
    if (symbols.includes(defaultSymbol)) return defaultSymbol;
    return symbols[0];
  }, [symbols, defaultSymbol]);

  const [symbol, setSymbol] = useState<string>(defaultSymbol);

  useEffect(() => {
    if (initialSymbol && symbol !== initialSymbol) setSymbol(initialSymbol);
  }, [initialSymbol]); // eslint-disable-line

  const pairId = idBySymbol[symbol] ?? 1;

  // đọc ticker on-chain
  const { symbol: liveSym, bestBid, bestAsk, last, loading } = useTicker(pairId);

  // đọc recent trades để tính high/low/vol trong “khoảng gần nhất”
  const { data: trades } = useTrades(64, pairId, 1500);
  const high = useMemo(() => {
    if (!trades || trades.length === 0) return undefined;
    return trades.reduce((m, t) => Math.max(m, Number(t.price)), -Infinity);
  }, [trades]);
  const low = useMemo(() => {
    if (!trades || trades.length === 0) return undefined;
    return trades.reduce((m, t) => Math.min(m, Number(t.price)), Infinity);
  }, [trades]);
  const vol = useMemo(() => {
    if (!trades || trades.length === 0) return 0;
    // tổng amount các trade (đã scale sẵn thành string), quy về number để hiển thị
    return trades.reduce((s, t) => s + Number(t.amount), 0);
  }, [trades]);

  return (
    <div className="rounded-2xl bg-white/5 shadow-card p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        {/* Dropdown chọn cặp từ contract */}
        <div className="flex items-center gap-2">
          <Label className="text-zinc-400">Market</Label>
          <Select value={symbol} onValueChange={setSymbol} disabled={loadingPairs || symbols.length===0}>
            <SelectTrigger className="w-56 rounded-xl bg-white/5 border-zinc-800">
              <SelectValue placeholder={loadingPairs ? "Loading…" : "Select market"} />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
              {symbols.map(sym => (
                <SelectItem key={sym} value={sym} className="cursor-pointer">
                  {sym}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Giá hiện tại (on-chain) */}
        <div className="text-xl md:text-2xl font-semibold">
          {loading ? (
            <span className="text-zinc-400">Loading…</span>
          ) : last ? (
            <>
              {last}
              {/* phần trăm thay đổi “tạm” nếu cần: dựa vào last vs (high+low)/2 */}
              {high && low && (
                <span className={(Number(last) >= (high+low)/2) ? "text-green-400 ml-2" : "text-red-400 ml-2"}>
                  ({(Number(last)/( (high+low)/2 ) - 1).toLocaleString(undefined,{ style:"percent", maximumFractionDigits:2 })})
                </span>
              )}
            </>
          ) : (
            <span className="text-zinc-400">N/A</span>
          )}
        </div>

        {/* Thống kê gần nhất từ recent trades */}
        {showStats && (
          <div className="text-sm text-zinc-400">
            <span className="mr-3">Pair: {liveSym ?? symbol ?? "—"}</span>
            H:{high !== undefined && isFinite(high) ? high.toLocaleString(undefined,{ maximumFractionDigits: 6 }) : "—"}
            {"  "}L:{low !== undefined && isFinite(low) ? low.toLocaleString(undefined,{ maximumFractionDigits: 6 }) : "—"}
            {"  "}Vol:{vol.toLocaleString(undefined,{ maximumFractionDigits: 2 })}
          </div>
        )}

        {/* Bid/Ask */}
        <div className="text-sm flex items-center gap-3">
          <div className="text-zinc-400">Bid:</div>
          <div className="text-green-400 font-medium">{bestBid ?? "—"}</div>
          <div className="text-zinc-400">Ask:</div>
          <div className="text-red-400 font-medium">{bestAsk ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}
