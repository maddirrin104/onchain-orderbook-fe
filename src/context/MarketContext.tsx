import { createContext, useContext, useMemo, useState } from "react";
import { usePairIndex } from "../hooks/usePairIndex";

type Ctx = {
  symbol?: string;
  pairId?: number;
  symbols: string[];
  idBySymbol: Record<string, number>;
  setSymbol: (s: string) => void;
  loading: boolean;
};

const MarketCtx = createContext<Ctx>({
  symbol: undefined,
  pairId: undefined,
  symbols: [],
  idBySymbol: {},
  setSymbol: () => {},
  loading: true,
});

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const { symbols, idBySymbol, loading } = usePairIndex();
  const [symbol, setSymbol] = useState<string | undefined>(undefined);

  // chọn symbol đầu tiên khi load xong lần đầu
  const currentSymbol = symbol ?? (symbols.length ? symbols[0] : undefined);
  const pairId = currentSymbol ? idBySymbol[currentSymbol] : undefined;

  const value = useMemo(
    () => ({ symbol: currentSymbol, pairId, symbols, idBySymbol, setSymbol, loading }),
    [currentSymbol, pairId, symbols, idBySymbol, loading]
  );

  return <MarketCtx.Provider value={value}>{children}</MarketCtx.Provider>;
}

export function useMarket() {
  return useContext(MarketCtx);
}
