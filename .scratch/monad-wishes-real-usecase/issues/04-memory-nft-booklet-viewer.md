# 04 — Dynamic Memory NFT Booklet Viewer & Dual Claim Action Mode

**What to build:** An interactive "View Memory Booklet NFT" modal/tab in `VaultDetailsModal.tsx` for claimed vaults that renders the dynamic base64-encoded SVG artwork directly from `nftContract.tokenURI(tokenId)` on-chain, alongside dual claim triggers (Official Birthday Lock & ⚡ Demo Time Travel Release).

**Blocked by:** 01 — Indexer Config Sync & GraphQL/RPC Fallback Service.

**Status:** ready-for-agent

- [ ] `VaultDetailsModal.tsx` checks if vault `isClaimed = true` and reads `nftTokenId`.
- [ ] Renders live SVG artwork decoded from base64 `tokenURI(tokenId)`.
- [ ] Provides a direct link to view the transaction/token on Monad Explorer (`https://testnet.monadexplorer.com`).
- [ ] Offers both "Claim Birthday Gift" (active on birthday timestamp) and "⚡ Demo Time Travel Release" (for hackathon demo testing).
