"use client";

import "dotenv/config";

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
