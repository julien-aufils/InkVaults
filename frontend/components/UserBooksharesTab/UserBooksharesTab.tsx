import { useEffect, useState } from "react";
import { useContractRead, useAccount } from "wagmi";
import { readContract } from "wagmi/actions";
import { fetchFromIPFS } from "@/utils/ipfs";
import { Flex, Link, Image, Text } from "@chakra-ui/react";
import {
  abiBookshare,
  abiBookshareFactory,
  bookshareFactoryAddress,
} from "@/constants";
import authorsData from "/data/authors.json";
import Author from "@/types/Author";
import Bookshare from "@/types/Bookshare";

import PercentBookshareInfo from "../UI/PercentBookshareInfo";

const UserBooksharesTab = () => {
  const [userBookshares, setUserBookshares] = useState<Bookshare[]>([]);
  const [selectedBookshare, setSelectedBookshare] = useState<number | null>(
    null
  );
  const { address, isConnected } = useAccount();

  const authorsAddresses = authorsData
    .map((author: Author) => author.localAddr)
    .filter((addr) => addr);

  const getBooksharesAddr = async () => {
    try {
      const booksharesAddr = await readContract({
        address: bookshareFactoryAddress,
        abi: abiBookshareFactory,
        functionName: "getAllBookShares",
      });
      return booksharesAddr;
    } catch (error) {
      console.log(error);
    }
  };

  const getNumberOfShares = async (bookshareAddr) => {
    try {
      const sharesNb = await readContract({
        address: bookshareAddr,
        abi: abiBookshare,
        functionName: "balanceOf",
        args: [address],
      });
      return Number(sharesNb);
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
  const fetchData = async () => {
    try {
      const booksharesAddr = await getBooksharesAddr();
      const sharesPromises = booksharesAddr.map(async (addr) => {
        const nbOfShares = await getNumberOfShares(addr);
        if (nbOfShares > 0) {
          const uri = await getBookshareURI(addr);
          return { address: addr, nbOfShares, uri };
        } else {
          return null;
        }
      });

      const sharesResults = await Promise.all(sharesPromises);
      const filteredResults = sharesResults.filter((result) => result !== null);

      const URIs = filteredResults.map((result) => result.uri);
      const Addrs = filteredResults.map((result) => result.address);
      const nbOfShares = filteredResults.map((result) => result.nbOfShares);

      const booksharesMetadata = await getMetadataForBookshares(URIs, Addrs);

      const userBookshares = booksharesMetadata.map((metadata, index) => ({
        ...metadata,
        nbOfShares: nbOfShares[index],
      }));

      setUserBookshares(userBookshares);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClick = (index: number) => {
    setSelectedBookshare(index);
  };

  return (
    <Flex w="100%" direction="column" gap="2rem">
      {userBookshares?.map((bookshare: Bookshare, index: number) => {
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
                src={URL.createObjectURL(bookshare.imageBookshare)}
                w={selectedBookshare === index ? "60%" : "40%"}
                transition="width 0.3s ease-in-out"
              />
              <Flex direction="column" gap="1rem" w="100%">
                <Text fontSize="m" fontWeight="600">
                  {bookshare.title}
                </Text>
                <Flex direction="column" gap="0.6rem"></Flex>
              </Flex>
            </Flex>
            <Flex
              direction="column"
              pt="1rem"
              gap={selectedBookshare !== index ? "3rem" : "5rem"}
              align="flex-end"
            >
              <PercentBookshareInfo
                percentage={bookshare.price?.percentage}
                nbOfShares={
                  bookshare.nbOfShares ? bookshare.nbOfShares : undefined
                }
              />

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
                  <Link
                    fontSize="sm"
                    textColor="#9EAABD"
                    textAlign="center"
                    textDecoration="underline"
                  >
                    Make a sell offer
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

export default UserBooksharesTab;
