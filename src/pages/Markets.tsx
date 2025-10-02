import { Link } from "react-router-dom";
import { useMarketMetrics } from "../hooks/useMarketMetrics";
import { withUsd } from "../lib/format";

export default function MarketsPage() {
  const { symbols, metrics, loading, error } = useMarketMetrics(2000);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Markets</h2>
        <Link to="/" className="text-indigo-400 hover:underline">← Back</Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {symbols.map((sym) => {
          const m = metrics[sym] ?? {};
          const live = Boolean(m.last || m.bestBid || m.bestAsk || (m.trades ?? 0) > 0);
          const ch = m.changePct ?? null;
          const chStr = ch === null ? "—" : `${ch >= 0 ? "+" : ""}${ch.toFixed(2)}%`;

          return (
            <div
              key={sym}
              className="rounded-xl bg-white/5 p-4 hover:bg-white/10 transition border border-zinc-800"
            >
              <div className="flex items-start justify-between">
                <div className="font-semibold">{sym}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${live ? "bg-emerald-900/30 text-emerald-300" : "bg-zinc-800 text-zinc-400"}`}>
                  {live ? "Live" : "No Data"}
                </span>
              </div>

              <div className="mt-2 flex items-baseline gap-3">
                <div className="text-2xl">{loading ? "Loading..." : withUsd(m.last, sym, 6)}</div>
                <div className={`text-sm ${ch !== null ? (ch >= 0 ? "text-green-400" : "text-red-400") : "text-zinc-400"}`}>
                  {chStr}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-zinc-400 mt-3">
                <div>Bid</div><div className="text-green-400 text-right">{withUsd(m.bestBid, sym, 6)}</div>
                <div>Ask</div><div className="text-red-400 text-right">{withUsd(m.bestAsk, sym, 6)}</div>
                <div>Volume (recent)</div><div className="text-right">{withUsd(m.volume, sym, 6)}</div>
                {/* Nếu muốn thêm H/L: */}
                {/* <div>High</div><div className="text-right">{fmtNum(m.high, 6)}</div>
                <div>Low</div><div className="text-right">{fmtNum(m.low, 6)}</div> */}
                <div>Trades</div><div className="text-right">{m.trades ?? 0}</div>
              </div>

              <div className="text-[11px] text-zinc-600 mt-2">
                ChainBook - DEX No.1 Viet Nam
              </div>
            </div>
          );
        })}
        {!symbols.length && (
          <div className="rounded-xl bg-white/5 p-4 border border-zinc-800">
            No pairs found. Did you run deploy + seed?
          </div>
        )}
      </div>
    </div>
  );
}
