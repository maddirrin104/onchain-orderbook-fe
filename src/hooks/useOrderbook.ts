import { useQuery } from '@tanstack/react-query'
import type { Hex } from 'viem'
import { createPublicClient, getContract, http } from 'viem'
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