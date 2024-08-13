import {
  Button,
  Flex,
  Heading,
  Input,
  VStack,
  HStack,
  Box,
  Text,
  Icon,
  Link,
  Divider,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import {
  MdOutlinePersonSearch,
  MdOutlineBusiness,
  MdOutlineEvent,
  MdOutlineGroups,
  MdOutlineSportsHandball,
} from "react-icons/md";
import { TextMedium } from "../ui/text/text";

const AuthInfo = (props) => {
  const mainHeading = { base: "md", md: "2xl", lg: "4xl" };
  const secondaryHeading = {
    base: "md",
    md: "2xl",
    lg: "3xl",
  };
  const iconSize = { base: 6, md: 10, lg: 20 };
  const iconText = { base: "xs", md: "md", lg: "lg" };

  return (
    <>
      <VStack alignItems="flex-start" mt={16}>
        <Heading fontSize={mainHeading}>Connecting Sports Community </Heading>
        <TextMedium>
          A sports community platform that connects athletes, brands and
          stakeholders globally.
        </TextMedium>
      </VStack>

      <HStack spacing={[2, 4, 6]} alignItems="flex-start">
        <VStack alignItems="center">
          <Icon as={MdOutlinePersonSearch} w={iconSize} h={iconSize} />
          <Text textAlign="center" fontSize={iconText}>
            Connect with other Sportsters
          </Text>
        </VStack>
        <VStack>
          <Icon as={MdOutlineBusiness} w={iconSize} h={iconSize} />
          <Text textAlign="center" fontSize={iconText}>
            Connect with Sponsors
          </Text>
        </VStack>
        <VStack>
          <Icon as={MdOutlineEvent} w={iconSize} h={iconSize} />
          <Text textAlign="center" fontSize={iconText}>
            Schedule Matches & Events
          </Text>
        </VStack>
        <VStack>
          <Icon as={MdOutlineGroups} w={iconSize} h={iconSize} />
          <Text textAlign="center" fontSize={iconText}>
            Manage Your Teams
          </Text>
        </VStack>
        <VStack>
          <Icon as={MdOutlineSportsHandball} w={iconSize} h={iconSize} />
          <Text textAlign="center" fontSize={iconText}>
            Play Sports with Others
          </Text>
        </VStack>
      </HStack>
    </>
  );
};

export default AuthInfo;
