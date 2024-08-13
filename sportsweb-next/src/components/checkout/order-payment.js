import { useState, useEffect, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Box, Flex } from "@chakra-ui/layout";
import secureLocalStorage from "react-secure-storage";
import { HeadingMedium } from "../ui/heading/heading";
import { useCreatePaymentIntent } from "../../hooks/order-hooks";
import OrderPaymentForm from "./order-payment-form";
import { useLocation } from "../../hooks/location-hooks";

const secureOrderKey = "KRIDAS_ORDER";

const OrderPayment = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [publishableStripeKey, setPublishableStripeKey] = useState();
  const { mutate } = useCreatePaymentIntent();
  const { data: locationData, isSuccess } = useLocation();

  const stripePromise = useMemo(
    () => publishableStripeKey && loadStripe(publishableStripeKey),
    [publishableStripeKey]
  );

  useEffect(() => {
    if (isSuccess && locationData) {
      if (locationData.countryCode === "SG") {
        setPublishableStripeKey(process.env.NEXT_PUBLIC_STRIPE_SG_KEY);
      } else {
        setPublishableStripeKey(process.env.NEXT_PUBLIC_STRIPE_IN_KEY);
      }
    }
  }, [isSuccess, locationData]);

  useEffect(() => {
    // let orderObj = window.localStorage.getItem(secureOrderKey);
    const orderObj = secureLocalStorage.getItem(secureOrderKey);
    if (orderObj) {
      // For regular local storage
      // orderObj = JSON.parse(orderObj);
      mutate(orderObj.paymentDTOList, {
        onSuccess: (data) => {
          setClientSecret(data.clientSecret);
        },
      });
    }
  }, [mutate]);

  const options = { clientSecret };

  return clientSecret && stripePromise ? (
    <Flex minH="100svh" justifyContent="center" alignItems="center">
      <Box
        border="1px solid"
        borderColor="gray.500"
        borderRadius="lg"
        bg="white"
      >
        <Box bg="primary.500" borderRadius="lg" p={8} textAlign="center">
          <HeadingMedium color="white">Order Payment</HeadingMedium>
        </Box>
        <Box p={5}>
          <Elements options={options} stripe={stripePromise}>
            <OrderPaymentForm />
          </Elements>
        </Box>
      </Box>
    </Flex>
  ) : (
    // Need to add skeleton here?
    <></>
  );
};

export default OrderPayment;
