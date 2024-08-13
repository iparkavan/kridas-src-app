import {
  Box,
  ButtonGroup,
  Divider,
  Grid,
  GridItem,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import secureLocalStorage from 'react-secure-storage';
import { format } from 'date-fns';
import Button from '../ui/button';
import { HeadingMedium } from '../ui/heading/heading';
import { TextMedium } from '../ui/text/text';
import routes from '../../helper/constants/route-constants';
import { useUser } from '../../hooks/user-hooks';
import { usePlaceOrder, useCreateRazorpayOrder } from '../../hooks/order-hooks';
import { useLocation } from '../../hooks/location-hooks';
import { useCountryByISOCode } from '../../hooks/country-hooks';
import {
  useGetBookedService,
  useProductCount,
} from '../../hooks/product-hooks';
import { verifyCartQuantity } from '../../helper/constants/cart-constants';
import { convertDateToUTCString } from '../../helper/constants/common-constants';
import OrderChooseGateway from './order-choose-gateway';
import { paymentGateways } from '../../helper/constants/order-constants';

const OrderSummary = (props) => {
  const {
    totalPrice,
    cashRedeemed,
    priceCurrency,
    rewardPointsForCurrency,
    cartData,
    isAddressPresent,
    isTypeService,
    isTypeEvent,
  } = props;
  const router = useRouter();
  const toast = useToast();
  const { data: userData } = useUser();
  const { data: locationData } = useLocation();
  const { data: countryData } = useCountryByISOCode(locationData?.countryCode);
  const { mutate: orderMutate, isLoading: isOrderLoading } = usePlaceOrder();
  const { mutateAsync: countMutateAsync, isLoading: isCountLoading } =
    useProductCount();
  const { mutateAsync: serviceMutateAsync, isLoading: isServiceLoading } =
    useGetBookedService();
  const { mutate: razorPayOrderMutate, isLoading: isRazorPayOrderLoading } =
    useCreateRazorpayOrder();

  const [isPgSelectionOpen, setIsPgSelectionOpen] = useState(false);
  const [hostURL, setHostURL] = useState('');
  const [isPaymentWindowOpen, setIsPaymentWindowOpen] = useState(false);

  useEffect(() => {
    setHostURL(window && window.location.origin);
  }, []);

  let finalTotal = totalPrice;
  let pointsRedeemed = 0;
  const isCashRedeemed = Boolean(Number(cashRedeemed));
  if (isCashRedeemed) {
    finalTotal -= Number(cashRedeemed);
    if (finalTotal < 0) {
      finalTotal = 0;
    }
    pointsRedeemed = Number(cashRedeemed) / rewardPointsForCurrency;
  }

  const isFinalTotalZero = finalTotal === 0;
  const secureOrderKey = 'KRIDAS_ORDER';

  const verifyAvailability = async () => {
    if (isTypeService) {
      const isCalendarType = cartData[0].shoppingCartAttrList.length > 0;
      if (isCalendarType) {
        const shoppingCartAttr = cartData[0].shoppingCartAttrList[0];
        const serviceId = shoppingCartAttr.serviceWeeklySchedule.serviceId;
        // const serviceDate = format(
        //   new Date(shoppingCartAttr.dateScheduled),
        //   "yyyy-MM-dd"
        // );
        const serviceDate = format(
          new Date(shoppingCartAttr.startTime),
          'yyyy-MM-dd'
        );
        const serviceStartTime =
          shoppingCartAttr.serviceWeeklySchedule.weeklyScheduleDetails[0]
            .startTime;
        const serviceEndTime =
          shoppingCartAttr.serviceWeeklySchedule.weeklyScheduleDetails[0]
            .endTime;

        try {
          const bookedServices = await serviceMutateAsync({
            serviceId,
            serviceDate,
          });

          const isServiceSlotBooked = bookedServices.find((bs) => {
            const startTimeStr = convertDateToUTCString(new Date(bs.startTime));
            const endTimeStr = convertDateToUTCString(new Date(bs.endTime));
            return (
              startTimeStr === serviceStartTime && endTimeStr === serviceEndTime
            );
          });

          if (isServiceSlotBooked) {
            toast({
              title: 'This time slot has been booked',
              status: 'error',
              isClosable: true,
            });
            return false;
          }
          return true;
        } catch (e) {
          console.log(e);
          toast({
            title: 'Service booking failed. Please try again',
            status: 'error',
            isClosable: true,
          });
          return false;
        }
      } else {
        return true;
      }
    } else if (isTypeEvent) {
      return true;
    } else {
      return await verifyCartQuantity(cartData, countMutateAsync, toast);
    }
  };

  const handlePlaceOrder = async () => {
    const areItemsAvailable = await verifyAvailability();
    if (!areItemsAvailable) return;

    const orderObj = {
      billingAddress: userData.address,
      billingFirstName: userData.first_name,
      billingLastName: userData.last_name,
      cartIds: cartData.map((cartItem) => cartItem.shoppingCartId),
      countryCode: countryData?.country_code,
      ipAddress: locationData?.query,
      itemTax: 0,
      itemTotalAmt: totalPrice.toFixed(2),
      orderCurrency: priceCurrency,
      orderFinalAmt: totalPrice.toFixed(2),
      orderId: null,
      orderStatus: 'CNF',
      paymentDTOList: [],
      paymentStatus: 'CNF',
      rewardPointsUtilized: pointsRedeemed || null,
      shippingAddress: userData.address,
      shippingFirstName: userData.first_name,
      shippingLastName: userData.last_name,
      userEmail: userData.user_email,
      userId: userData.user_id,
      userPhone: userData.user_phone,
    };
    if (isFinalTotalZero) {
      orderObj.paymentDTOList.push({
        countryCode: countryData?.country_code,
        paymentAmount: totalPrice.toFixed(2),
        paymentCurrency: priceCurrency,
        paymentMode: 'RWD',
        paymentReference: null,
      });
      orderMutate(orderObj, {
        onSuccess: () => {
          router.push(routes.orderStatus);
        },
      });
      // Handle direct points redeem here
    } else {
      orderObj.paymentDTOList.push({
        countryCode: countryData?.country_code,
        paymentAmount: finalTotal.toFixed(2),
        paymentCurrency: priceCurrency,
        paymentMode: 'CRE',
        paymentReference: null,
      });
      if (isCashRedeemed) {
        orderObj.paymentDTOList.push({
          countryCode: countryData?.country_code,
          paymentAmount: Number(cashRedeemed).toFixed(2),
          paymentCurrency: priceCurrency,
          paymentMode: 'RWD',
          paymentReference: null,
        });
      }
      // window.localStorage.setItem(secureOrderKey, JSON.stringify(orderObj));
      secureLocalStorage.setItem(secureOrderKey, orderObj);

      //If india, then show additional payment gateways
      if (countryData?.country_code === 'IND') {
        setIsPgSelectionOpen(true);
      } else router.push(routes.orderPayment);
      //console.log(countryData?.country_code);
      //router.push(routes.orderPayment);
    }
  };

  const pgSelectionCloseHandler = () => {
    setIsPgSelectionOpen(false);
  };

  const pgSelectionCOnfirmationHandler = async (selectedPg) => {
    setIsPgSelectionOpen(false);
    if (selectedPg === paymentGateways.RAZORPAY) {
      const res = await loadRazorpay();

      if (!res) {
        alert('Razorpay SDK Failed to load');
        return;
      }

      razorPayOrderMutate(
        { amount: finalTotal },
        {
          onSuccess: (data) => {
            const options = {
              key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
              amount: data.amout,
              currency: 'INR',
              name: 'Kridas Sportz Platform Private Ltd',
              description: 'Order from Kridas.com',
              image: 'https://www.kridas.com/kridas-logo-light.png',
              order_id: data.orderId,
              prefill: {
                name: userData.full_name,
                email: userData.user_email,
                contact: userData.user_phone,
              },
              notes: {
                address: '',
              },
              theme: {
                color: '#3399cc',
              },
              handler: async function (response) {
                setIsPaymentWindowOpen(false);
                const returnUrl = `${hostURL}${routes.orderStatus}?pg=${paymentGateways.RAZORPAY}&razorpay_payment_id=${response.razorpay_payment_id}&razorpay_order_id=${response.razorpay_order_id}&razorpay_signature=${response.razorpay_signature}`;
                router.push(returnUrl);
              },
              modal: {
                escape: false,
                ondismiss: function () {
                  setIsPaymentWindowOpen(false);
                },
              },
            };
            setIsPaymentWindowOpen(true);
            const razor = new window.Razorpay(options);

            razor.open();
          },
        }
      );
    } else router.push(routes.orderPayment);
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      // document.body.appendChild(script);

      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  return (
    <Box border="1px solid" borderColor="gray.500" borderRadius="lg">
      <Box bg="primary.500" borderRadius="lg" p={8} textAlign="center">
        <HeadingMedium color="white">Order Summary</HeadingMedium>
      </Box>
      <Box p={5}>
        <Grid templateColumns="2fr 1fr" rowGap={4}>
          <GridItem>
            <TextMedium>Items Total</TextMedium>
          </GridItem>
          <GridItem justifySelf="end">
            {totalPrice} {priceCurrency}
          </GridItem>
          {isCashRedeemed && (
            <>
              <GridItem>
                <TextMedium>Cash Redeemed using Kridas Points</TextMedium>
              </GridItem>
              <GridItem justifySelf="end">
                {cashRedeemed} {priceCurrency}
              </GridItem>
            </>
          )}
          <GridItem colSpan={2} mt={10}>
            <Divider borderColor="gray.400" />
          </GridItem>
          <GridItem>Total</GridItem>
          <GridItem justifySelf="end">
            {finalTotal} {priceCurrency}
          </GridItem>
          <GridItem colSpan={2}>
            <Divider borderColor="gray.400" />
          </GridItem>
        </Grid>
        <ButtonGroup mt={5} w="full">
          <Button
            w="full"
            isLoading={isCountLoading || isOrderLoading || isServiceLoading}
            onClick={handlePlaceOrder}
            disabled={
              isCountLoading ||
              isOrderLoading ||
              isServiceLoading ||
              !isAddressPresent ||
              isPaymentWindowOpen
            }
          >
            {isFinalTotalZero ? 'Place Order' : 'Pay'}
          </Button>
          <Button
            variant="outline"
            w="full"
            onClick={() => router.push(routes.cart)}
          >
            Back to Cart
          </Button>
        </ButtonGroup>
      </Box>
      <OrderChooseGateway
        isOpen={isPgSelectionOpen}
        onClose={pgSelectionCloseHandler}
        onProceed={pgSelectionCOnfirmationHandler}
      ></OrderChooseGateway>
    </Box>
  );
};

export default OrderSummary;
