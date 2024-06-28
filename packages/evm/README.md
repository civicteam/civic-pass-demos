# Civic Pass EVM Sample Airdrop Project

This project demonstrates the integration of Civic Pass into an Ethereum smart contract.

It is a simple airdrop contract that allows users to claim one ERC20 token each.

By adding Civic's Uniqueness Pass to the contract, we can ensure that each user can only claim.

## Getting started

Install dependencies:

```shell
yarn
```

Run a local hardhat node:
(This project uses hardhat-deploy to set up an ERC20 token contract.)

```shell
yarn local:start
```

Start the frontend:

```shell
yarn app:start
```

Deploy to testnet:

```shell
PRIVATE_KEY=${YOUR_PRIVATE_KEY} yarn deploy:testnet
```

Start the frontend pointing to testnet:

```shell
yarn app:start:testnet
```