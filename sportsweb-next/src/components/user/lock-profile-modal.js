import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  HStack,
  VStack,
  Divider,
  Stack,
} from "@chakra-ui/react";
import {
  LockIcon,
  MenuAltIcon,
  PersonCircleIcon,
  PersonIcon,
} from "../ui/icons";
import { TextMedium } from "../ui/text/text";
import ProfileSVG from "../../svg/profile-svg";
import { HeadingLarge, HeadingMedium } from "../ui/heading/heading";
import Button from "../ui/button";

function LockProfileModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent pt={4} pb={2}>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <ProfileSVG />
            <HeadingLarge>LOCK YOUR PROFILE</HeadingLarge>
            <TextMedium>
              Make your photo and posts more private in one step
            </TextMedium>
          </VStack>
          <Divider borderWidth="1px" borderColor="gray.300" my={5} />

          <VStack spacing={4}>
            <HeadingMedium>HOW LOCKING WORKS</HeadingMedium>
            <Stack spacing={1}>
              <HStack>
                <PersonIcon />
                <TextMedium>
                  Only followers will see the photos and posts on your profile
                </TextMedium>
              </HStack>
              <HStack>
                <PersonCircleIcon />
                <TextMedium>
                  Only followers will see your full-size profile picture and
                  cover photo
                </TextMedium>
              </HStack>
              <HStack>
                <MenuAltIcon />
                <TextMedium>
                  People aren&apos;t following you will see minimum profile
                  details
                </TextMedium>
              </HStack>
            </Stack>
          </VStack>
        </ModalBody>

        <ModalFooter alignSelf="center">
          <Button size="lg" borderRadius="full" leftIcon={<LockIcon />}>
            Lock Your Profile
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
export default LockProfileModal;
