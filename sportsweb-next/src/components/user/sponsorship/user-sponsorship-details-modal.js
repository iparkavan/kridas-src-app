import {
  Text,
  Button,
  Input,
  Radio,
  VStack,
  HStack,
  Stack,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spacer,
  Box,
  Heading,
  SimpleGrid,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import ProfileModal from "./user-sponsorship-profile-modal";
import { Formik, Form, Field, useFormikContext } from "formik";
import * as yup from "yup";
import { useCreateSponsorInfo } from "../../../hooks/sponsor-info-hooks";
import { useUser } from "../../../hooks/user-hooks";
import { useRouter } from "next/router";
import { useCategoriesByType } from "../../../hooks/category-hooks";
import { getUserRoiOptionYupSchema } from "../../../helper/constants/common-constants";

const DetailsModal = ({ onClose }) => {
  const {
    onOpen,
    isOpen,
    onClose: onVerifyDocumentUploadClose,
  } = useDisclosure();
  const { onOpen: onDocumentSuccessOpen, isOpen: isDocumentSuccessOpen } =
    useDisclosure();
  const { data: categories = [] } = useCategoriesByType("URO");
  const { data: userData } = useUser();
  const router = useRouter();
  const { mutate } = useCreateSponsorInfo();
  const [mode, setMode] = useState(false);

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
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={"lg"}>
        <Formik
          initialValues={{
            previous_current_sponsor: null,
            roi_options: [],
          }}
          validationSchema={getUserRoiOptionYupSchema(yup)}
          onSubmit={(values) => {
            const roi_options = values.roi_options.map((v) => +v);
            values.user_id = userData?.["user_id"];
            if (values.previous_current_sponsor === "") {
              values.previous_current_sponsor = null;
            }
            mutate(
              { ...values, roi_options },
              {
                onSuccess: () => {
                  // const con = values.roi_options[1];
                  onVerifyDocumentUploadClose();
                  onDocumentSuccessOpen();
                },
              }
            );
          }}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ values, handleChange, errors }) => (
            <Form>
              <ModalOverlay />
              <ModalContent h="2xl">
                <ModalHeader
                  h="16"
                  bg="linear-gradient(90deg, #EC008C 0%, #FC6767 100%)"
                  color="white"
                  px={4}
                  fontWeight="400"
                >
                  Get Sponsorship
                </ModalHeader>
                <ModalCloseButton color="white" fontSize="md" />
                <ModalBody>
                  <VStack mt="1.5" align="stretch">
                    <Text fontWeight="normal" fontSize="md" color="#000000">
                      Create your Sponsorhip profile
                    </Text>
                    <Text fontWeight="normal" fontSize="md" color="#555555">
                      We will start with creating a sponsorship profile, which
                      can be used for finalizing deals with Sponsors.{" "}
                    </Text>
                  </VStack>
                  <VStack align="stretch" mt="1.5">
                    <Text fontWeight="bold" fontSize="md" color="#000000">
                      {" "}
                      Current Sponsorship Status
                    </Text>
                    <RadioGroup defaultValue="1" pt={2}>
                      <VStack spacing={2} align="flex-start">
                        <Radio
                          value="1"
                          borderColor="#2F80ED"
                          onChange={() => {
                            setMode(false);
                            values.previous_current_sponsor = "";
                          }}
                        >
                          I do not have any sponsorship now
                        </Radio>
                        <Radio
                          value="2"
                          borderColor="#2F80ED"
                          onChange={() => setMode(true)}
                        >
                          I had/have sponsorship
                        </Radio>
                      </VStack>
                    </RadioGroup>
                    <Box pl={6} display={mode ? "block" : "none"}>
                      <Input
                        variant="flushed"
                        width="xs"
                        borderBottomColor="#2F80ED"
                        name="previous_current_sponsor"
                        value={values.previous_current_sponsor}
                        placeholder="Enter sponsor name"
                        onChange={handleChange}
                      />
                    </Box>
                  </VStack>
                  <VStack align="stretch" mt="15px" spacing={3}>
                    <VStack align="stretch" spacing={0.5}>
                      <Text fontWeight="bold" fontSize="16px" color="#000000">
                        {" "}
                        Common ROI
                      </Text>
                      <Text fontWeight="normal" fontSize="md" color="#555555">
                        Select the ROI you will be able provide to the Sponsors.
                      </Text>
                    </VStack>
                    <FormControl
                      id="roi_options"
                      isInvalid={errors["roi_options"]}
                    >
                      {categories.map((sport) => (
                        <Field key={sport["category_id"]} name="roi_options">
                          {({ field }) => {
                            return (
                              <VStack align="stretch" spacing={0.5}>
                                <Checkbox
                                  {...field}
                                  value={sport["category_id"]}
                                  borderColor="#2F80ED"
                                >
                                  <text>{sport["category_name"]}</text>
                                </Checkbox>
                                <Text
                                  fontWeight="normal"
                                  fontSize="md"
                                  color="#555555"
                                  pl="5"
                                >
                                  {sport["category_desc"]}
                                </Text>
                              </VStack>
                            );
                          }}
                        </Field>
                      ))}
                      {errors["roi_options"] && (
                        <FormErrorMessage>
                          Please select at least One ROI is mandatory
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <VStack>
                    <HStack spacing={5}>
                      <Button
                        colorScheme="primary"
                        variant="outline"
                        w="28"
                        borderRadius={2}
                        onClick={onClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        colorScheme="primary"
                        type="submit"
                        w="28"
                        borderRadius={2}
                      >
                        Submit
                      </Button>
                    </HStack>
                  </VStack>
                </ModalFooter>
              </ModalContent>
            </Form>
          )}
        </Formik>
      </Modal>
      <ProfileModal isOpen={isDocumentSuccessOpen} onClose={onClose} />
    </>
  );
};

export default DetailsModal;
