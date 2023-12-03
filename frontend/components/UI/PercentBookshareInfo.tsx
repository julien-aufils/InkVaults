import { Flex, Image, Text } from "@chakra-ui/react";

interface PercentBookshareInfoProps {
  percentage: number;
}

const PercentBookshareInfo: React.FC<PercentBookshareInfoProps> = ({
  percentage,
}) => {
  return (
    <Flex gap="1rem">
      <Image src="/bookshares/percentBookshare.svg" w="35%" />
      <Flex
        direction="column"
        w="70%"
        justify="center"
        textColor="#1CAEBE"
        fontWeight="700"
      >
        <Text fontSize="3xl" lineHeight="2rem">
          {percentage} %
        </Text>
        <Text fontSize="xs">per shares</Text>
      </Flex>
    </Flex>
  );
};

export default PercentBookshareInfo;
