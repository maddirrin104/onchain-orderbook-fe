// src/pages/Settings.tsx
import { useEffect, useState } from 'react'

export function SettingsPage(){
  const [decimals, setDecimals] = useState(() => Number(localStorage.getItem('priceDecimals') || 4))

  useEffect(() => {
    localStorage.setItem('priceDecimals', String(decimals))
  }, [decimals])

  return (
    <div className="rounded-2xl bg-white/5 shadow-card p-4 space-y-4">
      <h2 className="text-lg font-semibold">Settings</h2>
      <div className="space-y-2">
        <label className="block text-sm text-zinc-400">Price decimals</label>
        <input
          type="number"
          min={0}
          max={18}
          value={decimals}
          onChange={e=>setDecimals(Number(e.target.value))}
          className="w-32 px-3 py-2 rounded-xl bg-white/10 outline-none"
        />
        <div className="text-xs text-zinc-400">Lưu trong localStorage để tái sử dụng.</div>
      </div>
      <div className="text-sm text-zinc-400">* Có thể thêm tuỳ chọn theme, RPC endpoint, default market…</div>
    </div>
  )
}
