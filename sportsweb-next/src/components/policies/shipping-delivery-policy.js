import { Box, ListItem, UnorderedList } from "@chakra-ui/react";
import { HeadingMedium } from "../ui/heading/heading";

const ShippingDeliveryPolicy = () => {
  return (
    <Box>
      <HeadingMedium my={5}>SHIPPING AND DELIVERY POLICY</HeadingMedium>
      <UnorderedList spacing={5}>
        <ListItem>
          Kridas - The sports platform is an aggregator platform where a rewards
          based transactions are made for preferred sports products, vouchers or
          services.
        </ListItem>
        <ListItem>
          Kridas - The sports platform will not engage in any shipping or
          delivery fulfilment directly.
        </ListItem>
        <ListItem>
          Entire fulfilment journey for an end user/customer will be with our
          partnered retailers, service providers or event organisers.
        </ListItem>
        <ListItem>
          We recommend you to read terms & conditions of our partners before
          completing your transaction within Kridas - The sports platform.
        </ListItem>
        <ListItem>
          For any issues or concern please write to us on support@kridas.com
        </ListItem>
      </UnorderedList>
    </Box>
  );
};

export default ShippingDeliveryPolicy;
