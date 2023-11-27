import React, { ReactNode } from "react";
import { Tab } from "@chakra-ui/react";

const ProfileTabItem: React.FC<ProfileTabItemProps> = ({ children }) => {
  return (
    <Tab
      backgroundColor="#111318"
      borderTopRadius="0.75rem"
      textColor="#DDD"
      fontWeight="600"
      _selected={{ color: "#000", bg: "#FFF" }}
    >
      {children}
    </Tab>
  );
};

interface ProfileTabItemProps {
  children: ReactNode;
}

export default ProfileTabItem;
