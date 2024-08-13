import { useEffect, useState } from 'react';
import { Alert, AlertIcon, Box, ButtonGroup, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import secureLocalStorage from 'react-secure-storage';
import Button from '../ui/button';
import { TextMedium } from '../ui/text/text';
import routes from '../../helper/constants/route-constants';
import {
  usePlaceOrder,
  useVerifyRazorpayPayment,
} from '../../hooks/order-hooks';
import Skeleton from '../ui/skeleton';
import { useUser } from '../../hooks/user-hooks';
import { useUserCart } from '../../hooks/cart-hooks';
import { useRegisterTeam } from '../../hooks/team-hooks';
import { useLocation } from '../../hooks/location-hooks';
import { paymentGateways } from '../../helper/constants/order-constants';

const secureOrderKey = 'KRIDAS_ORDER';
const secureEventKey = 'KRIDAS_EVENT';

const OrderPaymentStatus = () => {
  const router = useRouter();
  const toast = useToast();
  const [status, setStatus] = useState('loading');
  const { mutate: orderMutate } = usePlaceOrder();
  const { data: userData } = useUser();
  const { refetch: refetchCart } = useUserCart(userData?.user_id);
  const { mutate: registerMutate } = useRegisterTeam();
  const { data: locationData, isSuccess } = useLocation();
  const [publishableStripeKey, setPublishableStripeKey] = useState();
  const [eventId, setEventId] = useState();
  const [paymentGatewayUsed, setPaymentGatewayUsed] = useState('');
  const { mutate: verifyRazorpayMutate } = useVerifyRazorpayPayment();

  useEffect(() => {
    if (isSuccess && locationData) {
      if (locationData.countryCode === 'SG') {
        setPublishableStripeKey(process.env.NEXT_PUBLIC_STRIPE_SG_KEY);
      } else {
        setPublishableStripeKey(process.env.NEXT_PUBLIC_STRIPE_IN_KEY);
      }
    }
  }, [isSuccess, locationData]);

  // Redirect to event page if event
  useEffect(() => {
    if (eventId) {
      setTimeout(() => {
        router.push(routes.events(eventId));
      }, 5000);
    }
  }, [eventId, router]);

  //useEffect to handle processing based on payment gateways
  useEffect(() => {
    if (router.isReady) {
      //get the payment gateway being used
      const { pg } = router.query;

      if (!pg) {
        // Need to handle events paid with reward points here
        // Success alert if payment is done through reward points alone
        setStatus('success');
        return;
      }

      setPaymentGatewayUsed(pg);
    }
  }, [router.isReady, router.query]);

  //handle when pg is Stripe
  useEffect(() => {
    const handleOrder = async () => {
      if (paymentGatewayUsed === paymentGateways.STRIPE) {
        const { payment_intent_client_secret: paymentIntentClientSecret } =
          router.query;

        const stripe =
          publishableStripeKey && (await loadStripe(publishableStripeKey));

        if (!stripe) {
          if (!publishableStripeKey) {
            return;
          }
          setStatus('error');
          return;
        }

        try {
          const { paymentIntent } = await stripe.retrievePaymentIntent(
            paymentIntentClientSecret
          );
          switch (paymentIntent?.status) {
            case 'succeeded':
              processOrder(paymentIntentClientSecret);
              break;
            default:
              setStatus('error');
          }
        } catch (e) {
          console.log(e);
          setStatus('error');
        }
      }
    };

    handleOrder();
  }, [paymentGatewayUsed, publishableStripeKey]);

  //handle when pg is razorpay
  useEffect(() => {
    const handleOrder = async () => {
      if (paymentGatewayUsed === paymentGateways.RAZORPAY) {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
          router.query;

        const orderObj = secureLocalStorage.getItem(secureOrderKey);
        if (orderObj) {
          try {
            verifyRazorpayMutate(
              { razorpay_payment_id, razorpay_order_id, razorpay_signature },
              {
                onSuccess: (data) => {
                  if (data === true) {
                    processOrder(razorpay_payment_id);
                  } else {
                    setStatus('error');
                  }
                },
                onError: (e) => {
                  console.log(e);
                  setStatus('error');
                },
              }
            );
          } catch (error) {
            console.log(e);
            setStatus('error');
          }
        } else {
          setStatus('error');
        }
      }
    };

    handleOrder();
  }, [paymentGatewayUsed]);

  const processOrder = async (paymentReference) => {
    const orderObj = secureLocalStorage.getItem(secureOrderKey);
    if (orderObj) {
      const { data: cartData, isSuccess: isCartSuccess } = await refetchCart();
      let updatedCart = cartData;
      if (isCartSuccess && cartData === '') {
        updatedCart = [];
      }
      const cartId = orderObj.cartIds[0];
      const cartItem = updatedCart.find(
        (item) => item.shoppingCartId === cartId
      );
      const isItemEvent = Boolean(cartItem?.productTypeId === 'EPRD');

      //attaching the payment reference to the paymentDTO list
      orderObj.paymentDTOList.map((paymentItem, index) => {
        paymentItem['paymentReference'] = paymentReference;
        paymentItem['paymentGateway'] = paymentGatewayUsed;
      });

      orderMutate(orderObj, {
        onSuccess: () => {
          if (isItemEvent) {
            const eventObj = secureLocalStorage.getItem(secureEventKey);
            registerMutate(eventObj, {
              onSuccess: () => setStatus('success'),
              onError: (error) => {
                toast({
                  title: error?.message || 'System error. Please try again',
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                });
                setStatus('error');
              },
              onSettled: () => {
                setEventId(eventObj.eventId);
                secureLocalStorage.removeItem(secureEventKey);
              },
            });
          } else {
            setStatus('success');
          }
        },
        onError: () => setStatus('error'),
        onSettled: () => {
          secureLocalStorage.removeItem(secureOrderKey);
        },
      });
    } else {
      setStatus('error');
    }
  };

  if (status === 'loading') {
    return <Skeleton />;
  }

  return (
    <Box>
      <Alert status={status} variant="solid">
        <AlertIcon />
        {status === 'success' && (
          <TextMedium>
            {eventId
              ? 'You have successfully registered for the event. You will be redirected to the event page in 5 seconds.'
              : 'Your order has been placed successfully.'}
          </TextMedium>
        )}
        {status === 'error' && (
          <TextMedium>
            {eventId
              ? 'Unable to register for the event, please try again. You will be redirected to the event page in 5 seconds.'
              : 'Unable to place your order. Please try again.'}
          </TextMedium>
        )}
      </Alert>
      {!eventId && (
        <ButtonGroup mt={5}>
          <Button
            variant="outline"
            bg="white"
            onClick={() => router.push(routes.orders)}
          >
            View Orders
          </Button>
          <Button onClick={() => router.push(routes.products)}>
            Continue Shopping
          </Button>
        </ButtonGroup>
      )}
    </Box>
  );
};

export default OrderPaymentStatus;
