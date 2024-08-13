import {
  Text,
  Button,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spacer,
} from "@chakra-ui/react";

import React from "react";
const ProfileModal = ({ isOpen, onClose }) => {
  const initialRef = React.useRef();

  return (
    <>
      <Modal
        onClose={onClose}
        size="lg"
        isOpen={isOpen}
        initialFocusRef={initialRef}
      >
        <ModalOverlay />
        <ModalContent h="80">
          <ModalHeader
            bg="linear-gradient(90deg, #EC008C 0%, #FC6767 100%)"
            color="white"
            px={4}
            fontWeight="400"
          >
            Get Sponsorship
          </ModalHeader>
          <ModalCloseButton color="white" fontSize="md" />
          <ModalBody>
            <VStack mt="1.5" align="stretch" ml={5}>
              <Text fontWeight="normal" color="#000000">
                Your Sponsorship profile has been created.
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <VStack mt={20}>
              <Button
                colorScheme="primary"
                type="submit"
                w="28"
                borderRadius={2}
                ref={initialRef}
                onClick={onClose}
              >
                Ok
              </Button>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
