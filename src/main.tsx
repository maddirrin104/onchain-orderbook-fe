// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './lib/wagmi'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MarketProvider } from "./context/MarketContext";
import './index.css'
import App from './App'


const client = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <WagmiProvider config={config}>
        <BrowserRouter>
          <MarketProvider>
            <App />
          </MarketProvider>
        </BrowserRouter>
      </WagmiProvider>
    </QueryClientProvider>
  </StrictMode>,
)
