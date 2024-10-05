'use client';

import {GatewayStatus, IdentityButton, useGateway} from "@civic/ethereum-gateway-react";
import balloon from './balloon.svg';
import Image from "next/image";
import {FC, PropsWithChildren} from "react";
import {useAirdrop} from "@/components/AirdropContext";
import {ConnectButton} from "@rainbow-me/rainbowkit";

const Balloon: FC = () => <Image src={balloon} alt="balloon" width={269} height={304}/>

const Notification: FC<PropsWithChildren<{}>> = ({children}) => <div className="notification">
    {children}
</div>

const Dashboard = () => {
    const {balance, claim, isConfirming, error, txHash} = useAirdrop();
    const {gatewayStatus} = useGateway();

    const usersPassIsActive = gatewayStatus === GatewayStatus.ACTIVE;

    return (
        <>
            <IdentityButton className="civic-button app-button"/>

            <button
                className="app-button"
                disabled={!usersPassIsActive}
                onClick={claim}>{usersPassIsActive ? "Claim Airdrop" : "Verify first!"}
            </button>

            {(!!balance || !usersPassIsActive) &&
                <a onClick={() => claim()}>Attempt to get Airdrop without Civic Pass</a>}


            {isConfirming && <Notification>Claiming</Notification>}

            {!!balance && <Notification>Congratulations, you have a token!</Notification>}
            {txHash && <Notification><>Transaction: {txHash}</>
            </Notification>}
            {error && <Notification><>Error: {error.message}</>
            </Notification>}
        </>)
}

export default function Home() {
    return (
        <div className="App">
            <Balloon/>

            <h1>Claim Airdrop</h1>

            <p>Get a <a
                href="https://support.civic.com/hc/en-us/articles/4409219336599-What-is-Civic-Pass-and-how-does-it-work"
            >
                Civic Pass
            </a> to verify you are a unique person and get the airdrop.
            </p>

            <ConnectButton showBalance={false}/>
            <Dashboard/>
        </div>
    )
};