import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './lib/wagmi'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { PriceFeedProvider } from "./context/PriceFeedContext";

const RPC_URL = import.meta.env.VITE_RPC_URL || "https://sepolia.infura.io/v3/5d21deefacd3471b9f6af2fef8f415be";

const client = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <WagmiProvider config={config}>
        <BrowserRouter>
        <PriceFeedProvider rpcUrl={RPC_URL} pollMs={30000}>
          <App />
        </PriceFeedProvider>
        </BrowserRouter>
      </WagmiProvider>
    </QueryClientProvider>
  </StrictMode>,
)
