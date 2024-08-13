import {
  Icon,
  VStack,
  HStack,
  Heading,
  Text,
  Checkbox,
  Button,
  Box,
  SimpleGrid,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/router";

import WelcomeSportsSvg from "../../svg/welcome-sports";
import { PersonCircleIcon } from "../ui/icons";
import { useSports } from "../../hooks/sports-hooks";
import { useUpdateUser, useUser } from "../../hooks/user-hooks";
import UserLayout from "../layout/user-layout/user-layout";
import { getNewUserInterestsYupSchema } from "../../helper/constants/user-contants";
import routes from "../../helper/constants/route-constants";

const UserInterests = (props) => {
  const { data: sportsData = [] } = useSports();
  const { data: userData } = useUser();

  const router = useRouter();
  const { redir } = router.query;
  const { mutate, isLoading } = useUpdateUser();

  return (
    <UserLayout {...props} hideSidebarAvatar={true} defaultNavSize="small">
      {userData && (
        <Formik
          // initialValues={{ ...userData, sports_interested: [] }}
          initialValues={{ sports_interested: [] }}
          validationSchema={getNewUserInterestsYupSchema(yup)}
          onSubmit={(values, { setSubmitting }) => {
            const updatedValues = { ...values };
            updatedValues.sports_interested = values.sports_interested.map(
              (v) => +v
            );
            mutate(
              { userData, values: updatedValues, type: "welcome-sports" },
              {
                onSuccess: () => {
                  const route = redir || routes.profile(userData["user_name"]);
                  router.push(route);
                },
              }
            );
            setSubmitting(false);
          }}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {(formik) => (
            <Form>
              <Box ml="10%" p={5} pt={10}>
                <VStack alignItems="flex-start" spacing={10}>
                  <WelcomeSportsSvg />
                  <HStack
                    alignItems="flex-start"
                    justifyContent="center"
                    spacing={5}
                  >
                    <Icon as={PersonCircleIcon} h={8} w={8} />
                    <VStack alignItems="flex-start" spacing={10}>
                      <Box>
                        <Heading as="h1" fontSize="2xl" fontWeight="normal">
                          Select your sports interests
                        </Heading>
                        <Text>
                          You can select more from your profile page later.
                        </Text>
                      </Box>

                      <FormControl
                        id="sports_interested"
                        isInvalid={formik.errors["sports_interested"]}
                      >
                        <SimpleGrid
                          columns={[1, 2, 3]}
                          spacingX={[null, 10, 20]}
                          spacingY={5}
                        >
                          {sportsData.map((sport) => (
                            <Field
                              key={sport["sports_id"]}
                              name="sports_interested"
                            >
                              {({ field }) => {
                                return (
                                  <Checkbox
                                    borderColor="primary.600"
                                    {...field}
                                    value={sport["sports_id"]}
                                  >
                                    {sport["sports_name"]}
                                  </Checkbox>
                                );
                              }}
                            </Field>
                          ))}
                        </SimpleGrid>

                        {formik.errors["sports_interested"] && (
                          <FormErrorMessage mt={5}>
                            Please select atleast one sport
                          </FormErrorMessage>
                        )}
                      </FormControl>

                      <Button
                        colorScheme="primary"
                        variant="solid"
                        type="submit"
                        isLoading={isLoading}
                      >
                        Next
                      </Button>
                    </VStack>
                  </HStack>
                </VStack>
              </Box>
            </Form>
          )}
        </Formik>
      )}
    </UserLayout>
  );
};

export default UserInterests;
