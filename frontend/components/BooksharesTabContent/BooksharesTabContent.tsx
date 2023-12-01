import { useState } from "react";
import { Flex, Image, Link, Text, Collapse } from "@chakra-ui/react";
import booksharesData from "/data/bookshares.json";

import BooksharesItemInfo from "../BooksharesItemInfo/BooksharesItemInfo";

const BooksharesTabContent: React.FC = ({ authorId }) => {
  const authorBookshares = booksharesData.filter(
    (bookshare) => bookshare.authorId === authorId
  );

  const [selectedBookshare, setSelectedBookshare] = useState<number | null>(
    null
  );

  const handleClick = (index: number) => {
    setSelectedBookshare((prev) => (prev === index ? null : index));
  };

  return (
    <Flex w="100%" direction="column" gap="2rem">
      {authorBookshares.map((bookshare: Bookshare, index: number) => (
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
          <Flex gap="1rem" w="40%">
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
                <BooksharesItemInfo
                  label="Total shared"
                  value={bookshare.totalShared}
                />
                <BooksharesItemInfo label="Supply" value={bookshare.supply} />
                <BooksharesItemInfo label="Price" value={bookshare.price} />
                <Collapse in={selectedBookshare === index} animateOpacity>
                  <Flex direction="column" gap="0.6rem">
                    <BooksharesItemInfo
                      label="Release date"
                      value={bookshare.releaseDate}
                    />
                    <BooksharesItemInfo
                      label="Royalties"
                      value={bookshare.royalties}
                    />
                    <BooksharesItemInfo
                      label="Last pay-out date"
                      value={bookshare.lastPayOutDate}
                    />
                    <BooksharesItemInfo
                      label="Last pay-out"
                      value={bookshare.lastPayOut}
                    />
                    <BooksharesItemInfo
                      label="Total pay-out"
                      value={bookshare.totalPayOut}
                    />
                  </Flex>
                </Collapse>
              </Flex>
            </Flex>
          </Flex>
          <Flex direction="column" justify="center" gap="3rem" align="center">
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
                  0.1 %
                </Text>
                <Text fontSize="xs">per shares</Text>
              </Flex>
            </Flex>
            <Link fontSize="sm" textColor="#9EAABD" textDecoration="underline">
              Click to view details
            </Link>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};

interface Bookshare {
  title: string;
  imgSrc: string;
  totalShared: string;
  supply: string;
  price: string;
  releaseDate: string;
  royalties: string;
  lastPayOutDate: string;
  lastPayOut: string;
  totalPayOut: string;
}

export default BooksharesTabContent;
