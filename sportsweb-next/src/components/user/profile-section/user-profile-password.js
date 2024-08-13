import { Divider, HStack, VStack, Text } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as yup from "yup";
import Button from "../../ui/button";

import { KeyIcon } from "../../ui/icons";
import { useChangeUserPassword, useUser } from "../../../hooks/user-hooks";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import { getUserPasswordYupSchema } from "../../../helper/constants/user-contants";
import { HeadingMedium } from "../../ui/heading/heading";
import FieldLayout from "./user-profile-edit/field-layout";
import { useRouter } from "next/router";
import routes from "../../../helper/constants/route-constants";

const UserProfilePassword = () => {
  const { data: userData, error } = useUser();
  const { mutate, isLoading, isSuccess, isError } = useChangeUserPassword();
  const router = useRouter();

  if (userData) {
    return (
      <Formik
        initialValues={{
          password: "",
          confirmPassword: "",
        }}
        validationSchema={getUserPasswordYupSchema(yup)}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          mutate(
            {
              email: userData["user_email"],
              password: values.password,
            },
            {
              onSuccess: () => resetForm(),
            }
          );
          setSubmitting(false);
        }}
      >
        {({ resetForm }) => (
          <Form>
            <VStack alignItems="flex-start" spacing={8} width="full">
              <HStack spacing={4} alignItems="flex-start" width="full">
                <Icon as={KeyIcon} w="6" h="6" />
                <VStack alignItems="flex-start" width="full" spacing={6}>
                  <HeadingMedium>Password Settings</HeadingMedium>
                  <Divider borderColor="gray.300" />

                  <VStack alignItems="flex-start" w="75%" spacing={6}>
                    <HStack
                      justifyContent="space-between"
                      alignItems="center"
                      w="100%"
                    >
                      <FieldLayout label="New Password">
                        <TextBoxWithValidation
                          name="password"
                          type="password"
                        />
                      </FieldLayout>
                    </HStack>
                    <HStack
                      justifyContent="space-between"
                      alignItems="center"
                      w="100%"
                    >
                      <FieldLayout label="Confirm Password">
                        <TextBoxWithValidation
                          name="confirmPassword"
                          type="password"
                          w='full'
                        />
                      </FieldLayout>
                    </HStack>
                    {isSuccess && <Text>Your password has been changed</Text>}
                    {isError && (
                      <Text color="red.500">
                        Unable to update your password
                      </Text>
                    )}
                  </VStack>
                </VStack>
              </HStack>
              <HStack spacing={6} alignItems="flex-start" width="full">
                <Button
                  colorScheme="primary"
                  variant="solid"
                  type="submit"
                  isLoading={isLoading}
                >
                  Save
                </Button>
                <Button
                  colorScheme="primary"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    router.push(routes.home);
                  }}
                >
                  Cancel
                </Button>
              </HStack>
            </VStack>
          </Form>
        )}
      </Formik>
    );
  }

  if (error) return "An error has occurred: " + error.message;

  return "Loading...";
};

export default UserProfilePassword;
