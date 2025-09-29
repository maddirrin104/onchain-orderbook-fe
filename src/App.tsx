// src/App.tsx
import Layout from './components/Layout'
import { Routes, Route, Navigate } from 'react-router-dom'
import TradePage from './pages/Trade'
import MarketsPage from './pages/Markets'
import PortfolioPage from './pages/Portfolio'
import { SettingsPage } from './pages/Settings'
import DocsPage from './pages/Docs'
import HomePage from './pages/Homepage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/trade" element={<TradePage />} />
        <Route path="/markets" element={<MarketsPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/docs" element={<DocsPage />} />
        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
