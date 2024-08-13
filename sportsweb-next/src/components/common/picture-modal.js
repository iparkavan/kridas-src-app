import {
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";

const PictureModal = ({ isOpen, onClose, src, alt }) => {
  return (
    <Modal size="2xl" isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="transparent" boxShadow="none">
        <ModalCloseButton />
        <ModalBody p={0}>
          <Image w="full" src={src} objectFit="cover" alt={alt} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PictureModal;
