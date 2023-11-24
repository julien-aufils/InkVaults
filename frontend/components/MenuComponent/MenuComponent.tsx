"use client";
import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

const MenuComponent: React.FC<MenuProps> = ({ category, items }) => (
  <Menu>
    {({ isOpen }) => (
      <>
        <MenuButton
          as={Button}
          variant="link"
          rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          color="white"
          fontWeight="700"
          _active={{ textColor: "#3D6EFF" }}
          _expanded={{ textColor: "#3D6EFF" }}
        >
          {category}
        </MenuButton>
        <MenuList backgroundColor="#191D24" border="none">
          {items.map((item, index) => (
            <MenuItem
              backgroundColor="transparent"
              textColor="white"
              key={index}
            >
              {item}
            </MenuItem>
          ))}
        </MenuList>
      </>
    )}
  </Menu>
);

interface MenuProps {
  category: string;
  items: string[];
}

export default MenuComponent;
