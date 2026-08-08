# 4. Pyth Network Oracle Integration for MON/USD Pricing

* Status: Accepted
* Date: 2026-08-08

## Context and Problem Statement
Target gift pool amounts need to be displayed in fiat (USD) while settling on-chain in MON.

## Decision Outcome
Chosen Option: Target amount stored in MON on-chain, while fetching real-time MON/USD conversion from Pyth Network Hermes Beta API (`https://hermes-beta.pyth.network`) and Pyth Contract (`0x2880aB155794e7179c9eE2e38200202908C17B43`).
