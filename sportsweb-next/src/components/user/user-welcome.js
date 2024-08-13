import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import WelcomeSportsSvg from "../../svg/welcome-sports";
import { PersonCircleIcon } from "../ui/icons";
import UserInterests from "./user-interests";
import UserLayout from "../layout/user-layout/user-layout";

function UserWelcome() {
  const [page, setPage] = useState("welcome");

  if (page === "interests") {
    return <UserInterests />;
  }

  return (
    <UserLayout hideSidebarAvatar={true} defaultNavSize="small">
      <Container maxW="container.md" ml="10%" mt={10}>
        <VStack alignItems="flex-start" spacing={10}>
          <WelcomeSportsSvg />
          <HStack alignItems="flex-start" justifyContent="center" spacing={5}>
            <Icon as={PersonCircleIcon} h={8} w={8} />
            <VStack alignItems="flex-start" spacing={10}>
              <Heading as="h1" fontSize="2xl" fontWeight="normal">
                Let&apos;s complete your Interests and Profile
              </Heading>
              <Box>
                <Text>
                  Completing your profile allows other users to connect with you
                  based on your specialization, location and other sports
                  interests.
                </Text>
                <Text fontSize="xs" mt={2} color="gray.500">
                  Tip: Fully completed profiles are eligible to apply for
                  verified profile and get access to more features within
                  Kridas.
                </Text>
              </Box>
              <Button
                colorScheme="primary"
                variant="solid"
                onClick={() => setPage("interests")}
              >
                Begin
              </Button>
            </VStack>
          </HStack>
        </VStack>
      </Container>
    </UserLayout>
  );
}

export default UserWelcome;
