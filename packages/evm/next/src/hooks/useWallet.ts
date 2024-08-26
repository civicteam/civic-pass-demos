import {BrowserProvider, JsonRpcSigner} from "ethers";
import { useWalletClient, UseWalletClientReturnType } from "wagmi";
import {useMemo} from "react";
import {EthereumGatewayWallet} from "@civic/ethereum-gateway-react";

// Convert a wagmi wallet client to an ethers signer
function walletClientToSigner(walletClient: UseWalletClientReturnType['data']): JsonRpcSigner {
    if (!walletClient) throw new Error('No account found in wallet client')
    const { account, chain, transport } = walletClient;
    const network = {
        chainId: chain?.id,
        name: chain?.name,
        ensAddress: chain?.contracts?.ensRegistry?.address,
    };

    const provider = new BrowserProvider(transport, network);
    return new JsonRpcSigner(provider, account?.address);
}

export const useWallet = (): EthereumGatewayWallet | undefined => {
    const { data: walletClient } = useWalletClient();

    const wallet = useMemo(() => {
        // the wallet client chain is set asynchronously, so wait until
        // it's set before creating a signer
        if (walletClient && walletClient.chain && walletClient.account) {
            return {
                address: walletClient.account.address,
                signer: walletClientToSigner(walletClient)
            }
        }

        return undefined;
    }, [walletClient?.account, walletClient?.chain]);

    return wallet;
}