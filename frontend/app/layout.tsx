"use client";

import * as dotenv from "dotenv";
dotenv.config();

import "@fontsource/sora";
import "@rainbow-me/rainbowkit/styles.css";

import { ChakraProvider, extendTheme, Box, Flex } from "@chakra-ui/react";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { hardhat, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";

import NavBar from "@/components/NavBar/NavBar";

const theme = extendTheme({
  fonts: {
    body: "Sora, sans-serif",
    heading: "Sora, sans-serif",
  },
});

const { chains, publicClient } = configureChains(
  process.env.APP_STATE !== "production"
    ? [hardhat, polygonMumbai]
    : [polygonMumbai],
  process.env.APP_STATE !== "production"
    ? [publicProvider()]
    : [
        publicProvider(),
        alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY as string }),
      ]
);

const WALLET_CONNECT_ID = "4a5edee207db822d4c4f5e8c64b8537c";
const { connectors } = getDefaultWallets({
  appName: "InkVaults",
  projectId: WALLET_CONNECT_ID,
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
              <NavBar />
              <Box as="main" backgroundColor="#080A0C" minHeight="100vh">
                <Flex
                  px={{ base: "1rem", md: "4rem" }}
                  py="1rem"
                  m="auto"
                  maxWidth="1530px"
                  direction="column"
                  gap="2rem"
                  textColor="#FFF"
                >
                  {children}
                </Flex>
              </Box>
            </RainbowKitProvider>
          </WagmiConfig>
        </ChakraProvider>
      </body>
    </html>
  );
}
