import {
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  Spacer,
  Heading,
  Text,
  Select,
  VStack,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";

import { Formik, Form } from "formik";
import VerifyDocumentUploadSuccess from "./user-pages-verify-documentuploadsuccess";
import {useRouter} from "next/router";
import {useCreateProfileVerification} from "../../../hooks/profile-verification-hooks"
import { useUser } from "../../../hooks/user-hooks";
import * as yup from "yup";
import { getDocumentDetailsYupSchema } from "../../../helper/constants/common-constants";
import SelectWithValidation from "../../ui/select/select-with-validation";

function VerifyDocumentUploadModal({ onClose,type }) {
  const { onOpen, isOpen, onClose: onVerifyDocumentUploadClose } = useDisclosure();
  const { onOpen: onDocumentSuccessOpen, isOpen: isDocumentSuccessOpen } =
    useDisclosure();
  const router = useRouter();
  const {mutate} = useCreateProfileVerification();
  const { data: userData } = useUser();
      console.log(userData)
  const handleSubmit = (values) => {
    onVerifyDocumentUploadClose();
    const {pageId} = router.query;
    mutate({document: values.document, companyId: pageId, userId: userData.user_id , type})
    console.log(pageId)
    console.log(values)
    onDocumentSuccessOpen();

  };
  return (
    <>
      <Button
        bg="blue.400"
        w="36"
        borderRadius="none"
        color="white"
        _hover={{ color: "black" }}
        onClick={onOpen}
      >
        Proceed
      </Button>
      <Modal size="xl" isOpen={isOpen} onClose={onClose}>
        <Formik 
          initialValues={{ document: "" }} 
          onSubmit={(values) => handleSubmit(values)}
          validationSchema={getDocumentDetailsYupSchema(yup)}>
          {(formik) => (
          <Form>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
                h="51px"
                bg="linear-gradient(90deg, #EC008C 0%, #FC6767 100%)"
                color="white"
                px={4}
                fontWeight="400"
              >
                Get Verified Badge
              </ModalHeader>
              <ModalCloseButton color="white" fontSize="15px" />
              <ModalBody p={[3, 5, 8]} pb={0}>
                <Text>
                  To get your profile verified, you need to upload the following{" "}
                </Text>
                <VStack p={5} spacing={2} align="flex-start">
                  <HStack spacing={5}>
                    <Text>Document Type</Text>
                    <SelectWithValidation
                      placeholder="Select..."
                      width="xs"
                      variant="flushed"
                      color="black"
                      borderBottomColor="#2F80ED"
                      name="documentType"
                      iconColor="#ED1C24"
                    ><option value='option1'>Aadhar Card</option>
                    <option value='option2'>Driving License</option>
                    <option value='option3'>Passport</option>
                    <option value='option4'>Voter ID</option>
                    <option value='option5'>Pan Card</option></SelectWithValidation>
                  </HStack>
                  <HStack spacing={5}>
                    <Text>Upload Document</Text>
                    <VStack pt={5}>
                      <HStack>
                        <Button
                        as="label"
                          colorScheme="blue"
                          variant="outline"
                          w="25"
                          borderRadius="none"
                          cursor="pointer"
                        >
                          Choose File
                         
                              <Input
                                type="file"
                                id="upload-file"
                                display="none"
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    formik.setFieldValue(
                                      "document",
                                      e.target.files[0]
                                    );
                                  }
                                }}
                              />
                        </Button>
                        {formik.values.document ? (<Text>{formik.values.document.name}</Text>) : (<Text>No File Chosen</Text>)}
                        {/* <Text>No File Chosen</Text> */}
                      </HStack>
                      <Text>JPG, JPEG, PDF (5 MB maximum)</Text>
                    </VStack>
                  </HStack>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Flex w="full" pt={5} gap={3}>
                  <Spacer />
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    bg
                    w="36"
                    borderRadius="none"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    bg="blue.400"
                    w="36"
                    borderRadius="none"
                    color="white"
                    _hover={{ color: "black" }}
                    type="submit"
                  >
                    Submit
                  </Button>
                </Flex>
              </ModalFooter>
            </ModalContent>
          </Form>
          )}
        </Formik>
      </Modal>
      <VerifyDocumentUploadSuccess
        isOpen={isDocumentSuccessOpen}
        onClose={onClose}
      />
    </>
  );
}
export default VerifyDocumentUploadModal;
