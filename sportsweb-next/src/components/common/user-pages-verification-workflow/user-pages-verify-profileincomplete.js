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

function VerifyProfileIncompleteModal({ name,isOpen,onClose }) {

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
          <ModalBody pt={[3, 5, 8]} pb={0}>
            <Text>Hi {name},</Text>
            <Text pt={4}>
              Your profile is incomplete. Consider filling all profile
              information before applying for Verified badge.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Flex w="full" pt={4} gap={3}>
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
export default VerifyProfileIncompleteModal;
