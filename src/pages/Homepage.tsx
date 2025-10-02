import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowRight, Shield, Zap, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import MarketTicker from "../components/MarketTicker";
import { useTickers } from "../hooks/useTickers";

const FALLBACK_PAIRS = ["ETH - USD", "BTC - USD", "AUD - USD"]; // sẽ lọc theo cặp thực có

export default function HomePage() {
  const { symbols, tickers, loading } = useTickers(1500);

  // Chọn danh sách hiển thị: ưu tiên FALLBACK nếu có trong on-chain, ngược lại dùng symbols từ contract
  const showPairs = symbols.length
    ? FALLBACK_PAIRS.filter((s) => symbols.includes(s)).concat(
        symbols.filter((s) => !FALLBACK_PAIRS.includes(s))
      ).slice(0, 6) // tối đa 6 hàng
    : FALLBACK_PAIRS;

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-10 px-6 bg-gradient-to-b from-zinc-900 to-zinc-950">
        <h1 className="text-5xl font-extrabold mb-4">ChainBook DEX</h1>
        <p className="text-lg text-zinc-400 mb-6">
          On-chain Order Book Exchange – 100% Transparent & Secure
        </p>
        <Link to="/trade">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 text-lg rounded-xl">
            Start Trading <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
        <div className="mt-6 w-full max-w-4xl">
          {/* MarketTicker đã chuyển sang on-chain (không Chainlink) */}
          <MarketTicker defaultSymbol="ETH - USD" />
        </div>
        {/* Bỏ phần status/updatedAt của PriceFeedContext */}
      </section>

      {/* Markets Overview (on-chain) */}
      <section className="py-4 px-6 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl font-semibold mb-6">Top Markets</h2>
        <div className="overflow-x-auto rounded-2xl shadow-md">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-zinc-900 text-zinc-300">
              <tr>
                <th className="py-3 px-4">Pair</th>
                <th className="py-3 px-4">Last Price</th>
                <th className="py-3 px-4">Bid</th>
                <th className="py-3 px-4">Ask</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {showPairs.map((pair) => {
                const t = tickers[pair];
                return (
                  <tr key={pair} className="hover:bg-zinc-900">
                    <td className="py-3 px-4 font-semibold">{pair}</td>
                    <td className="py-3 px-4">
                      {loading ? "Loading…" : (t?.last ?? "—")}
                    </td>
                    <td className="py-3 px-4 text-green-400">
                      {loading ? "…" : (t?.bestBid ?? "—")}
                    </td>
                    <td className="py-3 px-4 text-red-400">
                      {loading ? "…" : (t?.bestAsk ?? "—")}
                    </td>
                  </tr>
                );
              })}
              {!showPairs.length && (
                <tr><td className="py-3 px-4" colSpan={4}>No pairs</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-6">
          <Link to="/markets">
            <Button className="rounded-xl">View All Markets</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-zinc-900">
        <h2 className="text-4xl font-semibold text-center mb-12">Tại sao nên chọn ChainBook?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="bg-zinc-800 rounded-2xl shadow-lg">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Shield className="w-10 h-10 text-indigo-400 mb-4" />
              <h3 className="font-semibold mb-2 text-zinc-100">On-chain 100%</h3>
              <p className="text-zinc-400">Mọi lệnh được lưu và xác minh trực tiếp trên blockchain.</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-800 rounded-2xl shadow-lg">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Zap className="w-10 h-10 text-yellow-400 mb-4" />
              <h3 className="font-semibold mb-2 text-zinc-100">Fast Settlement</h3>
              <p className="text-zinc-400">Khớp lệnh nhanh chóng, minh bạch, không bên trung gian.</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-800 rounded-2l shadow-lg">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <BookOpen className="w-10 h-10 text-green-400 mb-4" />
              <h3 className="font-semibold mb-2 text-zinc-100">Transparent Orderbook</h3>
              <p className="text-zinc-400">Sổ lệnh công khai, dễ dàng kiểm chứng và audit.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-zinc-500 border-t border-zinc-800">
        <p>© 2025 ChainBook DEX. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="/docs" className="hover:text-white">Docs</a>
          <a href="https://github.com/maddirrin104/onchain-orderbook-fe" target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a>
          <a href="#" className="hover:text-white">Twitter</a>
        </div>
      </footer>
    </div>
  );
}
