// src/components/MarketTicker.tsx
import { useMemo, useState } from "react";
import { fmt } from "../lib/format";
import { usePriceFeeds } from "../hooks/usePriceFeeds";
import { FEEDS_SEPOLIA } from "../config/feeds";

// shadcn/ui
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Label } from "../components/ui/label";

const RPC = import.meta.env.VITE_RPC_URL || "https://sepolia.infura.io/v3/5d21deefacd3471b9f6af2fef8f415be";

type Props = {
  defaultSymbol?: string; // optional: preselect
  showStats?: boolean;    // optional: ẩn/hiện dòng H/L/Vol mock
};

export default function MarketTicker({ defaultSymbol = "ETH - USD", showStats = true }: Props) {
  // danh sách symbol render dropdown (chỉ cần symbol để hiển thị)
  const symbols = useMemo(() => FEEDS_SEPOLIA.map(f => f.symbol), []);
  const [symbol, setSymbol] = useState<string>(
    symbols.includes(defaultSymbol) ? defaultSymbol : symbols[0]
  );

  // Lấy giá theo toàn bộ FEEDS; map {symbol: price}
  const { prices, loading } = usePriceFeeds(RPC, FEEDS_SEPOLIA, 30000);
  const last = prices[symbol];

  // mock thống kê (Chainlink không có 24h change/vol)
  const mockChange = 1.23; // bạn có thể thay bằng dữ liệu thật khi có indexer
  const high = last ? last * 1.012 : undefined;
  const low  = last ? last * 0.988 : undefined;
  const vol  = 1234.56;

  return (
    <div className="rounded-2xl bg-white/5 shadow-card p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        {/* Dropdown chọn cặp */}
        <div className="flex items-center gap-2">
          <Label className="text-zinc-400">Market</Label>
          <Select value={symbol} onValueChange={setSymbol}>
            <SelectTrigger className="w-52 rounded-xl bg-white/5 border-zinc-800">
              <SelectValue placeholder="Select market" />
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

        {/* Giá hiện tại */}
        <div className="text-xl md:text-2xl font-semibold">
          {loading
            ? <span className="text-zinc-400">Loading…</span>
            : last !== undefined
              ? `${fmt.num(last, 2)} `
              : <span className="text-zinc-400">N/A</span>
          }
          {last !== undefined && (
            <span className={mockChange >= 0 ? "text-green-400 ml-2" : "text-red-400 ml-2"}>
              ({mockChange >= 0 ? "+" : ""}{mockChange.toFixed(2)}%)
            </span>
          )}
        </div>

        {/* Thống kê (mock) */}
        {showStats && (
          <div className="text-sm text-zinc-400">
            24h H:{high !== undefined ? fmt.num(high, 2) : "—"}
            {"  "}L:{low !== undefined ? fmt.num(low, 2) : "—"}
            {"  "}Vol:{fmt.num(vol, 0)}
          </div>
        )}
      </div>
    </div>
  );
}
