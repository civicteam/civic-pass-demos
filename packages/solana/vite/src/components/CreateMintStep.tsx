'use client';
import { FC, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import { useAirdrop } from "../AirdropContext";
import { GatewayStatus, useGateway } from "@civic/solana-gateway-react";

export const CreateMintStep: FC = ({  }) => {
    const wallet = useWallet();
    const [loading, setLoading] = useState(false);
    const { createNewAirdrop } = useAirdrop();

    const create = async () => {
        if (!wallet.publicKey) return;
        try {
            setLoading(true);

            await createNewAirdrop();
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center">
            <button className="btn btn-primary" onClick={create}>
                Create Mint
                {loading && <span className="loading loading-spinner loading-sm"></span>}
            </button>
        </div>
    )
}