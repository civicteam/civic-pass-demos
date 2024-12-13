// Get the state of a pass by calling the contract directly
// Usage: RPC=<your rpc node> bun run getPassStatusUsingContractABI.ts <walletAddress> <gatekeeperNetwork>

import {ethers} from "ethers";
import {base58ToBigInt, GATEWAY_CONTRACT_ADDRESS} from "./util";

// The script needs the wallet address and gatekeeper network as arguments
const walletAddress = process.argv[2]; // 0x...
const gatekeeperNetwork = process.argv[3]; // The gatekeeper network key in base58

// check the args - you must also provide an RPC as an environment variable
if (!walletAddress || !gatekeeperNetwork || !process.env.RPC) {
  console.log('Usage: RPC=<your rpc node> bun run getPassStatusUsingContractABI.ts <walletAddress> <gatekeeperNetwork>');
  process.exit(1);
}

// create the ethers provider
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC);
// converting the network key to a number for the ethereum contract
// NOTE - Pass types created before July 2024 are mapped to a slot ID in the gateway contract - these are not supported here.
// If you are using a pass type created before July 2024, contact Civic support to get the associated slot ID.
const slotId = base58ToBigInt(gatekeeperNetwork);
// A portion of the ABI. The full ABI is available here: https://github.com/civicteam/on-chain-identity-gateway/blob/main/ethereum/gateway-eth-ts/src/contracts/abi/GatewayToken.sol/GatewayToken.json
const abi = [
  'function getToken(uint256) view returns (address,uint8,string,uint256,uint256)',
  'function getTokenIdsByOwnerAndNetwork(address,uint256,bool) view returns (uint[])',
];

// Call the contract to get the token IDs for the wallet address and gatekeeper network
// Note - we are not using typescript here, but typescript bindings are available here:
// https://github.com/civicteam/on-chain-identity-gateway/tree/main/ethereum/gateway-eth-ts/src/contracts/typechain-types
const contract = new ethers.Contract(GATEWAY_CONTRACT_ADDRESS, abi, provider);
// Last argument: true to include only Active passes, false to include all passes.
contract.getTokenIdsByOwnerAndNetwork(walletAddress, slotId, false).then((tokenIds: bigint[]) => {
    if(!tokenIds || tokenIds.length === 0) {
      console.log('No passes found');
    }
    // For each token ID, look up its state on chain.
    tokenIds.forEach(async tokenId => {
        const [owner, state, identity, expiration, bitmask] = await contract.getToken(tokenId);
        console.log(`Token ID: ${tokenId}`);
        console.log(`Pass status: ${state}`); // An enum, see details here: https://github.com/civicteam/on-chain-identity-gateway/blob/e742e9f628c0886dfbbeb43596736f0952dd64bc/ethereum/gateway-eth-ts/src/utils/types.ts#L9
        console.log(`Expiration: ${expiration}`);
    })
});