import {
  Center,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

const VoucherModal = (props) => {
  const { isOpen, onClose, voucherData } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="gray.200" borderRadius="inherit">
          Preview
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={5}>
          <Center>
            <Image
              src={voucherData?.productMedia?.productMediaUrl}
              alt={voucherData?.productName}
            />
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default VoucherModal;
