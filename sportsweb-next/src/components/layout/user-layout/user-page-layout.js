import React from "react";
import { Text, Flex, Box, Icon } from "@chakra-ui/react";

import { MdOutlineHome } from "react-icons/md";
import NavItem from "./nav-item";
import { useUser } from "../../../hooks/user-hooks";
import { useRouter } from "next/router";
function UserPageLayout() {
  const { data: userData = {} } = useUser();
  const router = useRouter();
  return (
    <Box w="16" bg="white">
      <Icon
        as={MdOutlineHome}
        fontSize={45}
        pl={5}
        mt={5}
        cursor="pointer"
        onClick={() => router.push("/user")}
      />
    </Box>
  );
}

export default UserPageLayout;
