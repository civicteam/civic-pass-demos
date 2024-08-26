"use client";

import React, {FC, PropsWithChildren} from "react";
import {GatewayProvider} from "@civic/ethereum-gateway-react";
import {useWallet} from "@/hooks/useWallet";
import {TransactionRequest, TransactionResponse} from "ethers";

const UNIQUENESS_PASS = "uniqobk8oGh4XBLMqM68K8M2zNu3CdYX7q5go7whQiv";
const LIVENESS_PASS = "vaa1QRNEBb1G2XjPohqGWnPsvxWnwwXF67pdjrhDSwM";
const PASS = process.env.NEXT_PUBLIC_UNIQUENESS === "true" ? UNIQUENESS_PASS : LIVENESS_PASS;

const payer = process.env.NEXT_PUBLIC_PAYER;

// handle BigInt JSON serialization
const serializer = (key: string, value: any) =>
    typeof value === 'bigint'
        ? value.toString()
        : value // return everything else unchanged

// call the backend to sign and send the transaction
const handleTransaction = async (request: TransactionRequest) => {
  const responsePromise = await fetch('/api', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(request, serializer),
  });
  return responsePromise.json() as Promise<TransactionResponse>;
};

export const CivicPassProvider: FC<PropsWithChildren> = ({ children }) => {
  const wallet = useWallet();

  return <GatewayProvider
    wallet={wallet}
    payer={payer}
    gatekeeperNetwork={PASS}
    handleTransaction={handleTransaction}
  >
    {children}
  </GatewayProvider>;
}