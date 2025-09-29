import { fmt } from '../lib/format'

// Stubbed market header; wire it to oracle or mid-price later
export default function MarketTicker(){
  const mark = { symbol: 'ETH‑USD', last: 2451.23, change: +1.23, high: 2488.0, low: 2390.5, volume: 1234.56 }
  return (
    <div className="rounded-2xl bg-white/5 shadow-card p-4">
      <div className="flex flex-wrap items-center gap-6">
        <div className="text-2xl font-semibold">{mark.symbol}</div>
        <div className="text-xl">{fmt.num(mark.last, 2)} <span className={mark.change>=0? 'text-green-400':'text-red-400'}>({mark.change>=0?'+':''}{mark.change.toFixed(2)}%)</span></div>
        <div className="text-sm text-zinc-400">24h H:{fmt.num(mark.high,2)} L:{fmt.num(mark.low,2)} Vol:{fmt.num(mark.volume,0)}</div>
      </div>
    </div>
  )
}