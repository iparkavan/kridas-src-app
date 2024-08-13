import { Box, Grid, GridItem } from "@chakra-ui/react";
import { HeadingMedium } from "../ui/heading/heading";
import { TextMedium, TextSmall } from "../ui/text/text";

const OrderDetailsSummary = ({ orderData }) => {
  const { orderItem: orderItems, orderFinalAmt, orderCurrency } = orderData;

  const totalItemsPrice = orderItems.reduce(
    (total, item) => total + item.itemTotalAmt,
    0
  );

  const totalItemsTax = orderItems.reduce(
    (total, item) => total + item.itemTaxAmt * item.quantity,
    0
  );

  return (
    <Box border="1px solid" borderColor="gray.500" borderRadius="lg" h="full">
      <Box bg="primary.500" borderRadius="lg" p={8} textAlign="center">
        <HeadingMedium color="white">Order Summary</HeadingMedium>
      </Box>
      <Box p={5}>
        <Grid templateColumns="2fr 1fr" rowGap={5}>
          <GridItem>
            <TextMedium>Total Value</TextMedium>
          </GridItem>
          <GridItem justifySelf="end">
            {totalItemsPrice} {orderCurrency}
          </GridItem>
          <GridItem>
            <TextMedium>Taxes</TextMedium>
          </GridItem>
          <GridItem justifySelf="end">
            {totalItemsTax} {orderCurrency}
          </GridItem>
          {/* Need Condition to check if Kridas Points Redeemed and Redeemed Value */}
          {/* {true && (
            <>
              <GridItem>
                <TextMedium>Cash Redeemed using Kridas Points</TextMedium>
              </GridItem>
              <GridItem justifySelf="end">100 {orderCurrency}</GridItem>
            </>
          )} */}
          <GridItem>Total Payment</GridItem>
          <GridItem justifySelf="end">
            {orderFinalAmt} {orderCurrency}
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

export default OrderDetailsSummary;
