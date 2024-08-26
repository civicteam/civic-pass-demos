# Civic Pass Demos

This monorepo contains a suite of demo apps, all using Civic Pass to gate access to smart contracts.

## Demo Deployments

[EVM Vite (Polygon Amoy)](https://airdrop-demo.civic.me/evm)
[Solana Vite (devnet)](https://airdrop-demo.civic.me/solana)
[EVM NextJs (Polygon Amoy)](https://airdrop-demo.civic.me/next/evm)
[Solana NextJs (devnet)](https://airdrop-demo.civic.me/next/solana)

## Getting Started

To run these apps locally, first install all dependencies

```shell
yarn
```

Then navigate to the app:

| Chain  |                               |                                                  |
|--------|-------------------------------|--------------------------------------------------|
| EVM    | [Vite](/packages/evm/vite)    | [NextJS](/packages/evm/next)    |
| Solana | [Vite](/packages/solana/vite) | [NextJS](/packages/solana/next) |

Where appropriate, copy `.env.example` to `.env` and populate the fields.

Then run:

```shell
yarn dev
```