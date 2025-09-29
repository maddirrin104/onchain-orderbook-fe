# DEX Orderbook Frontend – Starter Kit (React + Vite + TypeScript)

A production‑ready React starter to build a decentralized exchange (DEX) frontend for an **on‑chain orderbook**. Includes wallet connect (wagmi/viem), query caching, Tailwind UI, reusable hooks, and example components (OrderBook, TradeForm, PriceChart, Orders).

> Tech stack: **Vite + React + TypeScript + TailwindCSS + wagmi + viem + @tanstack/react-query + Recharts**

---

## 1) Quick Start

```bash
# 1) Create project
npm create vite@latest dex-orderbook-frontend -- --template react-ts
cd dex-orderbook-frontend

# 2) Install deps
npm i wagmi viem @tanstack/react-query recharts
npm i -D tailwindcss postcss autoprefixer @types/node

# 3) Tailwind init
npx tailwindcss init -p

# 4) Replace/Add files per sections below

# 5) Run
npm run dev
```

---

## 2) Tailwind setup

**tailwind.config.js**

```ts
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      container: { center: true, padding: '1rem' },
      boxShadow: {
        card: '0 8px 30px rgba(0,0,0,0.08)'
      }
    },
  },
  plugins: [],
}
```

**src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* App theme tokens */
:root{
  --bg: 14 14 18;
  --fg: 244 244 245;
  --muted: 161 161 170;
  --accent: 99 102 241; /* indigo */
}

html, body, #root { height: 100%; }
body { background: rgb(var(--bg)); color: rgb(var(--fg)); }
```

---

## 3) Project structure

```
src/
  components/
    Layout.tsx
    WalletBar.tsx
    MarketTicker.tsx
    OrderBook.tsx
    TradeForm.tsx
    OrdersTable.tsx
    PriceChart.tsx
  hooks/
    useOrderbook.ts
    useTrades.ts
    useDexActions.ts
  lib/
    wagmi.ts
    format.ts
  abis/
    Dex.json
  types.ts
  App.tsx
  main.tsx
index.css
```

---

## 4) Base app wiring

**src/main.tsx**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './lib/wagmi'
import App from './App'
import './index.css'

const client = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)
```

**src/App.tsx**

```tsx
import Layout from './components/Layout'
import MarketTicker from './components/MarketTicker'
import OrderBook from './components/OrderBook'
import TradeForm from './components/TradeForm'
import OrdersTable from './components/OrdersTable'
import PriceChart from './components/PriceChart'

export default function App(){
  return (
    <Layout>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <MarketTicker />
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-6">
              <div className="rounded-2xl bg-white/5 shadow-card p-4">
                <h2 className="text-lg font-semibold mb-2">Order Book</h2>
                <OrderBook />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div className="rounded-2xl bg-white/5 shadow-card p-4">
                <h2 className="text-lg font-semibold mb-2">Recent Trades</h2>
                <PriceChart />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="rounded-2xl bg-white/5 shadow-card p-4">
            <h2 className="text-lg font-semibold mb-2">Trade</h2>
            <TradeForm />
          </div>
          <div className="rounded-2xl bg-white/5 shadow-card p-4">
            <h2 className="text-lg font-semibold mb-2">My Orders</h2>
            <OrdersTable />
          </div>
        </div>
      </div>
    </Layout>
  )
}
```

---

## 5) wagmi/viem config

**src/lib/wagmi.ts**

```ts
import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, hardhat } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Choose your default chain here. For local dev use hardhat.
const CHAINS = [hardhat, sepolia]

export const config = createConfig({
  chains: CHAINS,
  transports: {
    [hardhat.id]: http('http://127.0.0.1:8545'),
    [sepolia.id]: http(), // use default public RPC; replace with your provider if rate-limited
  },
  connectors: [injected()],
})
```

**src/lib/format.ts**

```ts
export const fmt = {
  num(n?: number | string, d = 4){
    if(n === undefined || n === null) return '-'
    const x = typeof n === 'string' ? parseFloat(n) : n
    return Intl.NumberFormat('en-US', { maximumFractionDigits: d }).format(x)
  },
}
```

