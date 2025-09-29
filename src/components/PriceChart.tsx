import { useTrades } from '../hooks/useTrades'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function PriceChart(){
  const { data = [] } = useTrades(100)
  const series = data.map(t => ({ x: new Date(t.ts).toLocaleTimeString(), y: Number(t.price) }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series}>
          <XAxis dataKey="x" hide={false} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
          <YAxis domain={['auto','auto']} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
          <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
          <Line type="monotone" dataKey="y" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}