import React, { useCallback, useEffect, useRef, useState } from "react";
import ImageCropper from "./image-cropper";
import { Flex, Image, Input, Tooltip, useToast } from "@chakra-ui/react";
import Button from "../../ui/button";
import { ModalFooter, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import Modal from "../../ui/modal";
import { EditIcon, PictureEditIcon } from "../../ui/icons";
import { useUpdateUser, useUser } from "../../../hooks/user-hooks";
import { useUpdatePage } from "../../../hooks/page-hooks";
import IconButton from "../../ui/icon-button";
import { validateImage } from "../../../helper/constants/common-constants";
import imageSize from "react-image-size";
import { useUpdateEvent } from "../../../hooks/event-hook";

function CoverImageHandler({
  type = null,
  pageData = null,
  eventData = null,
  coverImage = null,
  setCoverImage,
  setCroppedCoverImage,
  setFieldValue,
  /*   onCropped = () => {}, */
}) {
  const [imageToCrop, setImageToCrop] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const toast = useToast();
  const onUploadFile = async (event) => {
    const files = event.target.files;
    const file = event.target.files[0];
    const { isValid, message } = validateImage(file);
    const { width, height } = await imageSize(
      file && URL.createObjectURL(file)
    );
    /*    console.log(width, height); */
    if (isValid && width > 620) {
      setDimensions({ width, height });
      /*    console.log("correct width",width) */
      if (files && files.length > 0) {
        setImageToCrop(URL.createObjectURL(file));
        if (type === "article" || type === "eventCreate")
          setCoverImage(event.target.files);
      }
    } else if (isValid && width < 620) {
      /*      console.log("error width", width); */
      toast({
        title: "Please choose a different cover photo",
        description:
          "This cover photo is too small. Please choose a larger cover photo.",
        status: "error",
        isClosable: true,
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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const coverRef = useRef();
  const { mutate: userMutate, isLoading: userLoading } = useUpdateUser();
  const { mutate: pageMutate, isLoading: pageLoading } = useUpdatePage();
  const { mutate: eventMutate, isLoading: eventLoading } = useUpdateEvent();
  const { data: userData = {} } = useUser();
  const handleUpload = () => {
    if (croppedImage) {
      if (type === "user")
        userMutate(
          {
            userData,
            values: { image: croppedImage },
          },
          {
            onSuccess: () => {
              onClose();
              setImageToCrop(null);
              setCroppedImage(null);
            },
          }
        );
      else if (type === "pageCoverImage")
        pageMutate(
          {
            pageData,
            values: { [type]: croppedImage },
            type: "image",
          },
          {
            onSuccess: () => {
              onClose();
              setImageToCrop(null);
              setCroppedImage(null);
            },
          }
        );
      else if (type === "eventHeader") {
        eventMutate(
          {
            ...eventData,
            event_banner: croppedImage,
          },
          {
            onSuccess: () => {
              onClose();
              setImageToCrop(null);
              setCroppedImage(null);
            },
          }
        );
      } else if (type === "eventCreate") {
        setCroppedCoverImage(croppedImage);
        // setFieldValue("event_banner", croppedImage);
        /*     onCropped(croppedImage); */
        onClose();
      } else if (type === "article") {
        setFieldValue("cover_image_url", croppedImage);
        /*  onCropped(croppedImage); */
        onClose();
      }
    } else if (imageToCrop) {
      toast({
        title: "Please fit the Cover Image to Continue",
        description: "Upload Cover Image of 1021 x 300 for clearer fit",
        status: "info",
        isClosable: true,
        duration: 1500,
      });
    } else {
      toast({
        title: "Select a picture to proceed",
        description: "Click the 'Select Banner Image' button to upload",
        status: "error",
        isClosable: true,
        duration: 1500,
      });
    }
  };

  return (
    <>
      <IconButton
        aria-label="upload cover picture"
        icon={<EditIcon color="white" fontSize="18px" />}
        variant="solid"
        size="sm"
        colorScheme="primary"
        tooltipLabel="Edit Cover Picture"
        borderRadius="base"
        position="absolute"
        top={type === "article" ? "-10px" : "10px"}
        right={type === "article" ? "-10px" : "10px"}
        onClick={() => onOpen()}
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={"6xl"}
        title={"Upload Banner Image"}
      >
        <ModalCloseButton
          onClick={() => {
            onClose();
          }}
        />
        <Input
          display={"none"}
          ref={coverRef}
          type={"file"}
          accept="image/*"
          onChange={onUploadFile}
        />
        <Button
          my={5}
          /*  variant={"outline"} */
          colorScheme="blue"
          onClick={() => coverRef.current.click()}
        >
          Select Banner Image
        </Button>
        <div>
          <ImageCropper
            imageToCrop={imageToCrop}
            coverImage={coverImage}
            onImageCropped={(croppedImage) => setCroppedImage(croppedImage)}
            type={type}
            dimensions={dimensions}
          />
        </div>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            isLoading={userLoading || pageLoading || eventLoading}
            onClick={handleUpload}
          >
            Upload
          </Button>
          <Button
            colorScheme="red"
            mr={3}
            onClick={() => {
              /*   setImageToCrop(null);
              setCroppedImage(null);
              setOriginalImage(null); */
              onClose();
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default CoverImageHandler;
