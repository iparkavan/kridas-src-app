import { Button as CButton } from "@chakra-ui/react";

const Button = (props) => {
  return (
    <CButton
      colorScheme="primary"
      fontWeight="normal"
      borderRadius="base"
      {...props}
    />
  );
};

export default Button;
