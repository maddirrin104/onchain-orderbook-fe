// src/context/PriceFeedContext.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type {ReactNode } from "react";
import { ethers } from "ethers";

type Prices = Record<string, number>;
type Status = "idle" | "loading" | "ok" | "error";

const FEEDS: Record<string, string> = {
  "ETH - USD": "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  "BTC - USD": "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
  "AUD - USD": "0xB0C712f98daE15264c8E26132BCC91C40aD4d5F9",
};

const AGGREGATOR_V3_ABI = [
  "function latestRoundData() view returns (uint80 roundId,int256 answer,uint256 startedAt,uint256 updatedAt,uint80 answeredInRound)",
  "function decimals() view returns (uint8)"
];

type Ctx = {
  prices: Prices;
  updatedAt?: number;
  status: Status;
  error?: string;
  refresh: () => Promise<void>;
};

const PriceFeedContext = createContext<Ctx | null>(null);

export function PriceFeedProvider({
  rpcUrl,
  pollMs = 30000,
  children
}: {
  rpcUrl: string;
  pollMs?: number;
  children: ReactNode;
}) {
  const [prices, setPrices] = useState<Prices>({});
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | undefined>();
  const [updatedAt, setUpdatedAt] = useState<number | undefined>();

  const provider = useMemo(() => new ethers.JsonRpcProvider(rpcUrl), [rpcUrl]);

  const load = async () => {
    setStatus("loading");
    setError(undefined);
    try {
      const entries = await Promise.all(
        Object.entries(FEEDS).map(async ([symbol, address]) => {
          const feed = new ethers.Contract(address, AGGREGATOR_V3_ABI, provider);
          const [roundData, decimals] = await Promise.all([
            feed.latestRoundData(),
            feed.decimals()
          ]);
          const answer = Number(roundData.answer) / 10 ** Number(decimals);
          return [symbol, answer] as const;
        })
      );
      const next: Prices = Object.fromEntries(entries);
      setPrices(next);
      setUpdatedAt(Date.now());
      setStatus("ok");
    } catch (e: any) {
      console.error("PriceFeed load error:", e);
      setError(e?.message ?? "Unknown error");
      setStatus("error");
    }
  };

  useEffect(() => {
    // initial fetch
    load();
    // polling
    const id = setInterval(load, pollMs);
    return () => clearInterval(id);
  }, [pollMs, provider]);

  const value: Ctx = useMemo(
    () => ({ prices, updatedAt, status, error, refresh: load }),
    [prices, updatedAt, status, error]
  );

  return <PriceFeedContext.Provider value={value}>{children}</PriceFeedContext.Provider>;
}

export function usePriceFeed() {
  const ctx = useContext(PriceFeedContext);
  if (!ctx) throw new Error("usePriceFeed must be used within <PriceFeedProvider>");
  return ctx;
}
