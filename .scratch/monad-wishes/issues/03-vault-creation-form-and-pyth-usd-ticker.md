# 03 — Vault Creation Form & Pyth Oracle Live MON/USD Ticker

**What to build:**
Create UI form for building a new Time-Locked Birthday Vault (recipient name, wallet/social handle, target MON amount, duration in days). Integrate Pyth Network Hermes API (`https://hermes-beta.pyth.network`) to fetch live MON/USD price feed and render real-time fiat conversion on form inputs and vault summary.

**Blocked by:** 02 — Privy Social Login & Monad Testnet Web3 Provider Integration.

**Status:** ready-for-agent

- [ ] Vault creation route and interactive form component built with validation
- [ ] Pyth Hermes price feed hook fetching live MON/USD rate
- [ ] Dynamic USD equivalent display updating in real-time
- [ ] Contract `createVault` invocation and success redirect to vault details page
