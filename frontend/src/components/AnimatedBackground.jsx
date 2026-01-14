import { Box } from "@chakra-ui/react";

const AnimatedBackground = () => {
    return (
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
    );
};

export default AnimatedBackground;
