// src/pages/Docs.tsx
export default function DocsPage() {
  return (
    <div className="rounded-2xl bg-white/5 shadow-card p-4 space-y-4">
      <h2 className="text-lg font-semibold">📘 ChainBook Docs</h2>

      <p className="text-sm text-zinc-300">
        <strong>ChainBook</strong> là một sàn giao dịch phi tập trung (DEX) dựa trên{" "}
        <strong>On-chain Order Book</strong>. Người dùng có thể kết nối ví Web3 để giao dịch
        token ERC20/ETH trực tiếp trên blockchain, đảm bảo tính phi tập trung, minh bạch
        và an toàn.
      </p>

      <h3 className="text-md font-semibold text-white">🔑 Tính năng chính</h3>
      <ul className="list-disc pl-5 text-sm text-zinc-300 space-y-1">
        <li>Kết nối ví (MetaMask, WalletConnect, ...).</li>
        <li>Đặt lệnh <strong>BUY/SELL</strong> token.</li>
        <li>Xem Order Book với lệnh mua/bán đang mở.</li>
        <li>Theo dõi biểu đồ giá và Recent Trades.</li>
        <li>Quản lý Orders &amp; Portfolio (sẽ tích hợp indexer/subgraph).</li>
      </ul>

      <h3 className="text-md font-semibold text-white">⚡ Cách sử dụng</h3>
      <ol className="list-decimal pl-5 text-sm text-zinc-300 space-y-1">
        <li>Kết nối ví bằng nút <em>Connect Wallet</em> ở góc phải.</li>
        <li>Chọn cặp giao dịch trong mục <em>Markets</em>.</li>
        <li>Đặt lệnh <strong>Buy</strong> hoặc <strong>Sell</strong> theo mức giá mong muốn.</li>
        <li>Theo dõi trạng thái lệnh trong <em>Open Orders</em> hoặc <em>Trade History</em>.</li>
      </ol>

      <h3 className="text-md font-semibold text-white">🚀 Roadmap</h3>
      <ul className="list-disc pl-5 text-sm text-zinc-300 space-y-1">
        <li>Hiển thị số dư ERC20/ETH trực tiếp từ ví.</li>
        <li>Tích hợp Subgraph để truy vấn lịch sử giao dịch nhanh chóng.</li>
        <li>Nâng cấp UI/UX để thân thiện hơn với trader.</li>
      </ul>

      <p className="text-sm text-zinc-400">
        * Có thể bổ sung link tới README, whitepaper hoặc docs ngoài nếu có.
      </p>
    </div>
  );
}
