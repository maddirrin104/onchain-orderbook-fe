// src/hooks/usePairIndex.ts
import { useEffect, useState } from "react";
import { getOB } from "../lib/eth";

export function usePairIndex() {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [idBySymbol, setIdBySymbol] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;

    (async () => {
      try {
        const ob = await getOB();
        const next = await ob.nextPairId();
        const n = Number(next) - 1;
        const syms: string[] = [];
        const map: Record<string, number> = {};

        for (let i = 1; i <= n; i++) {
          const [symbol] = await ob.getPairMeta(i);
          syms.push(symbol);
          map[symbol] = i;
        }
        if (!cancel) {
          setSymbols(syms);
          setIdBySymbol(map);
          setLoading(false);
        }
      } catch (e) {
        console.error("usePairIndex:", e);
        if (!cancel) setLoading(false);
      }
    })();

    return () => { cancel = true; };
  }, []);

  return { symbols, idBySymbol, loading };
}
