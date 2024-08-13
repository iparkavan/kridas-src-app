import { useToast, VStack } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as yup from "yup";

import { useUpdateUser, useUser } from "../../../hooks/user-hooks";
import { getUserInterestsYupSchema } from "../../../helper/constants/user-contants";
import { useSports } from "../../../hooks/sports-hooks";
import { HeadingSmall } from "../../ui/heading/heading";
import Button from "../../ui/button";
import MultiSelect from "../../ui/select/multi-select";

const UserProfileEditInterests = () => {
  const toast = useToast();
  const { data: userData, error } = useUser();
  const { data: sportsData = [] } = useSports({
    select: (data) => {
      return data?.map((sport) => ({
        ...sport,
        value: sport["sports_id"],
        label: sport["sports_name"],
      }));
    },
  });
  const { mutate, isLoading } = useUpdateUser();

  if (userData) {
    const updatedSportsInterested =
      userData?.["sports_interested"]?.map((sportId) =>
        sportsData.find((s) => s["sports_id"] == sportId)
      ) ?? [];

    return (
      <Formik
        initialValues={{
          sports_interested: updatedSportsInterested,
        }}
        validationSchema={getUserInterestsYupSchema(yup)}
        enableReinitialize={true}
        onSubmit={(values, { setSubmitting }) => {
          const sports_interested = values.sports_interested.map(
            (type) => type.value
          );
          mutate(
            { userData, values: { sports_interested } },
            {
              onSettled: (_, error) => {
                setSubmitting(false);
                const toastTitle = error
                  ? "Failed to update your sports interested. Please try again."
                  : "Your sports interested has been updated.";
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
            <VStack alignItems="flex-start" maxW="lg" spacing={4}>
              <HeadingSmall textTransform="uppercase">
                Sports Interested
              </HeadingSmall>

              <MultiSelect
                isMulti
                placeholder="Select Sports"
                id="sports_interested"
                instanceId="sports_interested"
                name="sports_interested"
                options={sportsData}
              />

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

export default UserProfileEditInterests;
