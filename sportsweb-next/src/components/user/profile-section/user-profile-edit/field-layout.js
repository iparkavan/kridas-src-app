import { Flex } from "@chakra-ui/react";
import LabelText from "../../../ui/text/label-text";

const FieldLayout = ({ label, children }) => {
  return (
    <Flex
      w="full"
      direction={{ base: "column", md: "row" }}
      gap={{ base: 2, md: 10 }}
      // align={{ base: "flex-start", md: "center" }}
    >
      <LabelText minW="25%">{label}</LabelText>
      {children}
    </Flex>
  );
};

export default FieldLayout;
