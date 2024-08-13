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
  Spacer,
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

import AuthLayout from "./auth-layout";
import AuthInfo from "./auth-info";
import { SP } from "next/dist/shared/lib/utils";

const Auth = (props) => {
  const router = useRouter();

  const registerHandler = () => {
    router.push("/register");
  };

  return (
    <AuthLayout>
      <Flex
        width="full"
        height="full"
        //paddingBottom={10}
        direction={{ base: "column", md: "column", lg: "row" }}
        gap={{ base: 10, md: 10, lg: 0 }}
      >
        <VStack
          height="full"
          alignItems="flex-start"
          paddingRight={[0, 0, 10]}
          flex={1.25}
          spacing={[8, 12, 20]}
          color="white"
        >
          <AuthInfo />
        </VStack>

        <VStack
          height="full"
          // alignItems="flex-start"
          bg="white"
          flex={0.75}
          paddingX={[4, 8, 16]}
          paddingY={8}
          alignItems="center"
          spacing={6}
        >
          {props.children}
        </VStack>
      </Flex>
    </AuthLayout>
  );
};

export default Auth;
