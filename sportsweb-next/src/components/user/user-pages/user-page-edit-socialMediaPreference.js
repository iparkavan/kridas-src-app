import { VStack, ButtonGroup, HStack, Icon } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { useRouter } from "next/router";

import { usePage, useUpdatePage } from "../../../hooks/page-hooks";
import EditSocialLinks from "../../social/edit-social-links";
import { getSocialsYupSchema } from "../../../helper/constants/common-constants";
import { HeadingMedium, HeadingSmall } from "../../ui/heading/heading";
import { SocialMedia } from "../../ui/icons";
import { useToast } from "@chakra-ui/react";
import Button from "../../ui/button";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";
const UserPageEditSocial = ({ pageData }) => {
  // const router = useRouter();
  // const { pageId } = router.query;
  // const { data: pageData = {} } = usePage(pageId);
  const { mutate, isLoading } = useUpdatePage();
  const { data: socialData = [] } = useLookupTable("SOC");
  const toast = useToast();

  if (pageData) {
    const initialValues = socialData.map((social) => {
      const isSocialPresent = pageData.social?.find(
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
        onSubmit={(values) => {
          mutate(
            { pageData, values, type: "social" },
            {
              onSuccess: () =>
                toast({
                  title: "Changed successfully",
                  position: "top",
                  status: "success",
                  duration: 1000,
                  isClosable: true,
                }),
            }
          );
        }}
      >
        {(formik) => (
          <Form>
            <VStack alignItems="flex-start" spacing={4} w="full">
              {/* <ButtonGroup spacing={6}>
                <Button
                  colorScheme="primary"
                  type="submit"
                  isLoading={isLoading}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  colorScheme="primary"
                  onClick={() => setShowText(false)}
                >
                  Cancel
                </Button>
              </ButtonGroup> */}

              <HeadingSmall textTransform="uppercase">
                Social Media Presence
              </HeadingSmall>

              <EditSocialLinks formik={formik} name="social" />

              <Button colorScheme="primary" type="submit" isLoading={isLoading}>
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

export default UserPageEditSocial;
