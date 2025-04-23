import "@rainbow-me/rainbowkit/styles.css";
import "./App.css";
import { wagmiConfig } from "./config";
import {
  WagmiProvider,
} from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectButton, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import Civic from "./Civic";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <ConnectButton />
            <Civic />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default App;
