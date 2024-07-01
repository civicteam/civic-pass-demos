# Civic Pass Demos

This monorepo contains a suite of demo apps, all using Civic Pass to gate access to smart contracts.

## Demo Deployments

[EVM (Polygon Amoy)](https://airdrop-demo.civic.com/evm)

[Solana (devnet)](https://airdrop-demo.civic.com/solana)

## Getting Started

To run these apps locally, first install all dependencies

```shell
yarn
```

Then navigate to the app:

| Chain  |                               |                                 |
|--------|-------------------------------|---------------------------------|
| EVM    | [Vite](/packages/evm/vite)    | [NextJS](/packages/evm/next)    |
| Solana | [Vite](/packages/solana/vite) | [NextJS](/packages/solana/next) |

Where appropriate, copy `.env.example` to `.env` and populate the fields.

Then run:

```shell
yarn dev
```