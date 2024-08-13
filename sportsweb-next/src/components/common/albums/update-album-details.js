import {
  Button,
  ModalFooter,
  useDisclosure,
  Flex,
  Text,
  VStack,
  Input,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import Modal from "../../ui/modal";
import { Form, Formik } from "formik";
import { useGalleryData, useUpdateGallery } from "../../../hooks/gallery-hooks";
import { EditIcon } from "../../ui/icons";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import * as yup from "yup";
import { updateGalleryYupSchema } from "../../../helper/constants/gallery-constants";

const UpdateAlbumInfo = ({ galleryId, type }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: galleryData = {} } = useGalleryData(galleryId);
  const { mutate, isLoading } = useUpdateGallery(type);
  return (
    <>
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
        onClick={() => onOpen()}
      ></IconButton>
      <Modal
        onClose={onClose}
        size="xl"
        isOpen={isOpen}
        title={"Edit Album Info"}
        isCentered
      >
        <Formik
          initialValues={{
            gallery_name: galleryData?.gallery_name,
            gallery_desc: galleryData?.gallery_desc,
          }}
          validationSchema={updateGalleryYupSchema(yup)}
          onSubmit={(values) => {
            mutate(
              { gallery_id: galleryId, ...values },
              {
                onSuccess: () => {
                  onClose();
                },
              }
            );
          }}
        >
          {() => (
            <Form>
              <VStack w="full" align="flex-start" spacing={5}>
                <TextBoxWithValidation
                  name="gallery_name"
                  label={"Album Title"}
                />

                <TextBoxWithValidation
                  name="gallery_desc"
                  label={"Album Description"}
                />
              </VStack>
              <ModalFooter>
                <HStack>
                  <Button
                    type="submit"
                    colorScheme={"blue"}
                    isLoading={isLoading}
                  >
                    Save
                  </Button>
                  <Button onClick={onClose}>Close</Button>
                </HStack>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default UpdateAlbumInfo;
