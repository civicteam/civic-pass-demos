import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';

import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import {CivicPassProvider} from "@/components/CivicPassProvider";
import {AirdropProvider} from "@/components/AirdropContext";
import WalletProvider from "@/components/WalletProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Civic Pass Demo",
    description: "A Civic Pass EVM demo NextJs app",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <WalletProvider>
            <CivicPassProvider>
                <AirdropProvider>
                    {children}
                </AirdropProvider>
            </CivicPassProvider>
        </WalletProvider>
        </body>
        </html>
    );
}
