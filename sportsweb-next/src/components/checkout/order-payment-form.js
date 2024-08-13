import { useEffect, useState } from 'react';
import { ButtonGroup } from '@chakra-ui/button';
import { useRouter } from 'next/router';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import Button from '../ui/button';
import { TextMedium } from '../ui/text/text';
import routes from '../../helper/constants/route-constants';
import { paymentGateways } from '../../helper/constants/order-constants';

const OrderPaymentForm = () => {
  const router = useRouter();
  const [hostURL, setHostURL] = useState('');

  useEffect(() => {
    setHostURL(window && window.location.origin);
  }, []);

  const returnUrl = `${hostURL}${routes.orderStatus}?pg=${paymentGateways.STRIPE}`;

  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    });

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setErrorMessage(error.message);
    } else {
      setErrorMessage('An unexpected error occurred. Please try again');
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <ButtonGroup mt={5} w="full">
        <Button
          w="full"
          type="submit"
          isLoading={isLoading}
          disabled={isLoading || !stripe || !elements}
        >
          Pay
        </Button>
        <Button
          variant="outline"
          w="full"
          onClick={() => router.push(routes.cart)}
        >
          Cancel
        </Button>
      </ButtonGroup>
      {errorMessage && (
        <TextMedium color="red.500" mt={5}>
          {errorMessage}
        </TextMedium>
      )}
    </form>
  );
};

export default OrderPaymentForm;
