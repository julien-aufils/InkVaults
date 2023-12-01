"use client";
import NextLink from "next/link";
import { Box, Flex, Link } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box as="main">
      <Flex p="1rem" textColor="#fff">
        <Link
          as={NextLink}
          href="/author/daniel"
          textDecoration="underline"
          _hover={{ textColor: "#3D6EFF" }}
        >
          Page d'auteur : Daniel Villa Monteiro
        </Link>
      </Flex>
    </Box>
  );
}
