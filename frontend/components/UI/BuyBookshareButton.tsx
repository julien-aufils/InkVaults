import { Button } from "@chakra-ui/react";
import React from "react";

interface BuyBookshareButtonProps {
  onClick?: () => Promise<void> | void;
  amount: string;
  isDisabled: boolean | undefined;
}

const BuyBookshareButton: React.FC<BuyBookshareButtonProps> = ({
  onClick,
  amount,
  isDisabled,
}) => {
  return (
    <Button
      backgroundColor="#1CAEBE"
      textColor="#FFF"
      w="15rem"
      h="3.5rem"
      borderRadius="3rem"
      onClick={onClick}
      isDisabled={isDisabled}
      _hover={{ bgColor: "#fff", textColor: "#000" }}
    >
      Buy for {amount} MATIC
    </Button>
  );
};

export default BuyBookshareButton;
