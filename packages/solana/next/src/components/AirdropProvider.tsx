"use client";

import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useGateway } from "@civic/solana-gateway-react";
import toast from "react-hot-toast";
import { claim as claimAction } from "@/actions/claim";
import { getTicket as getTicketAction } from "@/actions/getTicket";

type AirdropContextType = {
  balance: number | null;
  claim: () => Promise<void>;
  isConfirming: boolean;
  error: Error | undefined;
  txHash: string | undefined;
}
export const AirdropContext = createContext<AirdropContextType>({
  claim: async () => {},
  isConfirming: false,
  balance: null,
  error: undefined,
  txHash: undefined
});

export const AirdropProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const wallet = useAnchorWallet();
  const {gatewayToken} = useGateway();
  const [balance, setBalance] = useState<number | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [txHash, setTxHash] = useState<string>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (wallet?.publicKey) {
      getTicketAction(wallet.publicKey.toBase58()).then((ticket) => {
        setBalance(ticket ? 1 : 0);
      });
    }
  }, [wallet?.publicKey.toBase58()]);

  const claim = async () => {
    if (!gatewayToken || !wallet) {
      console.log("No gateway token or wallet", gatewayToken, wallet);
      throw new Error("No gateway token");
    }

    try {
      const txSig = await claimAction(wallet.publicKey.toBase58(), gatewayToken.publicKey.toBase58());
      console.log("Airdrop tx sig:", txSig);

      toast.success(<a href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`} target="_blank">Airdrop
        complete. Explorer</a>);

      setIsConfirming(true);
      const alreadyAirdropped = await getTicketAction(wallet.publicKey.toBase58());
      setBalance(alreadyAirdropped ? 1 : 0);

      setTxHash(txSig);
    } catch (e) {
      toast.error("Airdrop failed: " + (e as Error).message);
      setError(e as Error)
    } finally {
      setIsConfirming(false);
    }
  }

  return (
      <AirdropContext.Provider value={{balance, claim, isConfirming, error, txHash}}>
        {children}
      </AirdropContext.Provider>
  );
}

export const useAirdrop = () => useContext(AirdropContext);