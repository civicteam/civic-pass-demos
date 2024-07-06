import { GatewayProvider } from "@civic/solana-gateway-react"
import React, { FC, PropsWithChildren } from "react";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {PublicKey} from "@solana/web3.js";

export const UNIQUENESS_PASS = new PublicKey("uniqobk8oGh4XBLMqM68K8M2zNu3CdYX7q5go7whQiv")

export const CivicPassProvider: FC<PropsWithChildren> = ({ children }) => {
  const wallet = useWallet();
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