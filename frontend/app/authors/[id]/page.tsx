"use client";

import { FC, useState } from "react";
import {
  Flex,
  Image,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Text,
} from "@chakra-ui/react";
import ProfileTabItem from "@/components/ProfileTabItem/ProfileTabItem";
import BiographyTabContent from "@/components/BiographyTabContent/BiographyTabContent";
import BooksharesTabContent from "@/components/BooksharesTabContent/BooksharesTabContent";
import authorsData from "/data/authors.json";
import Author from "@/types/Author";

const AuthorProfile: FC<AuthorProfileProps> = ({ params }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  const selectedAuthor: Author | undefined = authorsData.find(
    (author: Author) => author.id === parseInt(params.id)
  );

  if (!selectedAuthor) {
    return (
      <Text p="1rem" textColor="#fff">
        Author not found
      </Text>
    );
  }
  const tabItems = ["Summary", "Community", "Book Shares", "Market"];

  return (
    <>
      <Flex justify="center">
        <Image src={selectedAuthor.bannerUrl} />
      </Flex>
      <Flex gap="2rem" direction={{ base: "column", md: "row" }}>
        <Flex
          backgroundColor="#111318"
          borderRadius="0.75rem"
          w={{ base: "100%", md: "22vw" }}
          h="32rem"
          justify="center"
        >
          <Image src={selectedAuthor.widgetUrl} objectFit="contain" w="100%" />
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
              {/* SUMMARY */}
              <TabPanel display="flex" px="0" py="1.5rem">
                <BiographyTabContent selectedAuthor={selectedAuthor} />
              </TabPanel>

              {/* COMMUNITY */}
              <TabPanel>
                <p>Todo</p>
              </TabPanel>

              {/* BOOK SHARES */}
              <TabPanel display="flex" px="0" py="1.5rem">
                <BooksharesTabContent
                  authorId={selectedAuthor.id}
                  setTabIndex={setTabIndex}
                />
              </TabPanel>

              {/* MARKET */}
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

interface AuthorProfileProps {
  params: {
    id: string;
  };
}

export default AuthorProfile;
