import { ListItem, Text } from "@chakra-ui/react";
import { FC } from "react";
import Bookshare from "@/types/Bookshare";

interface BookshareExtendedInfoProps {
  bookshare: Bookshare;
}

const BookshareExtendedInfo: FC<BookshareExtendedInfoProps> = ({
  bookshare,
}) => {
  return (
    <>
      <ListItem display="flex" justifyContent="space-between" fontSize="sm">
        <Text fontWeight="600">Release date</Text>
        <Text>{bookshare.releaseDate} %</Text>
      </ListItem>
      <ListItem display="flex" justifyContent="space-between" fontSize="sm">
        <Text fontWeight="600">Royalties</Text>
        <Text>{bookshare.royalties}</Text>
      </ListItem>
      <ListItem display="flex" justifyContent="space-between" fontSize="sm">
        <Text fontWeight="600">Last pay-out date</Text>
        <Text>
          {bookshare.lastPayOutDate
            ? bookshare.lastPayOutDate
            : "No pay-out yet"}
        </Text>
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
    </>
  );
};

export default BookshareExtendedInfo;
