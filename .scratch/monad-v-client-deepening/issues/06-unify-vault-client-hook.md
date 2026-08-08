# 06 — Unify Vault Client Hook (`useVaultClient`)

**What to build:** Consolidate vault reads (Envio GraphQL + Viem RPC fallback) and vault write operations (`createVault`, `contribute`, `releaseBirthdayGift`) into a single deep hook (`useVaultClient.ts`) that manages data loading, Monad network validation, gas limit overrides, and automatic post-transaction refetching.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Create `frontend/src/hooks/useVaultClient.ts`.
- [ ] Incorporate `fetchLiveVaults()` data loading state (`vaults`, `isLoading`, `dataSource`).
- [ ] Incorporate write actions (`createVault`, `contribute`, `releaseGift`) with Monad explicit gas limits.
- [ ] Automatically trigger `refetch()` 1.5 seconds after any successful write transaction.
- [ ] Expose single unified return interface: `{ vaults, isLoading, dataSource, isWrongNetwork, toast, closeToast, createVault, contribute, releaseGift, refetch }`.
