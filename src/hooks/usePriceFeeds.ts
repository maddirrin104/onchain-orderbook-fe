// src/hooks/usePriceFeeds.ts
import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import type { Feed } from "../config/feeds";

const ABI = [
  "function latestRoundData() view returns (uint80 roundId,int256 answer,uint256 startedAt,uint256 updatedAt,uint80 answeredInRound)",
  "function decimals() view returns (uint8)"
];

export function usePriceFeeds(rpcUrl: string, feeds: Feed[], pollMs = 30000) {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const provider = useMemo(() => new ethers.JsonRpcProvider(rpcUrl), [rpcUrl]);

  const load = async () => {
    setLoading(true);
    try {
      const entries = await Promise.all(
        feeds
          .filter(f => !!f.address) // chỉ gọi những feed có address
          .map(async (f) => {
            const c = new ethers.Contract(f.address!, ABI, provider);
            const [rd, dec] = await Promise.all([c.latestRoundData(), c.decimals()]);
            const price = Number(rd.answer) / 10 ** Number(dec);
            return [f.symbol, price] as const;
          })
      );
      setPrices(Object.fromEntries(entries));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, pollMs);
    return () => clearInterval(id);
  }, [provider, pollMs, feeds]);

  return { prices, loading, refresh: load };
}
