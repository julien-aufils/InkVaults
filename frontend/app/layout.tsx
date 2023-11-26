"use client";

import "dotenv/config";

import "@fontsource/sora";
import "@rainbow-me/rainbowkit/styles.css";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { hardhat, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";

const theme = extendTheme({
  fonts: {
    body: "Sora, sans-serif",
    heading: "Sora, sans-serif",
  },
});

const { chains, publicClient } = configureChains(
  [hardhat, polygonMumbai],
  [
    publicProvider(),
    alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY as string }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "InkVaults Project",
  projectId: "fd0396dd8112284099c7567219b60051",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider theme={theme}>
          <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider theme={darkTheme()} chains={chains}>
              {children}
            </RainbowKitProvider>
          </WagmiConfig>
        </ChakraProvider>
      </body>
    </html>
  );
}
