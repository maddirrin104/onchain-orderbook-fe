// src/hooks/useTicker.ts
import { useEffect, useState } from "react";
import { getOB } from "../lib/eth";
import { fmtUnits } from "../lib/units";

export function useTicker(pairId = 1, pollMs = 1000) {
  const [state, setState] = useState<{
    symbol?: string;
    priceDec?: number;
    baseDec?: number;
    bestBid?: string; bestBidSz?: string;
    bestAsk?: string; bestAskSz?: string;
    last?: string; lastTs?: number;
    loading: boolean;
  }>({ loading: true });

  useEffect(() => {
    let t: any, cancel = false;

    (async () => {
      try {
        const ob = await getOB();
        const [symbol, priceDec, baseDec] = await ob.getPairMeta(pairId);

        const load = async () => {
          try {
            const [hasBid, bidPx, bidSz, hasAsk, askPx, askSz] = await ob.getBestBidAsk(pairId);
            const [lastPx, lastTs] = await ob.getLastPrice(pairId);

            const s = {
              symbol,
              priceDec: Number(priceDec),
              baseDec: Number(baseDec),
              bestBid: hasBid ? fmtUnits(bidPx as bigint, Number(priceDec)) : undefined,
              bestBidSz: hasBid ? fmtUnits(bidSz as bigint, Number(baseDec)) : undefined,
              bestAsk: hasAsk ? fmtUnits(askPx as bigint, Number(priceDec)) : undefined,
              bestAskSz: hasAsk ? fmtUnits(askSz as bigint, Number(baseDec)) : undefined,
              last: (lastPx as bigint) > 0n ? fmtUnits(lastPx as bigint, Number(priceDec)) : undefined,
              lastTs: Number(lastTs) || undefined,
              loading: false,
            };
            if (!cancel) setState(s);
          } catch (e) {
            console.error("useTicker load:", e);
          }
        };

        await load();
        t = setInterval(load, pollMs);
      } catch (e) {
        console.error("useTicker init:", e);
        if (!cancel) setState((s) => ({ ...s, loading: false }));
      }
    })();

    return () => {
      cancel = true;
      if (t) clearInterval(t);
    };
  }, [pairId, pollMs]);

  return state;
}
