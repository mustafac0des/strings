import {
  Avatar,
  Container,
  Flex,
  Stack,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Center,
  Box,
  Text,
  Divider,
  Spinner,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";

import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import Reply from "../components/Reply";
import AnimatedBackground from "../components/AnimatedBackground";

const UserPage = (props) => {
  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState(null);
  const [repostData, setRepostData] = useState(null);
  const [replyData, setReplyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const pathname = window.location.pathname;
      let res = await fetch(`/api/users/profile/${pathname.slice(1)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const user = await res.json();
      setUserData(user);

      res = await fetch(`/api/posts/postedby/${user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      let post = await res.json();

      res = await fetch(`/api/posts/repliesuser/${user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      let reply = await res.json();

      for (let i = 0; i < post.length; i++) {
        post[i].postedBy = user;
      }

      for (let i = 0; i < reply.length; i++) {
        reply[i].userId = user;
      }

      res = await fetch(`/api/posts/repostsuser/${user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const reposts = await res.json();

      setRepostData(reposts);
      setReplyData(reply);
      setPostData(post);
      setIsLoading(false);
    };

    fetchProfile();
  }, []);

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
            Loading profile...
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
          minW={["full", 480, 576, 720]}
          minH={"98vh"}
          my={[2, 3]}
          borderRadius={25}
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
            opacity: 0.8,
          }}
        >
          <UserHeader otherUser={userData} currentUser={props.user} />
          <Tabs variant="modern">
            <TabList
              justifyContent={"space-evenly"}
              bg="glass.bg.light"
              borderRadius="16px"
              p={1}
              mx={2}
            >
              <Tab
                flex={1}
                fontSize={[11, 13, 15]}
                fontWeight={600}
                borderRadius="14px"
                transition="all 0.3s ease"
                _selected={{
                  bg: "linear-gradient(135deg, #696969ff 0%, #464646ff 100%)",
                  color: "white",
                }}
              >
                Posts
              </Tab>
              <Tab
                flex={1}
                fontSize={[11, 13, 15]}
                fontWeight={600}
                borderRadius="14px"
                transition="all 0.3s ease"
                _selected={{
                  bg: "linear-gradient(135deg, #696969ff 0%, #464646ff 100%)",
                  color: "white",
                }}
              >
                Replies
              </Tab>
              <Tab
                flex={1}
                fontSize={[11, 13, 15]}
                fontWeight={600}
                borderRadius="14px"
                transition="all 0.3s ease"
                _selected={{
                  bg: "linear-gradient(135deg, #696969ff 0%, #464646ff 100%)",
                  color: "white",
                }}
                userData={userData}
              >
                Reposts
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel as={Stack} spacing={0} pt={3} alignItems={"center"}>
                {postData.length > 0 ? (
                  <>
                    {postData.map((post) => (
                      <UserPost
                        key={post._id}
                        userId={props.user._id}
                        post={post}
                      />
                    ))}
                  </>
                ) : (
                  <Center m={8} flexDirection="column" gap={3}>
                    <Box fontSize="3xl" opacity={0.3}>
                      📝
                    </Box>
                    <Box color="text.secondary" fontWeight="600" fontSize="lg">
                      No posts yet
                    </Box>
                    <Box
                      color="text.tertiary"
                      fontSize="sm"
                      textAlign="center"
                      maxW="300px"
                    >
                      This user hasn't posted anything yet
                    </Box>
                  </Center>
                )}
              </TabPanel>
              <TabPanel>
                {replyData.length > 0 ? (
                  <>
                    {replyData.map((reply) => (
                      <Reply
                        key={reply._id}
                        userId={props.user._id}
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
                      No replies yet
                    </Box>
                    <Box
                      color="text.tertiary"
                      fontSize="sm"
                      textAlign="center"
                      maxW="300px"
                    >
                      This user hasn't replied to any posts
                    </Box>
                  </Center>
                )}
              </TabPanel>
              <TabPanel>
                {repostData.length > 0 ? (
                  <>
                    {repostData.map((post) => (
                      <Box
                        key={post._id}
                        as={Stack}
                        width="full"
                        direction="row"
                        spacing={3}
                        mt={5}
                      >
                        <Stack
                          direction="column"
                          alignItems="flex-start"
                          spacing={[1, 2, 3]}
                        >
                          <Stack direction="row" spacing={3} mx={2} alignItems="center">
                            <Avatar src={userData.picture} size={["xs", "sm"]} />
                            <Text fontWeight={600} color="text.tertiary" fontSize="sm">
                              <Text fontSize={"larger"} textTransform={"uppercase"}>{userData.name}</Text> reposted
                            </Text>
                          </Stack>

                          <Stack direction="row" spacing={3}>
                            <Divider orientation="vertical" minH={"full"} opacity={0.3} />
                            <UserPost
                              userId={props.user._id}
                              post={post}
                            />
                          </Stack>
                        </Stack>
                      </Box>
                    ))}
                  </>
                ) : (
                  <Center m={8} flexDirection="column" gap={3}>
                    <Box fontSize="3xl" opacity={0.3}>
                      🔁
                    </Box>
                    <Box color="text.secondary" fontWeight="600" fontSize="lg">
                      No reposts
                    </Box>
                    <Box
                      color="text.tertiary"
                      fontSize="sm"
                      textAlign="center"
                      maxW="300px"
                    >
                      This user hasn't reposted anything
                    </Box>
                  </Center>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Flex>
    </>
  );
};

export default UserPage;
