import { extendTheme } from "@chakra-ui/react";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";

const colors = {
  primary: {
    50: "#EBF8FF",
    100: "#BEE3F8",
    200: "#90CDF4",
    300: "#63B3ED",
    400: "#4299E1",
    500: "#2F80ED",
    600: "#2B6CB0",
    700: "#2C5282",
    800: "#2A4365",
    900: "#1A365D",
  },
  navy: {
    500: "#00257D",
  },
};

const global = {
  body: {
    color: "#000000",
  },
  button: {
    _focus: {
      boxShadow: "none",
    },
  },
};

const Input = {
  baseStyle: {
    field: {
      _placeholder: {
        fontSize: "0.875rem",
      },
    },
  },
  // defaultProps: { variant: "flushed" },
};

const Link = {
  baseStyle: {
    _focus: {
      boxShadow: "none",
    },
  },
};

const customTheme = extendTheme({
  styles: { global },
  colors,
  fonts: {
    body: "Roboto, Montserrat, sans-serif",
    heading: "Roboto, Montserrat, sans-serif",
    mono: "Roboto, Montserrat, sans-serif",
  },
  components: {
    Input,
    Link,
    Steps,
  },
});

export default customTheme;
