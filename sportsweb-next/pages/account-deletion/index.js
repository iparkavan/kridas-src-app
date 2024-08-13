import NextLink from "next/link";
import {
  Box,
  Container,
  Link,
  Image,
  OrderedList,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import routes from "../../src/helper/constants/route-constants";
import { HeadingMedium } from "../../src/components/ui/heading/heading";
import { TextMedium } from "../../src/components/ui/text/text";

const AccountDeletionIndex = () => {
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
        <HeadingMedium mt={5}>ACCOUNT DELETION</HeadingMedium>
        <TextMedium my={3}>
          Please follow the below steps for deleting your account with Kridas
        </TextMedium>
        <OrderedList spacing={5} fontWeight="bold">
          <ListItem>
            Login to Your Account:
            <UnorderedList mt={1} fontWeight="normal">
              <ListItem>
                Log in to the account you want to delete by visiting{" "}
                <NextLink href={routes.login} passHref>
                  <Link textDecoration="underline">https://www.kridas.com</Link>
                </NextLink>
              </ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>
            Account Settings:
            <UnorderedList mt={1} fontWeight="normal">
              <ListItem>
                Look for &ldquo;Account Settings&rdquo; or a similar option in
                the menu.
              </ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>
            Account Deletion:
            <UnorderedList mt={1} fontWeight="normal">
              <ListItem>
                Navigate to the account settings related to account deletion.
              </ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>
            Follow Instructions:
            <UnorderedList mt={1} fontWeight="normal">
              <ListItem>
                Follow the instructions provided by the platform to delete your
                account.
              </ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>
            Confirmation:
            <UnorderedList mt={1} fontWeight="normal">
              <ListItem>
                Confirm your decision to delete the account. You will be asked
                for your password for additional verification.
              </ListItem>
            </UnorderedList>
          </ListItem>
        </OrderedList>
      </Container>
    </Box>
  );
};

export default AccountDeletionIndex;
