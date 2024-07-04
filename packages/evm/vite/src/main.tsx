import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '@rainbow-me/rainbowkit/styles.css';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {getDefaultConfig, RainbowKitProvider} from '@rainbow-me/rainbowkit';
import {WagmiProvider} from 'wagmi';
import {polygonAmoy} from "wagmi/chains";
import {AirdropProvider} from "./AirdropContext.tsx";
import {CivicPassProvider} from "./CivicPassContext.tsx";

/* New RainbowKit API */
const config = getDefaultConfig({
    appName: "Civic Demo Airdrop App",
    projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "",
    chains: [polygonAmoy],
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    <CivicPassProvider>
                        <AirdropProvider>
                            <App />
                        </AirdropProvider>
                    </CivicPassProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    </React.StrictMode>,
)
