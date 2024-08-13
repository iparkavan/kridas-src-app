import { Box, VStack } from "@chakra-ui/react";
import UserLayout from "../layout/user-layout/user-layout";
import { HeadingMedium } from "../ui/heading/heading";
import UserProfilePassword from "../user/profile-section/user-profile-password";
import LockProfile from "../user/profile-section/lock-profile";
import AccountDeletion from "../user/profile-section/account-deletion";

const UserAccountSettings = () => {
  return (
    <UserLayout>
      <VStack p={[0, 2]} align="flex-start" gap={2}>
        <HeadingMedium fontSize="24px">Account Settings</HeadingMedium>
        <Box bg="white" w="full" p={4} borderRadius="lg">
          <Box
            w="full"
            p={[4, 6, 8]}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
          >
            <UserProfilePassword />
          </Box>
        </Box>
        <Box bg="white" w="full" p={4} borderRadius="lg">
          <Box
            w="full"
            p={[4, 6, 8]}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
          >
            <LockProfile />
          </Box>
        </Box>
        <Box bg="white" w="full" p={4} borderRadius="lg">
          <Box
            w="full"
            p={[4, 6, 8]}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
          >
            <AccountDeletion />
          </Box>
        </Box>
      </VStack>
    </UserLayout>
  );
};

export default UserAccountSettings;
