# 1. Monad Native Staking Precompile (0x1000) & Internal Math Fallback

* Status: Accepted
* Date: 2026-08-08

## Context and Problem Statement
Monad provides a native protocol-level staking precompile at address `0x0000000000000000000000000000000000001000` (`0x1000`). We need to earn yield on pooled MON gift contributions during the 30-day waiting period. However, testnet validator precompile behavior can vary or fail depending on active validator nodes.

## Decision Drivers
- Demonstrating Monad-native EVM extension precompiles to hackathon judges.
- Ensuring 100% transaction reliability during live 3-minute hackathon presentation.

## Considered Options
1. Low-level call to `0x1000` with internal simulated yield fallback math (`0.5%` per month prorated).
2. Pure simulated yield math.

## Decision Outcome
Chosen Option: Option 1. The smart contract executes a low-level call to `0x1000`. If the precompile call reverts or is unhandled in testnet, the contract gracefully falls back to internal yield simulation so no transaction ever fails during presentation.
