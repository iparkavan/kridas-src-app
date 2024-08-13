import { Box, VStack } from "@chakra-ui/react";
import { useOrders } from "../../hooks/order-hooks";
import { useUser } from "../../hooks/user-hooks";
import { HeadingMedium } from "../ui/heading/heading";
import Skeleton from "../ui/skeleton";
import { TextMedium } from "../ui/text/text";
import OrderItem from "./order-item";

const OrderHistory = () => {
  const { data: userData } = useUser();
  const {
    data: ordersData,
    isLoading,
    isSuccess,
  } = useOrders({
    userId: userData?.user_id,
  });

  let updatedOrders = ordersData;
  if (isSuccess && ordersData === "") {
    updatedOrders = [];
  }

  const areOrdersPresent = Boolean(isSuccess && updatedOrders?.length > 0);

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <Box>
      <Box bg="white" p={5} borderRadius="lg">
        <HeadingMedium>Order History</HeadingMedium>
      </Box>
      {!areOrdersPresent ? (
        <Box bg="white" p={5} borderRadius="lg" mt={4}>
          <TextMedium>No orders are present</TextMedium>
        </Box>
      ) : (
        <VStack mt={4} spacing={3}>
          {updatedOrders.map((order) => (
            <OrderItem key={order.orderId} order={order} />
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default OrderHistory;
