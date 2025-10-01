// src/pages/Markets.tsx
import { Link } from "react-router-dom";
import { usePriceFeeds } from "../hooks/usePriceFeeds";
import { FEEDS_SEPOLIA } from "../config/feeds";

const RPC = import.meta.env.VITE_RPC_URL || "https://sepolia.infura.io/v3/5d21deefacd3471b9f6af2fef8f415be";

export default function MarketsPage() {
  const { prices, loading } = usePriceFeeds(RPC, FEEDS_SEPOLIA, 30000);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Markets</h2>
        <Link to="/" className="text-indigo-400 hover:underline">← Back</Link>
      </div>

      {/* lưới card các market */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEEDS_SEPOLIA.map((f) => {
          const price = prices[f.symbol];
          const hasAddr = Boolean(f.address);

          return (
            <div
              key={f.symbol}
              className="rounded-xl bg-white/5 p-4 hover:bg-white/10 transition border border-zinc-800"
            >
              <div className="flex items-start justify-between">
                <div className="font-semibold">{f.symbol}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${hasAddr ? "bg-emerald-900/30 text-emerald-300" : "bg-zinc-800 text-zinc-400"}`}>
                  {hasAddr ? "Live" : "Unavailable"}
                </span>
              </div>

              <div className="text-2xl mt-2">
                {hasAddr
                  ? (price !== undefined ? `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : (loading ? "Loading..." : "—"))
                  : "—"}
              </div>

              <div className="text-xs text-zinc-500 mt-2">
                {f.note ?? (hasAddr ? "Chainlink Sepolia oracle" : "No Sepolia feed address yet")}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-zinc-400 mt-6">
        * Giá lấy từ Chainlink Price Feeds qua Sepolia RPC; một số cặp có thể chưa có feed trên Sepolia.
      </div>
    </div>
  );
}
