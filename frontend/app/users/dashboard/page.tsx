"use client";

import { useState } from "react";
import { useAccount, useBalance } from "wagmi";
import {
  Text,
  Flex,
  Image,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import ProfileTabItem from "@/components/ProfileTabItem/ProfileTabItem";
import UserBooksharesTab from "@/components/UserBooksharesTab/UserBooksharesTab";

const userProfile = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const tabItems = ["Book Shares", "Community feed"];

  const { address, isConnected } = useAccount();

  const { data } = useBalance({
    address: address,
    watch: true,
  });

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  if (!isConnected) {
    return (
      <Text p="1rem" textColor="#fff">
        Please connect your wallet to see your profile.
      </Text>
    );
  }

  return (
    <>
      <Flex justify="center">
        <Image src="/banners/userBanner.png" />
      </Flex>
      <Flex gap="2rem" direction={{ base: "column", md: "row" }}>
        <Flex
          backgroundColor="#111318"
          borderRadius="0.75rem"
          w={{ base: "100%", md: "22vw" }}
          h="32rem"
          justify="center"
        >
          <Image src="/widgets/userWidget.png" objectFit="contain" w="100%" />
        </Flex>
        <Flex w={{ base: "100vw", md: "78vw" }}>
          <Tabs
            as="nav"
            w="100%"
            variant="unstyled"
            index={tabIndex}
            onChange={handleTabsChange}
          >
            <TabList
              gap={{ base: "0.5rem", md: "2rem" }}
              borderBottom="1px"
              borderColor="rgba(255, 255, 255, 0.5)"
            >
              {tabItems.map((item, index) => (
                <ProfileTabItem key={index}>{item}</ProfileTabItem>
              ))}
            </TabList>

            <TabPanels textColor="#FFF">
              {/* BOOK SHARES */}
              <TabPanel display="flex" px="0" py="1.5rem">
                <UserBooksharesTab />
              </TabPanel>

              {/* COMMUNITY  FEED*/}
              <TabPanel>
                <p>Todo</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Flex>
    </>
  );
};

export default userProfile;
