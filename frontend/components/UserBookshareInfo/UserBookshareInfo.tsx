import { Flex, List, ListItem, Link, Text, Collapse } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Bookshare from "@/types/Bookshare";
import UserBooksharePayOut from "../UserBooksharePayOut/UserBooksharePayOut";

interface UserBookshareInfoProps {
  bookshare: Bookshare;
  isSelected: boolean;
}

const UserBookshareInfo: React.FC<UserBookshareInfoProps> = ({
  bookshare,
  isSelected,
}) => {
  return (
    <List
      display="flex"
      flexDirection="column"
      gap="0.2rem"
      // style={customStyle || undefined}
    >
      <ListItem display="flex" justifyContent="space-between" fontSize="sm">
        <Text fontWeight="600">Number of shares</Text>
        <Text fontWeight="600">{bookshare.nbOfShares}</Text>
      </ListItem>
      <ListItem display="flex" justifyContent="space-between" fontSize="sm">
        <Text fontWeight="600">Last pay-out</Text>
        <Text>
          {bookshare.lastPayOut ? `$${bookshare.lastPayOut}` : "No pay-out yet"}
        </Text>
      </ListItem>
      <ListItem display="flex" justifyContent="space-between" fontSize="sm">
        <Text fontWeight="600">Total pay-out</Text>
        <Text>
          {bookshare.totalPayOut
            ? `$${bookshare.totalPayOut} `
            : "No pay-out yet"}
        </Text>
      </ListItem>
      <ListItem display="flex" justifyContent="space-between" fontSize="sm">
        <Link
          href={`https://mumbai.polygonscan.com/address/${bookshare.bookshareAddr}`}
          textColor="#C4C4C4"
          textDecoration="underline"
          _hover={{ textColor: "#fff" }}
          isExternal
        >
          See contract <ExternalLinkIcon mx="1px" />
        </Link>
      </ListItem>
      {/* <Collapse in={isSelected} animateOpacity>
        <Flex flexDirection="column" gap="0.2rem">
          <UserBooksharePayOut bookshare={bookshare} />
        </Flex>
      </Collapse> */}
    </List>
  );
};

export default UserBookshareInfo;