---

## 6) Types & ABI placeholder

**src/types.ts**

```ts
export type Side = 'BUY' | 'SELL'
export interface OrderBookLevel { price: string; size: string }
export interface OrderBook { bids: OrderBookLevel[]; asks: OrderBookLevel[] }
export interface Trade { price: string; size: string; ts: number; side: Side }
```

**src/abis/Dex.json**

```json
{
  "abi": [
    {"type":"function","name":"placeOrder","stateMutability":"nonpayable","inputs":[{"name":"market","type":"bytes32"},{"name":"side","type":"uint8"},{"name":"price","type":"uint256"},{"name":"size","type":"uint256"}],"outputs":[{"name":"orderId","type":"uint256"}]},
    {"type":"function","name":"cancelOrder","stateMutability":"nonpayable","inputs":[{"name":"orderId","type":"uint256"}],"outputs":[]},
    {"type":"function","name":"getOrderBook","stateMutability":"view","inputs":[{"name":"market","type":"bytes32"},{"name":"depth","type":"uint256"}],"outputs":[{"name":"bids","type":"uint256[][2]"},{"name":"asks","type":"uint256[][2]"}]},
    {"type":"function","name":"getRecentTrades","stateMutability":"view","inputs":[{"name":"market","type":"bytes32"},{"name":"count","type":"uint256"}],"outputs":[{"name":"prices","type":"uint256[]"},{"name":"sizes","type":"uint256[]"},{"name":"sides","type":"uint8[]"},{"name":"timestamps","type":"uint256[]"}]},
    {"type":"function","name":"baseDecimals","stateMutability":"view","inputs":[],"outputs":[{"type":"uint8"}]},
    {"type":"function","name":"quoteDecimals","stateMutability":"view","inputs":[],"outputs":[{"type":"uint8"}]}
  ]
}
```

> Replace this ABI with your actual deployed DEX contract.

---

## 7) Data hooks (viem calls wrapped in React Query)

**src/hooks/useOrderbook.ts**

```ts
import { useQuery } from '@tanstack/react-query'
import { Hex, createPublicClient, getContract, http } from 'viem'
import { hardhat } from 'viem/chains'
import Dex from '../abis/Dex.json'
import type { OrderBook } from '../types'

const DEX_ADDRESS: Hex = (import.meta.env.VITE_DEX_ADDRESS || '0x0000000000000000000000000000000000000000') as Hex
const MARKET = (import.meta.env.VITE_MARKET_SYMBOL || 'ETH-USD')

const marketToBytes32 = (sym: string) => {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(sym)
  const arr = new Uint8Array(32)
  arr.set(bytes.slice(0, 32))
  return ('0x' + Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('')) as Hex
}

const client = createPublicClient({ chain: hardhat, transport: http('http://127.0.0.1:8545') })

export function useOrderbook(depth = 20){
  return useQuery<OrderBook>({
    queryKey: ['orderbook', MARKET, depth, DEX_ADDRESS],
    queryFn: async () => {
      if(DEX_ADDRESS === '0x0000000000000000000000000000000000000000') return { bids: [], asks: [] }
      const dex = getContract({ address: DEX_ADDRESS, abi: (Dex as any).abi, client })
      const [bidsRaw, asksRaw] = await dex.read.getOrderBook([marketToBytes32(MARKET), BigInt(depth)]) as any
      const toLevels = (raw: any): { price: string; size: string }[] => (raw || []).map((pair: [bigint, bigint]) => ({ price: pair[0].toString(), size: pair[1].toString() }))
      return { bids: toLevels(bidsRaw), asks: toLevels(asksRaw) }
    },
    refetchInterval: 1500,
  })
}
```

**src/hooks/useTrades.ts**

