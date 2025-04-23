import { GatewayProvider, IdentityButton } from "@civic/ethereum-gateway-react";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { useMemo } from "react";
import { useAccount, useWalletClient, UseWalletClientReturnType } from "wagmi";

const GATEKEEPER_NETWORK = "ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6"; // Captcha pass
// const GATEKEEPER_NETWORK = "vaa1QRNEBb1G2XjPohqGWnPsvxWnwwXF67pdjrhDSwM"; // Liveness pass (video selfie)


function Civic() {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const wallet = useMemo(() => {
    // the wallet client chain is set asynchronously, so wait until
    // it's set before creating a signer
    if (walletClient && walletClient.chain && walletClient.account) {
      return {
        address: walletClient.account.address,
        signer: walletClientToSigner(walletClient),
      };
    }

    return undefined;
  }, [walletClient?.account, walletClient?.chain]);

  // Convert a wagmi wallet client to an ethers signer
  function walletClientToSigner(
    walletClient: UseWalletClientReturnType["data"]
  ): JsonRpcSigner {
    if (!walletClient) throw new Error("No account found in wallet client");
    const { account, chain, transport } = walletClient;
    const network = {
      chainId: chain?.id,
      name: chain?.name,
      ensAddress: chain?.contracts?.ensRegistry?.address,
    };

    const provider = new BrowserProvider(transport, network);
    return new JsonRpcSigner(provider, account?.address);
  }

  return (
    <>
      {isConnected && (
        <GatewayProvider
          wallet={wallet}
          gatekeeperNetwork={GATEKEEPER_NETWORK}
        >
            <IdentityButton />
        </GatewayProvider>
      )}
    </>
  );
}

export default Civic;
