import { Button } from "@chakra-ui/react";
import React from "react";

interface BuyBookshareButtonProps {
  onClick?: () => void | undefined;
  amount: number;
}

const BuyBookshareButton: React.FC<BuyBookshareButtonProps> = ({
  onClick,
  amount,
}) => {
  return (
    <Button
      backgroundColor="#1CAEBE"
      textColor="#FFF"
      w="15rem"
      h="3.5rem"
      borderRadius="3rem"
      onClick={onClick}
      _hover={{ bgColor: "#fff", textColor: "#000" }}
    >
      Buy ${amount}
    </Button>
  );
};

export default BuyBookshareButton;
