import { Box, Circle, Flex, HStack, IconButton } from "@chakra-ui/react";
import { AddIcon, CloseIcon, MinusIcon } from "../ui/icons";
import { TextMedium, TextSmall } from "../ui/text/text";

const ResponsiveCartItem = (props) => {
  const {
    cartItem,
    onOpen,
    totalPrice,
    handleUpdate,
    isLoading,
    isMinusLoading,
  } = props;

  return (
    <Box p={3} borderRadius="md" border="1px solid" borderColor="gray.300">
      <Flex justifyContent="space-between" gap={4}>
        <Box>
          <TextMedium noOfLines={2} wordBreak="break-all">
            {cartItem.productName}
          </TextMedium>
          <HStack mt={1}>
            <Circle h="4px" w="4px" bgColor="gray.500" />
            <TextSmall color="gray.500" noOfLines={1}>
              {cartItem.productDesc}
            </TextSmall>
          </HStack>
        </Box>
        <IconButton
          icon={<CloseIcon fontSize="16px" />}
          colorScheme="primary"
          variant="ghost"
          size="xs"
          onClick={onOpen}
        />
      </Flex>
      <HStack mt={3} spacing={4} justifyContent="space-between">
        <HStack>
          <IconButton
            icon={<MinusIcon fontSize="16px" />}
            colorScheme="primary"
            variant="ghost"
            size="xs"
            isLoading={isMinusLoading}
            onClick={() => handleUpdate("delete")}
          />
          <TextMedium>{cartItem.quantity}</TextMedium>
          <IconButton
            icon={<AddIcon fontSize="16px" />}
            colorScheme="primary"
            variant="ghost"
            size="xs"
            isLoading={isLoading}
            onClick={() => handleUpdate("add")}
          />
        </HStack>
        <TextMedium wordBreak="break-all">
          {totalPrice} {cartItem.productPriceCurrency}
        </TextMedium>
      </HStack>
    </Box>
  );
};

export default ResponsiveCartItem;
