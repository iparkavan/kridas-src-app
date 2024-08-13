import NextLink from "next/link";
import { Box, Container, Link, Image } from "@chakra-ui/react";
import routes from "../../src/helper/constants/route-constants";
import ShippingDeliveryPolicy from "../../src/components/policies/shipping-delivery-policy";

const ShippingDeliveryPolicyIndex = () => {
  return (
    <Box bg="white">
      <Box as="header" boxShadow="md" py={4}>
        <Container maxW="6xl">
          <NextLink href={routes.login} passHref>
            <Link>
              <Image
                src="/kridas-logo.svg"
                alt="Kridas - Logo"
                width="250px"
                height="50px"
              />
            </Link>
          </NextLink>
        </Container>
      </Box>
      <Container maxW="6xl">
        <ShippingDeliveryPolicy />
      </Container>
    </Box>
  );
};

export default ShippingDeliveryPolicyIndex;
