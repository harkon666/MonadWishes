# 02 — Network Auto-Switching Banner & Wallet Chain Safety (Chain ID 10143)

**What to build:** An automatic network validation and warning banner component (`NetworkSwitchBanner.tsx`) integrated with `useMonadVault.ts` that detects when a connected wallet is on Sepolia or another network (chainId != 10143) and presents a prominent 1-click "Switch to Monad Testnet" action to prevent transaction execution errors.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] `NetworkSwitchBanner.tsx` renders a clear warning alert when the wallet's current chain ID is not `10143` (Monad Testnet).
- [ ] Clicking "Switch to Monad Testnet" invokes Privy's `wallet.switchChain(10143)` or Wagmi's `switchChain`.
- [ ] `useMonadVault.ts` exposes `isWrongNetwork` state and validates network before executing contract transactions.
- [ ] Prevents `ContractFunctionExecutionError` due to target chain ID mismatch.
