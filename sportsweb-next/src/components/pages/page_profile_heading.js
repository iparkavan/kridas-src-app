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
import { Tooltip } from "@chakra-ui/react";

import { useUpdatePage } from "../../hooks/page-hooks";
import { EditIcon, PictureEditIcon } from "../ui/icons";
import PictureModal from "../common/picture-modal";
import { validateImage } from "../../helper/constants/common-constants";
import CoverImageHandler from "../common/image-crop-functions/crop-pic-mutate";
import CoverImage from "../common/cover-image";
import EmptyCoverImage from "../common/empty-cover-image";

export default function PageProfileHeading(props) {
  const { pageData, currentPage } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const profilePicRef = useRef();
  const coverPicRef = useRef();
  const { mutate } = useUpdatePage();

  const handleFile = (e, type) => {
    const { isValid, message } = validateImage(e.target.files[0]);
    if (isValid) {
      mutate({
        pageData,
        values: { [type]: e.target.files[0] },
        type: "image",
      });
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
      {pageData["company_img"] ? (
        <>
          <CoverImage
            modalOpen={onOpen}
            coverimage={pageData?.["company_img"]}
          />
          {/* <Image
            borderTopRightRadius={10}
            borderTopLeftRadius={10}
            h="300px"
            w="full"
            src={pageData?.["company_img"]}
            objectFit="cover"
            alt="Cover image"
            cursor="pointer"
            onClick={onOpen}
            
          /> */}
          <PictureModal
            isOpen={isOpen}
            onClose={onClose}
            src={pageData?.["company_img"]}
            alt="Page cover image"
          />
        </>
      ) : (
        <EmptyCoverImage
          coverimage={"url('/images/no-banner-image-page.jpg')"}
        />
      )}

      {currentPage && (
        <CoverImageHandler
          type="pageCoverImage"
          pageData={pageData}
          coverImage={pageData?.company_img}
        />
      )}
      <Flex justifyContent={"flex-start"} mt={-12} px={10}>
        <HStack>
          <Avatar
            size={"xl"}
            name={pageData?.["company_name"]}
            src={pageData?.["company_profile_img"]}
            alt={"User"}
            css={{
              border: "2px solid white",
            }}
            position="relative"
          >
            {currentPage ? (
              <>
                <Input
                  type="file"
                  id="profilePic"
                  display="none"
                  ref={profilePicRef}
                  onChange={(e) => handleFile(e, "pageProfileImage")}
                />
                <Tooltip label="Edit Profile Pic!" aria-label="A tooltip">
                  <IconButton
                    aria-label="upload picture"
                    icon={<PictureEditIcon color="white" size={20} />}
                    isRound
                    size="sm"
                    colorScheme="primary"
                    // border="2px solid white"
                    position="absolute"
                    top="5px"
                    right="-2"
                    onClick={() => profilePicRef.current.click()}
                  />
                </Tooltip>
              </>
            ) : null}
          </Avatar>
        </HStack>
      </Flex>
    </Box>
  );
}
