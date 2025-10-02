import { useEffect, useMemo, useState } from "react";
import { getOB } from "../lib/eth";
import { fmtUnits } from "../lib/units";

/** Đọc toàn bộ cặp từ contract + ticker (best bid/ask, last) theo chu kỳ */
export function useTickers(pollMs = 1500) {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [idBySymbol, setIdBySymbol] = useState<Record<string, number>>({});
  const [data, setData] = useState<Record<string, {
    last?: string;
    bestBid?: string;
    bestAsk?: string;
  }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    let timer: any;

    (async () => {
      try {
        const ob = await getOB();
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

        const load = async () => {
          try {
            const ob2 = await getOB();
            const entries = await Promise.all(syms.map(async (sym) => {
              const id = map[sym];
              const [symbol, priceDec, baseDec] = await ob2.getPairMeta(id);
              const [hasBid, bidPx, , hasAsk, askPx] = await ob2.getBestBidAsk(id);
              const [lastPx] = await ob2.getLastPrice(id);

              const last = (lastPx as bigint) > 0n ? fmtUnits(lastPx as bigint, Number(priceDec)) : undefined;
              const bestBid = hasBid ? fmtUnits(bidPx as bigint, Number(priceDec)) : undefined;
              const bestAsk = hasAsk ? fmtUnits(askPx as bigint, Number(priceDec)) : undefined;

              return [symbol as string, { last, bestBid, bestAsk }] as const;
            }));

            if (!cancel) {
              const rec: Record<string, { last?: string; bestBid?: string; bestAsk?: string }> = {};
              for (const [sym, val] of entries) rec[sym] = val;
              setData(rec);
            }
          } catch (e) {
            console.error("useTickers load:", e);
          }
        };

        await load();
        timer = setInterval(load, pollMs);
      } catch (e) {
        console.error("useTickers init:", e);
        setLoading(false);
      }
    })();

    return () => { cancel = true; if (timer) clearInterval(timer); };
  }, [pollMs]);

  const api = useMemo(() => ({
    symbols, idBySymbol, tickers: data, loading
  }), [symbols, idBySymbol, data, loading]);

  return api;
}
