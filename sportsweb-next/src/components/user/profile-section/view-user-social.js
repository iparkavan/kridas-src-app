import { Divider, VStack } from "@chakra-ui/react";

import ViewSocialLinks from "../../social/view-social-links";
import { HeadingSmall } from "../../ui/heading/heading";

const ViewUserSocial = ({ socials }) => {
  const isSocialsPresent = socials?.some((social) => social?.link);

  if (!isSocialsPresent) {
    return null;
  }

  return (
    <VStack alignItems="flex-start" width="full" spacing={6}>
      <Divider borderColor="gray.300" mx={-6} px={6} />
      <HeadingSmall textTransform="uppercase">Social Presence</HeadingSmall>
      <ViewSocialLinks socials={socials} />
    </VStack>
  );
};

export default ViewUserSocial;
