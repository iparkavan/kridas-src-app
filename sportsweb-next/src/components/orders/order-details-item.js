import { Box, Circle, GridItem, HStack } from "@chakra-ui/react";
import { format } from "date-fns";
import { TextMedium, TextSmall } from "../ui/text/text";

const OrderDetailsItem = ({ orderItem, desktopDisplay }) => {
  const isCalendarType =
    orderItem.productTypeId === "SER" && orderItem.orderItemAttrList.length > 0;
  let calendarSlot;
  if (isCalendarType) {
    const orderItemAttr = orderItem.orderItemAttrList[0];
    // const date = format(new Date(orderItemAttr.dateScheduled), "dd/MM/yyyy");
    const date = format(new Date(orderItemAttr.startTime), "dd/MM/yyyy");
    const startTime = format(new Date(orderItemAttr.startTime), "hh:mm aa");
    const endTime = format(new Date(orderItemAttr.endTime), "hh:mm aa");
    calendarSlot = `${date} (${startTime} - ${endTime})`;
  }

  return (
    <>
      {/* Desktop Styles */}
      <GridItem display={desktopDisplay} justifySelf="start" w="full">
        <Box border="1px" borderColor="gray.400" padding={4} borderRadius="lg">
          <TextMedium noOfLines={2}>{orderItem.productName}</TextMedium>
          <HStack mt={1}>
            <Circle h="4px" w="4px" bgColor="gray.500" />
            <TextSmall color="gray.500" noOfLines={1}>
              {orderItem.productDesc}
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
        <TextMedium>{orderItem.quantity}</TextMedium>
      </GridItem>
      <GridItem display={desktopDisplay} mr={1}>
        <TextMedium wordBreak="break-all">
          {orderItem.itemTotalAmt} {orderItem.itemCurrency}
        </TextMedium>
      </GridItem>

      {/* Mobile Styles */}
      <GridItem display={{ lg: "none" }} w="full">
        <Box p={3} borderRadius="md" border="1px solid" borderColor="gray.300">
          <TextMedium noOfLines={2} wordBreak="break-all">
            {orderItem.productName}
          </TextMedium>
          <HStack mt={1}>
            <Circle h="4px" w="4px" bgColor="gray.500" />
            <TextSmall color="gray.500" noOfLines={1}>
              {orderItem.productDesc}
            </TextSmall>
          </HStack>
          {isCalendarType && (
            <TextSmall mt={1} color="gray.500">
              {calendarSlot}
            </TextSmall>
          )}
          <HStack mt={3} spacing={4} justifyContent="space-between">
            <TextMedium>Quantity: {orderItem.quantity}</TextMedium>
            <TextMedium wordBreak="break-all">
              {orderItem.itemTotalAmt} {orderItem.itemCurrency}
            </TextMedium>
          </HStack>
        </Box>
      </GridItem>
    </>
  );
};

export default OrderDetailsItem;
