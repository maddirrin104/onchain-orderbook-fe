import { Link } from "react-router-dom";
import { useTickers } from "../hooks/useTickers";

export default function MarketsPage() {
  const { symbols, tickers, loading } = useTickers(1500);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Markets</h2>
        <Link to="/" className="text-indigo-400 hover:underline">← Back</Link>
      </div>

      {/* lưới card các market (on-chain) */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {symbols.map((sym) => {
          const t = tickers[sym];
          const live = Boolean(t?.last || t?.bestBid || t?.bestAsk);

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

              <div className="text-2xl mt-2">
                {loading ? "Loading..." : (t?.last ?? "—")}
              </div>

              <div className="text-xs text-zinc-500 mt-2">
                ChainBook
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

      {/* <div className="text-xs text-zinc-400 mt-6">
        * Dữ liệu lấy trực tiếp từ OnchainOrderBook local; không gọi Chainlink.
      </div> */}
    </div>
  );
}
