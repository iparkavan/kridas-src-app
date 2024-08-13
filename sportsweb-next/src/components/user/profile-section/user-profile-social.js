import {
  Button,
  Divider,
  Heading,
  HStack,
  VStack,
  Text,
  Icon,
} from "@chakra-ui/react";

import { HeartIcon } from "../../ui/icons";
import { useUser } from "../../../hooks/user-hooks";
import ViewSocialLinks from "../../social/view-social-links";
import { HeadingLarge } from "../../ui/heading/heading";
import { TextXtraSmall } from "../../ui/text/text";
import ViewUserSocial from "./view-user-social";

const UserProfileSocial = ({ setMode }) => {
  const { data: userData, error } = useUser();

  if (userData) {
    return (
      <VStack alignItems="flex-start" spacing={6} width="full">
        <Button
          colorScheme="primary"
          variant="outline"
          onClick={() => setMode("edit")}
        >
          Edit
        </Button>
        <ViewUserSocial socials={userData?.["social"]} />
        {/* <HStack spacing={6} alignItems="flex-start" width="full">
          <Icon as={HeartIcon} w="10" h="10" />
          <VStack alignItems="flex-start" width="full" spacing={6}>
            <HeadingLarge>Social Presence (Optional)</HeadingLarge>
            <VStack alignItems="flex-start" width="full" spacing={3}>
              <TextXtraSmall>
                Required when applying for Sponsorship
              </TextXtraSmall>
              <Divider></Divider>
            </VStack>

            <ViewSocialLinks socials={userData?.["social"]} />
          </VStack>
        </HStack> */}
      </VStack>
    );
  }

  if (error) return "An error has occurred: " + error.message;

  return "Loading...";
};

export default UserProfileSocial;
