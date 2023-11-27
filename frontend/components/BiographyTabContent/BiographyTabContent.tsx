import { Flex, Text } from "@chakra-ui/react";

const BiographyTabContent = ({ authorsData }) => {
  return (
    <Flex
      direction="column"
      backgroundColor="#111318"
      borderRadius="0.75rem"
      px="1.5rem"
      py="1.5rem"
      gap="0.5rem"
    >
      <Text fontWeight="600">Biography</Text>
      <Text fontSize="sm">{authorsData[0].biography}</Text>
    </Flex>
  );
};

export default BiographyTabContent;
