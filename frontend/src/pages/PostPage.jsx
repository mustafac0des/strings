import {
  Avatar,
  Box,
  Center,
  Divider,
  Container,
  Image,
  Flex,
  Stack,
  Text,
  Input,
  Button,
  Spinner,
} from "@chakra-ui/react";

import Actions from "../components/Actions";
import Reply from "../components/Reply";
import AnimatedBackground from "../components/AnimatedBackground";
import { timeAgo } from "../utils/dateUtils";

import { useState, useEffect } from "react";
import useCustomToast from "../hooks/useCustomToast";

const PostPage = (props) => {
  const [postData, setPostData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState("");
  const showToast = useCustomToast();

  const postId = window.location.pathname.split("/").pop();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      setIsLoading(false);
      setPostData(data);
    };

    fetchPost();
  }, [postId]);

  const postReply = async () => {
    if (text === "") {
      return showToast("Write something!", "info");
    }
    const res = await fetch(`/api/posts/reply/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();

    if (data.status === 200) {
      showToast(data.message, "success");
      setText("");
      window.location.reload();
    } else {
      showToast(data.message, "error");
    }
  };

  if (isLoading) {
    return (
      <>
        <AnimatedBackground />
        <Center h="100vh" flexDirection="column" gap={4}>
          <Spinner
            size="xl"
            thickness="4px"
            speed="0.65s"
            color="accent.gray"
          />
          <Box color="text.secondary" fontWeight="600">
            Loading post...
          </Box>
        </Center>
      </>
    );
  }

  return (
    <>
      <AnimatedBackground />
      <Flex alignItems={"center"} flexDirection={"column"}>
        <Container
          minW={[320, 480, 576, 720]}
          minH={"102vh"}
          my={[2, 3]}
          px={[3, 4, 5]}
          borderRadius={[15, 17, 25]}
          border="2px solid"
          borderColor="glass.border.accent"
          bg="glass.bg"
          backdropFilter="blur(10px)"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
          position="relative"
          overflow="hidden"
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            bgGradient: "linear(to-r, #696969ff, #464646ff)",
            _dark: { bgGradient: "linear(to-r, #696969ff, #464646ff)" },
            opacity: 0.8,
          }}
        >
          <Box w={"full"} mt={[3, 4, 5]}>
            <Stack direction={"row"} spacing={[1, 2, 3]} mb={2}>
              <Avatar
                src={postData.postedBy.picture}
                size={"md"}
                border="2px solid"
                borderColor="glass.border.accent"
              />
              <Box w={"full"} mt={-1}>
                <Stack direction={"column"}>
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Stack direction={"row"} fontSize={[14, 15, 16, 17]}>
                      <Text fontWeight={600}>{postData.postedBy.username}</Text>
                      <Text fontWeight={200} color="text.tertiary">
                        {timeAgo(postData.postedAt)}
                      </Text>
                    </Stack>
                  </Stack>
                  <Box mt={-2} fontSize={13}>
                    <Text fontSize={[12, 13, 14, 15]}>{postData.text}</Text>
                    {postData.image ? (
                      <Image
                        src={postData.image}
                        maxH={[200, 225, 275]}
                        mt={2}
                        objectFit={"cover"}
                        border="2px solid"
                        borderColor="glass.border.accent"
                        borderRadius={14}
                        transition="all 0.3s ease"
                        _hover={{
                          borderColor: "glass.border.accent",
                          transform: "scale(1.01)",
                        }}
                      />
                    ) : null}
                  </Box>
                  <Actions userId={props.user._id} post={postData} />
                </Stack>
              </Box>
            </Stack>
            <Box my={3} display={"flex"} gap={2}>
              <Input
                type={"text"}
                flex={9}
                placeholder={"What do you think about this?"}
                fontSize={[12, 13, 14]}
                h={["38px", "42px", "48px"]}
                border="2px solid"
                borderColor="glass.border.medium"
                bg="glass.bg.light"
                borderRadius={12}
                onChange={(e) => setText(e.target.value)}
                _hover={{
                  borderColor: "glass.border.accent",
                }}
                _focus={{
                  borderColor: "#696969ff",
                  boxShadow: "0 0 0 3px rgba(105, 105, 105, 0.2)",
                }}
                transition="all 0.3s ease"
              />
              <Button
                flex={1}
                fontSize={[12, 13, 14]}
                h={["38px", "42px", "48px"]}
                bgGradient="linear(135deg, #696969ff 0%, #464646ff 100%)"
                color="white"
                fontWeight="700"
                borderRadius={12}
                onClick={postReply}
                _hover={{
                  bgGradient: "linear(135deg, #464646ff 0%, #696969ff 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(70, 70, 70, 0.4)",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              >
                Reply
              </Button>
            </Box>
            <Divider opacity={0.3} my={3} />
            <Text my={3} fontSize={[13, 15, 17]} fontWeight={600} color="text.secondary">
              Replies
            </Text>
            <Divider opacity={0.3} mb={3} />
          </Box>
          {postData.replies.length > 0 ? (
            <>
              {postData.replies.map((reply) => (
                <Reply
                  key={reply._id}
                  userId={props.user._id}
                  postId={postId}
                  replyBy={reply}
                />
              ))}
            </>
          ) : (
            <Center m={8} flexDirection="column" gap={3}>
              <Box fontSize="3xl" opacity={0.3}>
                💬
              </Box>
              <Box color="text.secondary" fontWeight="600" fontSize="lg">
                Be the first to reply!
              </Box>
              <Box
                color="text.tertiary"
                fontSize="sm"
                textAlign="center"
                maxW="300px"
              >
                Share your thoughts on this post
              </Box>
            </Center>
          )}
        </Container>
      </Flex >
    </>
  );
};

export default PostPage;
