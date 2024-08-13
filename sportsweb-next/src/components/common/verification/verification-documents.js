import {
  Box,
  Checkbox,
  Divider,
  HStack,
  Input,
  ModalFooter,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";

import { getDocumentDetailsYupSchema } from "../../../helper/constants/common-constants";
import { verificationDocs } from "../../../helper/constants/user-contants";
import { useCreateProfileVerification } from "../../../hooks/profile-verification-hooks";
import { useUser } from "../../../hooks/user-hooks";
import Button from "../../ui/button";
import { HeadingSmall } from "../../ui/heading/heading";
import SelectWithValidation from "../../ui/select/select-with-validation";
import { TextMedium, TextSmall } from "../../ui/text/text";
import FieldLayout from "../../user/profile-section/user-profile-edit/field-layout";

function VerificationDocuments(props) {
  const { handleClose, nextStep, type, id } = props;
  const toast = useToast();
  const { data: userData } = useUser();
  const { mutate, isLoading } = useCreateProfileVerification();

  return (
    <Formik
      initialValues={{
        id_proof_type: "",
        id_proof: null,
        address_proof_type: "",
        address_proof: null,
        is_proof_same: false,
      }}
      validationSchema={getDocumentDetailsYupSchema(yup)}
      onSubmit={(values) => {
        mutate(
          {
            ...values,
            type,
            id,
          },
          {
            onSuccess: () => {
              nextStep();
            },
            onError: (_, variables) => {
              toast({
                title: `Unable to verify your ${
                  variables.type === "user" ? "profile" : "page"
                }. Please try again.`,
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            },
          }
        );
      }}
    >
      {(formik) => (
        <Form>
          <VStack align="flex-start" spacing={4}>
            <TextMedium>
              To get your {type === "user" ? "profile" : "page"} verified, you
              need to upload the following
            </TextMedium>

            <Divider borderColor="gray.300" />

            <VStack align="flex-start" spacing={5} w="full">
              <HeadingSmall>ID Proof</HeadingSmall>
              <FieldLayout label="Document Type">
                <SelectWithValidation
                  name="id_proof_type"
                  placeholder="Select..."
                >
                  {verificationDocs[userData.address?.country]
                    .filter((doc) => doc !== formik.values.address_proof_type)
                    .map((doc) => (
                      <option key={doc} value={doc}>
                        {doc}
                      </option>
                    ))}
                </SelectWithValidation>
              </FieldLayout>
              <FieldLayout label="Upload Document">
                <Box>
                  <HStack spacing={5}>
                    <Button
                      as="label"
                      variant="outline"
                      cursor="pointer"
                      minW="none"
                    >
                      Choose File
                      <Input
                        type="file"
                        id="upload-file"
                        display="none"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            formik.setFieldValue("id_proof", e.target.files[0]);
                          }
                        }}
                      />
                    </Button>
                    <TextSmall>
                      {formik.values.id_proof?.name ?? "No file chosen"}
                    </TextSmall>
                  </HStack>
                  {formik.errors.id_proof && formik.touched.id_proof && (
                    <TextSmall mt={2} color="red.500">
                      {formik.errors.id_proof}
                    </TextSmall>
                  )}
                  <TextSmall mt={2}>JPG, JPEG, PDF (5 MB maximum)</TextSmall>
                </Box>
              </FieldLayout>
            </VStack>

            <Divider borderColor="gray.300" />

            <VStack align="flex-start" spacing={5} w="full">
              <HeadingSmall>Address Proof</HeadingSmall>
              <Field name="is_proof_same">
                {({ field }) => {
                  return (
                    <Checkbox
                      borderColor="gray.300"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        formik.setFieldValue("address_proof_type", "");
                        formik.setFieldValue("address_proof", null);
                      }}
                    >
                      <TextSmall mt="1px">Same as ID Proof</TextSmall>
                    </Checkbox>
                  );
                }}
              </Field>

              <FieldLayout label="Document Type">
                <SelectWithValidation
                  name="address_proof_type"
                  placeholder="Select..."
                  disabled={formik.values.is_proof_same}
                >
                  {verificationDocs[userData.address?.country]
                    .filter((doc) => doc !== formik.values.id_proof_type)
                    .map((doc) => (
                      <option key={doc} value={doc}>
                        {doc}
                      </option>
                    ))}
                </SelectWithValidation>
              </FieldLayout>
              <FieldLayout label="Upload Document">
                <Box>
                  <HStack spacing={5}>
                    <Button
                      as="label"
                      variant="outline"
                      cursor="pointer"
                      minW="none"
                      disabled={formik.values.is_proof_same}
                    >
                      Choose File
                      {!formik.values.is_proof_same && (
                        <Input
                          type="file"
                          id="upload-file"
                          display="none"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              formik.setFieldValue(
                                "address_proof",
                                e.target.files[0]
                              );
                            }
                          }}
                        />
                      )}
                    </Button>
                    <TextSmall>
                      {formik.values.address_proof?.name ?? "No file chosen"}
                    </TextSmall>
                  </HStack>
                  {formik.errors.address_proof && formik.touched.address_proof && (
                    <TextSmall mt={2} color="red.500">
                      {formik.errors.address_proof}
                    </TextSmall>
                  )}
                  <TextSmall mt={2}>JPG, JPEG, PDF (5 MB maximum)</TextSmall>
                </Box>
              </FieldLayout>
            </VStack>
          </VStack>

          <ModalFooter p={0} mt={5}>
            <Button variant="outline" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Submit
            </Button>
          </ModalFooter>
        </Form>
      )}
    </Formik>
  );
}

export default VerificationDocuments;
