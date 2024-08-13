import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  Image,
  Box,
  Divider,
} from '@chakra-ui/react';
import { paymentGateways } from '../../helper/constants/order-constants';
import { TextSmall } from '../ui/text/text';

const OrderChooseGateway = ({ isOpen, onClose, onProceed }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Choose a Payment Gateway</ModalHeader>

        <ModalCloseButton />
        <ModalBody>
          <Box marginBottom={2}>
            <TextSmall>
              To finalize your order, please choose one of the following payment
              gateways. Each offers secure and hassle-free transactions.
            </TextSmall>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            bg="gray.100"
            borderRadius="md"
          >
            <VStack spacing={2}>
              <Image
                src="/images/pg/pg_razorpay.png"
                alt="Razorpay"
                objectFit="contain"
                borderRadius="md"
                width="225px"
                height="55px"
                onClick={() => onProceed(paymentGateways.RAZORPAY)}
                cursor="pointer"
              />
              <Divider borderWidth="1px" />
              <Image
                src="/images/pg/pg_stripe.png"
                alt="Stripe"
                objectFit="contain"
                borderRadius="md"
                width="250px"
                height="60px"
                onClick={() => onProceed(paymentGateways.STRIPE)}
                cursor="pointer"
              />
            </VStack>
          </Box>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OrderChooseGateway;
