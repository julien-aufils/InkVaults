import { useState, useEffect, FC } from "react";
import { Flex, Image, Link, Text, useDisclosure } from "@chakra-ui/react";
import { readContract } from "wagmi/actions";
import { fetchFromIPFS } from "@/utils/ipfs";
import { formatEther } from "viem";
import { MATIC_TO_USD_RATE } from "@/constants";
import authorsData from "/data/authors.json";

import Bookshare from "@/types/Bookshare";
import Author from "@/types/Author";

import BookshareInfo from "../BookshareInfo/BookshareInfo";
import ModalBuyBookshare from "../ModalBuyBookshare/ModalBuyBookshare";
import BuyBookshareButton from "../UI/BuyBookshareButton";
import PercentBookshareInfo from "../UI/PercentBookshareInfo";

import {
  bookshareFactoryAddress,
  abiBookshareFactory,
  abiBookshare,
} from "@/constants";

const BooksharesTabContent: FC<{
  authorId: number;
  authorAddr: string;
  setTabIndex: Function;
}> = ({ authorId, authorAddr, setTabIndex }) => {
  const [authorBookshares, setAuthorBookshares] = useState<Bookshare[]>([]);

  // Request to BookshareFactory contract : Get all the bookshares addresses of authorId
  const getBooksharesAddr = async () => {
    try {
      const booksharesAddr = await readContract({
        address: bookshareFactoryAddress,
        abi: abiBookshareFactory,
        functionName: "getBookSharesByAuthor",
        args: [authorAddr],
      });
      return booksharesAddr;
    } catch (error) {
      console.log(error);
    }
  };

  // Request to Bookshare contract : Get URI of the bookshares
  const getBookshareURI = async (bookshareAddr: any) => {
    try {
      const bookshareURI = await readContract({
        address: bookshareAddr,
        abi: abiBookshare,
        functionName: "bookshareURI",
      });

      return bookshareURI;
    } catch (error) {
      console.log(error);
    }
  };

  // Request to IPFS : Get Metadata and image of the bookshares
  const getMetadataForBookshares = async (
    bookshareURIs: string[],
    booksharesAddr: string[]
  ) => {
    try {
      const bookshares = await Promise.all(
        bookshareURIs.map(async (uri, index) => {
          const { metadata, imageBookshare } = await fetchFromIPFS(uri);
          return {
            ...metadata,
            imageBookshare,
            bookshareAddr: booksharesAddr[index],
          };
        })
      );
      return bookshares;
    } catch (error) {
      console.error("Error fetching metadata:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksharesAddr: any = await getBooksharesAddr();
        const bookshareURIs = await Promise.all(
          booksharesAddr.map(async (bookshareAddr: string) => {
            return await getBookshareURI(bookshareAddr);
          })
        );

        const bookshares = await getMetadataForBookshares(
          bookshareURIs,
          booksharesAddr
        );
        setAuthorBookshares(bookshares);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [authorId]);

  const selectedAuthor = authorsData.find(
    (author: Author) => author.id === authorId
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
      {authorBookshares?.map((bookshare: Bookshare, index: number) => {
        const isSelected = selectedBookshare === index;
        const booksharePrice = (
          parseFloat(formatEther(bookshare.price?.amount as any)) *
          MATIC_TO_USD_RATE
        ).toFixed(3);
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
                src={URL.createObjectURL(bookshare.imageBookshare)}
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
                    booksharePrice={booksharePrice as any}
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
              <PercentBookshareInfo percentage={bookshare.price?.percentage} />

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
                    amount={booksharePrice as any}
                    isDisabled={false}
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
          selectedBookshare !== null
            ? authorBookshares[selectedBookshare]
            : null
        }
        selectedAuthor={selectedAuthor}
      />
    </Flex>
  );
};

export default BooksharesTabContent;
