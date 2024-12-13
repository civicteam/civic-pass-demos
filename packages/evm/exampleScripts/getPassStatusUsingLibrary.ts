// Get the state of a pass using the @civic/gateway-eth-ts NPM library
// Usage: RPC=<your rpc node> bun run getPassStatusUsingLibrary.ts <walletAddress> <gatekeeperNetwork>

import {GatewayTs, TokenState} from '@civic/gateway-eth-ts';
import {ethers} from "ethers";
import {base58ToBigInt, GATEWAY_CONTRACT_ADDRESS} from "./util";

// The script needs the wallet address and gatekeeper network as arguments
const walletAddress = process.argv[2]; // 0x...
const gatekeeperNetwork = process.argv[3]; // The gatekeeper network key in base58

// check the args - you must also provide an RPC as an environment variable
if (!walletAddress || !gatekeeperNetwork || !process.env.RPC) {
    console.log('Usage: RPC=<your rpc node> bun run getPassStatusUsingLibrary.ts <walletAddress> <gatekeeperNetwork>');
    process.exit(1);
}

// create the ethers provider and pass it into civic library
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC);
const gatewayTs = new GatewayTs(provider, GATEWAY_CONTRACT_ADDRESS)

// Get the token for the wallet address and gatekeeper network
gatewayTs.getToken(walletAddress, base58ToBigInt(gatekeeperNetwork)).then(token => {
    if (!token) {
        console.log('Token not found');
        return;
    }

    console.log(`Token ID: ${token.tokenId}`);
    console.log(`Pass status: ${TokenState[token.state]}`);
    console.log(`Expiration: ${token.expiration}`);
});

// Subscribe to changes in the token state
gatewayTs.onGatewayTokenChange(walletAddress, base58ToBigInt(gatekeeperNetwork), (token) => {
    if(!token) {
        console.log('Token not found');
        return;
    }
    console.log(`Token ID: ${token.tokenId}`);
    console.log(`Pass status: ${TokenState[token.state]}`);
    console.log(`Expiration: ${token.expiration}`);
});