```ts
import { useQuery } from '@tanstack/react-query'
import { Hex, createPublicClient, getContract, http } from 'viem'
import { hardhat } from 'viem/chains'
import Dex from '../abis/Dex.json'
import type { Trade } from '../types'

const DEX_ADDRESS: Hex = (import.meta.env.VITE_DEX_ADDRESS || '0x0000000000000000000000000000000000000000') as Hex
const MARKET = (import.meta.env.VITE_MARKET_SYMBOL || 'ETH-USD')

const marketToBytes32 = (sym: string) => {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(sym)
  const arr = new Uint8Array(32)
  arr.set(bytes.slice(0, 32))
  return ('0x' + Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('')) as Hex
}

const client = createPublicClient({ chain: hardhat, transport: http('http://127.0.0.1:8545') })

export function useTrades(count = 60){
  return useQuery<Trade[]>({
    queryKey: ['trades', MARKET, count, DEX_ADDRESS],
    queryFn: async () => {
      if(DEX_ADDRESS === '0x0000000000000000000000000000000000000000') return []
      const dex = getContract({ address: DEX_ADDRESS, abi: (Dex as any).abi, client })
      const [prices, sizes, sides, timestamps] = await dex.read.getRecentTrades([marketToBytes32(MARKET), BigInt(count)]) as any
      return prices.map((p: bigint, i: number) => ({
        price: p.toString(),
        size: (sizes[i] as bigint).toString(),
        side: ((sides[i] as number) === 0 ? 'BUY' : 'SELL') as any,
        ts: Number(timestamps[i] as bigint) * 1000,
      }))
    },
    refetchInterval: 2000,
  })
}
```

**src/hooks/useDexActions.ts**

```ts
import { useMemo, useState } from 'react'
import type { Hex } from 'viem'
import { createWalletClient, custom, getContract } from 'viem'
import { hardhat } from 'viem/chains'
import Dex from '../abis/Dex.json'

const DEX_ADDRESS: Hex = (import.meta.env.VITE_DEX_ADDRESS || '0x0000000000000000000000000000000000000000') as Hex
const MARKET = (import.meta.env.VITE_MARKET_SYMBOL || 'ETH-USD')

const marketToBytes32 = (sym: string) => {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(sym)
  const arr = new Uint8Array(32)
  arr.set(bytes.slice(0, 32))
  return ('0x' + Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('')) as Hex
}

export function useDexActions(){
  const [txHash, setTxHash] = useState<Hex | null>(null)

  const client = useMemo(() => {
    if(!(window as any).ethereum) return null
    return createWalletClient({ chain: hardhat, transport: custom((window as any).ethereum) })
  }, [])

  const placeOrder = async (side: 'BUY'|'SELL', price: string, size: string) => {
    if(!client) throw new Error('Wallet not connected')
    const dex = getContract({ address: DEX_ADDRESS, abi: (Dex as any).abi, client })
    const sideNum = side === 'BUY' ? 0 : 1
    if (!client.account) throw new Error('Wallet account not found')
    const hash = await dex.write.placeOrder([marketToBytes32(MARKET), sideNum, BigInt(price), BigInt(size)], { account: client.account })
    setTxHash(hash as Hex)
    return hash
  }

  const cancelOrder = async (orderId: string) => {
    if(!client) throw new Error('Wallet not connected')
    if (!client.account) throw new Error('Wallet account not found')
    const dex = getContract({ address: DEX_ADDRESS, abi: (Dex as any).abi, client })
    const hash = await dex.write.cancelOrder([BigInt(orderId)], { account: client.account })
    setTxHash(hash as Hex)
    return hash
  }

  return { placeOrder, cancelOrder, txHash }
}
```

---

## 8) UI components

**src/components/Layout.tsx**

```tsx
import WalletBar from './WalletBar'

export default function Layout({ children }: { children: React.ReactNode }){
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 backdrop-blur bg-black/30 border-b border-white/10">
        <div className="container flex items-center justify-between py-3">
          <div className="text-xl font-bold">On‑Chain Orderbook DEX</div>
          <WalletBar />
        </div>
      </header>
      <main className="container py-6">
        {children}
      </main>
      <footer className="container py-8 text-sm text-zinc-400">
        Built with React • wagmi • viem
      </footer>
    </div>
  )
}
```

**src/components/WalletBar.tsx**

