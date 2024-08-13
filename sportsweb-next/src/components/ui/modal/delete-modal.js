import { ModalFooter } from "@chakra-ui/react";
import Button from "../button";
import { TextMedium } from "../text/text";
import Modal from "./index";

const DeleteModal = (props) => {
  const {
    isOpen,
    onClose,
    title,
    content,
    isLoading,
    handleDelete,
    buttonText,
  } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} isCentered size="xl">
      <TextMedium>{content}</TextMedium>
      <ModalFooter p={0} mt={5}>
        <Button variant="outline" mr={3} onClick={onClose}>
          Cancel
        </Button>
        <Button isLoading={isLoading} onClick={handleDelete}>
          {buttonText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteModal;
