import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import Button from "../../ui/button";

const FixturesAlertModal = (props) => {
  const { isOpen, onClose, isLoading, handleSubmit } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Setup Fixture</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          This action will replace the current Set Up data for published
          fixtures and cannot be retrieved. Would you like to continue?
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button isLoading={isLoading} onClick={handleSubmit}>
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FixturesAlertModal;
