import NextLink from "next/link";
import { Box, Container, Link, Image, Stack } from "@chakra-ui/react";
import routes from "../../src/helper/constants/route-constants";
import {
  HeadingMedium,
  HeadingSmall,
} from "../../src/components/ui/heading/heading";
import { TextMedium } from "../../src/components/ui/text/text";

const ContactUsIndex = () => {
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
        <Stack mt={5} spacing={5} maxW="sm">
          <HeadingMedium>CONTACT US</HeadingMedium>
          <Box>
            <HeadingSmall>EMAIL</HeadingSmall>
            <Link href="mailto:support@kridas.com">support@kridas.com</Link>
          </Box>
          <HeadingSmall>OFFICE LOCATIONS</HeadingSmall>
          <Box>
            <HeadingSmall>INDIA</HeadingSmall>
            <TextMedium>
              Flat No 3, Sri Sai Villa, No.7/2 Dr Ranga Road, Mylapore, Chennai,
              Tamil Nadu 600004, India
            </TextMedium>
          </Box>
          <HeadingSmall>OTHER LOCATIONS</HeadingSmall>
          <Box>
            <HeadingSmall>SINGAPORE</HeadingSmall>
            <TextMedium>
              69, Balestier Road, Singapore Indian Association, Singapore -
              329677
            </TextMedium>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default ContactUsIndex;
