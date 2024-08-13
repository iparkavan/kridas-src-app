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
  Box,
} from "@chakra-ui/react";
import ProfileSVG from "../../../svg/profile-svg";
import { HeadingLarge, HeadingMedium } from "../../ui/heading/heading";
import { TextMedium } from "../../ui/text/text";
import {
  LockIcon,
  MenuAltIcon,
  PersonCircleIcon,
  PersonIcon,
} from "../../ui/icons";
import Image from "next/image";
import Button from "../../ui/button";
// import {
//   LockIcon,
//   MenuAltIcon,
//   PersonCircleIcon,
//   PersonIcon,
// } from "../ui/icons";

const LockProfile = () => {
  return (
    <Box>
      <VStack
        w={"full"}
        justify={"flex-start"}
        alignItems={"flex-start"}
        spacing={0}
      >
        <HStack>
          {/* <ProfileSVG /> */}
          <Image
            src={"/lock-profile.png"}
            alt="Lock Profile"
            width={24}
            height={24}
          />
          <HeadingMedium>Profile Lock</HeadingMedium>
        </HStack>
        <TextMedium pl={8}>
          Make your photo and posts more private in one step
        </TextMedium>
      </VStack>
      <Divider borderWidth="1px" borderColor="gray.300" my={4} />

      <VStack
        spacing={4}
        w={"full"}
        justifyItems={"flex-start"}
        alignItems={"flex-start"}
      >
        <HeadingMedium color={"primary.500"}>How Locking Works</HeadingMedium>
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
              Only followers will see your full-size profile picture and cover
              photo
            </TextMedium>
          </HStack>
          <HStack>
            <MenuAltIcon />
            <TextMedium>
              People aren&apos;t following you will see minimum profile details
            </TextMedium>
          </HStack>
        </Stack>
        <Button rounded={"full"} gap={2}>
          <LockIcon />
          Lock your Profile
        </Button>
      </VStack>
    </Box>
  );
};

export default LockProfile;
