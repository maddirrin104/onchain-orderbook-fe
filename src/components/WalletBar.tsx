import { useEffect, useMemo, useRef, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type EIP6963ProviderDetail = {
  info: {
    uuid: string
    name: string
    icon?: string
    rdns?: string
  }
  provider: any
}

export default function WalletBar() {
  const [providers, setProviders] = useState<EIP6963ProviderDetail[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const selectedProviderRef = useRef<any>(null)

  const selected = useMemo(
    () => providers.find((p) => p.info.uuid === selectedId) ?? null,
    [providers, selectedId]
  )

  // --- init providers ---
  useEffect(() => {
    const found: Record<string, EIP6963ProviderDetail> = {}
    function onAnnounce(e: any) {
      const detail = e?.detail as EIP6963ProviderDetail | undefined
      if (!detail?.info?.uuid) return
      found[detail.info.uuid] = detail
      setProviders(Object.values(found))
    }
    window.addEventListener("eip6963:announceProvider", onAnnounce as any)
    window.dispatchEvent(new Event("eip6963:requestProvider"))

    const eth: any = (window as any).ethereum
    if (eth) {
      const list = Array.isArray(eth.providers) ? eth.providers : [eth]
      const augmented = list.map((p: any, i: number) => ({
        info: {
          uuid: p?.providerMapId ?? p?.id ?? `legacy-${i}`,
          name:
            (p?.isMetaMask && "MetaMask") ||
            (p?.isBraveWallet && "Brave Wallet") ||
            (p?.isCoinbaseWallet && "Coinbase Wallet") ||
            (p?.isOkxWallet && "OKX Wallet") ||
            "Injected Wallet",
        },
        provider: p,
      })) as EIP6963ProviderDetail[]
      const map: Record<string, EIP6963ProviderDetail> = {}
      augmented.forEach((d) => (map[d.info.uuid] = d))
      setProviders(Object.values(map))
    }

    return () =>
      window.removeEventListener("eip6963:announceProvider", onAnnounce as any)
  }, [])

  // --- change provider listener ---
  useEffect(() => {
    const prev = selectedProviderRef.current as any | null
    if (prev?.removeListener) {
      try {
        prev.removeListener("accountsChanged", onAccountsChanged)
        prev.removeListener("chainChanged", onChainChanged)
        prev.removeListener("disconnect", onDisconnect)
      } catch {}
    }

    selectedProviderRef.current = selected?.provider ?? null
    const prov: any = selectedProviderRef.current
    if (prov?.on) {
      prov.on("accountsChanged", onAccountsChanged)
      prov.on("chainChanged", onChainChanged)
      prov.on("disconnect", onDisconnect)
    }

    setAccount(null)
    return () => {
      if (prov?.removeListener) {
        try {
          prov.removeListener("accountsChanged", onAccountsChanged)
          prov.removeListener("chainChanged", onChainChanged)
          prov.removeListener("disconnect", onDisconnect)
        } catch {}
      }
    }
  }, [selected?.info.uuid])

  function onAccountsChanged(accs: string[]) {
    setAccount(accs?.[0] ?? null)
  }
  function onChainChanged(_chainId: string) {}
  function onDisconnect() {
    setAccount(null)
  }

  const requestAccounts = async (prov: any, uuid: string) => {
    try {
      setSelectedId(uuid)
      const accs: string[] = await prov.request({ method: "eth_requestAccounts" })
      setAccount(accs?.[0] ?? null)
    } catch (e: any) {
      console.error(e)
      alert(e?.message ?? "Connect failed")
    }
  }

  const switchAccount = async () => {
    const prov: any = selectedProviderRef.current
    if (!prov) return alert("Chưa chọn ví.")
    try {
      try {
        await prov.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        })
      } catch {}
      const accs: string[] = await prov.request({ method: "eth_requestAccounts" })
      setAccount(accs?.[0] ?? null)
    } catch (e: any) {
      console.error("switchAccount error:", e)
      alert(e?.message ?? "Cannot switch account")
    }
  }

  const disconnect = () => setAccount(null)

  const short = (a?: string | null) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-sm ">
          {account && selected
            ? `${selected.info.name} | ${short(account)}`
            : "Select Wallet"}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 text-zinc-300 bg-zinc-900 border border-zinc-800">
        {/* Danh sách ví để chọn → popup extension ngay */}
        {providers.map((p) => (
          <DropdownMenuItem
            key={p.info.uuid}
            onClick={() => requestAccounts(p.provider, p.info.uuid)}
          >
            {p.info.name}
          </DropdownMenuItem>
        ))}
        {account && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={switchAccount}>Switch Account</DropdownMenuItem>
            <DropdownMenuItem onClick={disconnect}>Disconnect</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
