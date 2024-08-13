import { Box, Flex, Grid, Skeleton, Stack, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { useOrder } from "../../hooks/order-hooks";
import { HeadingMedium } from "../ui/heading/heading";
import { TextCustom } from "../ui/text/text";
import OrderDetailsSummary from "./order-details-summary";
import OrderDetailsItems from "./order-details-items";
import Button from "../ui/button";
import { CloseIcon, ShoppingBagIcon, StarIcon } from "../ui/icons";
import routes from "../../helper/constants/route-constants";
import {
  addProductsToCart,
  verifyCartQuantity,
} from "../../helper/constants/cart-constants";
import { useUser } from "../../hooks/user-hooks";
import { useAddToCart } from "../../hooks/cart-hooks";
import { useProductCount } from "../../hooks/product-hooks";

const OrderDetails = ({ orderId }) => {
  const router = useRouter();
  const toast = useToast();
  const { data: userData } = useUser();
  const { data: orderData, isLoading } = useOrder(orderId);
  const { mutateAsync: cartMutateAsync, isLoading: isCartLoading } =
    useAddToCart();
  const { mutateAsync: countMutateAsync, isLoading: isCountLoading } =
    useProductCount();

  const formatDate = (date) => format(new Date(date), "dd/MM/yyyy");

  if (isLoading) {
    return <Skeleton />;
  }

  const isOrderService = orderData.orderItem.some(
    (item) => item.productTypeId === "SER"
  );
  const isOrderEvent = orderData.orderItem.some(
    (item) => item.productTypeId === "EPRD"
  );

  const handleOrderAgain = async () => {
    const areItemsAvailable = await verifyCartQuantity(
      orderData.orderItem,
      countMutateAsync,
      toast
    );

    if (!areItemsAvailable) {
      return;
    }

    await addProductsToCart(
      orderData.orderItem,
      cartMutateAsync,
      userData?.user_id
    );

    router.push(routes.cart);
  };

  return (
    <Box>
      <Box bg="white" borderRadius="lg" p={4}>
        <HeadingMedium>Order Details</HeadingMedium>
      </Box>
      <Box bg="white" borderRadius="lg" p={4} mt={3}>
        <Stack
          spacing={3}
          direction={{ base: "column", lg: "row" }}
          justifyContent="space-between"
          mb={{ base: 5, lg: 10 }}
        >
          <TextCustom fontSize="lg" fontWeight="medium">
            <Box as="span" color="primary.500">
              Date:{" "}
            </Box>
            {formatDate(orderData.orderDate)}
          </TextCustom>
          <TextCustom fontSize="lg" fontWeight="medium">
            <Box as="span" color="primary.500">
              Total:{" "}
            </Box>
            {/* {orderData.itemTotalAmt} */}
            {orderData.orderFinalAmt} {orderData.orderCurrency}
          </TextCustom>
          <TextCustom fontSize="lg" fontWeight="medium">
            <Box as="span" color="primary.500">
              Order ID:{" "}
            </Box>
            {orderData.orderId}
          </TextCustom>
        </Stack>

        <Grid templateColumns={{ lg: "70% 30%" }} rowGap={6}>
          <OrderDetailsItems orderData={orderData} />
          <OrderDetailsSummary orderData={orderData} />
        </Grid>

        <Flex mt={10} mb={5} gap={4}>
          {!isOrderService && !isOrderEvent && (
            <Button
              variant="ghost"
              color="primary.500"
              leftIcon={<ShoppingBagIcon />}
              isLoading={isCountLoading || isCartLoading}
              onClick={handleOrderAgain}
            >
              ORDER AGAIN
            </Button>
          )}
          {/* <Button
            ml="auto"
            variant="outline"
            colorScheme="gray"
            leftIcon={<StarIcon color="var(--chakra-colors-primary-500)" />}
          >
            Write a review
          </Button> */}
          <Button
            ml="auto"
            variant="outline"
            colorScheme="gray"
            leftIcon={<CloseIcon color="red" />}
            onClick={() => router.push(routes.orders)}
          >
            Close
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default OrderDetails;
