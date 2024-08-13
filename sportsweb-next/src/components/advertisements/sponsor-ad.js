import {
  Box,
  Button,
  Stack,
  Center,
  useColorModeValue,
  Heading,
  Icon,
  VStack,
  ButtonGroup,
  HStack,
} from "@chakra-ui/react";

import { HandShakeIcon, ThumpsDownIcon, ThumpsUpIcon } from "../ui/icons";
import { TextMedium, TextSmall, TextXtraSmall } from "../ui/text/text";

const SponsorAd = (props) => {
  return (
    <VStack
      w={"full"}
      bg={useColorModeValue("white", "gray.800")}
      boxShadow={"2xl"}
      overflow={"hidden"}
      borderRadius={10}
      gap={3}
      p={4}
    >
      <Icon as={HandShakeIcon} w={16} h={16} />
      <VStack gap={0}>
        <TextMedium textAlign="center">
          Hi, will you be interested to sponsor?
        </TextMedium>
        <TextXtraSmall>We will be happy to set you up.</TextXtraSmall>
      </VStack>

      <HStack variant="outline" gap={6} width="full" justifyContent="center">
        <Button
          colorScheme="primary"
          width="full"
          size="md"
          leftIcon={<ThumpsUpIcon />}
        >
          Yes
        </Button>
        {/*  <Button
          width="full"
          size="md"
          leftIcon={<ThumpsDownIcon />}
          variant="outline"
          colorScheme="primary"
        >
          No
        </Button> */}
      </HStack>
    </VStack>
  );
};

export default SponsorAd;
