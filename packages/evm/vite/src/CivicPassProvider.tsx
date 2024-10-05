import React, {FC, PropsWithChildren} from "react";
import {GatewayProvider} from "@civic/ethereum-gateway-react";
import {useWallet} from "./useWallet";

const UNIQUENESS_PASS = "uniqobk8oGh4XBLMqM68K8M2zNu3CdYX7q5go7whQiv";
const LIVENESS_PASS = "vaa1QRNEBb1G2XjPohqGWnPsvxWnwwXF67pdjrhDSwM";
const PASS = import.meta.env.VITE_UNIQUENESS === "true" ? UNIQUENESS_PASS : LIVENESS_PASS;

export const CivicPassProvider: FC<PropsWithChildren> = ({ children }) => {
  const wallet = useWallet();

  return <GatewayProvider
    wallet={wallet}
    gatekeeperNetwork={PASS}
  >
    {children}
  </GatewayProvider>;
}