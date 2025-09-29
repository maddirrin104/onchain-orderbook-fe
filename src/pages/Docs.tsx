// src/pages/Docs.tsx
export default function DocsPage(){
  return (
    <div className="rounded-2xl bg-white/5 shadow-card p-4 space-y-3">
      <h2 className="text-lg font-semibold">Docs</h2>
      <p className="text-sm text-zinc-300">
        Đây là giao diện DEX dựa trên orderbook on-chain. Bạn có thể:
      </p>
      <ul className="list-disc pl-5 text-sm text-zinc-300 space-y-1">
        <li>Kết nối ví và đặt lệnh BUY/SELL.</li>
        <li>Xem Order Book, Recent Trades và biểu đồ giá.</li>
        <li>Theo dõi Orders/Portfolio (sẽ tích hợp indexer/contract getter).</li>
      </ul>
      <p className="text-sm text-zinc-400">
        * Thêm README/whitepaper hoặc link tới docs ngoài nếu có.
      </p>
    </div>
  )
}
