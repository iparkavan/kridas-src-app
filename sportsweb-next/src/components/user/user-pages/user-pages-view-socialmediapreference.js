import { VStack, Button, HStack, Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { usePage } from "../../../hooks/page-hooks";
import ViewSocialLinks from "../../social/view-social-links";
import { HeadingMedium } from "../../ui/heading/heading";
import { SocialMedia } from "../../ui/icons";

function Socialmediapreference({ type }) {
  const router = useRouter();
  const { pageId } = router.query;
  const { data: pageData = {} } = usePage(pageId);

  if (pageData) {
    return (
      <VStack align="flex-start" w="full" spacing={4}>
        {/* {type === "private" && (
          <Button
            variant="outline"
            colorScheme="primary"
            onClick={() => {
              setShowText(true);
            }}
          >
            Edit
          </Button>
        )} */}
        <HStack spacing={4} mt={type === "public" && 3}>
          {/* <Icon as={SocialMedia} w="6" h="6" /> */}
          {pageData?.["social"] && (
            <HeadingMedium>Social Media Presence</HeadingMedium>
          )}
        </HStack>
        <ViewSocialLinks socials={pageData?.["social"]} />
      </VStack>
    );
  }

  if (error) return "An error has occurred: " + error.message;

  return "Loading...";
}

export default Socialmediapreference;
