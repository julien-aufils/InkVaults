"use client";

import NextLink from "next/link";
import {
  Flex,
  Image,
  InputGroup,
  InputLeftElement,
  Input,
  Link,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import MenuComponent from "../MenuComponent/MenuComponent";

const NavBar = () => {
  const menuItems: MenuItem[] = [
    {
      category: "Marketplace",
      items: [
        "Home",
        "Book Shares",
        "Writer Fan Card",
        "Verified Authors",
        "Crowdfunding",
      ],
    },
    {
      category: "Resources",
      items: ["Help Center", "Buy Polygon"],
    },
  ];

  return (
    <Flex
      as="nav"
      h={{ base: "auto", md: "5.5rem" }}
      py="1rem"
      px={{ base: "1rem", md: "4rem" }}
      backgroundColor={"#111318"}
      gap="3"
      align="center"
      justify={{ base: "center", md: "space-between" }}
      boxShadow="md"
      pos="sticky"
      top="0"
      flexWrap="wrap"
    >
      <Link as={NextLink} href="/">
        <Image objectFit="cover" w="11rem" src="/inkVaultsLogo.png" />
      </Link>
      <Flex gap="3" align="center">
        {menuItems.map((menu, index) => (
          <MenuComponent
            key={index}
            category={menu.category}
            items={menu.items}
          />
        ))}
        <InputGroup w={{ base: "100%", md: "25rem" }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.50" />
          </InputLeftElement>
          <Input
            type="search"
            placeholder="Collection, Book or Author"
            border="none"
            backgroundColor="#191D24"
            textColor="#FFFFFF"
            _placeholder={{
              fontWeight: "200",
              fontSize: "sm",
            }}
          />
        </InputGroup>
        <Image objectFit="cover" w="2rem" src="/iconPlayEbook.svg" />
      </Flex>
      <Flex gap="5" align="center">
        <Flex gap="5" h="1.5rem">
          <Image src="/flag/unitedKingdom.svg" />
          <Image src="/bellNotification.svg" />
        </Flex>
        <ConnectButton chainStatus="none" />
      </Flex>
    </Flex>
  );
};

interface MenuItem {
  category: string;
  items: string[];
}

export default NavBar;
