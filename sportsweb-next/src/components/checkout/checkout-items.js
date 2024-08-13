import {
  Divider,
  Grid,
  GridItem,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { HeadingSmall } from "../ui/heading/heading";
import { TextMedium } from "../ui/text/text";
import CheckoutItem from "./checkout-item";

const CheckoutItems = ({ cartData }) => {
  const totalQuantity = cartData.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalPrice = cartData.reduce(
    (total, item) => total + item.productSpecialPrice * item.quantity,
    0
  );
  const currency = cartData[0].productPriceCurrency;

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
      {cartData.map((cartItem) => (
        <CheckoutItem
          key={cartItem.shoppingCartId}
          cartItem={cartItem}
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
            {totalPrice} {currency}
          </HeadingSmall>
        </HStack>
      </GridItem>
      <GridItem display={desktopDisplay}>
        <TextMedium>{totalQuantity}</TextMedium>
      </GridItem>
      <GridItem display={desktopDisplay} mr={1}>
        <TextMedium wordBreak="break-all">
          {totalPrice} {currency}
        </TextMedium>
      </GridItem>
      <GridItem colSpan={{ lg: 3 }} justifySelf="stretch">
        <Divider borderColor="gray.400" />
      </GridItem>
    </Grid>
  );
};

export default CheckoutItems;
