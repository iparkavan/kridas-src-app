import { Heading, Container, VStack, Box, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import routes from "../../helper/constants/route-constants";

const AuthLayout = (props) => {
  return (
    <Box
      backgroundImage="url('/images/authBackground.png')"
      width="full"
      height="auto"
      minHeight="100vh"
    >
      <Container maxW="container.xl" padding={0}>
        <VStack
          width="full"
          padding={[4, 6, 10]}
          alignItems="flex-start"
          spacing={5}
        >
          <NextLink href={routes.login} passHref>
            <Link textDecoration="none" _hover={{ textDecoration: "none" }}>
              <Heading size="md" color="white" fontStyle="italic">
                Kridas
              </Heading>
            </Link>
          </NextLink>
          {props.children}
        </VStack>
      </Container>
    </Box>
  );
};

export default AuthLayout;
