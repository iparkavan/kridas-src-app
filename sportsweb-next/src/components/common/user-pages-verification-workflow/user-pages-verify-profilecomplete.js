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
  Heading,
  Text,
  VStack,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import VerifyDocumentUploadModal from "./user-pages-verify-documentupload";

function VerifyProfileCompleteModal({ isOpen, onClose ,type}) {
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
            Get Verified Badge
          </ModalHeader>
          <ModalCloseButton color="white" fontSize="15px" />
          <ModalBody p={[3, 5, 8]} pb={0}>
            <Text>
              You are about to apply for Verified badge. Click proceed button to
              continue.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Flex w="full" pt={5} gap={3}>
              <Spacer />
              <Button
                colorScheme="blue"
                variant="outline"
                bg
                w="36"
                borderRadius="none"
                onClick={onClose}
              >
                Cancel
              </Button>
              <VerifyDocumentUploadModal onClose={onClose} type={type}/>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
export default VerifyProfileCompleteModal;
