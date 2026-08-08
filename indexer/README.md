# MonadWishes Envio HyperIndex Indexer

Event indexer and GraphQL API for **MonadWishes** smart contract events on **Monad Testnet** (`Chain ID 10143`).

## Indexed Events

1. `VaultCreated` — Captures vault creation, creator, recipient, target MON, and timestamp.
2. `ContributionReceived` — Captures micro-contributions, on-chain greetings, total collected, and transaction hash.
3. `GiftClaimed` — Captures birthday release payouts, yield bonus, recipient wallet, and dynamic SVG NFT tokenId.

## How to Deploy to Envio Cloud

1. Ensure `envio-cloud` CLI and `gh` CLI are logged in:
   ```bash
   npm install -g envio-cloud
   envio-cloud login
   gh auth login
   ```

2. Run codegen and build:
   ```bash
   cd indexer
   bun run build
   ```

3. Deploy to Envio Cloud:
   ```bash
   envio-cloud deploy
   ```
