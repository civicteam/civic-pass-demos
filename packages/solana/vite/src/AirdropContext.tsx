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
  createNewAirdrop: () => Promise<void>;
  claim: () => Promise<string>;
}
export const AirdropContext = createContext<AirdropContextType>({
  client: undefined,
  createNewAirdrop: async () => {},
  claim: async () => "",
  balance: null
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
  const addressFromUrl = useMemo(
    () => safeParsePublicKey(window.location.href.split("#")[1]),
    [window.location.href]
  );

  const provider = useMemo(() => {
    if (!wallet) return undefined;
    return new AnchorProvider(
      connection,
      wallet,
      {}
    );
  }, [wallet])

  useEffect(() => {
    if (!provider || !addressFromUrl || client) return;
    AirdropClient.get(provider, addressFromUrl).then((client) => {
      setClient(client);

      if (client) {
        client.getBalance().then(setBalance);
      }
    });
  }, [addressFromUrl, provider, client]);

  const createNewAirdrop = async () => {
    if (!provider) return undefined;
    await AirdropClient.create(provider).then(client => {
      window.location.href = `#${client.airdropAddress.toString()}`;
      window.location.reload();
    });
  }

  const claim = async () => {
    if (!gatewayToken || !client) throw new Error("No gateway token");

    try {
      const txSig = await client.claim(gatewayToken.publicKey);
      console.log("Airdrop tx sig:", txSig);

      toast.success(<a href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`} target="_blank">Airdrop
        complete. Explorer</a>);

      client.getBalance().then(setBalance);

      return txSig;
    } catch (e) {
      toast.error("Airdrop failed: " + (e as Error).message);
      throw e;
    }
  }

  return (
    <AirdropContext.Provider value={{ client, createNewAirdrop, balance, claim }}>
      {children}
    </AirdropContext.Provider>
  );
}

export const useAirdrop = () => useContext(AirdropContext);