# 03 — Live Sub-Second Yield Ticker & Animated Counter Component

**What to build:** A live sub-second yield ticker component in `VaultDetailsModal.tsx` that continuously updates estimated yield growth every 1000ms based on total MON collected and duration elapsed, visually demonstrating Monad's 0.3s block time throughput and high-frequency micro-yield generation.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] A dedicated sub-second yield timer component is added to `VaultDetailsModal.tsx`.
- [ ] Yield growth updates live every second using prorated 0.5%/month (50 bps per 30 days) contract math.
- [ ] Displays Monad Native Staking badge (`Precompile 0x1000`).
- [ ] Shows equivalent USD value updating in real-time alongside Pyth price feed.
