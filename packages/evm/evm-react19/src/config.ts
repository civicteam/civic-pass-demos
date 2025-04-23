import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

export const rainbowkitConfig = getDefaultConfig({
    appName: 'Civic Ethereum example',
    projectId: '4d41dec6c1d27f3ff29f2463d8add9fd',
    chains: [mainnet, sepolia],
});