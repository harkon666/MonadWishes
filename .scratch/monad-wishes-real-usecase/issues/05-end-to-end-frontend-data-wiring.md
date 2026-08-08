# 05 — End-to-End Frontend Data Wiring & Live Feed Integration

**What to build:** Replace the hardcoded `INITIAL_VAULTS` static array in `routes/index.tsx` with live data fetched via `services/indexer.ts`, automatically refreshing the active vaults list and greeting feeds upon `createVault`, `contribute`, or `releaseBirthdayGift` transactions.

**Blocked by:** 01 — Indexer Config Sync & GraphQL/RPC Fallback Service, 02 — Network Auto-Switching Banner & Wallet Chain Safety (Chain ID 10143), 03 — Live Sub-Second Yield Ticker & Animated Counter Component, 04 — Dynamic Memory NFT Booklet Viewer & Dual Claim Action Mode.

**Status:** ready-for-agent

- [ ] `routes/index.tsx` fetches live vault data from `services/indexer.ts` on page load.
- [ ] Displays loading states and clean error/fallback handling.
- [ ] Renders `NetworkSwitchBanner.tsx` at the top of the application when wallet is on wrong chain.
- [ ] Automatically triggers vault list refetch after contract transactions complete on Monad Testnet.
- [ ] Full end-to-end flow verified clean on Monad Testnet (Chain ID 10143).
