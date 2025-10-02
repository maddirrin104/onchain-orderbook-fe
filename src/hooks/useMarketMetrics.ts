import { useEffect, useState } from "react";
import { getOB } from "../lib/eth";
import { fmtUnits } from "../lib/units";

type Metrics = {
  last?: string;            // đã format theo priceDecimals
  bestBid?: string;
  bestAsk?: string;
  changePct?: number | null; // % so với giá mở (trades cũ nhất trong cửa sổ recent)
  volume?: number;           // tổng amount trong cửa sổ recent (đã scale về số thực)
  high?: number | null;      // high/low từ cửa sổ recent (dùng cho tương lai nếu cần)
  low?: number | null;
  trades?: number;           // số trade trong cửa sổ recent
};

export function useMarketMetrics(pollMs = 2000) {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [idBySymbol, setIdBySymbol] = useState<Record<string, number>>({});
  const [metrics, setMetrics] = useState<Record<string, Metrics>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    let cancel = false;
    let timer: any;

    (async () => {
      try {
        const ob = await getOB();

        // Lấy danh sách cặp
        const next = await ob.nextPairId();
        const n = Number(next) - 1;
        const syms: string[] = [];
        const map: Record<string, number> = {};
        for (let i = 1; i <= n; i++) {
          const [sym] = await ob.getPairMeta(i);
          syms.push(sym);
          map[sym] = i;
        }
        if (cancel) return;
        setSymbols(syms);
        setIdBySymbol(map);
        setLoading(false);

        // Hàm tải metrics tất cả cặp
        const loadAll = async () => {
          try {
            const ob2 = await getOB();
            const res: Record<string, Metrics> = {};

            // Chạy tuần tự để dễ debug; nếu muốn nhanh hơn có thể Promise.all
            for (const sym of syms) {
              const id = map[sym];
              const [ , priceDecBN, baseDecBN] = await ob2.getPairMeta(id);
              const priceDec = Number(priceDecBN);
              const baseDec  = Number(baseDecBN);

              // ticker
              const [hasBid, bidPx, , hasAsk, askPx] = await ob2.getBestBidAsk(id);
              const [lastPx] = await ob2.getLastPrice(id);
              const last = (lastPx as bigint) > 0n ? fmtUnits(lastPx as bigint, priceDec) : undefined;
              const bestBid = hasBid ? fmtUnits(bidPx as bigint, priceDec) : undefined;
              const bestAsk = hasAsk ? fmtUnits(askPx as bigint, priceDec) : undefined;

              // recent trades
              const trades = await ob2.getRecentTrades(id);
              let changePct: number | null = null;
              let volume = 0;
              let high: number | null = null;
              let low: number | null = null;

              if (Array.isArray(trades) && trades.length > 0) {
                // Contract trả newest-first → giá mở là phần tử cuối
                const newest = trades[0];
                const oldest = trades[trades.length - 1];

                // Chuyển về số thực để tính toán
                const newestPrice = Number(fmtUnits(newest.price as bigint, priceDec));
                const oldestPrice = Number(fmtUnits(oldest.price as bigint, priceDec));

                if (oldestPrice > 0) {
                  changePct = (newestPrice / oldestPrice - 1) * 100;
                }

                // Volume/high/low trong cửa sổ recent
                for (const t of trades as any[]) {
                  const px = Number(fmtUnits(t.price as bigint, priceDec));
                  const amt = Number(fmtUnits(t.amount as bigint, baseDec));
                  volume += amt;
                  high = high === null ? px : Math.max(high, px);
                  low  = low  === null ? px : Math.min(low, px);
                }
              }

              res[sym] = { last, bestBid, bestAsk, changePct, volume, high, low, trades: trades.length ?? 0 };
            }

            if (!cancel) setMetrics(res);
          } catch (e:any) {
            if (!cancel) setError(e?.message ?? String(e));
          }
        };

        await loadAll();
        timer = setInterval(loadAll, pollMs);
      } catch (e:any) {
        if (!cancel) {
          setError(e?.message ?? String(e));
          setLoading(false);
        }
      }
    })();

    return () => { cancel = true; if (timer) clearInterval(timer); };
  }, [pollMs]);

  return { symbols, idBySymbol, metrics, loading, error };
}
