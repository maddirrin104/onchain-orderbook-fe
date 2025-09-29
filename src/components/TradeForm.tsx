import { useState } from 'react'
import { useDexActions } from '../hooks/useDexActions'

export default function TradeForm(){
  const [side, setSide] = useState<'BUY'|'SELL'>('BUY')
  const [price, setPrice] = useState('0')
  const [size, setSize] = useState('0')
  const { placeOrder, txHash } = useDexActions()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try{ await placeOrder(side, price, size) } catch(err:any){ alert(err.message || String(err)) }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex gap-2">
        <button type="button" className={`flex-1 py-2 rounded-xl ${side==='BUY'? 'bg-green-500':'bg-white/10'}`} onClick={()=>setSide('BUY')}>Buy</button>
        <button type="button" className={`flex-1 py-2 rounded-xl ${side==='SELL'? 'bg-red-500':'bg-white/10'}`} onClick={()=>setSide('SELL')}>Sell</button>
      </div>
      <div className="space-y-2">
        <label className="block text-sm text-zinc-400">Price</label>
        <input value={price} onChange={e=>setPrice(e.target.value)} inputMode="decimal" className="w-full px-3 py-2 rounded-xl bg-white/10 outline-none" placeholder="e.g. 2500000000000000000 (wei)" />
      </div>
      <div className="space-y-2">
        <label className="block text-sm text-zinc-400">Size</label>
        <input value={size} onChange={e=>setSize(e.target.value)} inputMode="decimal" className="w-full px-3 py-2 rounded-xl bg-white/10 outline-none" placeholder="e.g. 1000000000000000000 (wei)" />
      </div>
      <button className="w-full py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600">Submit Order</button>
      {txHash && <div className="text-xs text-zinc-400 break-all">Tx: {txHash}</div>}
    </form>
  )
}