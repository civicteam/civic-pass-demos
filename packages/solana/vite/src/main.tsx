import { createRoot } from 'react-dom/client';
import App from "./App";
import React, {StrictMode} from "react";
import {Toaster} from "react-hot-toast";
import {ConnectionProvider, WalletProvider} from "@solana/wallet-adapter-react";
import {WalletModalProvider} from "@solana/wallet-adapter-react-ui";
import {CivicPassProvider} from "./CivicPassProvider";
import {AirdropProvider} from "./AirdropContext";
import {clusterApiUrl} from "@solana/web3.js";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";

const endpoint = clusterApiUrl(WalletAdapterNetwork.Devnet)
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <StrictMode>
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
                          <App />
                      </AirdropProvider>
                  </CivicPassProvider>
              </WalletModalProvider>
          </WalletProvider>
      </ConnectionProvider>
  </StrictMode>
);