import { useState, useEffect } from "react";
import { Alert, AlertIcon, Box, Grid, Link } from "@chakra-ui/react";
import { useRouter } from "next/router";
import NextLink from "next/link";

import { HeadingMedium } from "../../../src/components/ui/heading/heading";
import CheckoutItems from "./checkout-items";
import OrderSummary from "./order-summary";
import CheckoutPoints from "./checkout-points";
import { useUserCart } from "../../hooks/cart-hooks";
import { useUser } from "../../hooks/user-hooks";
import { TextMedium } from "../ui/text/text";
import { useLookupTable } from "../../hooks/lookup-table-hooks";
import routes from "../../helper/constants/route-constants";
import { useCartContext } from "../../context/cart-context";

const CheckOutIndex = () => {
  const router = useRouter();
  const { type } = router.query;
  const { data: userData } = useUser();
  const { data: cartData, isSuccess } = useUserCart(userData?.user_id);
  const { data: rewardPointsWorth = [] } = useLookupTable("RWR");
  let updatedCart = cartData;
  if (isSuccess && cartData === "") {
    updatedCart = [];
  }
  const { cartItems } = useCartContext();

  const isTypeService = type === "service";
  const isTypeEvent = type === "event";
  if (isTypeService) {
    updatedCart = updatedCart?.filter(
      (cartItem) => cartItem.productTypeId === "SER"
    );
  } else if (isTypeEvent) {
    updatedCart = updatedCart?.filter(
      (cartItem) => cartItem.productTypeId === "EPRD"
    );
  } else {
    updatedCart = cartItems;
  }

  const isCartPresent = Boolean(isSuccess && updatedCart?.length > 0);
  let isAddressPresent = false;
  if (userData?.address) {
    isAddressPresent = Object.values(userData.address).some((val) => val);
  }

  const totalPrice =
    isCartPresent &&
    updatedCart.reduce((total, item) => {
      return total + item.productSpecialPrice * item.quantity;
    }, 0);

  const priceCurrency = isCartPresent && updatedCart[0].productPriceCurrency;
  const rewardPointsForCurrency = rewardPointsWorth?.find(
    (rewardPoint) => rewardPoint.lookup_key === priceCurrency
  )?.lookup_value;
  const rewardPoints = Number(userData?.reward_point);
  const cashForRewardPoints =
    rewardPoints * Number(rewardPointsForCurrency) || 0;
  // const cashForRewardPoints = rewardPoints / 5;
  const maxCashRedeemed = Math.min(cashForRewardPoints, totalPrice);
  const [cashRedeemed, setCashRedeemed] = useState(0);

  useEffect(() => {
    setCashRedeemed(0);
  }, [maxCashRedeemed]);

  return (
    <Box p={5} borderRadius="lg" bg="white">
      {isSuccess && (
        <>
          {!isAddressPresent && (
            <Alert status="info" borderRadius="lg" mb={4}>
              <AlertIcon />
              Please&nbsp;
              <NextLink href={routes.editProfile} passHref>
                <Link fontWeight="medium" textDecoration="underline">
                  update your address
                </Link>
              </NextLink>
              &nbsp;before placing an order.
            </Alert>
          )}
          <HeadingMedium mb={3}>Order Checkout</HeadingMedium>
          {isCartPresent ? (
            <Grid templateColumns={{ lg: "70% 30%" }} rowGap={6}>
              <Box>
                <CheckoutItems cartData={updatedCart} />
                <CheckoutPoints
                  rewardPoints={rewardPoints}
                  cashForRewardPoints={cashForRewardPoints}
                  rewardPointsForCurrency={rewardPointsForCurrency}
                  maxCashRedeemed={maxCashRedeemed}
                  setCashRedeemed={setCashRedeemed}
                />
              </Box>
              <Box>
                <OrderSummary
                  totalPrice={totalPrice}
                  cashRedeemed={cashRedeemed}
                  priceCurrency={priceCurrency}
                  rewardPointsForCurrency={rewardPointsForCurrency}
                  cartData={updatedCart}
                  isAddressPresent={isAddressPresent}
                  isTypeService={isTypeService}
                  isTypeEvent={isTypeEvent}
                />
              </Box>
            </Grid>
          ) : (
            <TextMedium>No items to checkout</TextMedium>
          )}
        </>
      )}
    </Box>
  );
};

export default CheckOutIndex;
