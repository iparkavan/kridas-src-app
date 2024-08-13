import {
  Divider,
  Grid,
  GridItem,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { HeadingSmall } from "../ui/heading/heading";
import { TextMedium } from "../ui/text/text";
import OrderDetailsItem from "./order-details-item";

const OrderDetailsItems = ({ orderData }) => {
  const { orderItem: orderItems, orderCurrency } = orderData;

  const totalItemsPrice = orderItems.reduce(
    (total, item) => total + item.itemTotalAmt,
    0
  );

  const totalQuantity = orderItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const desktopDisplay = useBreakpointValue({ base: "none", lg: "initial" });

  return (
    <Grid
      templateColumns={{ lg: "50% repeat(2, 1fr)" }}
      rowGap={3}
      columnGap={5}
      justifyItems="center"
      alignItems="center"
    >
      <GridItem display={desktopDisplay} justifySelf="start">
        <HeadingSmall color="primary.500">Items</HeadingSmall>
      </GridItem>
      <GridItem display={desktopDisplay}>
        <HeadingSmall color="primary.500">Quantity</HeadingSmall>
      </GridItem>
      <GridItem display={desktopDisplay}>
        <HeadingSmall color="primary.500">Price</HeadingSmall>
      </GridItem>
      <GridItem display={desktopDisplay} colSpan={3} justifySelf="stretch">
        <Divider borderColor="gray.400" />
      </GridItem>
      {orderItems.map((orderItem) => (
        <OrderDetailsItem
          key={orderItem.orderItemId}
          orderItem={orderItem}
          desktopDisplay={desktopDisplay}
        />
      ))}
      <GridItem colSpan={{ lg: 3 }} justifySelf="stretch">
        <Divider borderColor="gray.400" />
      </GridItem>
      <GridItem w="full" justifySelf="start">
        <HStack justifyContent="space-between">
          <HeadingSmall>Total</HeadingSmall>
          {/* Mobile Styles */}
          <HeadingSmall display={{ lg: "none" }}>
            {totalItemsPrice} {orderCurrency}
          </HeadingSmall>
        </HStack>
      </GridItem>
      <GridItem display={desktopDisplay}>
        <TextMedium>{totalQuantity}</TextMedium>
      </GridItem>
      <GridItem display={desktopDisplay}>
        <TextMedium wordBreak="break-all">
          {totalItemsPrice} {orderCurrency}
        </TextMedium>
      </GridItem>
      <GridItem colSpan={{ lg: 3 }} justifySelf="stretch">
        <Divider borderColor="gray.400" />
      </GridItem>
    </Grid>
  );
};

export default OrderDetailsItems;
