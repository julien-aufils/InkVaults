import { useState } from "react";
import { Button, Flex, Image, Link, Text, Collapse } from "@chakra-ui/react";
import booksharesData from "/data/bookshares.json";

import BooksharesItemInfo from "../BooksharesItemInfo/BooksharesItemInfo";

const BooksharesTabContent: React.FC = () => {
  const [selectedBookshare, setSelectedBookshare] = useState<number | null>(
    null
  );

  const handleClick = (index: number) => {
    setSelectedBookshare((prev) => (prev === index ? null : index));
  };

  return (
    <Flex w="100%" direction="column" gap="2rem">
      {booksharesData.map((bookshare: Bookshare, index: number) => (
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
          <Flex direction="column" pt="1rem" gap="3rem" align="flex-end">
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
            {selectedBookshare !== index && (
              <Link
                fontSize="sm"
                textColor="#9EAABD"
                textDecoration="underline"
                textAlign="center"
              >
                Click to view details
              </Link>
            )}
            <Collapse in={selectedBookshare === index} animateOpacity>
              <Flex direction="column" gap="1rem">
                <Button
                  backgroundColor="#1CAEBE"
                  textColor="#FFF"
                  w="15rem"
                  h="3.5rem"
                  borderRadius="3rem"
                >
                  Buy $15
                </Button>
                <Link
                  fontSize="sm"
                  textColor="#00C1FF"
                  textDecoration="underline"
                  textAlign="center"
                >
                  See 12 offers on marketplace
                </Link>
              </Flex>
            </Collapse>
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
