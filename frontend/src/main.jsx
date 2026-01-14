import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

import App from "./App";

import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const styles = {
  global: (props) => ({
    "*": {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    body: {
      transition: "background-color 0.3s ease, color 0.3s ease",
    },
    ".darkBlack": {
      backgroundColor: mode("#FAFAFA !important", "#0A0A0A !important")(props),
      color: mode("#0A0A0A !important", "#FAFAFA !important")(props),
    },
    ".lightBlack": {
      backgroundColor: mode("#FFFFFF !important", "#181818 !important")(props),
      color: mode("#0A0A0A !important", "#FAFAFA !important")(props),
    },
    ".text": {
      color: mode("#0A0A0A !important", "#FAFAFA !important")(props),
      fill: mode("#0A0A0A !important", "#FAFAFA !important")(props),
    },
  }),
};

const colors = {
  brand: {
    50: "#f0e7ff",
    100: "#d4bbff",
    200: "#b88fff",
    300: "#9c63ff",
    400: "#8037ff",
    500: "#6610f2",
    600: "#5009c7",
    700: "#3a069c",
    800: "#240371",
    900: "#0e0046",
  },
  accent: {
    gray: "#696969ff",
    darkGray: "#464646ff",
    mediumGray: "#808080",
    lightGray: "#A0A0A0",
    gradient: "linear-gradient(135deg, #696969ff 0%, #464646ff 100%)",
    gradientReverse: "linear-gradient(135deg, #464646ff 0%, #696969ff 100%)",
    gradientLight: "linear-gradient(135deg, #808080 0%, #696969ff 100%)",
    gradientSubtle: "linear-gradient(135deg, #A0A0A0 0%, #808080 100%)",
    glassBg: "rgba(255, 255, 255, 0.05)",
    glassBorder: "rgba(255, 255, 255, 0.1)",
    glassHover: "rgba(105, 105, 105, 0.2)",
  },
  semantic: {
    success: "#10B981",
    error: "#EF4444",
    warning: "#F59E0B",
    info: "#696969ff",
  },
  glass: {
    bg: {
      light: "rgba(255, 255, 255, 0.05)",
      medium: "rgba(255, 255, 255, 0.1)",
      heavy: "rgba(255, 255, 255, 0.15)",
    },
    border: {
      light: "rgba(255, 255, 255, 0.08)",
      medium: "rgba(255, 255, 255, 0.12)",
      accent: "rgba(105, 105, 105, 0.3)",
    },
  },
  text: {
    primary: "#FAFAFA",
    secondary: "#A0A0A0",
    tertiary: "#616161",
    muted: "#404040",
  },
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: "600",
      borderRadius: "12px",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      _hover: {
        transform: "translateY(-2px)",
      },
      _active: {
        transform: "translateY(0)",
      },
    },
    variants: {
      gradient: {
        bgGradient: "linear(135deg, #696969ff 0%, #464646ff 100%)",
        color: "white",
        _hover: {
          bgGradient: "linear(135deg, #464646ff 0%, #696969ff 100%)",
          boxShadow: "0 8px 20px rgba(70, 70, 70, 0.4)",
        },
      },
      glass: {
        bg: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        _hover: {
          bg: "rgba(105, 105, 105, 0.2)",
          borderColor: "rgba(105, 105, 105, 0.3)",
        },
      },
    },
  },
  Input: {
    baseStyle: {
      field: {
        transition: "all 0.3s ease",
        borderRadius: "12px",
        _focus: {
          borderColor: "#696969ff",
          boxShadow: "0 0 0 3px rgba(105, 105, 105, 0.2)",
        },
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        bg: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "16px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  Tabs: {
    variants: {
      modern: {
        tab: {
          borderRadius: "14px",
          fontWeight: "600",
          transition: "all 0.3s ease",
          _selected: {
            bg: "linear-gradient(135deg, #696969ff 0%, #464646ff 100%)",
            color: "white",
          },
        },
      },
    },
  },
  Modal: {
    baseStyle: {
      dialog: {
        bg: "glass.bg",
        backdropFilter: "blur(10px)",
        border: "1px solid",
        borderColor: "glass.border",
      },
      overlay: {
        backdropFilter: "blur(4px)",
      },
    },
  },
};

const semanticTokens = {
  colors: {
    "glass.bg": {
      default: "rgba(255, 255, 255, 0.8)",
      _dark: "rgba(24, 24, 24, 0.95)",
    },
    "glass.bg.light": {
      default: "rgba(255, 255, 255, 0.6)",
      _dark: "rgba(255, 255, 255, 0.05)",
    },
    "glass.border": {
      default: "rgba(0, 0, 0, 0.1)",
      _dark: "rgba(255, 255, 255, 0.08)",
    },
    "glass.border.accent": {
      default: "rgba(0, 0, 0, 0.2)",
      _dark: "rgba(105, 105, 105, 0.3)",
    },
    "text.primary": {
      default: "#181818",
      _dark: "#FAFAFA",
    },
    "text.secondary": {
      default: "#616161",
      _dark: "#A0A0A0",
    },
    "button.bg": {
      default: "#EDF2F7",
      _dark: "glass.bg.light",
    },
  },
};

const theme = extendTheme({ config, styles, colors, components, semanticTokens });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>,
);
