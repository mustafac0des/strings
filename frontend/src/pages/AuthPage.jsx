import { useState } from "react";
import { useSetRecoilState } from "recoil";
import useCustomToast from "../hooks/useCustomToast";

import {
  Button,
  Container,
  Image,
  Input,
  Tabs,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Box,
} from "@chakra-ui/react";

import userAtom from "../atoms/userAtom";

const AuthPage = () => {
  const showToast = useCustomToast();

  const setUser = useSetRecoilState(userAtom);

  const [userInputs, setUserInputs] = useState({
    username: "",
    password: "",
  });

  const [newUserInputs, setNewUserInputs] = useState({
    name: "",
    username: "",
    password: "",
  });

  const userSignIn = async () => {
    if (userInputs.username === "" || userInputs.password === "") {
      return showToast("Fill in both fields!", "info");
    }

    showToast("Signing in...", "info");

    try {
      const res = await fetch("/api/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInputs),
      });

      const data = await res.json();

      if (data.status === 200) {
        setUser(data.user);
        return showToast(data.message, "success");
      } else {
        return showToast(data.message, "error");
      }
    } catch (err) {
      return showToast(err.message, "error");
    }
  };

  const userSignUp = async () => {
    if (
      newUserInputs.name.length < 3 ||
      newUserInputs.name.length > 15 ||
      newUserInputs.password.length < 8
    ) {
      return showToast({
        title: "Fill in the fields as per the requirements!",
        status: "warning",
      });
    }

    showToast("Creating account...", "info");

    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserInputs),
      });

      const data = await res.json();

      if (data.status === 200) {
        setUser(data.newUser);
        return showToast(data.message, "success");
      } else {
        return showToast(data.message, "error");
      }
    } catch (err) {
      return showToast(err.message, "error");
    }
  };

  return (
    <>
      {/* Animated Strings Background */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        overflow="hidden"
        zIndex={-1}
        pointerEvents="none"
      >
        {[...Array(12)].map((_, i) => (
          <Box
            key={i}
            position="absolute"
            left={`${(i * 8) + 5}%`}
            width="2px"
            height="100vh"
            bgGradient="linear(to-b, transparent, rgba(160, 160, 160, 0.15), transparent)"
            animation={`floatString ${15 + i * 2}s ease-in-out infinite`}
            animationDelay={`${i * 0.5}s`}
            sx={{
              '@keyframes floatString': {
                '0%, 100%': {
                  transform: 'translateY(-10%) scaleY(0.8)',
                  opacity: 0.3,
                },
                '50%': {
                  transform: 'translateY(10%) scaleY(1.2)',
                  opacity: 0.6,
                },
              },
            }}
          />
        ))}
      </Box>

      <Container centerContent minH="100vh" display="flex" flexDirection="column" justifyContent="center">
        <Box
          w={[320, 380, 420]}
          p={8}
          borderRadius="24px"
          bg="glass.bg"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor="glass.border.medium"
          boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.37)"
          transition="all 0.3s ease"
          _hover={{
            transform: "translateY(-4px)",
            boxShadow: "0 12px 40px 0 rgba(0, 0, 0, 0.5)",
          }}
        >
          <Stack gap={6} align="center">
            <Text
              fontSize={[28, 32, 36]}
              fontWeight="800"
              bgGradient="linear(135deg, #181818 0%, #616161 100%)"
              _dark={{ bgGradient: "linear(135deg, #FFFFFF 0%, #A0A0A0 100%)" }}
              bgClip="text"
              letterSpacing="tight"
              textShadow="0 4px 12px rgba(255, 255, 255, 0.1)"
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              | STRINGS |
            </Text>
            <Tabs isFitted variant={"unstyled"} w="full">
              <TabList
                bg="glass.bg.light"
                borderRadius="16px"
                p={1}
              >
                <Tab
                  fontSize={[12, 14, 16]}
                  borderRadius="14px"
                  fontWeight="600"
                  color="text.secondary"
                  _selected={{
                    bgGradient: "linear(135deg, #696969ff 0%, #464646ff 100%)",
                    color: "white",
                  }}
                  transition="all 0.3s ease"
                >
                  Sign In
                </Tab>
                <Tab
                  fontSize={[12, 14, 16]}
                  borderRadius="14px"
                  fontWeight="600"
                  color="text.secondary"
                  _selected={{
                    bgGradient: "linear(135deg, #696969ff 0%, #464646ff 100%)",
                    color: "white",
                  }}
                  transition="all 0.3s ease"
                >
                  Sign up
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0} pt={6}>
                  <Stack spacing={4}>
                    <Input
                      borderRadius={12}
                      placeholder={"Username*"}
                      value={userInputs.username}
                      onChange={(e) =>
                        setUserInputs({ ...userInputs, username: e.target.value })
                      }
                      h="48px"
                      border="2px solid"
                      borderColor="glass.border.medium"
                      _hover={{
                        borderColor: "glass.border.accent",
                      }}
                      _focus={{
                        borderColor: "#696969ff",
                        boxShadow: "0 0 0 3px rgba(105, 105, 105, 0.2)",
                      }}
                    />
                    <Input
                      placeholder={"Password*"}
                      type="password"
                      borderRadius={12}
                      value={userInputs.password}
                      onChange={(e) =>
                        setUserInputs({ ...userInputs, password: e.target.value })
                      }
                      h="48px"
                      border="2px solid"
                      borderColor="glass.border.medium"
                      _hover={{
                        borderColor: "glass.border.accent",
                      }}
                      _focus={{
                        borderColor: "#696969ff",
                        boxShadow: "0 0 0 3px rgba(105, 105, 105, 0.2)",
                      }}
                    />
                    <Button
                      fontSize={[12, 14, 16]}
                      h="48px"
                      borderRadius={12}
                      onClick={userSignIn}
                      bgGradient="linear(135deg, #696969ff 0%, #464646ff 100%)"
                      color="white"
                      fontWeight="700"
                      _hover={{
                        bgGradient: "linear(135deg, #464646ff 0%, #696969ff 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 20px rgba(70, 70, 70, 0.4)",
                      }}
                      _active={{
                        transform: "translateY(0)",
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    >
                      Sign in
                    </Button>
                  </Stack>
                </TabPanel>
                <TabPanel px={0} pt={6}>
                  <Stack spacing={4}>
                    <Input
                      placeholder={"Name (3 or more characters)*"}
                      borderRadius={12}
                      value={newUserInputs.name}
                      onChange={(e) =>
                        setNewUserInputs({
                          ...newUserInputs,
                          name: e.target.value,
                        })
                      }
                      h="48px"
                      border="2px solid"
                      borderColor="glass.border.medium"
                      _hover={{
                        borderColor: "glass.border.accent",
                      }}
                      _focus={{
                        borderColor: "#696969ff",
                        boxShadow: "0 0 0 3px rgba(105, 105, 105, 0.2)",
                      }}
                    />
                    <Input
                      placeholder={"Username*"}
                      borderRadius={12}
                      value={newUserInputs.username}
                      onChange={(e) =>
                        setNewUserInputs({
                          ...newUserInputs,
                          username: e.target.value,
                        })
                      }
                      h="48px"
                      border="2px solid"
                      borderColor="glass.border.medium"
                      _hover={{
                        borderColor: "glass.border.accent",
                      }}
                      _focus={{
                        borderColor: "#696969ff",
                        boxShadow: "0 0 0 3px rgba(105, 105, 105, 0.2)",
                      }}
                    />
                    <Input
                      placeholder={"Password (8 or more characters)*"}
                      type="password"
                      borderRadius={12}
                      value={newUserInputs.password}
                      onChange={(e) =>
                        setNewUserInputs({
                          ...newUserInputs,
                          password: e.target.value,
                        })
                      }
                      h="48px"
                      border="2px solid"
                      borderColor="glass.border.medium"
                      _hover={{
                        borderColor: "glass.border.accent",
                      }}
                      _focus={{
                        borderColor: "#696969ff",
                        boxShadow: "0 0 0 3px rgba(105, 105, 105, 0.2)",
                      }}
                    />
                    <Button
                      fontSize={[12, 14, 16]}
                      h="48px"
                      borderRadius={12}
                      onClick={userSignUp}
                      bgGradient="linear(135deg, #696969ff 0%, #464646ff 100%)"
                      color="white"
                      fontWeight="700"
                      _hover={{
                        bgGradient: "linear(135deg, #464646ff 0%, #696969ff 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 20px rgba(70, 70, 70, 0.4)",
                      }}
                      _active={{
                        transform: "translateY(0)",
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    >
                      Sign Up
                    </Button>
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>
        </Box>
      </Container>
    </>
  );
};

export default AuthPage;
