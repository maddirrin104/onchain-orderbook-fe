// Placeholder for user's open orders (query from contract or subgraph later)
export default function OrdersTable(){
  return (
    <div className="text-sm text-zinc-400">
      <div>No open orders yet.</div>
      <div className="mt-2">(Integrate with your contract's getter or indexer.)</div>
    </div>
  )
}