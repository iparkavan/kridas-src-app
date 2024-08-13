import { Box } from "@chakra-ui/react";

const EmptyCoverImage = (props) => {
  const { coverimage } = props;
  return (
    <Box
      borderTopRightRadius={10}
      borderTopLeftRadius={10}
      h="300px"
      w="full"
      display="flex"
      justifyContent="center"
      alignItems="center"
      backgroundImage={coverimage ? coverimage : "none"}
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      {...props}
    >{props.children}</Box>
  );
};

export default EmptyCoverImage;
