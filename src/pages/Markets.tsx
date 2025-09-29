// src/pages/Markets.tsx
import { Link } from 'react-router-dom'

const MOCK = [
  { symbol: 'ETH-USD', last: 2451.23, chg: +1.23, vol: 1234.5 },
  { symbol: 'BTC-USD', last: 67321.9, chg: -0.42, vol: 912.2 },
  { symbol: 'OP-USD',  last: 1.92,   chg: +4.88, vol: 10234 },
]

export default function MarketsPage(){
  return (
    <div className="rounded-2xl bg-white/5 shadow-card p-4">
      <h2 className="text-lg font-semibold mb-4">Markets</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK.map((m) => (
          <Link key={m.symbol} to="/" className="rounded-xl bg-white/5 p-4 hover:bg-white/10 transition">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{m.symbol}</div>
              <div className={m.chg>=0 ? 'text-green-400' : 'text-red-400'}>
                {m.chg>=0?'+':''}{m.chg.toFixed(2)}%
              </div>
            </div>
            <div className="text-2xl mt-1">{m.last.toLocaleString()}</div>
            <div className="text-sm text-zinc-400 mt-1">Vol: {m.vol.toLocaleString()}</div>
          </Link>
        ))}
      </div>
      <div className="text-xs text-zinc-400 mt-4">* Thay danh sách trên bằng dữ liệu oracle/subgraph sau.</div>
    </div>
  )
}
