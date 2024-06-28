import { GatewayProvider } from "@civic/solana-gateway-react"
import React, { FC, PropsWithChildren } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { UNIQUENESS_PASS } from "./lib/AirdropClient";

export const CivicPassProvider: FC<PropsWithChildren> = ({ children }) => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  return <GatewayProvider
    wallet={wallet}
    connection={connection}
    gatekeeperNetwork={UNIQUENESS_PASS}
    cluster="devnet"
  >
    {children}
  </GatewayProvider>;
}