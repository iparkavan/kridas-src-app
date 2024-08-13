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

function EventRulesModal({ isRulesHtml, eventRulesHtml, eventData }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button colorScheme="blue" variant="link" onClick={onOpen}>
        Event Rules
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            bg="linear-gradient(90deg, #0093E9 0%, #80D0C7 100%)"
            color="white"
          >
            Event Rules
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={[2, 4, 6]}>
            <Box>
              {isRulesHtml ? (
                <Box dangerouslySetInnerHTML={{ __html: eventRulesHtml }} />
              ) : (
                eventData["standardEventRules"]
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EventRulesModal;
