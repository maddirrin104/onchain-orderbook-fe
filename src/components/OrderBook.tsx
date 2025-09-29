import { useOrderbook } from '../hooks/useOrderbook'
import { fmt } from '../lib/format'

export default function OrderBook(){
  const { data, isLoading } = useOrderbook(18)
  if(isLoading) return <div>Loading…</div>
  const bids = data?.bids ?? []
  const asks = data?.asks ?? []

  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      {/* Bids */}
      <div>
        <div className="flex justify-between text-zinc-400 mb-1"><span>Bid Size</span><span>Price</span></div>
        <div className="space-y-1">
          {bids.slice(0, 18).map((l, i) => (
            <div key={'b'+i} className="flex justify-between bg-green-500/10 px-2 py-1 rounded-md">
              <span>{fmt.num(l.size)}</span>
              <span className="text-green-400">{fmt.num(l.price)}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Asks */}
      <div>
        <div className="flex justify-between text-zinc-400 mb-1"><span>Price</span><span>Ask Size</span></div>
        <div className="space-y-1">
          {asks.slice(0, 18).map((l, i) => (
            <div key={'a'+i} className="flex justify-between bg-red-500/10 px-2 py-1 rounded-md">
              <span className="text-red-400">{fmt.num(l.price)}</span>
              <span>{fmt.num(l.size)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}