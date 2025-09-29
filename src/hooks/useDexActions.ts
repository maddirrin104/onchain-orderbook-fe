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