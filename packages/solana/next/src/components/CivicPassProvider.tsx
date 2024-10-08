'use client';
import React, {FC, PropsWithChildren} from "react";
import {GatewayProvider} from "@civic/solana-gateway-react";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {PublicKey, Transaction} from "@solana/web3.js";

// Pick your pass type...
const UNIQUENESS_PASS = new PublicKey("uniqobk8oGh4XBLMqM68K8M2zNu3CdYX7q5go7whQiv");
const CAPTCHA_PASS = new PublicKey("ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6")
const DUMMY_PASS = new PublicKey("tgnuXXNMDLK8dy7Xm1TdeGyc95MDym4bvAQCwcW21Bf")

const PAYER = new PublicKey(process.env.NEXT_PUBLIC_PAYER ?? "");

export const CivicPassProvider: FC<PropsWithChildren> = ({ children }) => {
    const wallet = useWallet();
    const { connection } = useConnection();

    const handleTransaction = async (transaction: Transaction) => {
        const serializedTransaction = Buffer.from(transaction.serialize({
            requireAllSignatures: false,
        })).toString('base64');
        const response = await fetch('/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transaction: serializedTransaction }),
        });
        const { signature } = await response.json();
        return signature;
    };

    return (
        <GatewayProvider
            wallet={wallet}
            connection={connection}
            gatekeeperNetwork={UNIQUENESS_PASS}
            cluster="devnet"
            payer={PAYER}
            handleTransaction={handleTransaction}>
            {children}
        </GatewayProvider>
    )
};