import React from "react";
import {
  ModalFooter,
  useDisclosure,
  Text,
  ButtonGroup,
  ModalContent,
} from "@chakra-ui/react";
import Modal from "../../ui/modal";
import { DeleteIcon } from "../../ui/icons";
import Button from "../../ui/button";
import { TextMedium } from "../../ui/text/text";

function EventSportlistDeleteModal({ arrayHelpers, index }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <DeleteIcon
        cursor="pointer"
        onClick={onOpen}
        // onClick={() => arrayHelpers.remove(index)}
      />
      <Modal
        isCentered
        title={"Are you sure to delete the sport?"}
        size={"xl"}
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalFooter>
          <ButtonGroup>
            <Button onClick={() => arrayHelpers.remove(index)}>Yes</Button>
            <Button onClick={onClose} variant="outline">
              NO
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default EventSportlistDeleteModal;
