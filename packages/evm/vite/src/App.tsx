import './App.css';
import {useAirdrop} from './AirdropContext';
import {ConnectButton} from '@rainbow-me/rainbowkit';
import {GatewayStatus, IdentityButton, useGateway} from '@civic/ethereum-gateway-react';
import Balloon from "./balloon.svg?react";
import {FC, PropsWithChildren} from "react";

const Notification: FC<PropsWithChildren<{}>> = ({children}) => <div className="notification">
    {children}
</div>

const Dashboard = () => {
    const {balance, totalSupply, claim, isConfirming, txHash, error} = useAirdrop();
    const {gatewayStatus} = useGateway();

    const usersPassIsActive = gatewayStatus === GatewayStatus.ACTIVE;

    return (
        <>
            <IdentityButton className="civic-button app-button"/>

            {!balance &&
                <button
                    className="app-button"
                    disabled={!usersPassIsActive}
                    onClick={claim}>{usersPassIsActive ? "Claim Airdrop" : "Verify first!"}
                </button>
            }

            {(!!balance || !usersPassIsActive) &&
                <a onClick={() => claim({gasLimit: 3000000})}>Attempt to get Airdrop without Civic Pass</a>}


            {isConfirming && <Notification>Claiming</Notification>}

            {!!balance && <Notification>Congratulations, you have a token!</Notification>}
            {txHash && <Notification><>Transaction: {txHash}</>
            </Notification>}
            {error && <Notification><>Error: {error.message}</>
            </Notification>}

            <Notification>
                <h3>Claimed</h3>
                <h2>{totalSupply?.toString() ?? 0} Airdrops</h2>
            </Notification>
        </>)
}

function App() {
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
    );
}

export default App;
