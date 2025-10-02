// src/hooks/useTrades.ts
import { useEffect, useState } from "react";
import { getOB } from "../lib/eth";
import { fmtUnits } from "../lib/units";

type TradeRow = {
  ts: number;         // ms timestamp cho recharts
  price: string;      // đã scale
  amount: string;     // đã scale
  maker: string;
  taker: string;
  takerSide: "BUY" | "SELL";
};

export function useTrades(limit = 100, pairId = 1, pollMs = 1000) {
  const [data, setData] = useState<TradeRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let t: any;
    let cancel = false;

    (async () => {
      try {
        const ob = await getOB();
        const meta = await ob.getPairMeta(pairId);
        const priceDec = Number(meta[1]);
        const baseDec  = Number(meta[2]);

        const load = async () => {
          try {
            const out = await ob.getRecentTrades(pairId);
            const rows = (out as any[]).map((t) => ({
              ts: Number(t.ts) * 1000,
              price: fmtUnits(t.price as bigint, priceDec),
              amount: fmtUnits(t.amount as bigint, baseDec),
              maker: t.maker as string,
              taker: t.taker as string,
              takerSide: Number(t.takerSide) === 0 ? "BUY" as "BUY" : "SELL" as "SELL",
            }));
            // newest-first theo contract, mình cứ slice theo limit
            const limited = rows.slice(0, limit);
            if (!cancel) {
              setData(limited);
              setLoading(false);
            }
          } catch (e) {
            console.error("getRecentTrades:", e);
          }
        };

        await load();
        t = setInterval(load, pollMs);
      } catch (e) {
        console.error("useTrades init:", e);
      }
    })();

    return () => {
      cancel = true;
      if (t) clearInterval(t);
    };
  }, [limit, pairId, pollMs]);

  return { data, loading };
}
