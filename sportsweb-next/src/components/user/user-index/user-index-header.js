import React, { useRef, useState } from "react";
import {
  Flex,
  Box,
  Text,
  Grid,
  GridItem,
  Circle,
  Image,
  Avatar,
  VStack,
  Link,
  Wrap,
  WrapItem,
  Center,
  Heading,
  usePanGesture,
  Input,
  IconButton,
  useDisclosure,
  Stack,
  AvatarGroup,
  Button,
  Spacer,
  HStack,
} from "@chakra-ui/react";
import styles from "../user-index/user-index.module.css";
import { useUserStatistics } from "../../../hooks/user-statistics-hooks";
import {
  useUser,
  useUpdateUser,
  useUserFollowersById,
} from "../../../hooks/user-hooks";
import { useRouter } from "next/router";
import PictureModal from "../../common/picture-modal";
import { EditIcon } from "../../ui/icons";
import VerifyProfileCompleteModal from "../../common/user-pages-verification-workflow/user-pages-verify-profilecomplete";
import VerifyProfileInCompleteModal from "../../common/user-pages-verification-workflow/user-pages-verify-profileincomplete";
import DetailsModal from "../sponsorship/user-sponsorship-details-modal";
import Sponsorship from "../sponsorship/user-sponsorship-notverified";
import ProfileModal from "../sponsorship/user-sponsorship-profile-modal";
import SponsorshipVerification from "../sponsorship/user-sponsorship-verification";
import { verifyUser } from "../../../../src/helper/constants/user-contants";

function UserIndexHeader() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const {
    isOpen: isVerifyModalOpen,
    onOpen: onVerifyModalOpen,
    onClose: onVerifyModalClose,
  } = useDisclosure();
  const {
    isOpen: isVerifyOpen,
    onOpen: onVerifyOpen,
    onClose: onVerifyClose,
  } = useDisclosure();
  const { mutate } = useUpdateUser();
  const profilePicRef = useRef();
  const coverPicRef = useRef();
  //const isProfileDetailsFilled = false;
  const { data: userData = {} } = useUser();
  const { data: userStatisticsData = [] } = useUserStatistics(
    userData?.["user_id"]
  );
  const [isProfileDetailsFilled, setIsProfileDetailsFilled] = useState(false);
  const isUserDetailFilled = true;
  const handleFile = (e, type) => {
    if (type === "userProfileImage") {
      mutate({
        userData,
        values: { userProfileImage: e.target.files[0] },
      });
    } else if (type === "userCoverImage") {
      mutate({
        userData,
        values: { image: e.target.files[0] },
      });
    }
  };
  const handleVerification = (userData, userStatisticsData) => {
    const { isProfileComplete, percentage } = verifyUser(
      userData,
      userStatisticsData
    );
    setIsProfileDetailsFilled(isProfileComplete);
    onVerifyModalOpen();
  };
  const { data: userFollowersData = {} } = useUserFollowersById(
    userData?.user_id
  );

  return (
    <>
      <Box w="100%" pb={5}>
        <Grid>
          <GridItem
            colSpan={6}
            h="48"
            w={["100%", "100%", "100%"]}
            position="relative"
          >
            {userData["user_img"] ? (
              <>
                <Image
                  h="48"
                  w="full"
                  src={userData["user_img"]}
                  objectFit="cover"
                  alt="Cover image"
                  cursor="pointer"
                  onClick={onOpen}
                />
                <PictureModal
                  isOpen={isOpen}
                  onClose={onClose}
                  src={userData["user_img"]}
                  alt="User cover image"
                />
              </>
            ) : (
              <Box
                h="48"
                w="full"
                display="flex"
                justifyContent="center"
                alignItems="center"
                bgColor="gray.300"
              >
                <Text fontSize="lg">Add your banner image</Text>
              </Box>
            )}
            <Flex justifyContent={"flex-start"} mt={-9} px={6}>
              <HStack>
                <Avatar
                  size={"xl"}
                  name={userData["full_name"]}
                  src={userData["user_profile_img"]}
                  alt={"User"}
                  css={{
                    border: "2px solid white",
                  }}
                  position="relative"
                ></Avatar>
              </HStack>
            </Flex>
          </GridItem>
          <GridItem colSpan={6} h="24" w={["100%", "100%", "100%"]} bg="white">
            <Flex mt={3}>
              <Box>
                <VStack spacing={0} align="stretch" ml={[5, 10, 127]}>
                  <Box w={60}>
                    <Heading
                      fontSize={"md"}
                      fontWeight={500}
                      fontFamily={"body"}
                      wordBreak="break-word"
                      textOverflow="ellipsis"
                    >
                      {userData["full_name"]}
                    </Heading>
                  </Box>
                </VStack>
              </Box>
              <Flex gap={6}>
                <Box>
                  <VStack
                    spacing={1}
                    align="center"
                    cursor="pointer"
                    onClick={() => router.push(`/user/followers`)}
                  >
                    <Box>
                      <Text fontSize="15px">
                        <b>{userFollowersData?.follower?.length} Followers</b>
                      </Text>
                    </Box>
                    <Box>
                      <AvatarGroup size="sm" max={3}>
                        {userFollowersData?.follower?.map(
                          ({ id, name, avatar }) => (
                            <Avatar name={name} src={avatar} key={id} />
                          )
                        )}
                      </AvatarGroup>
                    </Box>
                  </VStack>
                </Box>
                <Box>
                  <VStack
                    spacing={1}
                    align="center"
                    cursor="pointer"
                    onClick={() =>
                      router.push(`/user/followers/?tab=following`)
                    }
                  >
                    <Box>
                      <Text fontSize="15px">
                        <b>{userFollowersData?.following?.length} Following</b>
                      </Text>
                    </Box>
                    <Box>
                      <AvatarGroup size="sm" max={3}>
                        {userFollowersData?.following?.map(
                          ({ id, name, avatar }) => (
                            <Avatar name={name} src={avatar} key={id} />
                          )
                        )}
                      </AvatarGroup>
                    </Box>
                  </VStack>
                </Box>
                <Box mt="2">
                  <Flex align="center" justify="center" gap={7}>
                    {
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        //  w="44"
                        //p={5}
                        borderRadius="none"
                        //onClick={onVerifyModalOpen}
                        onClick={(onVerifyModalOpen) =>
                          handleVerification(userData, userStatisticsData)
                        }
                      >
                        Get ”Verified” Badge
                      </Button>
                    }
                    {isProfileDetailsFilled ? (
                      <VerifyProfileCompleteModal
                        isOpen={isVerifyModalOpen}
                        onClose={onVerifyModalClose}
                        type="user"
                      />
                    ) : (
                      <VerifyProfileInCompleteModal
                        isOpen={isVerifyModalOpen}
                        onClose={onVerifyModalClose}
                        name={userData.full_name}
                      />
                    )}
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      // w="44"
                      //p={5}
                      borderRadius="none"
                      onClick={onVerifyOpen}
                    >
                      Get Sponsorship
                    </Button>
                    {isUserDetailFilled ? (
                      <SponsorshipVerification
                        isOpen={isVerifyOpen}
                        onClose={onVerifyClose}
                      />
                    ) : (
                      <Sponsorship
                        isOpen={isVerifyOpen}
                        onClose={onVerifyClose}
                        name={userData.full_name}
                      />
                    )}
                  </Flex>
                </Box>
              </Flex>
            </Flex>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
}

export default UserIndexHeader;
