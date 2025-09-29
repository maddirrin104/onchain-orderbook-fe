import { useEffect, useState } from 'react'

export default function WalletBar(){
  const [account, setAccount] = useState<string | null>(null)

  useEffect(() => {
    const eth = (window as any).ethereum
    if(!eth) return
    eth.request({ method: 'eth_accounts' }).then((accs: string[]) => setAccount(accs[0] || null))
    eth.on?.('accountsChanged', (accs: string[]) => setAccount(accs[0] || null))
  }, [])

  const connect = async () => {
    const eth = (window as any).ethereum
    if(!eth) return alert('No wallet found')
    const accs = await eth.request({ method: 'eth_requestAccounts' })
    setAccount(accs[0] || null)
  }

  return (
    <div className="flex items-center gap-3">
      {account ? (
        <div className="px-3 py-1 rounded-full bg-white/10 text-sm">
          {account.slice(0,6)}…{account.slice(-4)}
        </div>
      ) : (
        <button onClick={connect} className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600">Connect</button>
      )}
    </div>
  )}