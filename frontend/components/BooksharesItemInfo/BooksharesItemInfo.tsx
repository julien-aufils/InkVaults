import { Flex, Text } from "@chakra-ui/react";

const BooksharesItemInfo = ({ label, value }) => {
  return (
    <Flex fontSize="xs" justify="space-between">
      <Text fontWeight="600">{label}</Text>
      <Text>{value}</Text>
    </Flex>
  );
};

export default BooksharesItemInfo;
