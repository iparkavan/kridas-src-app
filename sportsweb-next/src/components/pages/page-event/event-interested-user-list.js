import { Box, SimpleGrid } from "@chakra-ui/react";

import { TextMedium } from "../../ui/text/text";
import UserCard from "../../common/follow-card";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

function EventInterestedUserList({
  eventFollowersData,
  onIntrestOpen,
  isIntrestOpen,
  onIntrestClose,
}) {
  return (
    <Box>
      <Modal
        isOpen={isIntrestOpen}
        onClose={onIntrestClose}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            bg="linear-gradient(90deg, #0093E9 0%, #80D0C7 100%)"
            color="white"
          >
            Interested
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={4}>
            <SimpleGrid columns={[1, 2]} spacing={5}>
              {eventFollowersData?.followerList?.length !== 0 ? (
                eventFollowersData?.followerList?.map((follower) => (
                  <UserCard key={follower.id} cardData={follower} type="U" />
                ))
              ) : (
                <TextMedium>No Interested Users to display</TextMedium>
              )}
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default EventInterestedUserList;
