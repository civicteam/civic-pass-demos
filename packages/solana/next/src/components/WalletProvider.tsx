"use client";
import {
    ConnectionProvider,
    WalletProvider as WalletAdapterProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { FC, PropsWithChildren, useMemo } from "react";

// Default styles
require("@solana/wallet-adapter-react-ui/styles.css");

const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
    const endpoint =
        process.env.NEXT_PUBLIC_RPC ||
        "https://api.devnet.solana.com";

    const wallets = useMemo(
        () => [
            new SolflareWalletAdapter(),
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletAdapterProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletAdapterProvider>
        </ConnectionProvider>
    );
};

export default WalletProvider;