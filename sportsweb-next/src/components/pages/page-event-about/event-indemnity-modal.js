import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import Button from "../../ui/button";

function EventIndemnityModal({ indemnityClauseHtml }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button colorScheme="blue" variant="link" onClick={onOpen}>
        Event Indemnity Form
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            bg="linear-gradient(90deg, #0093E9 0%, #80D0C7 100%)"
            color="white"
          >
            Event Indemnity Form
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={[2, 4, 6]}>
            <Box>
              <Box dangerouslySetInnerHTML={{ __html: indemnityClauseHtml }} />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EventIndemnityModal;
