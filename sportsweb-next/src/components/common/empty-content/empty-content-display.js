import { Box } from "@chakra-ui/react";

import { TextMedium } from "../../ui/text/text";

const EmptyContentDisplay = (props) => {
  const { displayText, ...otherProps } = props;
  return (
    <Box width="full" bgColor="white" p="3" borderRadius={10} {...otherProps}>
      <TextMedium>{displayText}</TextMedium>
    </Box>
  );
};

export default EmptyContentDisplay;
