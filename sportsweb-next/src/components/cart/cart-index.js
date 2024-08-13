import {
  Box,
  Divider,
  GridItem,
  HStack,
  Grid,
  useToast,
  Skeleton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  HeadingMedium,
  HeadingSmall,
} from "../../../src/components/ui/heading/heading";
import { useCartContext } from "../../context/cart-context";
import { verifyCartQuantity } from "../../helper/constants/cart-constants";
import routes from "../../helper/constants/route-constants";
import { useUserCart } from "../../hooks/cart-hooks";
import { useProductCount } from "../../hooks/product-hooks";
import { useUser } from "../../hooks/user-hooks";
import Button from "../ui/button";
import { TextMedium } from "../ui/text/text";
import CartItem from "./cart-item";

const CartIndex = () => {
  const router = useRouter();
  const { data: userData } = useUser();
  const toast = useToast();
  const { mutateAsync, isLoading: isCountLoading } = useProductCount();
  const {
    data: cartData,
    isLoading: isCartLoading,
    isSuccess: isCartSuccess,
  } = useUserCart(userData?.user_id, {
    select: (data) => {
      if (data === "") {
        return [];
      } else {
        return data.filter(
          (item) =>
            item.productTypeId !== "SER" && item.productTypeId !== "EPRD"
        );
      }
    },
  });
  const { cartItems } = useCartContext();

  const isCartPresent = Boolean(isCartSuccess && cartData.length > 0);

  const totalPrice =
    isCartPresent &&
    cartData.reduce((total, item) => {
      return total + item.productSpecialPrice * item.quantity;
    }, 0);

  const currency = isCartPresent && cartData[0].productPriceCurrency;

  const handleCheckout = async () => {
    // Filter not needed here as cartData is already filtered
    // const filteredCart = cartData?.filter(
    //   (cartItem) => cartItem.productTypeId !== "SER"
    // );

    // Verifying quantity only for products & vouchers
    const areItemsAvailable = await verifyCartQuantity(
      cartItems,
      mutateAsync,
      toast
    );

    if (areItemsAvailable) {
      router.push(routes.checkoutProducts);
    }
  };

  const desktopDisplay = useBreakpointValue({ base: "none", lg: "initial" });

  return (
    <Skeleton w="full" isLoaded={!isCartLoading}>
      <Box p={5} borderRadius="lg" bg="white">
        <HeadingMedium>Your Cart ({cartData?.length})</HeadingMedium>
        {!isCartPresent ? (
          <TextMedium mt={4}>No items are present in the cart</TextMedium>
        ) : (
          <Grid
            templateColumns={{ base: "85% 1fr", lg: "50% 2fr 2fr 1fr 1fr" }}
            mt={4}
            rowGap={5}
            columnGap={{ base: 4, lg: 10 }}
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
            <GridItem display={desktopDisplay} colSpan={2} />
            <GridItem
              display={desktopDisplay}
              colSpan={5}
              justifySelf="stretch"
            >
              <Divider borderColor="gray.400" />
            </GridItem>
            {cartData.map((cartItem) => (
              <CartItem
                key={cartItem.shoppingCartId}
                cartItem={cartItem}
                desktopDisplay={desktopDisplay}
              />
            ))}
            <GridItem colSpan={{ base: 2, lg: 5 }} justifySelf="stretch">
              <Divider borderColor="gray.400" />
            </GridItem>
            <GridItem colSpan={2} w="full" justifySelf="start">
              <HStack justifyContent="space-between">
                <HeadingSmall>Total</HeadingSmall>
                {/* Mobile Styles */}
                <HeadingSmall display={{ lg: "none" }}>
                  {totalPrice} {currency}
                </HeadingSmall>
              </HStack>
            </GridItem>
            <GridItem display={desktopDisplay}>
              <HeadingSmall>
                {totalPrice} {currency}
              </HeadingSmall>
            </GridItem>
            <GridItem display={desktopDisplay} colSpan={2} />
            <GridItem colSpan={{ base: 2, lg: 5 }} justifySelf="stretch">
              <Divider borderColor="gray.400" />
            </GridItem>
          </Grid>
        )}
        <HStack mt={5} spacing={5} justifyContent="flex-end">
          {isCartPresent && (
            <Button
              isLoading={isCountLoading}
              onClick={handleCheckout}
              disabled={isCountLoading || cartItems.length === 0}
            >
              Checkout
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => router.push(routes.products)}
          >
            Continue Shopping
          </Button>
        </HStack>
      </Box>
    </Skeleton>
  );
};

export default CartIndex;
