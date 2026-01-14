import { Box, Divider, Avatar, Stack, Text } from "@chakra-ui/react";
import { ActionButton } from "./Actions";
import useCustomToast from "../hooks/useCustomToast";
import { timeAgo } from "../utils/dateUtils";

const Reply = (props) => {
  const showToast = useCustomToast();

  const postReplyLike = async () => {
    const res = await fetch(
      `/api/posts/replyLike/${props.postId}/${props.replyBy._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await res.json();

    if (data.status === 200) {
      showToast(data.message, "success");
    } else {
      showToast(data.message, "error");
    }
  };

  const postReplyDelete = async () => {
    const userConfirmed = window.confirm("Do you want to delete this reply?");

    if (!userConfirmed) {
      return showToast("Delete cancelled!", "info");
    }

    const res = await fetch(
      `/api/posts/replydelete/${props.postId}/${props.replyBy._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await res.json();

    if (data.status === 200) {
      showToast(data.message, "success");
      window.location.reload(); 
    } else {
      showToast(data.message, "error");
    }
  };

  return (
    <Box w={"full"} mb={[3, 4, 5]}>
      <Stack direction={"row"} spacing={[1, 2, 3]}>
        <Avatar src={props.replyBy.userId.picture} size={["xs", "sm"]} />
        <Box w={"full"}>
          <Stack direction={"column"}>
            <Stack direction={"row"} mt={-1} justifyContent={"space-between"}>
              <Stack direction={"row"} fontSize={[12, 13, 14, 15]}>
                <Text fontWeight={600}>{props.replyBy.userId.username}</Text>
                <Text fontWeight={200} color="text.tertiary">
                  {timeAgo(props.replyBy.postedAt)}
                </Text>
              </Stack>
            </Stack>
            <Text mt={-1} fontSize={[10, 11, 12, 13]}>
              {props.replyBy.text}
            </Text>
            <Stack direction={"row"}>
              <ActionButton
                icon={"heart"}
                onClick={postReplyLike}
              />
              {props.replyBy.userId._id === props.userId ? (
                <ActionButton icon={"trash"} onClick={postReplyDelete} />
              ) : null}
            </Stack>
            <Box ml={-3} mt={-5} fontSize={13}></Box>
          </Stack>
        </Box>
      </Stack>
      <Divider mt={5} />
    </Box>
  );
};

export default Reply;
