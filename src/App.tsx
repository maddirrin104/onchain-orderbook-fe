import './App.css'

import Layout from './components/Layout'
import MarketTicker from './components/MarketTicker'
import OrderBook from './components/OrderBook'
import TradeForm from './components/TradeForm'
import OrdersTable from './components/OrdersTable'
import PriceChart from './components/PriceChart'

function App() {
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

export default App
