import React from "react";
import { Collapse, Flex, List, ListItem, Text } from "@chakra-ui/react";
import { formatEther } from "viem";
import BookshareExtendedInfo from "../BookshareExtendedInfo/BookshareExtendedInfo";
import Bookshare from "@/types/Bookshare";

interface BookshareInfoProps {
  bookshare: Bookshare;
  booksharePrice: Number;
  isSelected: boolean;
  customStyle?: React.CSSProperties | null;
}

const BookshareInfo: React.FC<BookshareInfoProps> = ({
  bookshare,
  booksharePrice,
  isSelected,
  customStyle,
}) => {
  return (
    <>
      <List
        display="flex"
        flexDirection="column"
        gap="0.2rem"
        style={customStyle || undefined}
      >
        <ListItem display="flex" justifyContent="space-between" fontSize="sm">
          <Text fontWeight="600">Total shared</Text>
          <Text fontWeight="600">{bookshare.totalSharedPercentage} %</Text>
        </ListItem>
        <ListItem display="flex" justifyContent="space-between" fontSize="sm">
          <Text fontWeight="600">Supply</Text>
          <Flex gap="0.2rem" align="center">
            <Text fontWeight="600">{bookshare.supply.available}</Text>
            <Text fontSize="xs">/</Text>
            <Text fontSize="xs">{bookshare.supply.total}</Text>
          </Flex>
        </ListItem>
        <ListItem display="flex" justifyContent="space-between" fontSize="sm">
          <Text fontWeight="600">Price</Text>
          <Flex gap="0.2rem" align="center">
            <Text fontWeight="600">{booksharePrice as any} MATIC</Text>
            <Text fontSize="xs">for</Text>
            <Text fontSize="xs">{bookshare.price.percentage} %</Text>
          </Flex>
        </ListItem>
        <Collapse in={isSelected} animateOpacity>
          <Flex flexDirection="column" gap="0.2rem">
            <BookshareExtendedInfo bookshare={bookshare} />
          </Flex>
        </Collapse>
      </List>
    </>
  );
};

export default BookshareInfo;
