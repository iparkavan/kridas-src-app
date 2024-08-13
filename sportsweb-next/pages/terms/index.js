import NextLink from "next/link";
import { Box, Container, Link, Image } from "@chakra-ui/react";
import routes from "../../src/helper/constants/route-constants";
import Terms from "../../src/components/policies/terms";
import { HeadingMedium } from "../../src/components/ui/heading/heading";

const TermsIndex = () => {
  return (
    <Box bg="white">
      <Box as="header" boxShadow="md" py={4}>
        <Container maxW="6xl">
          <NextLink href={routes.login} passHref>
            <Link>
              <Image
                src="/kridas-logo.svg"
                alt="Kridas - Logo"
                width="250px"
                height="50px"
              />
            </Link>
          </NextLink>
        </Container>
      </Box>
      <Container maxW="6xl">
        <HeadingMedium my={5}>TERMS</HeadingMedium>
        <Terms />
      </Container>
    </Box>
  );
};

export default TermsIndex;
