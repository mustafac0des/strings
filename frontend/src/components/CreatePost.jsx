import {
  Avatar,
  Button,
  Divider,
  Stack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
  Textarea,
  useDisclosure,
  Input,
  Image,
  Box,
  IconButton,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import useCustomToast from "../hooks/useCustomToast";
import usePreviewImage from "../hooks/usePreviewImage";
import Icon from "./Icon";

const CreatePost = (props) => {
  const showToast = useCustomToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [post, setPost] = useState({ text: "", picture: "" });
  const { imgUrl, setImgUrl, handleImgChange } = usePreviewImage();
  const fileRef = useRef(null);

  const postCreate = async () => {
    if (post.text.length < 9 || post.text.length > 500) {
      return showToast(
        "Text length should be in between 10 to 500 characters!",
        "error",
      );
    }

    showToast("Posting...", "info");

    post.picture = imgUrl;

    try {
      const res = await fetch(`/api/posts/create/${props.user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });

      const data = await res.json();

      if (data.status === 200) {
        onClose();
        setPost({ text: "", picture: "" });
        setImgUrl(null);
        showToast(data.message, "success");
        window.location.reload();
      } else {
        return showToast(data.message, "error");
      }
    } catch (err) {
      return showToast("sadsd" + err.message, "error");
    }
  };

  return (
    <>
      {props.isHeader ? (
        <>
          <Button
            w={["auto"]}
            h={["auto"]}
            p={[3, 3.5, 4]}

            bg="glass.bg.light"
            border="1px solid #696969ff"
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
            onClick={onOpen}
          >
            <Icon name={"plus"} size={[5, 5.5, 8]} color="text.primary" />
          </Button>
        </>
      ) : (
        <Stack
          px={4}
          py={4}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          onClick={onOpen}
          cursor={"pointer"}
          borderRadius="12px"
          transition="all 0.2s ease"
          _hover={{
            bg: "rgba(255, 255, 255, 0.03)",
          }}
        >
          <Stack direction={"row"} alignItems={"center"} gap={3}>
            <Avatar
              src={props.user.picture}
              size={["sm", "md"]}
              border="2px solid"
              borderColor="glass.border.accent"
            />
            <Text fontSize={[12, 14, 15]} color="text.secondary" fontWeight="500">
              Start a conversation...
            </Text>
          </Stack>
          <Button
            size="sm"
            px={5}
            h={9}
            fontSize={13}
            fontWeight="700"
            bgGradient="linear(135deg, #696969ff 0%, #464646ff 100%)"
            color="white"
            borderRadius={10}
            _hover={{
              bgGradient: "linear(135deg, #464646ff 0%, #696969ff 100%)",
            }}
            transition="all 0.3s ease"
          >
            Post
          </Button>
        </Stack>
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={["sm", "md", "lg"]}>
        <ModalContent
          maxH={["90vh", "85vh", "80vh"]}
          mx={[3, 4, 0]}
          borderRadius={20}
          border="2px solid"
          borderColor="glass.border.accent"
          bg="glass.bg"
          backdropFilter="blur(20px)"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.5)"
        >
          <ModalBody px={6} py={5}>
            <Stack direction={"row"} gap={4}>
              <Stack direction={"column"} alignItems={"center"}>
                <Avatar
                  size={["md", "lg"]}
                  src={props.user.picture}
                  border="2px solid"
                  borderColor="glass.border.accent"
                />
                <Divider
                  orientation={"vertical"}
                  opacity={0.3}
                  flex={1}
                />
              </Stack>
              <Stack w={"full"} direction={"column"} gap={2}>
                <Text fontSize={[14, 15, 16]} fontWeight={700}>
                  {props.user.name}
                </Text>
                <Textarea
                  placeholder={"What's on your mind?"}
                  resize={"none"}
                  minH="120px"
                  p={0}
                  border={0}
                  _focus={{ boxShadow: "none" }}
                  fontSize={[13, 14, 15]}
                  maxLength={500}
                  onChange={(e) => setPost({ ...post, text: e.target.value })}
                  _placeholder={{ color: "text.tertiary" }}
                />
                {imgUrl && (
                  <Box position="relative">
                    <Image
                      src={imgUrl}
                      maxH={[200, 250, 300]}
                      w="full"
                      border="2px solid"
                      borderColor="glass.border.accent"
                      borderRadius={16}
                      objectFit={"cover"}
                    />
                    <IconButton
                      position="absolute"
                      top={2}
                      right={2}
                      size="sm"
                      icon={<Icon name="trash" size={4} />}
                      onClick={() => {
                        if (fileRef.current) {
                          fileRef.current.value = "";
                        }
                        setImgUrl(null);
                        setPost((prev) => ({ ...prev, picture: "" }));
                      }}
                      bg="rgba(0, 0, 0, 0.7)"
                      _hover={{ bg: "rgba(220, 38, 38, 0.8)" }}
                      borderRadius="full"
                      aria-label="Remove image"
                    />
                  </Box>
                )}
              </Stack>
            </Stack>
          </ModalBody>
          <ModalFooter px={6} py={4} gap={3}>
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
              Add Image
            </Button>
            <Box flex={1} />
            <Button
              size="md"
              px={8}
              h={10}
              fontSize={14}
              fontWeight="700"
              bgGradient="linear(135deg, #696969ff 0%, #464646ff 100%)"
              color="white"
              borderRadius={12}
              onClick={postCreate}
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
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
