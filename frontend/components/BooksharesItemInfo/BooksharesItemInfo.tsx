import { Flex, Text } from "@chakra-ui/react";

const BooksharesItemInfo: React.FC<BooksharesItemInfoProps> = ({
  label,
  value,
}) => {
  return (
    <Flex fontSize="xs" justify="space-between">
      <Text fontWeight="600">{label}</Text>
      <Text>{value}</Text>
    </Flex>
  );
};

interface BooksharesItemInfoProps {
  label: string;
  value: string;
}

export default BooksharesItemInfo;
