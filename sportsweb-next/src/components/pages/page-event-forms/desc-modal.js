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
import React from "react";
import Button from "../../ui/button";

function DescModal({ tournamentCategoryDescHtml }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button colorScheme="blue" variant="link" onClick={onOpen}>
        Sports Description
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            bg="linear-gradient(90deg, #0093E9 0%, #80D0C7 100%)"
            color="white"
          >
            Sports Description
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={[2, 4, 6]}>
            <Box
              dangerouslySetInnerHTML={{
                __html: tournamentCategoryDescHtml,
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default DescModal;
