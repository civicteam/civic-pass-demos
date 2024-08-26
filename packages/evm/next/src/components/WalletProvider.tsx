"use client";

import {getDefaultConfig, RainbowKitProvider} from "@rainbow-me/rainbowkit";
import {polygonAmoy} from "wagmi/chains";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import React from "react";
import {CivicPassProvider} from "@/components/CivicPassProvider";
import {AirdropProvider} from "@/components/AirdropContext";
import {WagmiProvider} from "wagmi";

const config = getDefaultConfig({
    appName: "Civic Demo Airdrop App",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    chains: [polygonAmoy],
});

const queryClient = new QueryClient();

export default function WalletProvider({
                                              children,
                                          }: {
    children: React.ReactNode;
}) {

    return <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
                <CivicPassProvider>
                    <AirdropProvider>
                        {children}
                    </AirdropProvider>
                </CivicPassProvider>
            </RainbowKitProvider>
        </QueryClientProvider>
    </WagmiProvider>
}