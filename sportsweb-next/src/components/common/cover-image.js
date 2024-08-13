import { Box } from "@chakra-ui/react";

const CoverImage = (props) => {
  const { modalOpen, coverimage } = props;
  return (
    <Box
      borderTopRightRadius={10}
      borderTopLeftRadius={10}
      h="300px"
      w="full"
      display="flex"
      justifyContent="center"
      alignItems="center"
      backgroundImage={"url(" + coverimage + ")"}
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize={{ base: "contain", md: "100% 100%" }}
      onClick={modalOpen}
      cursor="pointer"
    />
  );
};

export default CoverImage;
