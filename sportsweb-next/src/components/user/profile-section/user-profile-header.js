import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Image,
  Flex,
  HStack,
  Input,
  useDisclosure,
  useToast,
  Skeleton,
  Icon,
  Text,
} from "@chakra-ui/react";
import IconButton from "../../ui/icon-button";
import { useUpdateUser, useUserFollowersById } from "../../../hooks/user-hooks";
import {
  VerifyIcon,
  CheckCircleIcon,
  CricketIcon,
  EditIcon,
  LocationIcon,
  WorkIcon,
} from "../../ui/icons";
import PictureModal from "../../common/picture-modal";
import { validateImage } from "../../../helper/constants/common-constants";
import { HeadingMedium } from "../../ui/heading/heading";
import { TextSmall } from "../../ui/text/text";
import { useSports } from "../../../hooks/sports-hooks";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";
import FollowStats from "../../common/follow-stats";
import Button from "../../ui/button";
import UserProfileTabs from "./user-profile-tabs";
import CoverImageHandler from "../../common/image-crop-functions/crop-pic-mutate";
import { useRouter } from "next/router";
import routes from "../../../helper/constants/route-constants";
import UserFollow from "../user-follow";
import SocialMediaShareButtons from "../../common/social-media-share-buttons";
import VerificationModal from "../../common/verification/verification-modal";
import CoverImage from "../../common/cover-image";
import EmptyCoverImage from "../../common/empty-cover-image";
import UserFollowersModal from "../user-followers/user-followers-modal";
import UserFollowingModal from "../user-followers/user-following-modal";

