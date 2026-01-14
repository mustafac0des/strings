import { useState, useRef } from "react";
import {
  Box,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  Stack,
  useDisclosure,
  Avatar,
  Textarea,
} from "@chakra-ui/react";
import useCustomToast from "../hooks/useCustomToast";
import usePreviewImage from "../hooks/usePreviewImage";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import Icon from "./Icon";

const UserUpdate = () => {
  const user = useRecoilValue(userAtom);
  const setUser = useSetRecoilState(userAtom);
  const fileRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const showToast = useCustomToast();

  const [inputs, setInputs] = useState({
    name: user.name,
    biography: user.biography,
    username: user.username,
    password: "",
  });
  const { imgUrl, handleImgChange } = usePreviewImage();

  const userUpdate = async () => {
    if (!inputs.name && !inputs.biography && !inputs.username && !inputs.password) {
      return showToast("Fill in at least one field!", "error");
    }

    showToast("Updating profile...", "info");

    try {
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...inputs, picture: imgUrl }),
      });

      const data = await res.json();

      if (data.status === 200) {
        showToast(data.message, "success");
        setUser(data.user);
        onClose();
        if (inputs.username !== user.username) {
          window.location.href = `/${inputs.username}`;
        }
      } else {
        showToast(data.message, "error");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <Box>
      <Button
        w={"full"}
        h={["36px", "40px", "44px"]}
        my={3}
        fontSize={[11, 13, 14]}
        fontWeight="600"
        border="2px solid"
        borderColor="glass.border.medium"
        bg="glass.bg.light"
        borderRadius={12}
        onClick={onOpen}
        transition="all 0.3s ease"
        _hover={{
          borderColor: "glass.border.accent",
          bg: "rgba(105, 105, 105, 0.1)",
        }}
      >
        Edit Profile
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} isCentered size={["sm", "md", "lg"]}>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent
          py={6}
          px={2}
          border="2px solid"
          borderColor="glass.border.accent"
          borderRadius={20}
          bg="glass.bg"
          backdropFilter="blur(20px)"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.5)"
        >
          <ModalHeader textAlign={"center"} fontSize={[18, 20, 22]} fontWeight="700">
            Edit Profile
          </ModalHeader>
          <ModalBody as={Stack} direction={"column"} spacing={4}>
            <Stack
              direction={"column"}
              pb={3}
              alignItems={"center"}
              spacing={3}
            >
              <Avatar
                size={["lg", "xl"]}
                src={imgUrl || user.picture}
                border="3px solid"
                borderColor="glass.border.accent"
                boxShadow="0 4px 12px rgba(105, 105, 105, 0.3)"
              />
              <Input
                type={"file"}
                ref={fileRef}
                onChange={handleImgChange}
                display="none"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => fileRef.current?.click()}
                leftIcon={<Icon name="image" size={4} />}
                color="text.secondary"
                _hover={{
                  bg: "rgba(105, 105, 105, 0.15)",
                  color: "white",
                }}
              >
                Change Picture
              </Button>
            </Stack>
            <Input
              placeholder={"Name (3 or more characters)"}
              borderRadius={12}
              size="md"
              h={["40px", "44px", "48px"]}
              border="2px solid"
              borderColor="glass.border.medium"
              bg="glass.bg.light"
              value={inputs.name}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  name: e.target.value,
                })
              }
              _hover={{
                borderColor: "glass.border.accent",
              }}
              _focus={{
                borderColor: "#696969ff",
                boxShadow: "0 0 0 3px rgba(105, 105, 105, 0.2)",
              }}
              transition="all 0.3s ease"
            />
            <Input
              placeholder={"Username"}
              borderRadius={12}
              size="md"
              h={["40px", "44px", "48px"]}
              border="2px solid"
              borderColor="glass.border.medium"
              bg="glass.bg.light"
              value={inputs.username}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  username: e.target.value,
                })
              }
              _hover={{
                borderColor: "glass.border.accent",
              }}
              _focus={{
                borderColor: "#696969ff",
                boxShadow: "0 0 0 3px rgba(105, 105, 105, 0.2)",
              }}
              transition="all 0.3s ease"
            />
            <Textarea
              placeholder={"Biography"}
              borderRadius={12}
              minH="80px"
              border="2px solid"
              borderColor="glass.border.medium"
              bg="glass.bg.light"
              resize="none"
              value={inputs.biography}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  biography: e.target.value,
                })
              }
              _hover={{
                borderColor: "glass.border.accent",
              }}
              _focus={{
                borderColor: "#696969ff",
                boxShadow: "0 0 0 3px rgba(105, 105, 105, 0.2)",
              }}
              transition="all 0.3s ease"
            />
            <Input
              placeholder={"New Password (optional)"}
              type={"password"}
              borderRadius={12}
              size="md"
              h={["40px", "44px", "48px"]}
              border="2px solid"
              borderColor="glass.border.medium"
              bg="glass.bg.light"
              value={inputs.password}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  password: e.target.value,
                })
              }
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
              borderRadius={12}
              size="lg"
              h={["44px", "48px", "52px"]}
              fontSize={[14, 15, 16]}
              fontWeight="700"
              bgGradient="linear(135deg, #696969ff 0%, #464646ff 100%)"
              color="white"
              onClick={userUpdate}
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
              Update Profile
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserUpdate;
