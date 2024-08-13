import { Flex, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { TextCustom, TextHighlight, TextMedium, TextSmall, TextXtraSmall } from "../ui/text/text";
import { PageIcon } from "../ui/icons";
import StadiumSVG from "../../svg/stadium-svg";

const CreatePageAd = (props) => {
  const router = useRouter();

  return (
    <Flex
      display={{ base: "none", lg: "flex" }}
      my={4}
      bg="primary.100"
      w="full"
      h="105px"
      align="center"
      justify="center"
      p={3}
      gap={6}
      borderRadius={10}
    >
      <StadiumSVG />
      <Flex direction="column" align="flex-start">
        <TextCustom fontSize="lg">Do you own or manage a team or club?</TextCustom>
        <TextSmall>
          Create your Team / Tournament / Club page now
        </TextSmall>
      </Flex>
      <Button
        colorScheme="primary"
        onClick={() => router.push("/user/create-page")}
        leftIcon={<PageIcon />}
      >
        Create Page
      </Button>
    </Flex>
  );
};

export default CreatePageAd;