const UserProfileHeader = (props) => {
  const { userData, currentUser, tabIndex, setTabIndex } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isFollowersOpen,
    onOpen: onFollowersOpen,
    onClose: onFollowersClose,
  } = useDisclosure();
  const {
    isOpen: isFollowingOpen,
    onOpen: onFollowingOpen,
    onClose: onFollowingClose,
  } = useDisclosure();
  const {
    isOpen: isVerifyOpen,
    onOpen: onVerifyOpen,
    onClose: onVerifyClose,
  } = useDisclosure();
  const toast = useToast();
  const { mutate } = useUpdateUser();
  const { data: userFollowersData, isLoading: isFollowersLoading } =
    useUserFollowersById(userData?.user_id);
  const { data: sportsData = [] } = useSports({}, true);
  const { data: professionData = [] } = useLookupTable("PRF");
  const [truncateBioDesc, setTruncateBioDesc] = useState(true);
  const bioDetailsRef = useRef({});
  const profilePicRef = useRef();
  const coverPicRef = useRef();

  const totalFollowingCount =
    userFollowersData &&
    userFollowersData?.following?.length + userFollowersData?.events?.length;

  useEffect(() => {
    bioDetailsRef.current = {};
    onFollowersClose();
    onFollowingClose();
  }, [userData, onFollowersClose, onFollowingClose]);

  const handleFile = (e, type) => {
    const { isValid, message } = validateImage(e.target.files[0]);
    if (isValid) {
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
    } else {
      toast({
        title: "Upload failed",
        description: message,
        status: "error",
        isClosable: true,
      });
    }
  };
  const router = useRouter();
  /* 
  const [url, setURL] = useState(null);
  useEffect(() => {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "";

    const URL = `${origin}${router.asPath}`;
    setURL(URL);
  }, [router.asPath]); */
  const [hostURL, setHostURL] = useState(null);

  useEffect(() => {
    setHostURL(window && window.location.host);
  }, []);

  return (
    <Box p={6} bg="white" borderRadius="xl" position="relative">
      {userData["user_img"] ? (
        <>
          <CoverImage modalOpen={onOpen} coverimage={userData?.["user_img"]} />
          <PictureModal
            isOpen={isOpen}
            onClose={onClose}
            src={userData["user_img"]}
            alt="User cover image"
          />
        </>
      ) : (
        <EmptyCoverImage coverimage={"url('/images/no-banner-image.jpg')"} />
      )}

      {currentUser && (
        <CoverImageHandler type="user" coverImage={userData?.user_img} />
      )}

      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "center", md: "stretch" }}
        mt="-85px"
        px={{ md: 7 }}
      >
        <Box textAlign={{ base: "center", md: "revert" }}>
          <Avatar
            size="2xl"
            name={userData["full_name"]}
            src={userData["user_profile_img"]}
            alt="User profile image"
            border="5px solid white"
            position="relative"
          >
            {currentUser && (
              <>
                <Input
                  type="file"
                  id="profilePic"
                  display="none"
                  ref={profilePicRef}
                  onChange={(e) => handleFile(e, "userProfileImage")}
                />
                <IconButton
                  aria-label="upload profile picture"
                  icon={<EditIcon color="white" fontSize="18px" />}
                  variant="solid"
                  isRound
                  size="sm"
                  colorScheme="primary"
                  tooltipLabel="Edit Profile Picture"
                  position="absolute"
                  top="0px"
                  right="0px"
                  onClick={() => profilePicRef.current.click()}
                />
              </>
            )}
          </Avatar>
          <Box mt={1}>
            <HeadingMedium fontWeight="medium" display="inline">
              {userData["full_name"]}
              {userData["user_profile_verified"] && (
                <Icon
                  as={VerifyIcon}
                  color="primary.500"
                  h={6}
                  w={6}
                  ml={2}
                  verticalAlign="bottom"
                />
              )}
            </HeadingMedium>
          </Box>
        </Box>

        <HStack
          mt={{ base: 4, md: "100px" }}
          ml={{ md: "auto" }}
          spacing={{ base: 5, md: 14 }}
          alignSelf={{ md: "flex-end" }}
        >
          <Skeleton isLoaded={!isFollowersLoading}>
            <FollowStats
              number={userFollowersData?.follower?.length}
              label="Followers"
              cursor="pointer"
              onClick={onFollowersOpen}
            />
            <UserFollowersModal
              isOpen={isFollowersOpen}
              onClose={onFollowersClose}
              userFollowersData={userFollowersData}
            />
          </Skeleton>
          <Skeleton isLoaded={!isFollowersLoading}>
            <FollowStats
              number={totalFollowingCount}
              label="Following"
              cursor="pointer"
              onClick={onFollowingOpen}
            />
            <UserFollowingModal
              isOpen={isFollowingOpen}
              onClose={onFollowingClose}
              userId={userData.user_id}
              userFollowersData={userFollowersData}
            />
          </Skeleton>
        </HStack>
      </Flex>

      {((userData.address?.city && userData["countryData"]) ||
        userData["bio_details"]?.["sports_id"] ||
        userData["bio_details"]?.["profession"]) && (
        <Flex
          mt={{ base: 4, md: 1 }}
          direction={{ base: "column", md: "row" }}
          gap={{ base: 2, md: 5 }}
          align="flex-start"
        >
          {userData.address?.city && userData["countryData"] && (
            <Flex align={{ base: "flex-start", md: "center" }} gap={2}>
              <Icon as={LocationIcon} w={5} h={5} />
              <TextSmall>
                {userData.address?.city && `${userData.address.city}, `}
                {userData["countryData"] &&
                  JSON.parse(userData["countryData"])["country_name"]}
              </TextSmall>
            </Flex>
          )}
          {userData["bio_details"]?.["sports_id"] && (
            <Flex align={{ base: "flex-start", md: "center" }} gap={2}>
              <Icon as={CricketIcon} w={5} h={5} />
              <TextSmall>
                {
                  sportsData.find(
                    (sport) =>
                      sport["sports_id"] == userData["bio_details"]["sports_id"]
                  )?.["sports_name"]
                }
              </TextSmall>
            </Flex>
          )}
          {userData["bio_details"]?.["profession"] && (
            <Flex align={{ base: "flex-start", md: "center" }} gap={2}>
              <Icon as={WorkIcon} w={5} h={5} />
              <TextSmall>
                {
                  professionData.find(
                    (profession) =>
                      profession["lookup_key"] ===
                      userData["bio_details"]["profession"]
                  )?.["lookup_value"]
                }
              </TextSmall>
            </Flex>
          )}
        </Flex>
      )}

      <Flex
        mt={3}
        direction={{ base: "column", md: "row" }}
        gap={{ base: 3, md: 10 }}
        pr={{ md: 7 }}
        justify="space-between"
      >
        {userData?.["bio_details"]?.["description"] && (
          <Box>
            <Text
              fontSize="sm"
              noOfLines={truncateBioDesc && 2}
              ref={(newRef) => {
                if (newRef && !bioDetailsRef.current?.offsetHeight) {
                  bioDetailsRef.current.offsetHeight = newRef.offsetHeight;
                  bioDetailsRef.current.scrollHeight = newRef.scrollHeight;
                }
              }}
            >
              {userData["bio_details"]["description"]}
            </Text>
            {bioDetailsRef.current?.offsetHeight <
              bioDetailsRef.current?.scrollHeight && (
              <Button
                variant="link"
                fontSize="sm"
                colorScheme="primary"
                onClick={() => setTruncateBioDesc(!truncateBioDesc)}
              >
                {truncateBioDesc ? "Show More" : "Show Less"}
              </Button>
            )}
          </Box>
        )}

        <Flex
          ml={{ base: "none", md: "auto" }}
          alignSelf={{ base: "center", md: "flex-start" }}
          direction={{ base: "column", lg: "row" }}
          gap={3}
        >
          {currentUser ? (
            <>
              {!userData["user_profile_verified"] && (
                <>
                  <Button leftIcon={<CheckCircleIcon />} onClick={onVerifyOpen}>
                    Get &ldquo;Verified&rdquo; Badge
                  </Button>
                  <VerificationModal
                    isOpen={isVerifyOpen}
                    onClose={onVerifyClose}
                    type="user"
                  />
                </>
              )}
              <HStack spacing={3} justify="space-between">
                <Button
                  leftIcon={<EditIcon />}
                  minW="none"
                  onClick={() => router.push(routes.editProfile)}
                >
                  Edit Profile
                </Button>
                <SocialMediaShareButtons
                  content={`${userData?.full_name}'s Profile`}
                  fbHashtag={"#kridas"}
                  twitterHashtags={["kridas", "sports_career", "social_media"]}
                  twitterMention={"kridas_sports"}
                />
              </HStack>
            </>
          ) : (
            <HStack spacing={3}>
              <UserFollow userData={userData} />
              <SocialMediaShareButtons
                content={`${userData?.full_name}'s Profile`}
                fbHashtag={"#kridas"}
                twitterHashtags={["kridas", "sports_career", "social_media"]}
                twitterMention={"kridas_sports"}
              />
            </HStack>
          )}
        </Flex>
      </Flex>
      <UserProfileTabs tabIndex={tabIndex} setTabIndex={setTabIndex} mt={4} />
    </Box>
  );
};

export default UserProfileHeader;
