# MonadWishes Engineering Specification (SPEC.md)

## Problem Statement

When friend groups organize birthday gift pools 1 month prior to the event, conventional Web2 and traditional Web1/Web3 solutions introduce major pain points:
1. **Idle Funds & Lost Yield**: Pooled funds sit idle for 30 days without generating any interest or growth.
2. **Prohibitive Gas Fees**: High transaction fees on traditional L1/L2 networks prevent micro-contributions ($0.50 – $2.00) from large networks of friends.
3. **Manual & Unreliable Disbursal**: Admins must manually remember and execute transfers at 00:00 on the recipient's birthday.
4. **Lack of Emotional Memorabilia**: Monetary transfers offer no lasting emotional keepsake or consolidated group greeting record.
5. **Web3 Onboarding Friction**: Non-crypto native friends struggle with wallet creation, seed phrases, and purchasing MON tokens for gas.

## Solution

**MonadWishes** is a Social Birthday Gift Vault & Micro-Yield Pool built specifically for the **Monad Blockchain**:
- **Time-Locked Gift Vaults**: Pools locked until the target birthday timestamp (e.g. 30 days).
- **Auto-Staking & Yield Generation**: Capital is delegated to Monad Native Staking (`0x1000` precompile) with graceful math fallback, generating 0.5%/month yield during wait periods.
- **Sub-Second Micro-Contributions & Greeting Feed**: 300ms–400ms block times and sub-cent gas fees ($0.001) allow real-time micro-donations and on-chain messages.
- **Dynamic On-Chain SVG Memory Booklet NFT**: Upon claim, recipients receive a 100% on-chain SVG NFT containing gift stats, total yield, and greeting records.
- **Frictionless Web2.5 UX (Privy SDK / EIP-7702)**: Social login (Google/Twitter) with paymaster gasless sponsorship.
- **Live Fiat Pricing (Pyth Network Oracle)**: MON target amounts mapped dynamically to USD using Pyth Hermes off-chain price feeds.
- **Hackathon Demo Mode**: 1-click time-travel simulation allowing judges to experience the instant 00:00 payout in 3-minute pitch presentations.

---

## User Stories

1. As a vault creator, I want to create a time-locked birthday gift pool for my friend by providing their name, wallet/social handle, target duration in days, and MON target amount, so that our friend group can start pooling funds immediately.
2. As a contributor, I want to log in using my Google or Twitter account without installing a browser wallet, so that I can participate without Web3 technical barriers.
3. As a contributor, I want to send micro-contributions (e.g. 0.1 MON or $1.00) without paying gas fees, so that my entire contribution goes directly to my friend's gift pool.
4. As a contributor, I want to leave a personalized on-chain birthday message with my contribution, so that it is permanently recorded for my friend to read.
5. As a group member, I want to view a real-time activity feed updating sub-second as friends contribute, so that I feel connected to the group effort.
6. As a group member, I want to see the live target progress and yield counter updating in real-time with Pyth USD pricing, so that I know how close we are to our goal.
7. As a recipient, I want funds (principal + accumulated DeFi yield) automatically unlocked on my birthday timestamp, so that I receive my gift immediately at midnight without needing an admin to manually send it.
8. As a recipient, I want to claim my gift and receive a 100% on-chain Dynamic SVG NFT Memory Booklet, so that I have a permanent digital keepsake summarizing all messages and contributors.
9. As a hackathon judge, I want a dedicated "Demo Mode / Time Travel" button on the UI, so that I can trigger and verify the time-lock release and NFT minting instantly within a 3-minute pitch.

---

## Implementation Decisions

### Core Architecture & Modules
- **Smart Contract Layer (`contracts/src/`)**:
  - `MonadBirthdayVault.sol`: Manages vault lifecycle (`createVault`, `contribute`, `releaseBirthdayGift`), greeting feed storage, Monad `0x1000` precompile delegation with fallback math, and yield calculation (`calculateYieldBonus`).
  - `MonadBirthdayNFT.sol`: ERC721 contract minting dynamic base64-encoded on-chain SVG artwork containing recipient name, total payout, contributor count, and Monad branding gradients.
- **Frontend Layer (`frontend/src/`)**:
  - React + TanStack Router + Tailwind CSS.
  - Wagmi / Viem configured for Monad Testnet (`Chain ID 10143`, RPC `https://testnet-rpc.monad.xyz`).
  - Privy SDK for EIP-7702 Social Login & Account Abstraction Gasless Paymaster.
  - Pyth Network SDK / Hermes API (`https://hermes-beta.pyth.network`) for MON/USD pricing feed.

### Key Technical & Protocol Seams
- **Monad Precompile Integration (ADR-0001)**:
  - Address: `0x0000000000000000000000000000000000001000`.
  - Default Validator: `0x0000000000000000000000000000000000000001`.
  - Low-level `call{value: 0}(abi.encodeWithSignature("delegate(address,uint256)", validator, amount))`. If precompile call fails/reverts on testnet, contract falls back to internal yield simulation (0.5% monthly prorated).
- **100% Dynamic On-Chain SVG NFT (ADR-0003)**:
  - No external IPFS dependency.
  - `tokenURI(uint256)` returns `data:application/json;base64,...` wrapping pure SVG XML with glowing Monad purple/cyan gradients and unicode gift emojis.
- **Oracle & USD Display (ADR-0004)**:
  - Pyth Price Feed ID fetched from Hermes Beta API.
  - Client side auto-refreshes MON/USD conversion every 1000ms.
- **Hackathon Demo Mode**:
  - `releaseBirthdayGift(uint256 vaultId, bool isDemoMode)` allows authorized creator/owner/recipient to bypass `block.timestamp >= birthdayTimestamp` during live demo testing.

---

## Testing Decisions

### Seams Strategy
We establish two primary testing seams across the stack:

1. **Contract Seam (Foundry Integration Suite)**:
   - Primary test file: `contracts/test/MonadBirthdayVault.t.sol`.
   - Tests full contract lifecycle:
     - `test_CreateVault`: Validates vault parameter state and time-lock calculation.
     - `test_ContributeAndGreetings`: Tests micro-contributions, accumulator math, and struct array storage for on-chain greetings.
     - `test_ReleaseGiftDemoMode`: Validates instant demo release, yield calculation, payout transfer, and SVG NFT minting + tokenURI base64 validation.
     - `test_ReleaseGiftTimeTravel`: Uses Foundry `vm.warp(block.timestamp + 31 days)` to simulate true temporal expiration and recipient release.

2. **Client Seam (Vite / Frontend Integration)**:
   - Wagmi mock connector / testnet RPC tests verifying contract interaction bindings, Privy login state transitions, and Pyth price feed formatting.

---

## Out of Scope

- Multi-token ERC20 vault funding (USDC/USDT) — MVP focuses strictly on MON native asset.
- Mainnet production deployment (targeting Monad Testnet Chain ID 10143).
- Complex multi-sig vault permissions — Vault administration is streamlined for group social use.

---

## Further Notes

- **Pitch Checklist (3-Minute Presentation)**:
  1. UX Layer: Privy Embedded Social Login + Gasless EIP-7702.
  2. Oracle Layer: Pyth Network MON/USD Live Price Feed.
  3. Smart Contract Layer: Monad Staking Precompile (`0x1000`) + Fallback Math + Dynamic SVG NFT.
  4. Execution Layer: High-Frequency Greeting Ticker leveraging 0.3s Monad block times.
