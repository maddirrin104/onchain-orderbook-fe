import { useQuery } from '@tanstack/react-query'
import type { Hex } from 'viem'
import { createPublicClient, getContract, http } from 'viem'
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