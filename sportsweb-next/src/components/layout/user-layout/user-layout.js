import { useEffect, useState } from "react";
import { Box, HStack, useMediaQuery, Flex, IconButton } from "@chakra-ui/react";
import Header from "../header";
import Sidebar from "./sidebar";
import { ArrowUpIcon } from "../../ui/icons";

const UserLayout = (props) => {
  const [isLargerThan1280] = useMediaQuery("(min-width: 1280px)");
  const [sideMenuSize, setSideMenuSize] = useState("MAX");
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const size = window.localStorage.getItem("sideMenuSize");
    if (size) {
      setSideMenuSize(size);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollButton(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuToggle = () => {
    const size = sideMenuSize === "MIN" ? "MAX" : "MIN";
    setSideMenuSize(size);
    window.localStorage.setItem("sideMenuSize", size);
  };

  return (
    <HStack alignItems="strech" width="full" height="full" spacing={0}>
      <Flex
        minHeight="100vh"
        sx={{
          "@media screen and (max-width: 768px)": {
            display: "none",
          },
        }}
        align="flex-start"
        bg="white"
      >
        <Sidebar navSize={sideMenuSize} {...props}></Sidebar>
      </Flex>
      <Box width="full" minHeight="100vh" minWidth="0px">
        <Header handleMenuToggle={handleMenuToggle} />
        <Flex width="full" px={6} py={6} minHeight="100vh" isolation="isolate">
          <Box w="full">{props.children}</Box>
          <Box
            display={{ base: "none", md: "inherit" }}
            w={sideMenuSize === "MIN" ? "150px" : "0px"}
            transition="all 0.4s"
          />
        </Flex>
      </Box>
      {showScrollButton && (
        <IconButton
          colorScheme="primary"
          icon={<ArrowUpIcon />}
          pos="fixed"
          bottom={5}
          right={5}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
      )}
    </HStack>
  );
};

export default UserLayout;
