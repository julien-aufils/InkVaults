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
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { FC, useState } from "react";
import BookshareInfo from "../BookshareInfo/BookshareInfo";
import Bookshare from "@/types/Bookshare";
import Author from "@/types/Author";

import PercentBookshareInfo from "../UI/PercentBookshareInfo";
import BuyBookshareButton from "../UI/BuyBookshareButton";

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
            <ModalBody
              p="0 1rem"
              display="flex"
              flexDirection="column"
              gap="2rem"
              alignItems="center"
            >
              <Text fontSize="sm">
                Become a partner, by owning a Book Share and its proportional
                share of rights, <strong>earn royalties</strong> based on the
                commercial performance.
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
                isSelected={true}
                customStyle={{ width: "80%" }}
              />
              <Box
                border="1px"
                borderColor="#1CAEBE"
                borderRadius="0.75rem"
                p="0.5rem"
                display="flex"
                gap="0.5rem"
                alignSelf="stretch"
              >
                <Text as="strong">Your wallet balance:</Text>
                <Text>$456</Text>
              </Box>
            </ModalBody>
            <ModalFooter
              display="flex"
              flexDirection="column"
              gap="1rem"
              p="1rem"
            >
              <BuyBookshareButton
                amount={selectedBookshare.price.amount}
                onClick={undefined}
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
      </ModalContent>
    </Modal>
  );
};

export default ModalBuyBookshare;
