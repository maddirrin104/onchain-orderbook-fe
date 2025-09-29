import WalletBar from './WalletBar'
import logo2 from '../assets/logo2.png'

export default function Layout({ children }: { children: React.ReactNode }){
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 backdrop-blur bg-black/30 border-b border-white/10">
        <div className="container flex items-center justify-between py-3">
          <div className="text-xl font-bold">
            <img src={logo2} alt="Logo" className="inline h-8 mr-2 -mt-1" />
            ChainBook
          </div>
          <WalletBar />
        </div>
      </header>
      <main className="container py-6">
        {children}
      </main>
      {/* <footer className="container py-8 text-sm text-zinc-400">
        Built with React • wagmi • viem
      </footer> */}
    </div>
  )
}