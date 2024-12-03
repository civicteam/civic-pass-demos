// Get the state of a pass using the @civic/solana-gateway-ts NPM library
// Usage: RPC=<your rpc node> bun run getPassStatusUsingLibrary.ts <walletAddress> <gatekeeperNetwork>

import {findGatewayTokensForOwnerAndNetwork} from '@civic/solana-gateway-ts';
import {Connection, PublicKey} from "@solana/web3.js";

// The script needs the wallet address and gatekeeper network as arguments
const walletAddress = process.argv[2]; // A solana public key
const gatekeeperNetwork = process.argv[3]; // The gatekeeper network key in base58

// check the args - you must also provide an RPC as an environment variable
if (!walletAddress || !gatekeeperNetwork || !process.env.RPC) {
    console.log('Usage: RPC=<your rpc node> bun run getPassStatusUsingLibrary.ts <walletAddress> <gatekeeperNetwork>');
    process.exit(1);
}

const connection = new Connection(process.env.RPC, 'confirmed');

// Get the token for the wallet address and gatekeeper network
findGatewayTokensForOwnerAndNetwork(connection, new PublicKey(walletAddress), new PublicKey(gatekeeperNetwork)).then((tokens) => {
    tokens.forEach((token) => {
        console.log(`Pass status: ${token.state}`);
        console.log(`Expiration: ${token.expiryTime}`);
    });
});
