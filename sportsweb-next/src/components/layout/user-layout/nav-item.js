import React from "react";
import {
  Flex,
  Text,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Box,
  Center,
} from "@chakra-ui/react";
import NextLink from "next/link";
import NavHoverBox from "./nav-hover-box";
import { HeadingSmall, HeadingXtraSmall } from "../../ui/heading/heading";
import * as classes from "./user-layout.module.css";
import { TextCustom, TextSmall } from "../../ui/text/text";

export default function NavItem({
  icon,
  title,
  description,
  active,
  navSize,
  href,
}) {
  return (
    <Flex
      my={1}
      flexDir="column"
      w="100%"
      alignItems={navSize == "MIN" ? "center" : "flex-start"}
      justifyContent="center"
      // height="full"
    >
      <Menu placement="right">
        <NextLink href={href} passHref>
          <Link
            backgroundColor={active && navSize == "MAX" && "gray.100"}
            p={2}
            borderTopLeftRadius={20}
            borderBottomLeftRadius={20}
            borderTopRightRadius={{ base: 20, md: "none" }}
            borderBottomRightRadius={{ base: 20, md: "none" }}
            _hover={{ textDecor: "none" }}
            w={navSize == "MAX" && "100%"}
            position={"relative"}
            display={"block"}
          >
            {active && navSize == "MAX" ? (
              <>
                <div className={classes.topcorner}></div>
                <div className={classes.bottomcorner}></div>
              </>
            ) : (
              ""
            )}

            <MenuButton
              w="100%"
              height="full"
              _hover={{ transform: "translateX(6px)", color: "primary.500" }}
              transition={"transform 0.4s ease"}
            >
              <Flex
                flexDirection={navSize == "MIN" ? "column" : "row"}
                alignItems="center"
                height="full"
              >
                <Center
                  bgColor={active ? "primary.500" : "inherit"}
                  p={1}
                  rounded={20}
                >
                  <Icon
                    as={icon}
                    fontSize={navSize == "MIN" ? "xl" : "2xl"}
                    color={active ? "white" : "inherit"}
                    rounded={20}
                  />
                </Center>

                <TextCustom
                  fontSize={navSize == "MIN" ? "xs" : "sm"}
                  ml={navSize == "MAX" && 3}
                  color={active ? "primary.500" : "inherit"}
                  fontWeight="medium"
                >
                  {title}
                </TextCustom>
              </Flex>
            </MenuButton>
          </Link>
        </NextLink>
      </Menu>
    </Flex>
  );
}
