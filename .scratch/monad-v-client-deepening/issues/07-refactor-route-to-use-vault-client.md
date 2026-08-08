# 07 — Refactor UI Route (`routes/index.tsx`) to consume `useVaultClient`

**What to build:** Refactor `frontend/src/routes/index.tsx` to consume the unified `useVaultClient` hook, removing shallow imports of `useMonadVault` and direct `fetchLiveVaults` calls. The route component simply destructures `{ vaults, isLoading, dataSource, createVault, contribute, releaseGift }` from the client.

**Blocked by:** 06 — Unify Vault Client Hook (`useVaultClient`).

**Status:** ready-for-agent

- [ ] Update `routes/index.tsx` to use `useVaultClient()`.
- [ ] Remove redundant `loadOnChainVaults` manual refetching handlers and separate hook states.
- [ ] Verify clean UI rendering and state updates.
- [ ] Verify `bun run build` passes with zero type or bundle errors.
