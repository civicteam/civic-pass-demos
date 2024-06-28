'use client';
import { FC, useState } from "react";
import { useAirdrop } from "../AirdropContext";
import { useGateway } from "@civic/solana-gateway-react";

export const AirdropStep: FC = ({  }) => {
    const { claim, balance } = useAirdrop();
    const { gatewayToken } = useGateway();
    const [loading, setLoading] = useState(false);

    const airdrop = async () => {
        try {
            setLoading(true);
            await claim();
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center">
            <div className="flex h-12 items-center">Balance: {balance ?? 0}</div>
            <button className="btn btn-primary" onClick={airdrop} disabled={!gatewayToken}>
                Airdrop
                {loading && <span className="loading loading-spinner loading-sm"></span>}
            </button>
        </div>
    )
}