// src/config/feeds.ts
export type Feed = {
  symbol: string;              // Hiển thị trên UI
  address?: `0x${string}`;     // Địa chỉ AggregatorV3 (trống = chưa có trên mạng hiện tại)
  note?: string;               // Ghi chú (tùy chọn)
};

// Sepolia: chỉ điền các feed chắc chắn có
export const FEEDS_SEPOLIA: Feed[] = [
  { symbol: "ETH - USD", address: "0x694AA1769357215DE4FAC081bf1f309aDC325306" },
  { symbol: "BTC - USD", address: "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43" },
  { symbol: "LINK - USD", address: "0xc59E3633BAAC79493d908e63626716e204A45EdF" },
  { symbol: "AUD - USD", address: "0xB0C712f98daE15264c8E26132BCC91C40aD4d5F9" },
  { symbol: "IB01 - USD", address: "0xB677bfBc9B09a3469695f40477d05bc9BcB15F50" },
  { symbol: "XAU - USD", address: "0xC5981F461d74c46eB4b0CF3f4Ec79f025573B0Ea" },
  { symbol: "SNX - USD", address: "0xc0F82A46033b8BdBA4Bb0B0e28Bc2006F64355bC" },
  { symbol: "SUSDE - USD", address: "0x6f7be09227d98Ce1Df812d5Bc745c0c775507E92" },
  { symbol: "WSTETH - USD", address: "0xaaabb530434B0EeAAc9A42E25dbC6A22D7bE218E" },
  { symbol: "PYUSD - USD", address: "0x57020Ba11D61b188a1Fd390b108D233D87c06057" },
  { symbol: "IBTA - USD", address: "0x5c13b249846540F81c093Bc342b5d963a7518145" },
  { symbol: "GBP - USD", address: "0x91FAB41F5f3bE955963a986366edAcff1aaeaa83" },
  { symbol: "GHO - USD", address: "0x635A86F9fdD16Ff09A0701C305D3a845F1758b8E" },
  { symbol: "USDG - USD", address: "0x90E422f6B8cB0bD178C0F84764ad790715cbc2aa" },
  { symbol: "USDC - USD", address: "0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E" },
  { symbol: "USDE - USD", address: "0x55ec7c3ed0d7CB5DF4d3d8bfEd2ecaf28b4638fb" },
  { symbol: "USDL - USD", address: "0x5376B13E1622CB498E0E95F328fC7547e827fcC8" },
  { symbol: "FORTH - USD", address: "0x070bF128E88A4520b3EfA65AB1e4Eb6F0F9E6632" },
  { symbol: "EUR - USD", address: "0x1a81afB8146aeFfCFc5E50e8479e826E7D55b910" },
  { symbol: "CSPX - USD", address: "0x4b531A318B0e44B549F3b2f824721b3D0d51930A" },
  { symbol: "CZK - USD", address: "0xC32f0A9D70A34B9E7377C10FDAd88512596f61EA" },
  { symbol: "JPY - USD", address: "0x8A6af2B75F23831ADc973ce6288e5329F63D86c6" },
  { symbol: "DAI - USD", address: "0x14866185B1962B63C3Ea9E03Bc1da838bab34C19" },
];

// Nếu sau này bạn chuyển RPC sang mainnet/testnet khác, có thể tạo FEEDS cho mạng đó ở file này.
