import { Box, Divider, HStack, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { HeadingMedium } from "../../ui/heading/heading";
import UserProfileEditDetails from "./user-profile-edit-details";
import UserProfileEditBio from "./user-profile-edit-bio";
import UserProfileEditCareer from "./user-profile-edit-career";
import UserProfileEditStatistics from "./user-profile-edit-statistics";
import UserProfileEditInterests from "./user-profile-edit-interests";
import UserProfileEditSocial from "./user-profile-edit-social";
import Button from "../../ui/button";
import { ArrowLeftIcon } from "../../ui/icons";

const UserProfileEdit = () => {
  const router = useRouter();

  return (
    <Box>
      <HStack w="full" justify="space-between">
        <HeadingMedium>Edit Profile</HeadingMedium>
        <Button
          variant="link"
          leftIcon={<ArrowLeftIcon />}
          onClick={() => router.back()}
        >
          Back
        </Button>
      </HStack>
      <Box bg="white" mt={4} p={6} borderRadius="xl">
        <VStack
          align="stretch"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          p={6}
          spacing={5}
        >
          <UserProfileEditDetails />
          <Divider borderColor="gray.300" />
          <UserProfileEditBio />
          <Divider borderColor="gray.300" />
          <UserProfileEditCareer />
          <Divider borderColor="gray.300" />
          <UserProfileEditStatistics />
          <Divider borderColor="gray.300" />
          <UserProfileEditInterests />
          <Divider borderColor="gray.300" />
          <UserProfileEditSocial />
        </VStack>
      </Box>
    </Box>
  );
};

export default UserProfileEdit;
