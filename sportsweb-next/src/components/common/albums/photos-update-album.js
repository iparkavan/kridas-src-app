import {
  ModalFooter,
  ModalCloseButton,
  Input,
  SimpleGrid,
  GridItem,
  Flex,
  Heading,
  VStack,
  Image,
  AspectRatio,
  useDisclosure,
  FormControl,
  FormErrorMessage,
  useToast,
  Box,
} from "@chakra-ui/react";
import Modal from "../../ui/modal/index";
import Button from "../../ui/button";
import { Formik, Form } from "formik";
import { useRef } from "react";
import { BsPlusCircle } from "react-icons/bs";
import { useCreateGalleryMedia } from "../../../hooks/gallery-media-hooks";
import { updateGalleryMediaYupSchema } from "../../../helper/constants/gallery-media-constants";
import * as yup from "yup";
import { CloseIcon } from "../../ui/icons";
import { validateImageOrVideo } from "../../../helper/constants/common-constants";

export function UpdateAlbumModal({ isOpen, onClose, gallery_id, type }) {
  const { mutate: createGalleryMediaMutate, isLoading } =
    useCreateGalleryMedia(type);
  const fileRef = useRef();
  const handleSubmit = (values) => {
    createGalleryMediaMutate(
      {
        gallery_id,
        file: values.file,
      },
      {
        onSuccess: () => {
          onClose();
          toast({
            title: "Your album has been updated",
            status: "success",
            duration: 6000,
            isClosable: true,
          })
        },
      }
    );
  };
  var fileList = [];
  const toast = useToast();
  return (
    <Modal
      size="3xl"
      isOpen={isOpen}
      onClose={onClose}
      title={"Update Album"}
      p={[2, 4, 6]}
    >
      <Formik
        initialValues={{
          gallery_id,
          file: [],
        }}
        validationSchema={updateGalleryMediaYupSchema(yup)}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ values, setFieldValue, errors }) => (
          <Form>
            <SimpleGrid columns={3} w="full" gap={4}>
              <GridItem colSpan={{ base: 4, md: 2, lg: 1 }}>
                <Flex
                  border="2px dashed darkgray"
                  w="200px"
                  h="200px"
                  direction="column"
                  align="center"
                  justify="center"
                  mt={5}
                >
                  <BsPlusCircle
                    style={{
                      fontSize: "40px",
                      cursor: "pointer",
                      color: "white",
                      background: "#3182CE",
                      borderRadius: "50%",
                    }}
                    onClick={() => fileRef.current.click()}
                  />
                  <Input
                    type="file"
                    multiple
                    ref={fileRef}
                    name="file"
                    display="none"
                    onChange={(e) => {
                      let files = e.target.files;
                      for (let file of files) {
                        if (validateImageOrVideo(file)?.isValid) continue;
                        else {
                          const { message } = validateImageOrVideo(file);
                          if (message)
                            toast({
                              title: "Upload failed",
                              description: message,
                              status: "error",
                              duration: 6000,
                              isClosable: true,
                            });
                          return false;
                        }
                      }
                      if (e.target.files) {
                        /*  console.log(fileList.length + files.length); */
                        if (
                          files.length > 5 ||
                          fileList.length + files.length > 5
                        ) {
                          toast({
                            title: "Maximum Upload limit is 5",
                            description: "Please Upload upto 5 Photos/Videos",
                            status: "error",
                            duration: 6000,
                            isClosable: true,
                          });
                        } else {
                          for (let i = 0; i < files.length; i++)
                            fileList.push(files[i]);
                          setFieldValue("file", fileList);
                        }
                      }
                    }}
                  />
                  <Heading size="sm" textAlign="center">
                    Add Photos/Videos
                  </Heading>
                </Flex>
              </GridItem>
              {values.file &&
                values.file.map((file, index) => (
                  <GridItem
                    key={index}
                    colSpan={{ base: 4, md: 2, lg: 1 }}
                    mt={5}
                  >
                    <Box position="relative">
                      {file.type.includes("image") ? (
                        <Image
                          alt="preview_image"
                          src={URL.createObjectURL(file)}
                          boxSize="200"
                          w="full"
                          objectFit="cover"
                          borderRadius="5px"
                        />
                      ) : (
                        <AspectRatio maxW="200px" maxH="200px" ratio={1}>
                          <video src={URL.createObjectURL(file)} controls />
                        </AspectRatio>
                      )}
                      <CloseIcon
                        style={{
                          top: "0px",
                          right: file.type.includes("image") ? "0px" : "30px",
                          position: "absolute",
                          cursor: "pointer",
                          color: "red",
                        }}
                        fontSize="25px"
                        onClick={() => {
                          /* let copy = values.file.filter(
                                  (file, idx) => index !== idx
                                ); */
                          fileList.splice(index, 1);
                          setFieldValue("file", fileList);
                        }}
                      />
                    </Box>
                  </GridItem>
                ))}
            </SimpleGrid>
            <FormControl id="file" isInvalid={errors["file"]}>
              <FormErrorMessage>{errors.file && errors.file}</FormErrorMessage>
            </FormControl>

            <ModalFooter>
              <Button
                bg="grey"
                color="white"
                _hover={{ bg: "#3182CE" }}
                size="md"
                w="50%"
                margin="10px"
                onClick={onClose}
              >
                Discard Everything
              </Button>
              <Button
                bg="#3182CE"
                color="white"
                _hover={{ bg: "#3182CE" }}
                size="md"
                w="50%"
                type="submit"
                isLoading={isLoading}
              >
                Update Album
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export function UpdateAlbumButton({ gallery_id, type }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        bg="#3182CE"
        _hover={{ bg: "#3182CE" }}
        color="white"
        size="md"
        w={{ base: "full", md: "min-content" }}
        onClick={onOpen}
      >
        Update Album
      </Button>
      <UpdateAlbumModal
        isOpen={isOpen}
        onClose={onClose}
        gallery_id={gallery_id}
        type={type}
      />
    </>
  );
}
