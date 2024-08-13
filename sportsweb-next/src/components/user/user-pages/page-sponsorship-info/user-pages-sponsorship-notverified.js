import React from 'react';
import {
    Modal,
    VStack,
    Text,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button
  } from '@chakra-ui/react'


function PageSponsorshipNotVerified({pagename,isOpen,onClose}){
    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
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
            <ModalCloseButton />
            <ModalBody>
            <VStack spacing={4} alignItems="flex-start">
                <Text >Hi {pagename},</Text>
                 <p>Your profile is not verified yet.Only Verified users can apply
                 for Sponsorship.</p>
                 <Text
                    fontSize="sm"
                    color='#555555'>
                    Tip:Complete your profile 100% to be eligible for verified badge
                    </Text>
                 </VStack>
            </ModalBody>

            <ModalFooter mt={10}>
              <Button
                    mr={3}
                    colorScheme="primary"
                    variant="outline"
                    width="120px"
                    height="40px"
                    borderRadius={0}
                    >Get Verified</Button>
                    <Button
                        colorScheme="primary"
                        width="120px"
                        height="40px"
                        borderRadius={0}
                        onClick={onClose}
                        >Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default PageSponsorshipNotVerified;