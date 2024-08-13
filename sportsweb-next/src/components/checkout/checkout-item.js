import { Box, Circle, GridItem, HStack } from "@chakra-ui/react";
import { TextMedium, TextSmall } from "../ui/text/text";
import { getCTServiceDateTime } from "../../helper/constants/cart-constants";

const CheckoutItem = ({ cartItem, desktopDisplay }) => {
  const isCalendarType = cartItem.shoppingCartAttrList.length > 0;
  let calendarSlot;
  if (isCalendarType) {
    calendarSlot = getCTServiceDateTime(cartItem.shoppingCartAttrList[0]);
  }
  const totalPrice = cartItem.quantity * cartItem.productSpecialPrice;

  return (
    <>
      {/* Desktop Styles */}
      <GridItem display={desktopDisplay} justifySelf="start" w="full">
        <Box border="1px" borderColor="gray.400" padding={4} borderRadius="lg">
          <TextMedium noOfLines={2}>{cartItem.productName}</TextMedium>
          <HStack mt={1}>
            <Circle h="4px" w="4px" bgColor="gray.500" />
            <TextSmall color="gray.500" noOfLines={1}>
              {cartItem.productDesc}
            </TextSmall>
          </HStack>
          {isCalendarType && (
            <TextSmall mt={1} color="gray.500">
              {calendarSlot}
            </TextSmall>
          )}
        </Box>
      </GridItem>
      <GridItem display={desktopDisplay}>
        <TextMedium>{cartItem.quantity}</TextMedium>
      </GridItem>
      <GridItem display={desktopDisplay} mr={1}>
        <TextMedium wordBreak="break-all">
          {totalPrice} {cartItem.productPriceCurrency}
        </TextMedium>
      </GridItem>

      {/* Mobile Styles */}
      <GridItem display={{ lg: "none" }} w="full">
        <Box p={3} borderRadius="md" border="1px solid" borderColor="gray.300">
          <TextMedium noOfLines={2} wordBreak="break-all">
            {cartItem.productName}
          </TextMedium>
          <HStack mt={1}>
            <Circle h="4px" w="4px" bgColor="gray.500" />
            <TextSmall color="gray.500" noOfLines={1}>
              {cartItem.productDesc}
            </TextSmall>
          </HStack>
          {isCalendarType && (
            <TextSmall mt={1} color="gray.500">
              {calendarSlot}
            </TextSmall>
          )}
          <HStack mt={3} spacing={4} justifyContent="space-between">
            <TextMedium>Quantity: {cartItem.quantity}</TextMedium>
            <TextMedium wordBreak="break-all">
              {totalPrice} {cartItem.productPriceCurrency}
            </TextMedium>
          </HStack>
        </Box>
      </GridItem>
    </>
  );
};

export default CheckoutItem;
