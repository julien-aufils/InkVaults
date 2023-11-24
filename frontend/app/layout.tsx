"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@fontsource/sora";

const theme = extendTheme({
  fonts: {
    body: "Sora, sans-serif",
    heading: "Sora, sans-serif",
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </body>
    </html>
  );
}
