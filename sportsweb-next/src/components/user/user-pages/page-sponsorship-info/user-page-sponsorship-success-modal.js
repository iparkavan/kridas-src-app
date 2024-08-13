import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  Spacer,
  Text,
} from "@chakra-ui/react";

function PageSponsorshipSuccessModal({ isOpen, onClose }) {
  return (
    <>
      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            h="51px"
            bg="linear-gradient(90deg, #EC008C 0%, #FC6767 100%)"
            color="white"
            px={4}
            fontWeight="400"
          >
            Get Sponsorship
          </ModalHeader>
          <ModalCloseButton color="white" fontSize="15px" />
          <ModalBody p={[3, 5, 8]}>
            <Text>Your Sponsorship profile has been created.</Text>
          </ModalBody>
          <ModalFooter>
            <Flex w="full" pt={10} gap={3}>
              <Spacer />

              <Button
                bg="blue.400"
                w="36"
                borderRadius="none"
                color="white"
                _hover={{ color: "black" }}
                onClick={onClose}
              >
                OK
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
export default PageSponsorshipSuccessModal;
