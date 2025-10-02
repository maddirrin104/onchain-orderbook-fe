// src/hooks/useOrderbook.ts
import { useEffect, useState } from "react";
import { getOB } from "../lib/eth";
import { fmtUnits } from "../lib/units";

type OBRow = { price: string; size: string };

type OBState = {
  bids: OBRow[];
  asks: OBRow[];
};

export function useOrderbook(depth = 18, pairId = 1, pollMs = 1000) {
  const [data, setData] = useState<OBState>({ bids: [], asks: [] });
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let t: any;
    let cancel = false;

    (async () => {
      try {
        const ob = await getOB();
        const meta = await ob.getPairMeta(pairId);
        const priceDec = Number(meta[1]);
        const baseDec = Number(meta[2]);

        const load = async () => {
          try {
            const [bidPx, bidSz, askPx, askSz] = await ob.getTopOfBook(pairId, depth);
            const bids = (bidPx as bigint[]).map((p, i) => ({
              price: fmtUnits(p, priceDec),
              size: fmtUnits((bidSz as bigint[])[i], baseDec),
            }));
            const asks = (askPx as bigint[]).map((p, i) => ({
              price: fmtUnits(p, priceDec),
              size: fmtUnits((askSz as bigint[])[i], baseDec),
            }));
            if (!cancel) {
              setData({ bids, asks });
              setLoading(false);
            }
          } catch (e) {
            console.error("getTopOfBook:", e);
          }
        };

        await load();
        t = setInterval(load, pollMs);
      } catch (e) {
        console.error("useOrderbook init:", e);
      }
    })();

    return () => {
      cancel = true;
      if (t) clearInterval(t);
    };
  }, [depth, pairId, pollMs]);

  return { data, isLoading };
}
