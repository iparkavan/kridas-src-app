import { useRef, useState } from "react";
import { useDisclosure, VStack, Input, useToast } from "@chakra-ui/react";
import Button from "../../ui/button";
import Modal from "../../ui/modal";
import PostModal from "../../feed/post-modal";
import { UploadIcon } from "../../ui/icons";
import { TextSmall } from "../../ui/text/text";
import { validateImage } from "../../../helper/constants/common-constants";

export function AddPhotos({ type, id, data }) {
  const {
    isOpen: addIsOpen,
    onOpen: addOnOpen,
    onClose: addOnClose,
  } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const photosRef = useRef();
  const [photo, setPhoto] = useState();
  const toast = useToast();

  return (
    <>
      <Button
        variant="outline"
        w={{ base: "full", md: "min-content" }}
        onClick={addOnOpen}
      >
        Add Photos
      </Button>
      <Modal
        title={"Upload Photo"}
        onClose={addOnClose}
        size="xl"
        isOpen={addIsOpen}
        p={[2, 4, 6]}
      >
        <VStack
          w="full"
          justify="center"
          cursor="pointer"
          onClick={() => photosRef.current.click()}
        >
          <Input
            type="file"
            ref={photosRef}
            display="none"
            onChange={(e) => {
              const { isValid, message } = validateImage(e.target.files[0]);
              if (isValid) {
                setPhoto(e);
                onOpen();
              } else {
                toast({
                  title: "Upload failed",
                  description: message,
                  duration: 6000,
                  status: "error",
                  isClosable: true,
                });
              }
            }}
          />
          <UploadIcon />
          <TextSmall>Upload Photo</TextSmall>
          <TextSmall style={{ color: "#888da8" }}>
            Browse your computer
          </TextSmall>
        </VStack>
        <PostModal
          isOpen={isOpen}
          onClose={onClose}
          type={type}
          id={id}
          addPhoto={photo}
          addOnClose={addOnClose}
          data={data}
          pageId={data?.eventOrganizers?.[0]?.companyId}
        />
      </Modal>
    </>
  );
}
