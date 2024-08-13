import NextLink from "next/link";
import { Link as ChakraLink } from "@chakra-ui/react";

const Link = (props) => {
  const { href, ...otherProps } = props;

  return (
    <NextLink href={href} passHref>
      <ChakraLink color="primary.500" fontWeight="semibold" {...otherProps}>
        {props.children}
      </ChakraLink>
    </NextLink>
  );
};

export default Link;
