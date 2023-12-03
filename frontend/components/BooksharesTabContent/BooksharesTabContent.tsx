import { useState, FC } from "react";
import { Button, Flex, Image, Link, Text } from "@chakra-ui/react";
import booksharesData from "/data/bookshares.json";
import Bookshare from "@/types/Bookshare";

import BookshareInfo from "../BookshareInfo/BookshareInfo";

const BooksharesTabContent: FC<{
  authorId: number;
  setTabIndex: Function;
}> = ({ authorId, setTabIndex }) => {
  const authorBookshares = booksharesData.filter(
    (bookshare: Bookshare) => bookshare.authorId === authorId
  );

  const [selectedBookshare, setSelectedBookshare] = useState<number | null>(
    null
  );

  const handleClick = (index: number) => {
    setSelectedBookshare((prev) => (prev === index ? null : index));
  };

  return (
    <Flex w="100%" direction="column" gap="2rem">
      {authorBookshares.map((bookshare: Bookshare, index: number) => {
        const isSelected = selectedBookshare === index;
        return (
          <Flex
            backgroundColor="#111318"
            borderRadius="0.75rem"
            px="2rem"
            py="1.5rem"
            gap="1rem"
            justify="space-between"
            w="100%"
            key={index}
            onClick={() => handleClick(index)}
            cursor="pointer"
          >
            <Flex gap="1rem" w="50%">
              <Image
                objectFit="contain"
                src={bookshare.imgSrc}
                w={selectedBookshare === index ? "60%" : "40%"}
                transition="width 0.3s ease-in-out"
              />
              <Flex direction="column" gap="1rem" w="100%">
                <Text fontSize="m" fontWeight="600">
                  {bookshare.title}
                </Text>
                <Flex direction="column" gap="0.6rem">
                  <BookshareInfo
                    bookshare={bookshare}
                    isSelected={isSelected}
                  />
                </Flex>
              </Flex>
            </Flex>
            <Flex
              direction="column"
              pt="1rem"
              gap={selectedBookshare !== index ? "3rem" : "5rem"}
              align="flex-end"
            >
              <Flex gap="1rem">
                <Image src="/bookshares/percentBookshare.svg" w="35%" />
                <Flex
                  direction="column"
                  w="70%"
                  justify="center"
                  textColor="#1CAEBE"
                  fontWeight="700"
                >
                  <Text fontSize="3xl" lineHeight="2rem">
                    {bookshare.price.percentage} %
                  </Text>
                  <Text fontSize="xs">per shares</Text>
                </Flex>
              </Flex>
              {!isSelected ? (
                <Link
                  fontSize="sm"
                  textColor="#9EAABD"
                  textDecoration="underline"
                  textAlign="center"
                >
                  Click to view details
                </Link>
              ) : (
                <Flex direction="column" gap="1rem">
                  <Button
                    backgroundColor="#1CAEBE"
                    textColor="#FFF"
                    w="15rem"
                    h="3.5rem"
                    borderRadius="3rem"
                  >
                    Buy ${bookshare.price.amount}
                  </Button>
                  <Link
                    fontSize="sm"
                    textColor="#00C1FF"
                    textDecoration="underline"
                    textAlign="center"
                    onClick={() => {
                      setTabIndex(3);
                    }}
                  >
                    See 12 offers on marketplace
                  </Link>
                </Flex>
              )}
            </Flex>
          </Flex>
        );
      })}
    </Flex>
  );
};

export default BooksharesTabContent;
