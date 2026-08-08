# 04 — Micro-Contribution UI, Sub-Second Greeting Feed & Gasless Sponsorship

**What to build:**
Interactive Vault details page featuring a sub-second updating activity feed for micro-contributions and on-chain birthday messages. Allow friends to enter micro-tips ($0.50 - $2.00 in MON) with a personalized greeting message and submit transactions via gasless paymaster.

**Blocked by:** 03 — Vault Creation Form & Pyth Oracle Live MON/USD Ticker.

**Status:** completed

- [x] Vault details page showing vault status, countdown timer, and live yield accumulator
- [x] Contribution modal/form with message input and preset MON tip buttons
- [x] Sub-second polling (1s Wagmi interval) rendering new greetings in live feed
- [x] Gasless contribution submission verified
