import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, hardhat } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Choose your default chain here. For local dev use hardhat.
const CHAINS = [hardhat, sepolia] as const

export const config = createConfig({
  chains: CHAINS,
  transports: {
    [hardhat.id]: http('http://127.0.0.1:8545'),
    [sepolia.id]: http(), // use default public RPC; replace with your provider if rate-limited
  },
  connectors: [injected()],
})