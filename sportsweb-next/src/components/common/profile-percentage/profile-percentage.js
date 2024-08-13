import {
  VStack,
  Button,
  Progress,
  Flex,
  Spacer,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import { HeadingSmall } from "../../ui/heading/heading";
import { TextHighlight } from "../../ui/text/text";
import routes from "../../../helper/constants/route-constants";
import { DownArrowIcon, TickIcon } from "../../ui/icons";

const ProfilePercentage = (props) => {
  const router = useRouter();
  const { percentage, type, pageId = null, setTabIndex } = props;

  const handleCompleteNow = () => {
    if (type === "user") {
      router.push(routes.editProfile);
      // const url = "/user/profile?tab=about";
      // const isSameUrl = router.asPath === url;
      // isSameUrl ? setTabIndex(1) : router.push(url);
    } else {
      router.push(routes.editPage(pageId));
      // const url = "/page/[pageId]";
      // const isSameUrl = router.pathname === url;
      // isSameUrl ? setTabIndex(2) : router.push(`/page/${pageId}?tab=about`);
    }
  };

  return (
    <VStack
      bg="white"
      w="full"
      h="max-content"
      p={4}
      align="flex-start"
      borderRadius={10}
      gap={2}
    >
      <HeadingSmall>Profile Completion</HeadingSmall>
      <VStack w="full" alignItems="flex-start" gap={0}>
        <Flex w="full">
          <Spacer />
          <HStack spacing={0}>
            {percentage < 100 ? (
              <DownArrowIcon
                style={{ color: "#f16d75", fontWeight: "500" }}
                fontSize="22px"
              />
            ) : (
              <TickIcon style={{ color: "green" }} />
            )}
            <TextHighlight fontWeight="600">{percentage}% done</TextHighlight>
          </HStack>
        </Flex>
        <Progress
          colorScheme={percentage === 100 ? "green" : "yellow"}
          size="sm"
          value={percentage}
          hasStripe={percentage === 100 ? false : true}
          width="full"
        />
      </VStack>

      {percentage != 100 ? (
        <Button
          width="full"
          variant="outline"
          colorScheme="primary"
          onClick={handleCompleteNow}
        >
          Complete Now
        </Button>
      ) : null}
    </VStack>
  );
};

export default ProfilePercentage;
