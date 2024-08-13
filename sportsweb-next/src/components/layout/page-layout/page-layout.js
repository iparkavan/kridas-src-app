import { Box, Container, HStack } from "@chakra-ui/react";
import Header from "../header";

const PageLayout = (props) => {
  return (
    <HStack alignItems="strech" width="full" height="100%" spacing={0}>
      <Box minWidth={{ base: "10px", md: "30px", lg: "60px" }} bg="white"></Box>

      <Box
        width="full"
        px={{ base: "5px", md: "30px", lg: "60px" }}
        py={6}
        minHeight="100vh"
      >
        {props.children}
      </Box>
      <Box minWidth={{ base: "10px", md: "30px", lg: "60px" }} bg="white"></Box>
    </HStack>
  );
};

export default PageLayout;
