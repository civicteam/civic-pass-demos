'use client';

import { CivicPassProvider } from "@/components/CivicPassProvider";
import WalletMultiButton from "@/components/WalletMultiButton";
import WalletProvider from "@/components/WalletProvider";
import { IdentityButton } from "@civic/solana-gateway-react";

export default async function Home() {
  return (
      <WalletProvider>
        <CivicPassProvider>
          <div className="flex min-h-screen items-center justify-center">
            <main className="flex flex-col items-center justify-between p-6 max-h-[200px]">
              <WalletMultiButton/>
              <IdentityButton/>
            </main>
          </div>
        </CivicPassProvider>
      </WalletProvider>
  )
};