import React from "react";
import {
  useDisclosure,
  Modal,
  Text,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Spacer,
  Flex,
} from "@chakra-ui/react";
import PageCreateSponsorshipModal from "./user-page-create-sponsorship-modal";
import { useSponsorInfo,useSponsorInfoById } from "../../../../hooks/sponsor-info-hooks";

function PageSponsorshipVerify({ isOpen, onClose }) {
  const { data: sponsorData = [] } = useSponsorInfo();
  const { data: sponsorDataById = {} } = useSponsorInfoById(7);
  //console.log(sponsorData)
   // console.log(sponsorDataById)
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
            <Text>
              You are about to apply for Sponsorship. Click proceed button to
              continue.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Flex w="full" pt={4} gap={3}>
              <Spacer />
              <Button
                mr={3}
                colorScheme="primary"
                variant="outline"
                width="120px"
                height="40px"
                borderRadius={0}
                onClick={onClose}
              >
                Cancel
              </Button>
              <PageCreateSponsorshipModal onClose={onClose} />
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PageSponsorshipVerify;
