import { useState, FC } from "react";
import {
  Button,
  Flex,
  Image,
  Link,
  Modal,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import booksharesData from "/data/bookshares.json";
import Bookshare from "@/types/Bookshare";

import BookshareInfo from "../BookshareInfo/BookshareInfo";
import ModalBuyBookshare from "../ModalBuyBookshare/ModalBuyBookshare";
import BuyBookshareButton from "../UI/BuyBookshareButton";
import PercentBookshareInfo from "../UI/PercentBookshareInfo";

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
    setSelectedBookshare(index);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

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
              <PercentBookshareInfo percentage={bookshare.price.percentage} />

              {!isSelected ? (
                <Link
                  fontSize="sm"
                  textColor="#9EAABD"
                  textAlign="center"
                  textDecoration="underline"
                >
                  Click to view details
                </Link>
              ) : (
                <Flex direction="column" gap="1rem">
                  <BuyBookshareButton
                    onClick={onOpen}
                    amount={bookshare.price.amount}
                  />
                  <Link
                    fontSize="sm"
                    bgGradient="linear(97deg, #00C1FF 0.71%, #3337FF 102.37%)"
                    bgClip="text"
                    _hover={{ textColor: "#fff", textDecoration: "underline" }}
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
      <ModalBuyBookshare
        onOpen={onOpen}
        onClose={onClose}
        isOpen={isOpen}
        selectedBookshare={
          selectedBookshare !== null ? booksharesData[selectedBookshare] : null
        }
      />
    </Flex>
  );
};

export default BooksharesTabContent;
