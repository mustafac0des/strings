import { useState, useEffect, useCallback } from "react";

import { Box, Center, Container, Flex, Divider, Spinner } from "@chakra-ui/react";

import UserPost from "../components/UserPost";
import Reply from "../components/Reply";
import FeedMenu from "../components/FeedMenu";
import CreatePost from "../components/CreatePost";
import AnimatedBackground from "../components/AnimatedBackground";

const HomePage = (props) => {
  const [feedType, setFeedType] = useState("forYou");
  const [post, setPost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setPost([]);
    try {
      let res;
      if (feedType === "forYou") {
        res = await fetch("/api/posts/foryou");
      } else if (feedType === "following") {
        res = await fetch(`/api/posts/feed/${props.user._id}`);
      } else if (feedType === "liked") {
        res = await fetch(`/api/posts/liked/${props.user._id}`);
      } else if (feedType === "saved") {
        res = await fetch(`/api/posts/saved/${props.user._id}`);
      }

      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setPost(data);
      } else if (Array.isArray(data.posts)) {
        setPost(data.posts);
      } else {
        setPost([]);
      }
    } catch (err) {
      console.error("Error fetching posts:", err.message);
      setPost([]);
    } finally {
      setIsLoading(false);
    }
  }, [props.user._id, feedType]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (isLoading) {
    return (
      <Center h="100vh" flexDirection="column" gap={4}>
        <Spinner
          size="xl"
          thickness="4px"
          speed="0.65s"
          color="accent.gray"
        />
        <Box color="text.secondary" fontWeight="600">Loading feed...</Box>
      </Center>
    );
  }

  return (
    <>
      <AnimatedBackground />
      <Flex alignItems={"center"} flexDirection={"column"} className={"text"}>
        <FeedMenu user={props.user} feedType={feedType} setFeedType={setFeedType} />
        <Container
          minW={[320, 480, 576, 720]}
          minH={"100vh"}
          borderRadius={[18, 20, 24]}
          border="2px solid"
          borderColor="glass.border.accent"
          className={"lightBlack"}
          bg="rgba(255, 255, 255, 0.02)"
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
            opacity: 0.8,
          }}
        >
          <CreatePost user={props.user} />
          <Divider opacity={0.3} />
          <Box
            mx={[1, 2, 3]}
            maxH={"88vh"}
            css={{
              '&::-webkit-scrollbar': {
                width: '0px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '0px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(105, 105, 105, 0.5)',
                borderRadius: '0px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: 'rgba(105, 105, 105, 0.7)',
              },
            }}
            overflowY="auto"
          >
            {Array.isArray(post) && post.length > 0 ? (
              post.map((postItem) =>
                postItem.type === "reply" ? (
                  <Reply
                    key={postItem._id}
                    userId={props.user._id}
                    replyBy={postItem}
                  />
                ) : (
                  <UserPost
                    key={postItem._id}
                    userId={props.user._id}
                    post={postItem}
                  />
                ),
              )
            ) : (
              <Center m={8} flexDirection="column" gap={3}>
                <Box color="text.secondary" fontWeight="600" fontSize="lg">
                  No posts found!
                </Box>
                <Box color="text.tertiary" fontSize="sm" textAlign="center" maxW="350px">
                  Follow some users to see their posts in your feed
                </Box>
              </Center>
            )}
          </Box>
        </Container>
      </Flex>
    </>
  );
};

export default HomePage;