```tsx
import { useEffect, useState } from 'react'

export default function WalletBar(){
  const [account, setAccount] = useState<string | null>(null)

  useEffect(() => {
    const eth = (window as any).ethereum
    if(!eth) return
    eth.request({ method: 'eth_accounts' }).then((accs: string[]) => setAccount(accs[0] || null))
    eth.on?.('accountsChanged', (accs: string[]) => setAccount(accs[0] || null))
  }, [])

  const connect = async () => {
    const eth = (window as any).ethereum
    if(!eth) return alert('No wallet found')
    const accs = await eth.request({ method: 'eth_requestAccounts' })
    setAccount(accs[0] || null)
  }

  return (
    <div className="flex items-center gap-3">
      {account ? (
        <div className="px-3 py-1 rounded-full bg-white/10 text-sm">
          {account.slice(0,6)}…{account.slice(-4)}
        </div>
      ) : (
        <button onClick={connect} className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600">Connect</button>
      )}
    </div>
  )}
```

**src/components/MarketTicker.tsx**

```tsx
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
```

**src/components/OrderBook.tsx**

```tsx
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
```

**src/components/TradeForm.tsx**

```tsx
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
```

**src/components/OrdersTable.tsx**

```tsx
// Placeholder for user's open orders (query from contract or subgraph later)
export default function OrdersTable(){
  return (
    <div className="text-sm text-zinc-400">
      <div>No open orders yet.</div>
      <div className="mt-2">(Integrate with your contract's getter or indexer.)</div>
    </div>
  )
}
```

**src/components/PriceChart.tsx**

```tsx
import { useTrades } from '../hooks/useTrades'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function PriceChart(){
  const { data = [] } = useTrades(100)
  const series = data.map(t => ({ x: new Date(t.ts).toLocaleTimeString(), y: Number(t.price) }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series}>
          <XAxis dataKey="x" hide={false} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
          <YAxis domain={['auto','auto']} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
          <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
          <Line type="monotone" dataKey="y" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
```

---

## 9) Environment variables

Create a **.env** at project root:

```env
VITE_DEX_ADDRESS=0xYourDexContractAddress
VITE_MARKET_SYMBOL=ETH-USD
```

* For local **Hardhat** testing, deploy your contract and paste the address. Ensure wagmi/viem are pointed at your local RPC (already set in `wagmi.ts`).

---

## 10) Local chain integration (Hardhat)

* Run your local node: `npx hardhat node`
* Deploy contract: `npx hardhat run scripts/deploy.ts --network localhost`
* Copy contract address → `.env` → restart dev server.
* Import a Hardhat test account into MetaMask (private key from Hardhat log) to place orders.

> If your contract expects ERC‑20 tokens (base/quote), ensure users have balances/allowances. You can extend `useDexActions` to include approve/allowance flows.

---

## 11) Production notes

* Replace public RPC with a provider (e.g., Alchemy/Infura) in `lib/wagmi.ts` for Sepolia/Mainnet.
* Add **error toasts** and **form validation**.
* Persist user settings (selected market, theme) in localStorage or Zustand.
* Indexer/subgraph: for scalable order/trade history, use The Graph or a light indexer service.
* Security: never trust client input; display decoded BigInt → fixed‑decimal units; guard against reorgs; show tx status.

---

## 12) Next steps (you can ask me to add any of these)

1. **Balances & Allowances panel** for base/quote tokens.
2. **Open Orders/Order History** wired to contract events or subgraph.
3. **Advanced Order Types** (limit only here; add post‑only, reduce‑only if contract supports).
4. **Market switcher** (multi‑market support via bytes32 symbol).
5. **Price ladder depth shading** and mid‑price marker.
6. **Dark/light theme toggle**.
7. **Unit formatting** using token decimals from the contract.

---

### Done ✅

You now have a working scaffold to:

* Connect a wallet.
* Read orderbook & trades (polling) from your DEX contract.
* Place/cancel orders via `useDexActions` (after wiring real ABI & address).

Ping me which contract ABI/functions you use and I’ll adapt the hooks & UI to match exactly.
