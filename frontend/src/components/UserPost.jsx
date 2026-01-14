/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { Avatar, Box, Divider, Image, Stack, Text } from "@chakra-ui/react";

import Actions from "./Actions";

import { timeAgo } from "../utils/dateUtils";

const UserPost = (props) => {
  return (
    <Box
      w={"full"}
      mt={[3, 4, 5]}
      p={4}
      borderRadius="16px"
      bg="glass.bg.light"
      border="1px solid"
      borderColor="glass.border.light"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        bg: "glass.bg.medium",
        borderColor: "glass.border.accent",
        transform: "translateY(-2px)",
        boxShadow: "0 8px 20px rgba(102, 126, 234, 0.2)",
      }}
    >
      <Stack direction={"row"} spacing={[2, 3, 4]}>
        <Avatar
          src={props.post.postedBy.picture}
          size={["sm", "md"]}
          border="2px solid"
          borderColor="glass.border.accent"
        />
        <Box w={"full"}>
          <Stack direction={"column"} mt={-1}>
            <Link
              to={`/${props.post.postedBy.username}/post/${props.post._id}`}
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Stack direction={"row"} fontSize={[12, 13, 14, 15]} spacing={2}>
                  <Text fontWeight={700}>{props.post.postedBy.username}</Text>
                  <Text fontWeight={400} color="text.secondary">
                    {timeAgo(props.post.postedAt)}
                  </Text>
                </Stack>
              </Stack>
              <Box fontSize={13} mt={2}>
                <Text fontSize={[11, 12, 13, 14]} lineHeight="1.6">{props.post.text}</Text>
                {props.post.image ? (
                  <Image
                    src={props.post.image}
                    maxH={[240, 280, 320]}
                    mt={3}
                    objectFit={"cover"}
                    border="2px solid"
                    borderColor="glass.border.accent"
                    borderRadius={14}
                    transition="all 0.3s ease"
                    _hover={{
                      borderColor: "rgba(102, 126, 234, 0.5)",
                      transform: "scale(1.01)",
                    }}
                  />
                ) : null}
              </Box>
            </Link>
            <Actions userId={props.userId} post={props.post} />
          </Stack>
        </Box>
      </Stack>
      <Divider mt={3} opacity={0.2} />
    </Box>
  );
};

export default UserPost;
