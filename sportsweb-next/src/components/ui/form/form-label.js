import { FormLabel } from "@chakra-ui/react";

const CustomFormLabel = (props) => {
  return (
    <FormLabel
      color="primary.500"
      fontSize="sm"
      fontWeight="medium"
      mb={1}
      {...props}
    />
  );
};

export default CustomFormLabel;
