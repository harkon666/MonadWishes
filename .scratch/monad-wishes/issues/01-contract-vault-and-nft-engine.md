# 01 — Smart Contract Vault & Dynamic SVG NFT Core Engine

**What to build:**
Complete smart contract layer in Solidity for MonadWishes (`MonadBirthdayVault.sol` and `MonadBirthdayNFT.sol`) with 100% test coverage in Foundry (`MonadBirthdayVault.t.sol`). Supports time-locked vault creation, micro-contributions with on-chain greetings feed, Monad `0x1000` staking precompile low-level call with internal fallback math (0.5% monthly yield), hackathon demo mode instant release, and dynamic base64 on-chain SVG Memory Booklet NFT minting.

**Blocked by:** None — can start immediately.

**Status:** completed

- [x] `MonadBirthdayVault.sol` compiled and configured with `MonadBirthdayNFT.sol` address
- [x] `createVault`, `contribute`, `releaseBirthdayGift`, and getter functions working
- [x] Monad precompile `0x1000` low-level call with simulated yield fallback verified
- [x] On-chain SVG NFT metadata URI returns valid base64 JSON with Monad gradients
- [x] All tests in `MonadBirthdayVault.t.sol` passing cleanly
