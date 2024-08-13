import React from "react";
import { Box, useDisclosure } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import Button from "../../ui/button";

function RulesModal({ playingConditionsHtml }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button colorScheme="blue" variant="link" onClick={onOpen}>
        Playing Conditions
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            bg="linear-gradient(90deg, #0093E9 0%, #80D0C7 100%)"
            color="white"
          >
            Playing Condition
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={[2, 4, 6]}>
            <Box
              dangerouslySetInnerHTML={{
                __html: playingConditionsHtml,
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default RulesModal;
