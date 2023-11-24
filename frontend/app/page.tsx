"use client";
import { Box } from "@chakra-ui/react";

import NavBar from "@/components/NavBar/NavBar";

export default function Home() {
  return (
    <Box as="main" backgroundColor="#080A0C" h="100vh">
      <NavBar />
    </Box>
  );
}
