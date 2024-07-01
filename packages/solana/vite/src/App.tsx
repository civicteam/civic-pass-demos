import React, { useMemo } from "react";
import "./App.css";
import { ConnectionProvider, useWallet, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { AirdropProvider, useAirdrop } from "./AirdropContext";
import { clusterApiUrl } from "@solana/web3.js";
import { CivicPassProvider } from "./CivicPassContext";
import { GatewayStatus, IdentityButton, useGateway } from "@civic/solana-gateway-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import "@solana/wallet-adapter-react-ui/styles.css";
import { Step } from "./components/Step";
import { FaChevronRight } from "react-icons/fa6";
import { AirdropStep } from "./components/AirdropStep";
import { Toaster } from "react-hot-toast";
import { CreateMintStep } from "./components/CreateMintStep";
import { IntroStep } from "./components/IntroStep";
import { ProfileView } from "./components/ProfileView";

import civicLogoOrange from "./civic-logo-orange.svg"

const Admin = () => {
    const { client, createNewAirdrop } = useAirdrop();

    return (<div>
        <h1>Admin Mode</h1>
        { !client && <button onClick={createNewAirdrop}>Create New Airdrop</button>}
        { client && <>
            <div><a href={ `${document.location.href}#${client.airdropAddress.toString()}`}>Your Airdrop</a></div>
        </>}
    </div>)
}

const Player = () => {
    const { client } = useAirdrop();
    const { gatewayStatus, gatewayToken } = useGateway();
    if (!client) return <></>;

    return (<div>
        <h1>Player Mode</h1>
        <IdentityButton />
        { gatewayStatus !== GatewayStatus.ACTIVE && <div>Verify you are a unique person before entering</div>}
        { !client.ticket && gatewayToken && <button disabled={gatewayStatus !== GatewayStatus.ACTIVE} onClick={() => client.claim(gatewayToken.publicKey)}>Claim Airdrop</button>}
    </div>)
}

const SecondStep = () => {
    const wallet = useWallet()
    const { client } = useAirdrop();

    if (!wallet.connected || !wallet.publicKey) return <></>

    // admin mode if we have not created a airdrop yet, or if we are the airdrop authority
    const isAdminMode = client === undefined || client.airdrop.authority.equals(wallet.publicKey);

    return isAdminMode ? (<Step title="Create Mint" description="">
        <CreateMintStep />
    </Step>) : (<Step title="Airdrop" description="">
        <AirdropStep />
    </Step>);
}

const Content = () => {
    const wallet = useWallet()
    const { client } = useAirdrop();

    const ready = wallet.connected && wallet.publicKey

    // admin mode if we have not created a airdrop yet, or if we are the airdrop authority
    const isAdminMode = ready && (client === undefined || (wallet.publicKey && client.airdrop.authority.equals(wallet.publicKey)));

    return (<main className="flex min-h-screen flex-col items-center justify-between pr-16">
        <div className="flex flex-col items-center justify-center">
            <div className="flex justify-end items-end w-screen items-center">
                <ProfileView />
                <WalletMultiButton />
            </div>
            <div className="flex flex-col items-center justify-center pb-4">
                <img src={civicLogoOrange} className="pr-4 w-48 h-48"/>
                <div className="text-2xl">Airdrop Demo</div>
            </div>
        </div>
        {ready ? <div className="flex flex-row md:flex-row w-screen md:w-2/3 items-center justify-center">
            {!isAdminMode && <>
                <Step title="Civic Pass" description="">
                    <IdentityButton />
                </Step>
                <FaChevronRight className="text-4xl" />
            </>}
            {
                isAdminMode ? (<Step title="Create Mint" description="">
                    <CreateMintStep />
                </Step>) : (<Step title="Airdrop" description="">
                    <AirdropStep />
                </Step>)
            }
        </div> : <div><IntroStep/></div>
        }
        <div className="flex justify-end items-end w-screen">
            Created by <a className="pl-1 pr-1" href="https://www.linkedin.com/in/kelleherdaniel/">Daniel Kelleher</a> ©
            2024 Civic Technologies, Inc.
        </div>
    </main>)
}

function App() {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-4">
          <Toaster
            position="bottom-right"
            toastOptions={{ duration: 5000 }}
            reverseOrder={false}
          />
          <ConnectionProvider endpoint={endpoint}>
              <WalletProvider wallets={[]} autoConnect>
                  <WalletModalProvider>
                      <CivicPassProvider>
                          <AirdropProvider>
                              <Content />
                          </AirdropProvider>
                      </CivicPassProvider>
                  </WalletModalProvider>
              </WalletProvider>
          </ConnectionProvider>
      </main>
    );
}

export default App;
