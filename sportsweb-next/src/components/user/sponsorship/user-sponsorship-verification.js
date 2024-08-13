import React from "react";
import {
  useDisclosure,
  Modal,
  Text,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Spacer,
} from "@chakra-ui/react";

import DetailsModal from "./user-sponsorship-details-modal";

function SponsorshipVerification({ isOpen, onClose }) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            bg="linear-gradient(90deg, #EC008C 0%, #FC6767 100%)"
            color="white"
            px={4}
            fontWeight="400"
          >
            Get Sponsorship
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody mt={4}>
            <Text fontSize="md">
              You are about to apply for Sponsorship. Click proceed button to
              continue.
            </Text>
          </ModalBody>
          <ModalFooter mt={14}>
            <Flex w="full" pt={5} gap={3}>
              <Spacer />
              <Button
                colorScheme="blue"
                variant="outline"
                bg
                w="36"
                borderRadius="none"
                onClick={onClose}
              >
                Cancel
              </Button>
              <DetailsModal onClose={onClose} />
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default SponsorshipVerification;
