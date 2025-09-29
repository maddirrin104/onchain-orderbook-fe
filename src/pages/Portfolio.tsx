// src/pages/Portfolio.tsx
import OrdersTable from '../components/OrdersTable'

export default function PortfolioPage(){
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white/5 shadow-card p-4">
        <h2 className="text-lg font-semibold mb-2">Balances</h2>
        <div className="text-sm text-zinc-400">Coming soon: đọc số dư từ ERC20/ETH qua viem.</div>
      </div>
      <div className="rounded-2xl bg-white/5 shadow-card p-4">
        <h2 className="text-lg font-semibold mb-2">Open Orders</h2>
        <OrdersTable />
      </div>
      <div className="rounded-2xl bg-white/5 shadow-card p-4">
        <h2 className="text-lg font-semibold mb-2">Trade History</h2>
        <div className="text-sm text-zinc-400">Coming soon: truy vấn lịch sử khớp lệnh từ contract/subgraph.</div>
      </div>
    </div>
  )
}

