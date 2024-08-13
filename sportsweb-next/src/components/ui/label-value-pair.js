import { VStack } from "@chakra-ui/react";
import LabelText from "./text/label-text";
import LabelValue from "./text/label-value";

const LabelValuePair = (props) => {
  const { label } = props;
  return (
    <VStack alignItems="flex-start" spacing={1} width="full">
      <LabelText>{label}</LabelText>
      <LabelValue>{props.children}</LabelValue>
    </VStack>
  );
};

export default LabelValuePair;
