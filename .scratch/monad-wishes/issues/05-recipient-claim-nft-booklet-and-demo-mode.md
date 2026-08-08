# 05 — Recipient Claim Payout, Dynamic NFT Booklet Gallery & 1-Click Hackathon Demo Mode

**What to build:**
Complete recipient gift claim experience. Unlocks payout transfer (principal + yield) upon birthday timestamp. Renders high-resolution Dynamic On-Chain SVG NFT Memory Booklet in an interactive gallery modal. Features a prominent 1-click "Demo Mode / Time Travel" button allowing hackathon judges to trigger instant payout release during 3-minute presentations.

**Blocked by:** 04 — Micro-Contribution UI, Sub-Second Greeting Feed & Gasless Sponsorship.

**Status:** ready-for-agent

- [ ] Recipient claim button triggering `releaseBirthdayGift(vaultId, false)`
- [ ] 1-Click "Demo Mode / Time Travel" button triggering `releaseBirthdayGift(vaultId, true)`
- [ ] Render recipient's minted `MonadBirthdayNFT` SVG artwork directly in UI modal
- [ ] Confetti celebration UI and claimed vault state reflection
