import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import {CivicPassProvider} from "@/components/CivicPassProvider";
import AppWalletProvider from "@/components/AppWalletProvider";
import {AirdropProvider} from "@/components/AirdropProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Civic Pass Demo",
    description: "A Civic Pass Solana demo NextJs app",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <AppWalletProvider>
            <CivicPassProvider>
                <AirdropProvider>
                    {children}
                </AirdropProvider>
            </CivicPassProvider>
        </AppWalletProvider></body>
        </html>
    );
}
