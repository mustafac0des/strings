import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";

import Icon from "./Icon";

const FeedMenu = ({ feedType, setFeedType }) => {
  const getTitle = () => {
    switch (feedType) {
      case "forYou":
        return "For You";
      case "following":
        return "Following";
      case "liked":
        return "Liked";
      case "saved":
        return "Saved";
      default:
        return "For You";
    }
  };

  return (
    <Stack my={[3, 4]} direction={"horizontal"} alignItems={"center"} gap={3}>
      <Text fontSize={[14, 15, 17]} fontWeight={700} bgGradient="linear(to-r, #696969ff, #A0A0A0)" _dark={{ bgGradient: "linear(to-r, #FFFFFF, #A0A0A0)" }} bgClip="text" style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        {getTitle()}
      </Text>
      <Menu>
        <MenuButton
          as={Button}
          w={8}
          h={8}
          minW={8}
          size={"sm"}
          p={0}
          border="2px solid"
          borderColor="glass.border.accent"
          bg="glass.bg.light"
          borderRadius={"full"}
          transition="all 0.3s ease"
          _hover={{
            borderColor: "glass.border.accent",
            bg: "accent.glassHover",
          }}
          _active={{
            transform: "scale(0.95)",
          }}
        >
          <Icon name={"arrow"} size={4} />
        </MenuButton>
        <MenuList
          fontSize={[13, 14, 15]}
          fontWeight={600}
          border="2px solid"
          borderColor="glass.border.accent"
          borderRadius={16}
          bg="glass.bg"
          backdropFilter="blur(20px)"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.5)"
          p={2}
        >
          <MenuItem
            bg={"transparent"}
            borderRadius={8}
            _hover={{
              bg: "accent.glassHover",
            }}
            onClick={() => setFeedType("forYou")}
          >
            For You
          </MenuItem>
          <MenuItem
            bg={"transparent"}
            borderRadius={8}
            _hover={{
              bg: "accent.glassHover",
            }}
            onClick={() => setFeedType("following")}
          >
            Following
          </MenuItem>
          <MenuItem
            bg={"transparent"}
            borderRadius={8}
            _hover={{
              bg: "accent.glassHover",
            }}
            onClick={() => setFeedType("liked")}
          >
            Liked
          </MenuItem>
          <MenuItem
            bg={"transparent"}
            borderRadius={8}
            _hover={{
              bg: "accent.glassHover",
            }}
            onClick={() => setFeedType("saved")}
          >
            Saved
          </MenuItem>
        </MenuList>
      </Menu>
    </Stack>
  );
};

export default FeedMenu;
