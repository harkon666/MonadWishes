# 01 — Indexer Config Sync & GraphQL/RPC Fallback Service

**What to build:** Update the Envio HyperIndex configuration to listen to the deployed Monad Birthday Vault contract (`0x5f2394E6Bc3Dd842831C66253d4433f4F72B4E7B`) and create a unified frontend service (`services/indexer.ts`) that fetches live Vaults, Greeting feeds, and Claims from GraphQL with an automatic, seamless fallback to viem `publicClient.readContract` calls on Monad Testnet RPC.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] `indexer/config.yaml` is updated with contract address `0x5f2394E6Bc3Dd842831C66253d4433f4F72B4E7B`.
- [ ] `frontend/src/services/indexer.ts` is implemented with `fetchVaultsFromIndexer()` querying `VaultEntity`, `ContributionEntity`, `GiftClaimEntity`.
- [ ] Fallback method `fetchVaultsFromRPC()` using viem `publicClient` is active if GraphQL endpoint is unreachable.
- [ ] Data structures map cleanly to `VaultData` interface expected by the UI.
