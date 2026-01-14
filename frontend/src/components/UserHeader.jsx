/* eslint-disable react/prop-types */
import { Avatar, Box, Button, Link, Stack, Text } from "@chakra-ui/react";

import { useState } from "react";
import UserUpdate from "./UserUpdate";
import useCustomToast from "../hooks/useCustomToast";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";

const UserHeader = (props) => {
  const showToast = useCustomToast();
  const setUser = useSetRecoilState(userAtom);
  const [following, setFollowing] = useState(
    props.currentUser.following.includes(props.otherUser._id)
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const userFollowUnfollow = async () => {
    if (isUpdating) return;
    setIsUpdating(true);

    // Optimistic Update
    const wasFollowing = following;
    setFollowing(!wasFollowing);

    try {
      const res = await fetch(
        `/api/users/followUnfollow/${props.otherUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json();

      if (data.status === 200) {
        setUser(data.user); // updates currentUser state
        showToast(data.message, "success");
      } else {
        setFollowing(wasFollowing);
        showToast(data.message, "error");
      }
    } catch (err) {
      setFollowing(wasFollowing);
      showToast(err.message, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Box mt={[3, 4, 5, 6]} mx={[3, 4, 5, 6]} mb={2}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack direction={"column"} spacing={1}>
          <Text fontSize={[18, 20, 24]} fontWeight={800}>
            {props.otherUser.name}
          </Text>
          <Stack direction={"row"} ml={0.5} alignItems={"center"} spacing={2}>
            <Text fontSize={[11, 13, 15]} fontWeight="600" opacity={0.8}>
              {props.otherUser.username}
            </Text>
            <Text
              px={2}
              py={0.5}
              fontSize={[9, 10, 11]}
              color={"white"}
              bgGradient="linear(135deg, #696969ff 0%, #464646ff 100%)"
              borderRadius={12}
              fontWeight="600"
            >
              strings
            </Text>
          </Stack>
        </Stack>

        <Avatar
          size={["lg", "xl"]}
          border="3px solid"
          borderColor="glass.border.accent"
          src={props.otherUser.picture}
          boxShadow="0 4px 12px rgba(105, 105, 105, 0.3)"
        />
      </Stack>
      {props.currentUser._id !== props.otherUser._id && (
        <Button
          size={["sm", "md"]}
          mt={3}
          px={6}
          borderRadius={12}
          bgGradient="linear(135deg, #696969ff 0%, #464646ff 100%)"
          color={"white"}
          fontWeight="700"
          onClick={userFollowUnfollow}
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          _hover={{
            bgGradient: "linear(135deg, #464646ff 0%, #696969ff 100%)",
            transform: "translateY(-2px)",
            boxShadow: "0 6px 16px rgba(70, 70, 70, 0.4)",
          }}
          _active={{
            transform: "translateY(0)",
          }}
        >
          <Text fontSize={[12, 14]}>
            {following ? "Following" : "Follow"}
          </Text>
        </Button>
      )}
      <Text maxW={"85%"} mt={4} fontSize={[11, 13, 15]} lineHeight="1.6" opacity={0.9}>
        {props.otherUser.biography}
      </Text>
      <Stack direction={"row"} spacing={2} mt={2} color="text.secondary">
        <Text fontSize={[11, 13, 15]} fontWeight="600">
          {props.otherUser.followers.length} followers
        </Text>
        {props.link ? (
          <>
            <Text>・</Text>
            <Link to={props.link} color="brand.400" fontWeight="600">{props.link}</Link>
          </>
        ) : null}
      </Stack>
      {props.currentUser._id === props.otherUser._id && <UserUpdate />}
    </Box>
  );
};

export default UserHeader;
