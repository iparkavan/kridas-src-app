import { Grid, GridItem, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { format } from "date-fns";
import routes from "../../helper/constants/route-constants";
import { TextMedium } from "../ui/text/text";
import { HeadingSmall } from "../ui/heading/heading";

const OrderItem = ({ order }) => {
  const formatDate = (date) => format(new Date(date), "dd/MM/yyyy");
  // const formatDate = (date) => format(new Date(date), "dd/MM/yyyy, h:mm aa");

  return (
    <Grid
      templateColumns={{ base: "auto auto" }}
      w="full"
      bg="white"
      p={5}
      borderRadius="lg"
      gap={4}
    >
      <GridItem>
        <HeadingSmall noOfLines={1}> Order Id: {order.orderId}</HeadingSmall>
      </GridItem>
      <GridItem justifySelf="end">
        <HeadingSmall>
          {/* {order.itemTotalAmt} */}
          Total: {order.orderFinalAmt} {order.orderCurrency}
        </HeadingSmall>
      </GridItem>

      <GridItem>
        <TextMedium color="primary.500">
          Date: {formatDate(order.orderDate)}
        </TextMedium>
      </GridItem>

      {/* <AvatarGroup max={2}>
          <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
          <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
          <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
          <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
          <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
        </AvatarGroup> */}

      <GridItem justifySelf="end">
        <NextLink href={routes.order(order.orderId)} passHref>
          <Link color="primary.500">View Details</Link>
        </NextLink>
      </GridItem>
    </Grid>
  );
};

export default OrderItem;
