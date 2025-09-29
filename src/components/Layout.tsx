// src/components/Layout.tsx
import WalletBar from './WalletBar'
import logo2 from '../assets/logo2.png'
import { NavLink } from 'react-router-dom'

const navLink = 'px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/10 transition'
const active  = 'bg-white/10 text-white'

export default function Layout({ children }: { children: React.ReactNode }){
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 backdrop-blur bg-black/30 border-b border-white/10">
        {/* ✅ giới hạn chiều rộng + padding 2 bên */}
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 grid grid-cols-3 items-center py-3">
          <div className="justify-self-start flex items-center gap-2 text-xl font-bold">
            <img src={logo2} alt="Logo" className="inline h-8 -mt-1" />
            <span className="hidden sm:inline">ChainBook</span>
          </div>

          <nav className="justify-self-center hidden md:flex items-center gap-1">
            <NavLink to="/" end className={({isActive}) => `${navLink} ${isActive?active:''}`}>Trade</NavLink>
            <NavLink to="/markets" className={({isActive}) => `${navLink} ${isActive?active:''}`}>Markets</NavLink>
            <NavLink to="/portfolio" className={({isActive}) => `${navLink} ${isActive?active:''}`}>Portfolio</NavLink>
            <NavLink to="/settings" className={({isActive}) => `${navLink} ${isActive?active:''}`}>Settings</NavLink>
            <NavLink to="/docs" className={({isActive}) => `${navLink} ${isActive?active:''}`}>Docs</NavLink>
          </nav>

          <div className="justify-self-end">
            <WalletBar />
          </div>
        </div>
      </header>

      {/* ✅ giới hạn chiều rộng + padding 2 bên */}
      <main className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  )
}
