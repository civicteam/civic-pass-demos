import { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { AirdropClient } from "./lib/AirdropClient";
import { PublicKey } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@coral-xyz/anchor";
import { useGateway } from "@civic/solana-gateway-react";
import toast from "react-hot-toast";

type AirdropContextType = {
  client: AirdropClient | undefined;
  balance: number | null;
  claim: () => Promise<void>;
  isConfirming: boolean;
  error: Error | undefined;
  txHash: string | undefined;
}
export const AirdropContext = createContext<AirdropContextType>({
  client: undefined,
  claim: async () => {},
  isConfirming: false,
  balance: null,
  error: undefined,
  txHash: undefined
});

const safeParsePublicKey = (string: string) => {
  try {
    return new PublicKey(string);
  } catch (e) {
    return null;
  }
};

export const AirdropProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const { gatewayToken } = useGateway();
  const [client, setClient] = useState<AirdropClient | undefined>();
  const [balance, setBalance] = useState<number | null>(null);
  const airdropAddress = useMemo(
    () => safeParsePublicKey(import.meta.env.VITE_AIRDROP_ADDRESS ?? window.location.href.split("#")[1]),
    [window.location.href]
  );
  const [isConfirming, setIsConfirming] = useState(false);
  const [txHash, setTxHash] = useState<string>();
  const [error, setError] = useState<Error>();

  const provider = useMemo(() => {
    if (!wallet) return undefined;
    return new AnchorProvider(
      connection,
      wallet,
      {}
    );
  }, [wallet])

  useEffect(() => {
    if (!provider || !airdropAddress || client) return;
    AirdropClient.get(provider, airdropAddress).then((client) => {
      setClient(client);

      if (client) {
        client.getBalance().then(setBalance);
      }
    });
  }, [airdropAddress, provider, client]);

  const claim = async () => {
    if (!gatewayToken || !client) throw new Error("No gateway token");

    try {
      const txSig = await client.claim(gatewayToken.publicKey);
      console.log("Airdrop tx sig:", txSig);

      toast.success(<a href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`} target="_blank">Airdrop
        complete. Explorer</a>);

      setIsConfirming(true);
      client.getBalance().then(setBalance);

      setTxHash(txSig);
    } catch (e) {
      toast.error("Airdrop failed: " + (e as Error).message);
      setError(e as Error)
    } finally {
      setIsConfirming(false);
    }
  }

  return (
    <AirdropContext.Provider value={{ client, balance, claim, isConfirming, error, txHash }}>
      {children}
    </AirdropContext.Provider>
  );
}

export const useAirdrop = () => useContext(AirdropContext);