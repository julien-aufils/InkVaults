"use client";
import NextLink from "next/link";
import { Box, Flex, Link } from "@chakra-ui/react";
import authorsData from "/data/authors.json";
import Author from "@/types/Author";

export default function Home() {
  return (
    <Box as="main">
      <Flex p="1rem" textColor="#fff" direction="column">
        {authorsData.map((author: Author) => (
          <Link
            key={author.id}
            as={NextLink}
            href={`/authors/${author.id}`}
            textDecoration="underline"
            _hover={{ textColor: "#3D6EFF" }}
          >
            Page d'auteur : {author.name}
          </Link>
        ))}
      </Flex>
    </Box>
  );
}
