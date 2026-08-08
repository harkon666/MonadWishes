# 5. Envio HyperIndex Event Indexer & GraphQL API Integration

* Status: Accepted
* Date: 2026-08-08

## Context and Problem Statement
Reading historical vault activity feeds, transaction greetings, and leaderboard statistics directly via Monad RPC calls can introduce latency and rate-limit constraints as event volume scales.

## Decision Drivers
- High-performance, sub-second indexing of on-chain Monad smart contract events (`VaultCreated`, `ContributionReceived`, `GiftClaimed`).
- Providing a fast, structured GraphQL query API for frontend activity feeds and leaderboard sorting.

## Decision Outcome
Chosen Option: Envio HyperIndex Indexer. Deployed via `envio-cloud` CLI for Monad Testnet, capturing contract events into a PostgreSQL database with a managed GraphQL endpoint consumed by the frontend.
