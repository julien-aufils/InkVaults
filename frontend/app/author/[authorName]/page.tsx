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
  Text,
} from "@chakra-ui/react";
import NavBar from "@/components/NavBar/NavBar";
import ProfileTabItem from "@/components/ProfileTabItem/ProfileTabItem";
import BiographyTabContent from "@/components/BiographyTabContent/BiographyTabContent";

const AuthorProfile = () => {
  const tabItems = ["Summary", "Community", "Book Shares", "Market"];

  return (
    <Box as="main" backgroundColor="#080A0C" h="100vh">
      <NavBar />
      <Flex px="4rem" py="1rem" direction="column" gap="2rem">
        <Flex>
          <Image src="/authors/authorBanner.png" />
        </Flex>
        <Flex gap="2rem">
          <Flex
            backgroundColor="#111318"
            borderRadius="0.75rem"
            w="20vw"
            h="25rem"
            justify="center"
          >
            <Image src="/authorWidgetPlaceholder.png" />
          </Flex>
          <Flex w="80vw">
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

              <TabPanels>
                <TabPanel textColor="#FFF" display="flex" px="0" py="1.5rem">
                  <BiographyTabContent authorsData={authorsData} />
                </TabPanel>
                <TabPanel>
                  <p>two!</p>
                </TabPanel>
                <TabPanel>
                  <p>three!</p>
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
