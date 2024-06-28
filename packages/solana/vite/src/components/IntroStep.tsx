'use client';
import { FC } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const IntroStep: FC = ({  }) => {
    return (
        <div className="flex flex-col items-center">
                Connect Wallet
                <WalletMultiButton />
        </div>
    )
}