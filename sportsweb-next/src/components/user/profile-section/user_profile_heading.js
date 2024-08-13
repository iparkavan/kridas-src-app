import { useRef } from "react";
import {
  Avatar,
  Box,
  Image,
  Flex,
  HStack,
  Input,
  IconButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useUpdateUser } from "../../../hooks/user-hooks";
import { EditIcon } from "../../ui/icons";
import PictureModal from "../../common/picture-modal";
import { validateImage } from "../../../helper/constants/common-constants";
import CoverImageHandler from "../../common/image-crop-functions/crop-pic-mutate";

export default function UserProfileHeading(props) {
  const { userData, currentUser } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { mutate } = useUpdateUser();

  const profilePicRef = useRef();
  const coverPicRef = useRef();

  const handleFile = (e, type) => {
    const { isValid, message } = validateImage(e.target.files[0]);
    if (isValid) {
      if (type === "userProfileImage") {
        mutate({
          userData,
          values: { userProfileImage: e.target.files[0] },
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

  return (
    <Box w="100%">
      {userData["user_img"] ? (
        <>
          <Image
            borderTopRightRadius={10}
            borderTopLeftRadius={10}
            h={'192px'}
            w="full"
            src={userData["user_img"]}
           /*  bg={`url(${userData["user_img"]})`} */
            objectFit="cover"
            bg={'gray.400'}
           /*  objectPosition={"center"} */
         /*    backgroundSize={'cover'}
            backgroundPosition={'center'} */
            alt="Cover Image"
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
          h="192px"
          w="full"
          display="flex"
          justifyContent="center"
          alignItems="center"
          backgroundImage="url('/images/no-banner-image.jpg')"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          borderTopRightRadius={10}
          borderTopLeftRadius={10}
        ></Box>
      )}

      {currentUser ? (
        <>
         {/*  <Input
            type="file"
            id="coverPic"
            display="none"
            ref={coverPicRef}
            onChange={(e) => handleFile(e, "userCoverImage")}
          />
          <IconButton
            aria-label="upload picture"
            icon={<EditIcon color="white" />}
            isRound
            size="xs"
            colorScheme="primary"
            border="2px solid white"
            position="absolute"
            top="10px"
            right="10px"
            onClick={() => coverPicRef.current.click()}
          /> */}<CoverImageHandler type='user'/>
        </>
      ) : null}
      <Flex justifyContent={"flex-start"} mt={-12} py={3} px={6}>
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
          >
            {currentUser ? (
              <>
                <Input
                  type="file"
                  id="profilePic"
                  display="none"
                  ref={profilePicRef}
                  onChange={(e) => handleFile(e, "userProfileImage")}
                />
                <IconButton
                  aria-label="upload picture"
                  icon={<EditIcon color="white" />}
                  isRound
                  size="xs"
                  colorScheme="primary"
                  border="2px solid white"
                  position="absolute"
                  top="5px"
                  right="0px"
                  onClick={() => profilePicRef.current.click()}
                />
              </>
            ) : null}
          </Avatar>
        </HStack>
      </Flex>
    </Box>
  );
}
