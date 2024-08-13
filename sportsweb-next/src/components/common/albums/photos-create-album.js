import { useRef } from "react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import {
  Input,
  SimpleGrid,
  GridItem,
  Flex,
  Heading,
  VStack,
  AspectRatio,
  Image,
  useDisclosure,
  FormControl,
  FormErrorMessage,
  useToast,
  Box,
  ModalFooter,
  HStack,
} from "@chakra-ui/react";
import Modal from "../../ui/modal";
import Button from "../../ui/button";
import { BsPlusCircle } from "react-icons/bs";
import { createGalleryMediaYupSchema } from "../../../helper/constants/gallery-media-constants";
import { useCreateGallery } from "../../../hooks/gallery-hooks";
import { useCreateGalleryMedia } from "../../../hooks/gallery-media-hooks";
// import usePage from "../../../hooks/page-hooks";
import { usePage } from "../../../hooks/page-hooks";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import * as yup from "yup";
import { CloseIcon } from "../../ui/icons";
import { useUser } from "../../../hooks/user-hooks";
import { validateImageOrVideo } from "../../../helper/constants/common-constants";

export function CreateAlbumModal({
  isOpen,
  onClose,
  type,
  setTabIndex,
  button,
}) {
  const router = useRouter();
  const { pageId, eventId } = router.query;
  const { mutate: createGalleryMutate } = useCreateGallery();
  const { mutate: createGalleryMediaMutate, isLoading } =
    useCreateGalleryMedia(type);
  const fileRef = useRef();

  const handleSubmit = (values) => {
    createGalleryMutate(
      {
        gallery_name: values.gallery_name,
        gallery_desc: values.gallery_desc,
        type,
        Id: eventId || pageData?.company_id || userData?.user_id,
      },
      {
        onSuccess: (response) => {
          createGalleryMediaMutate(
            {
              gallery_id: response.gallery_id,
              file: values.file,
            },
            {
              onSuccess: () => {
                onClose();
                if (button === "square") setTabIndex(2);
                toast({
                  title: "Your album has been created",
                  status: "success",
                  duration: 6000,
                  isClosable: true,
                });
              },
            }
          );
        },
      }
    );
  };

  const { data: pageData = {} } = usePage(pageId);
  const { data: userData = {} } = useUser();
  var fileList = [];
  const toast = useToast();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={"Create Album"}
      size={"3xl"}
      p={[2, 4, 8]}
    >
      <Formik
        initialValues={{
          gallery_name: "",
          gallery_desc: "",
          file: [],
        }}
        validationSchema={createGalleryMediaYupSchema(yup)}
        onSubmit={(values) => handleSubmit(values)}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ values, setFieldValue, handleChange, errors }) => (
          <Form>
            <VStack spacing={4}>
              <TextBoxWithValidation
                name="gallery_name"
                placeholder="Album Name"
                size="md"
              />
              <Input
                name="gallery_desc"
                placeholder="Album Description"
                size="md"
                onChange={handleChange}
                values={values.gallery_desc}
              />
            </VStack>
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
                      background: "var(--chakra-colors-primary-500)",
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
                  <Heading size="sm" textAlign="center" mt={1}>
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
            <ModalFooter p={0} mt={6}>
              <HStack w="full" spacing={4}>
                <Button variant="outline" w="50%" onClick={onClose}>
                  Discard Everything
                </Button>
                <Button w="50%" type="submit" isLoading={isLoading}>
                  Post Album
                </Button>
              </HStack>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export function CreateAlbumSquare({ type, setTabIndex }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button w={{ base: "full", md: "min-content" }} onClick={onOpen}>
        Create Album
      </Button>
      <CreateAlbumModal
        isOpen={isOpen}
        onClose={onClose}
        type={type}
        setTabIndex={setTabIndex}
        button={"square"}
      />
    </>
  );
}
export function CreateAlbumCircle({ type }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <BsPlusCircle
        style={{
          fontSize: "45px",
          cursor: "pointer",
          color: "white",
          background: "var(--chakra-colors-primary-500)",
          borderRadius: "50%",
        }}
        onClick={onOpen}
      />

      <CreateAlbumModal isOpen={isOpen} onClose={onClose} type={type} />
    </>
  );
}
