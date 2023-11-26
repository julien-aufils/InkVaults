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
import NavBar from "@/components/NavBar/NavBar";
import ProfileTabItem from "@/components/ProfileTabItem/ProfileTabItem";
import BiographyTabContent from "@/components/BiographyTabContent/BiographyTabContent";
import BooksharesTabContent from "@/components/BooksharesTabContent/BooksharesTabContent";

const AuthorProfile = () => {
  const tabItems = ["Summary", "Community", "Book Shares", "Market"];

  return (
    <Box as="main" backgroundColor="#080A0C" minHeight="100vh">
      <NavBar />
      <Flex px="4rem" py="1rem" direction="column" gap="2rem">
        <Flex>
          <Image src="/authors/authorBanner.png" />
        </Flex>
        <Flex gap="2rem">
          <Flex
            backgroundColor="#111318"
            borderRadius="0.75rem"
            w="25vw"
            h="32rem"
            justify="center"
          >
            <Image
              src="/authorWidgetPlaceholder.png"
              objectFit="cover"
              w="100%"
            />
          </Flex>
          <Flex w="75vw">
            <Tabs as="nav" w="100%" variant="unstyled" defaultIndex={0}>
              <TabList
                gap="2rem"
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
