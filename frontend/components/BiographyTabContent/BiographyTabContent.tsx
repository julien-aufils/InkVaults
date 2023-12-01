import { Flex, Text } from "@chakra-ui/react";
import Author from "@/types/Author";

interface BiographyTabContentProps {
  selectedAuthor: Author;
}

const BiographyTabContent: React.FC<BiographyTabContentProps> = ({
  selectedAuthor,
}) => {
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
      <Text fontSize="sm">{selectedAuthor.biography}</Text>
    </Flex>
  );
};

export default BiographyTabContent;
