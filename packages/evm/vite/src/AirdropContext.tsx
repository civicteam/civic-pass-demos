import React, { createContext, FC, ReactNode, useContext } from "react";
import {Airdrop__factory} from "./typechain-types";
import {useWallet} from "./useWallet";
import {useReadContract, useWaitForTransactionReceipt, useWriteContract} from "wagmi";
import type {Address} from "abitype";
import {UseWriteContractReturnType} from "wagmi/src/hooks/useWriteContract.ts";

const contractAddress:Address  = import.meta.env.VITE_CONTRACT_ADDRESS as Address || "0xabc";

type AirdropContextType = {
  balance: bigint | undefined;
  totalSupply: bigint | undefined;
  isConfirming: boolean;
  isConfirmed: boolean
  txHash: string | undefined;
  error: UseWriteContractReturnType["error"] | null;
  claim: (...args: any[]) => void;
}
export const AirdropContext = createContext<AirdropContextType>({
  balance: undefined,
  totalSupply: undefined,
  isConfirming: false,
  isConfirmed: false,
  txHash: undefined,
  error: null,
  claim: () => {}
});

export const AirdropProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const wallet = useWallet();

  const {
    data: balance
  } = useReadContract({
    address: contractAddress,
    abi: Airdrop__factory.abi,
    functionName: "balanceOf",
    args: [wallet?.address as Address]
  });

  const { data: totalSupply } = useReadContract({
    address: contractAddress,
    abi: Airdrop__factory.abi,
    functionName: "totalSupply",
    query: {
      refetchInterval: 3000
    }
  })

  const { data: txHash, writeContract, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
      useWaitForTransactionReceipt({
        hash: txHash,
      })

  const claim = () => {
    writeContract({
      address: contractAddress,
      abi: Airdrop__factory.abi,
      functionName: "claim",
    });
  }
  return (
      <AirdropContext.Provider value={{ balance, totalSupply, claim, isConfirming, isConfirmed, txHash, error }}>
        {children}
      </AirdropContext.Provider>
  );
}

export const useAirdrop = () => useContext(AirdropContext);