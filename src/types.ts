export type Side = 'BUY' | 'SELL'
export interface OrderBookLevel { price: string; size: string }
export interface OrderBook { bids: OrderBookLevel[]; asks: OrderBookLevel[] }
export interface Trade { price: string; size: string; ts: number; side: Side }