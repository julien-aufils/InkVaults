// ModalBuyBookshare.jsx
import {
  Box,
  Link,
  Flex,
  IconButton,
  Image,
  Input,
  Heading,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { FC, useState, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
import { Player } from "@lottiefiles/react-lottie-player";
import { abiBookshare, MARKET_FEE_PERCENTAGE } from "@/constants";
import BookshareInfo from "../BookshareInfo/BookshareInfo";
import Bookshare from "@/types/Bookshare";
import Author from "@/types/Author";

import PercentBookshareInfo from "../UI/PercentBookshareInfo";
import BuyBookshareButton from "../UI/BuyBookshareButton";
import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "wagmi/actions";

interface ModalBuyBookshareProps {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
  selectedBookshare: Bookshare | null;
  selectedAuthor: Author;
}

const ModalBuyBookshare: FC<ModalBuyBookshareProps> = ({
  onOpen,
  onClose,
  isOpen,
  selectedBookshare,
  selectedAuthor,
}) => {
  const [booksharesNbToBuy, setBooksharesNbToBuy] = useState(1);
  const [marketFee, setMarketFee] = useState<bigint>(0n);
  const [totalAmount, setTotalAmount] = useState<bigint>(0n);
  const [formattedTotalAmount, setFormattedTotalAmount] = useState("");
  const [userBalance, setUserBalance] = useState(0n);
  const [userBalanceFormatted, setUserBalanceFormatted] = useState(0);
  const [isBalanceOk, setIsBalanceOk] = useState(false);

  type TransactionState = "idle" | "pending" | "success" | "error";
  const [transactionState, setTransactionState] =
    useState<TransactionState>("idle");
  const [transactionHash, setTransactionHash] = useState("");

  const { address, isConnected } = useAccount();

  const { data } = useBalance({
    address: address,
    watch: true,
  });

  const calculateTransactionCosts = (
    quantity: bigint,
    pricePerShare: bigint,
    marketFeePercentage: bigint
  ) => {
    const pricePerShareBigInt = BigInt(pricePerShare);
    const marketFeePercentageBigInt = BigInt(marketFeePercentage);

    const marketFee =
      (BigInt(quantity) * pricePerShareBigInt * marketFeePercentageBigInt) /
      10000n;
    const totalCost = BigInt(quantity) * pricePerShareBigInt + marketFee;

    return { totalCost, marketFee };
  };

  const fetchData = () => {
    try {
      if (selectedBookshare?.price?.amount) {
        const priceAmountBigInt = BigInt(selectedBookshare.price.amount);
        const { totalCost, marketFee } = calculateTransactionCosts(
          BigInt(booksharesNbToBuy),
          priceAmountBigInt,
          MARKET_FEE_PERCENTAGE
        );

        setTotalAmount(totalCost);
        setFormattedTotalAmount(
          parseFloat(formatEther(totalCost)).toFixed(3) as any
        );
        setMarketFee(marketFee);

        if (isConnected) {
          if (userBalance !== null) {
            checkBalance(userBalance, totalCost);
          } else {
            console.log("User balance is not available.");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetTransactionState = () => {
    setTransactionState("idle");
    setTransactionHash("");
  };

  useEffect(() => {
    fetchData();
  }, [selectedBookshare, booksharesNbToBuy, isConnected, userBalance]);

  useEffect(() => {
    if (isConnected) {
      if (data?.value !== undefined) {
        setUserBalance(BigInt(data.value));
      }
      setUserBalanceFormatted(
        parseFloat(data?.formatted || "0").toFixed(3) as any
      );
    }
  }, [data, isConnected]);

  useEffect(() => {
    if (!isOpen) {
      resetTransactionState();
    }
  }, [isOpen]);

  const checkBalance = (userBalance: bigint, totalAmount: bigint) => {
    if (userBalance !== null && totalAmount < userBalance) {
      setIsBalanceOk(true);
    } else {
      setIsBalanceOk(false);
    }
  };

  const handleIncrement = () => {
    if (booksharesNbToBuy < 999) {
      setBooksharesNbToBuy((prevCount) => prevCount + 1);
    }
  };

  const handleDecrement = () => {
    if (booksharesNbToBuy > 1) {
      setBooksharesNbToBuy((prevCount) => prevCount - 1);
    }
  };

  const handleInputChange = (value: number) => {
    if (value >= 0 && value < 999) {
      setBooksharesNbToBuy(value);
    }
  };

  const buyBookshare = async () => {
    try {
      const { request } = await prepareWriteContract({
        // @ts-ignore
        address: selectedBookshare?.bookshareAddr,
        abi: abiBookshare,
        functionName: "buyShares",
        value: totalAmount,
        args: [booksharesNbToBuy],
      });
      const { hash } = await writeContract(request);
      setTransactionState("pending");
      setTransactionHash(hash);
      await waitForTransaction({ hash: hash });
      setTransactionState("success");
    } catch (err: any) {
      setTransactionState("error");
      console.log(err.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered>
      <ModalOverlay />

      <ModalContent
        backgroundColor="#191D24"
        textColor="#FFF"
        p="1rem"
        gap="1rem"
        borderRadius="1.25rem"
      >
        {selectedBookshare !== null && (
          <>
            <ModalHeader
              display="flex"
              p="1rem"
              gap="2rem"
              borderBottom="1px"
              borderColor="rgba(255, 255, 255, 0.5)"
            >
              <Image
                objectFit="contain"
                src={URL.createObjectURL(selectedBookshare.imageBookshare)}
              />
              <Flex direction="column" justify="center" gap="1rem">
                <Heading fontWeight="700" size="lg">
                  {selectedBookshare.title}
                </Heading>
                <Heading size="Lg" fontWeight="400" textColor="#A6A6A6">
                  {selectedAuthor.name}
                </Heading>
              </Flex>
            </ModalHeader>
            {transactionState === "idle" && (
              <>
                <ModalBody
                  p="0 1rem"
                  display="flex"
                  flexDirection="column"
                  gap="2rem"
                  alignItems="center"
                >
                  <Text fontSize="sm">
                    Become a partner, by owning a Book Share and its
                    proportional share of rights,{" "}
                    <strong>earn royalties</strong> based on the commercial
                    performance.
                  </Text>
                  <Flex justify="center" gap="4rem">
                    <PercentBookshareInfo
                      percentage={selectedBookshare.price.percentage}
                    />
                    <Flex align="center" gap="1rem">
                      <IconButton
                        aria-label="Search database"
                        icon={<MinusIcon />}
                        color="#fff"
                        bgColor="#1CAEBE66"
                        isRound={true}
                        size="xs"
                        onClick={handleDecrement}
                      />

                      <Input
                        variant="unstyled"
                        type="number"
                        min="1"
                        value={booksharesNbToBuy}
                        onChange={(e) =>
                          handleInputChange(parseInt(e.target.value, 10))
                        }
                        fontWeight="700"
                        fontSize="3xl"
                        w="3.8rem"
                        textAlign="center"
                      />
                      <IconButton
                        aria-label="Search database"
                        icon={<AddIcon />}
                        color="#fff"
                        bgColor="#1CAEBE66"
                        isRound={true}
                        size="xs"
                        onClick={handleIncrement}
                      />
                    </Flex>
                  </Flex>
                  <BookshareInfo
                    bookshare={selectedBookshare}
                    booksharePrice={parseFloat(
                      formatEther(selectedBookshare.price?.amount as any)
                    )}
                    isSelected={true}
                    customStyle={{ width: "80%" }}
                  />
                  <Box
                    border="1px"
                    borderColor={!isBalanceOk ? "#FF7063" : "#1CAEBE"}
                    borderRadius="0.75rem"
                    p="0.5rem"
                    display="flex"
                    gap="0.5rem"
                    alignSelf="stretch"
                  >
                    <Text
                      as="strong"
                      color={isConnected && !isBalanceOk ? "red" : undefined}
                    >
                      Your wallet balance:
                    </Text>
                    {isConnected ? (
                      <Text
                        color={
                          isConnected && !isBalanceOk ? "#FF7063" : undefined
                        }
                      >
                        {userBalanceFormatted !== null
                          ? `${userBalanceFormatted} MATIC`
                          : "Loading..."}
                      </Text>
                    ) : (
                      <Link>Please connect your wallet.</Link>
                    )}
                  </Box>
                </ModalBody>
                <ModalFooter
                  display="flex"
                  flexDirection="column"
                  gap="1rem"
                  p="1rem"
                >
                  <BuyBookshareButton
                    amount={formattedTotalAmount}
                    onClick={buyBookshare}
                    isDisabled={!isBalanceOk || !isConnected}
                  />
                  <Link
                    variant="link"
                    bgGradient="linear(97deg, #00C1FF 0.71%, #3337FF 102.37%)"
                    bgClip="text"
                    _hover={{ textColor: "#fff", textDecoration: "underline" }}
                    mr={3}
                    onClick={onClose}
                  >
                    Close
                  </Link>
                </ModalFooter>
              </>
            )}
            {transactionState === "pending" && (
              <>
                <ModalBody
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Player
                    src="/transactionPending.json"
                    className="player"
                    loop
                    autoplay
                    style={{ width: "15rem" }}
                  />
                  <Heading textColor="#1CAEBE" fontWeight="700">
                    Transaction pending
                  </Heading>
                  <Link
                    href={`https://mumbai.polygonscan.com/tx/${transactionHash}`}
                    textColor="#C4C4C4"
                    textDecoration="underline"
                    _hover={{ textColor: "#fff" }}
                    isExternal
                  >
                    View on explorer <ExternalLinkIcon mx="1px" />
                  </Link>
                </ModalBody>
                <ModalFooter display="flex" justifyContent="center">
                  <Link
                    variant="link"
                    bgGradient="linear(97deg, #00C1FF 0.71%, #3337FF 102.37%)"
                    bgClip="text"
                    _hover={{ textColor: "#fff", textDecoration: "underline" }}
                    mr={3}
                    onClick={onClose}
                  >
                    Close
                  </Link>
                </ModalFooter>
              </>
            )}
            {transactionState === "success" && (
              <>
                <ModalBody
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Player
                    src="/transactionSuccess.json"
                    className="player"
                    loop
                    autoplay
                    style={{ width: "15rem" }}
                  />
                  <Heading textColor="#1CAEBE" fontWeight="700">
                    Transaction success
                  </Heading>
                  <Link
                    href={`https://mumbai.polygonscan.com/tx/${transactionHash}`}
                    textColor="#C4C4C4"
                    textDecoration="underline"
                    _hover={{ textColor: "#fff" }}
                    isExternal
                  >
                    View on explorer <ExternalLinkIcon mx="1px" />
                  </Link>
                </ModalBody>
                <ModalFooter display="flex" justifyContent="center">
                  <Link
                    variant="link"
                    bgGradient="linear(97deg, #00C1FF 0.71%, #3337FF 102.37%)"
                    bgClip="text"
                    _hover={{ textColor: "#fff", textDecoration: "underline" }}
                    mr={3}
                    onClick={onClose}
                  >
                    Close
                  </Link>
                </ModalFooter>
              </>
            )}
            {transactionState === "error" && (
              <>
                <ModalBody
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Player
                    src="/transactionError.json"
                    className="player"
                    loop
                    autoplay
                    style={{ width: "15rem" }}
                  />
                  <Heading textColor="#FF7063" fontWeight="700">
                    Transaction error
                  </Heading>
                </ModalBody>
                <ModalFooter display="flex" justifyContent="center">
                  <Link
                    variant="link"
                    bgGradient="linear(97deg, #00C1FF 0.71%, #3337FF 102.37%)"
                    bgClip="text"
                    _hover={{ textColor: "#fff", textDecoration: "underline" }}
                    mr={3}
                    onClick={onClose}
                  >
                    Close
                  </Link>
                </ModalFooter>
              </>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalBuyBookshare;
