# 02 — Privy Social Login & Monad Testnet Web3 Provider Integration

**What to build:**
Configure Privy SDK and Wagmi/Viem provider in the React / TanStack Router frontend (`frontend/src/`) for Monad Testnet (`Chain ID 10143`, RPC `https://testnet-rpc.monad.xyz`). Enable Google & Twitter social login with automatic embedded wallet generation and account abstraction paymaster gasless sponsorship.

**Blocked by:** 01 — Smart Contract Vault & Dynamic SVG NFT Core Engine.

**Status:** ready-for-agent

- [ ] PrivyProvider wrapped around main app with Monad Testnet chain definition
- [ ] Header / Navigation social login button (Google / Twitter / Embedded Wallet)
- [ ] Wallet connection state accessible across routes
- [ ] EIP-7702 paymaster gasless sponsorship enabled for transactions
