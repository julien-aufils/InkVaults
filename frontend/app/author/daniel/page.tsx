"use client";
import authorsData from "/data/authors.json";

import {
  Box,
  Flex,
  Image,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import ProfileTabItem from "@/components/ProfileTabItem/ProfileTabItem";
import BiographyTabContent from "@/components/BiographyTabContent/BiographyTabContent";
import BooksharesTabContent from "@/components/BooksharesTabContent/BooksharesTabContent";

const AuthorProfile = () => {
  const tabItems = ["Summary", "Community", "Book Shares", "Market"];

  return (
    <Box as="main">
      <Flex
        px={{ base: "1rem", md: "4rem" }}
        py="1rem"
        direction="column"
        gap="2rem"
      >
        <Flex justify="center">
          <Image src="/authors/authorBanner.png" />
        </Flex>
        <Flex gap="2rem" direction={{ base: "column", md: "row" }}>
          <Flex
            backgroundColor="#111318"
            borderRadius="0.75rem"
            w={{ base: "100%", md: "22vw" }}
            h="32rem"
            justify="center"
          >
            <Image
              src="/authorWidgetPlaceholder.png"
              objectFit="contain"
              w="100%"
            />
          </Flex>
          <Flex w={{ base: "100vw", md: "78vw" }}>
            <Tabs as="nav" w="100%" variant="unstyled" defaultIndex={0}>
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
                {/* SUMMARY */}
                <TabPanel display="flex" px="0" py="1.5rem">
                  <BiographyTabContent authorsData={authorsData} />
                </TabPanel>

                {/* COMMUNITY */}
                <TabPanel>
                  <p>Todo</p>
                </TabPanel>

                {/* BOOK SHARES */}
                <TabPanel display="flex" px="0" py="1.5rem">
                  <BooksharesTabContent />
                </TabPanel>

                {/* MARKET */}
                <TabPanel>
                  <p>Todo</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default AuthorProfile;
