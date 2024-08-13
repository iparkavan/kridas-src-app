import { useToast, VStack } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as yup from "yup";

import { useUpdateUser, useUser } from "../../../hooks/user-hooks";
import EditSocialLinks from "../../social/edit-social-links";
import { getSocialsYupSchema } from "../../../helper/constants/common-constants";
import { HeadingSmall } from "../../ui/heading/heading";
import Button from "../../ui/button";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";

const UserProfileEditSocial = () => {
  const toast = useToast();
  const { data: userData, error } = useUser();
  const { data: socialData = [], isSuccess } = useLookupTable("SOC");
  const { mutate, isLoading } = useUpdateUser();

  if (userData && isSuccess) {
    const initialValues = socialData.map((social) => {
      const isSocialPresent = userData.social?.find(
        (soc) => soc.type === social["lookup_key"]
      );
      return isSocialPresent
        ? isSocialPresent
        : { type: social["lookup_key"], link: "" };
    });

    return (
      <Formik
        initialValues={{
          social: initialValues,
        }}
        validationSchema={getSocialsYupSchema(yup)}
        enableReinitialize={true}
        onSubmit={(values, { setSubmitting }) => {
          mutate(
            { userData, values },
            {
              onSettled: (_, error) => {
                setSubmitting(false);
                const toastTitle = error
                  ? "Failed to update your social presence. Please try again."
                  : "Your social presence has been updated.";
                toast({
                  title: toastTitle,
                  status: error ? "error" : "success",
                  duration: 5000,
                  isClosable: true,
                });
              },
            }
          );
        }}
      >
        {() => (
          <Form>
            <VStack alignItems="flex-start" width="full" spacing={6}>
              <HeadingSmall textTransform="uppercase">
                Social Presence
              </HeadingSmall>
              <EditSocialLinks name="social" />
              <Button type="submit" isLoading={isLoading}>
                Save
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    );
  }

  if (error) return "An error has occurred: " + error.message;

  return "Loading...";
};

export default UserProfileEditSocial;
