import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";

import CreatePost from "./CreatePost";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  MenuGroup,
  Button,
  Flex,
  Stack,
  useColorMode,
  Text,
} from "@chakra-ui/react";

import Icon from "./Icon";

const NavButton = ({ icon, onClick }) => {
  return (
    <Button
      w={["auto"]}
      h={["auto"]}
      p={[3, 3.5, 4]}
      bg="glass.bg.light"
      border="2px solid transparent"
      borderRadius="14px"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        bg: "accent.glassHover",
        borderColor: "rgba(105, 105, 105, 0.3)",
        transform: "translateY(-2px)",
        boxShadow: "0 6px 16px rgba(105, 105, 105, 0.3)",
      }}
      _active={{
        transform: "translateY(0)",
        boxShadow: "0 2px 8px rgba(105, 105, 105, 0.2)",
      }}
      onClick={onClick}
    >
      <Icon name={icon} size={[5, 5.5, 8]} color="text.primary" />
    </Button>
  );
};

const HeaderMenu = (props) => {
  const setUser = useSetRecoilState(userAtom);
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Menu>
      <MenuButton>
        <NavButton icon={"bars"} />
      </MenuButton>
      <MenuList
        p={3}
        fontWeight={600}
        border="2px solid"
        borderColor="glass.border.accent"
        borderRadius={20}
        bg="glass.bg"
        boxShadow="0 12px 40px rgba(105, 105, 105, 0.15)"
        minW="220px"
      >
        <MenuGroup title={"Settings"} fontSize="xs" color="text.tertiary">
          <MenuItem
            borderRadius={12}
            bg="glass.bg.light"
            _hover={{
              bg: "accent.glassHover",
            }}

            transition="all 0.2s ease"
          >
            <Button
              flex={1}
              onClick={toggleColorMode}
              bg="transparent"
              _hover={{ bg: "transparent" }}
              justifyContent="flex-start"
              gap={3}
            >
              <Icon name={colorMode === "dark" ? "sun" : "moon"} size={5} />
              <Text flex={1} textAlign="left">
                {colorMode === "dark" ? "Light" : "Dark"} Mode
              </Text>
            </Button>
          </MenuItem>
        </MenuGroup>
        {props.user && (
          <>
            <MenuDivider opacity={0.3} />
            <MenuGroup bg={"unset"}>
              <MenuItem
                borderRadius={12}
                bg="transparent"
                color="red.400"
                _hover={{
                  bg: "rgba(239, 68, 68, 0.15)",
                  color: "red.300",
                }}
                transition="all 0.2s ease"
                onClick={async () => {
                  try {
                    await fetch("/api/users/signout", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                    });
                    setUser(null);
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                <Text ml={3}>Sign Out</Text>
              </MenuItem>
            </MenuGroup>
          </>
        )}
      </MenuList>
    </Menu>
  );
};

const Header = () => {
  const user = useRecoilValue(userAtom);

  if (!user) return null;

  return (
    <Flex
      w={["full", "full", "full", "7vh"]}
      h={["7vh", "7vh", "7vh", "full"]}
      p={3}
      position={"fixed"}
      left={["auto", "auto", "auto", 0]}
      bottom={[0, 0, 0, "auto"]}
      flexDirection={["row", "row", "row", "column"]}
      alignItems={"center"}
      justifyContent={"space-between"}
      zIndex={10}
      backdropFilter="blur(15px)"
    >
      <Link to={null}>
        {user && <CreatePost user={user} isHeader={true} isFixed={true} />}
      </Link>
      <Stack direction={["row", "row", "row", "column"]} spacing={2}>
        <Link to={"/"}>
          <NavButton icon={"home"} />
        </Link>
        <Link to={"/search"}>
          <NavButton icon={"search"} />
        </Link>
        <Link to={`/${user.username}`}>
          <NavButton icon={"profile"} />
        </Link>
      </Stack>
      <Stack>
        <HeaderMenu user={user} />
      </Stack>
    </Flex>
  );
};

export default Header;
