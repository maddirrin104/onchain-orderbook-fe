// src/lib/eth.ts
import { Contract, JsonRpcProvider } from "ethers";
import OnchainOrderBook from "../abis/OnchainOrderBook.json";

const RPC = import.meta.env.VITE_RPC_URL as string;
const OB_ADDR = import.meta.env.VITE_OB_ADDR as string || "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

export function getProvider() {
  // ép dùng RPC local để tránh lạc chain
  const p = new JsonRpcProvider(RPC);
  return p;
}

export async function getOB() {
  const provider: any = getProvider();

  // Log chẩn đoán
  try {
    const net = await provider.getNetwork?.();
    console.debug("[OB] RPC:", RPC, "chainId:", Number(net?.chainId ?? 0), "addr:", String(OB_ADDR));
  } catch (e) {
    console.warn("[OB] getNetwork failed:", e);
  }

  // Kiểm tra bytecode tại địa chỉ
  const code = await provider.getCode(OB_ADDR);
  console.debug("[OB] bytecode prefix:", (code || "").slice(0, 10));
  if (!code || code === "0x") {
    throw new Error(
      `No bytecode at ${String(OB_ADDR)} on RPC ${RPC}.
- Sai địa chỉ? (VITE_OB_ADDR)
- Sai RPC? (VITE_RPC_URL)
- Node vừa restart? Hãy redeploy 01_deploy_all vào đúng node này.`
    );
  }

  const abi = (OnchainOrderBook as any).abi ?? OnchainOrderBook;
  return new Contract(OB_ADDR, abi, provider);
}

// (tùy chọn) Hàm chẩn đoán nhanh từ console
export async function __diag() {
  const provider:any = getProvider();
  const net = await provider.getNetwork?.();
  const code = await provider.getCode(OB_ADDR);
  return { RPC, OB_ADDR: String(OB_ADDR), chainId: Number(net?.chainId ?? 0), hasCode: code && code !== "0x" };
}
// gắn lên window để gọi trong DevTools
// @ts-ignore
if (typeof window !== "undefined") (window as any).__dexDiag = __diag;
