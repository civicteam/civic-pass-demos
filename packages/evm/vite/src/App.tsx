import './App.css';
import {useAirdrop} from './AirdropContext';
import {ConnectButton} from '@rainbow-me/rainbowkit';
import {GatewayStatus, IdentityButton, useGateway} from '@civic/ethereum-gateway-react';
import Ticket from "./ticket.svg?react";

const Dashboard = () => {
    const { balance, totalSupply, claim, isConfirming, txHash, error } = useAirdrop();
    const { gatewayStatus } = useGateway();

    const usersPassIsActive = gatewayStatus === GatewayStatus.ACTIVE;

    return (<div id="main">

        <Ticket />
        <h1>Claim Airdrop</h1>

        <IdentityButton/>

        {!usersPassIsActive && <div>Verify you are a unique person before entering</div>}

        {!balance &&
            <button
                disabled={!usersPassIsActive}
                onClick={claim}>{usersPassIsActive ? "Claim" : "Verify first!"}
            </button>
        }

        {(!!balance || !usersPassIsActive) &&
            <button onClick={() => claim({gasLimit: 3000000})}>I don't care, try to claim anyway!</button>}

        {isConfirming && <p><>Claiming...</>

        </p>}

        {!!balance && <p><>Congratulations, you have a token!</>
        </p>}
        {txHash && <p><>Transaction: {txHash}</>
        </p>}
        {error && <p><>Error: {error.message}</>
        </p>}
        <div>Claimed so far: {totalSupply?.toString() ?? 0}</div>
    </div>)
}

function App() {
    return (
        <div className="App">
            <div className="container" style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh"
            }}>
                <ConnectButton showBalance={false}/>
                <hr/>
                <Dashboard/>
            </div>
        </div>
    );
}

export default App;
