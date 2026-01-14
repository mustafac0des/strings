import { Box, Flex, Heading, Input, Spinner, Stack, Text, Avatar } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useShowToast from "../hooks/useCustomToast";
import AnimatedBackground from "../components/AnimatedBackground";
import { useColorMode } from "@chakra-ui/react";

const SearchPage = () => {
    const [searchText, setSearchText] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const showToast = useShowToast();
    const { colorMode } = useColorMode();

    const handleSearch = async (e) => {
        setSearchText(e.target.value);
    };

    useEffect(() => {
        const searchUsers = async () => {
            if (searchText.length === 0) {
                setUsers([]);
                return;
            }
            setLoading(true);
            try {
                const res = await fetch(`/api/users/search/${searchText}`);
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setUsers(data);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            if (searchText) searchUsers();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchText, showToast]);

    return (
        <>
            <AnimatedBackground />
            <Box w={"full"} maxW={"600px"} mx={"auto"} p={4}>
                <Heading mb={6} size={"lg"} fontWeight="800" bgGradient="linear(to-r, #696969ff, #A0A0A0)" _dark={{ bgGradient: "linear(to-r, #FFFFFF, #A0A0A0)" }} bgClip="text">
                    Search Users
                </Heading>
                <Input
                    placeholder="Search for a user..."
                    value={searchText}
                    onChange={handleSearch}
                    mb={8}
                    h="56px"
                    fontSize="16px"
                    borderRadius="16px"
                    border="2px solid"
                    borderColor="glass.border.accent"
                    bg="glass.bg.light"
                    backdropFilter="blur(10px)"
                    _hover={{
                        borderColor: "glass.border.accent",
                    }}
                    _focus={{
                        borderColor: "#696969ff",
                        boxShadow: "0 0 0 4px rgba(105, 105, 105, 0.2)",
                        bg: "glass.bg.medium",
                    }}
                    transition="all 0.3s ease"
                />

                {loading && (
                    <Flex justifyContent={"center"} py={8}>
                        <Spinner
                            size={"xl"}
                            thickness="4px"
                            speed="0.65s"
                            color="accent.gray"
                        />
                    </Flex>
                )}

                {!loading && users.length === 0 && searchText.length > 0 && (
                    <Box
                        textAlign={"center"}
                        py={12}
                        px={6}
                        borderRadius="20px"
                        bg="glass.bg.light"
                        border="2px dashed"
                        borderColor="glass.border.light"
                    >
                        <Text fontSize="lg" opacity={0.7}>No users found</Text>
                        <Text fontSize="sm" opacity={0.5} mt={2}>Try a different search term</Text>
                    </Box>
                )}

                <Stack gap={3}>
                    {users.map((user) => (
                        <Box
                            key={user._id}
                            as={Link}
                            to={`/${user.username}`}
                            p={4}
                            borderRadius="16px"
                            bg="glass.bg.light"
                            border="1px solid"
                            borderColor="glass.border.medium"
                            backdropFilter="blur(10px)"
                            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                            _hover={{
                                bg: "accent.glassHover",
                                borderColor: "rgba(105, 105, 105, 0.5)",
                                transform: "translateY(-4px)",
                                boxShadow: "0 8px 24px rgba(105, 105, 105, 0.3)",
                            }}
                            cursor="pointer"
                        >
                            <Flex alignItems={"center"} gap={4}>
                                <Avatar
                                    src={user.picture}
                                    size={"md"}
                                    border="2px solid rgba(105, 105, 105, 0.3)"
                                />
                                <Stack gap={1} flex={1}>
                                    <Text fontWeight={"700"} fontSize="md">{user.username}</Text>
                                    <Text color="text.secondary" fontSize={"sm"} fontWeight="500">{user.name}</Text>
                                </Stack>
                            </Flex>
                        </Box>
                    ))}
                </Stack>
            </Box>
        </>
    );
};

export default SearchPage;
