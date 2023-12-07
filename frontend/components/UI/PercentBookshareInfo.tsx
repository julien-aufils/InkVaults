import { Flex, Image, Text } from "@chakra-ui/react";

interface PercentBookshareInfoProps {
  percentage: number;
  nbOfShares: number | undefined;
}

const PercentBookshareInfo: React.FC<PercentBookshareInfoProps> = ({
  percentage,
  nbOfShares,
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
          {nbOfShares ? (percentage * nbOfShares).toFixed(1) : percentage} %
        </Text>
        <Text fontSize="xs">{nbOfShares ? "of shares" : "per shares"}</Text>
      </Flex>
    </Flex>
  );
};

export default PercentBookshareInfo;
