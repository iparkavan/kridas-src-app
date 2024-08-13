import { ButtonGroup, HStack, Icon, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { formatPhoneNumberIntl } from "react-phone-number-input";

import { useCountries } from "../../../hooks/country-hooks";
import { useUpdatePage } from "../../../hooks/page-hooks";
import { getPageContactInfoDetailsYupSchema } from "../../../helper/constants/page-constants";
import { usePage } from "../../../hooks/page-hooks";
import SelectWithValidation from "../../ui/select/select-with-validation";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import PhoneNumberInput from "../../ui/phone-input/phone-number-input";
import { HeadingMedium, HeadingSmall } from "../../ui/heading/heading";
import { ContactInfo } from "../../ui/icons";
import FieldLayout from "../profile-section/user-profile-edit/field-layout";
import { useToast } from "@chakra-ui/react";
import Button from "../../ui/button";

const EditContactInformation = ({ pageData, isSubTeamPage }) => {
  // const router = useRouter();
  // const { pageId } = router.query;
  const toast = useToast();
  // const { data: pageData = {} } = usePage(pageId);
  const { data: countriesData = [] } = useCountries();
  const { mutate, isLoading } = useUpdatePage();
  return (
    <Formik
      initialValues={{
        address: {
          line1: pageData["address"]?.line1 || "",
          line2: pageData["address"]?.line2 || "",
          city: pageData["address"]?.city || "",
          state: pageData["address"]?.state || "",
          country: pageData["address"]?.country || "",
          pincode: pageData["address"]?.pincode || "",
        },
        company_contact_no: pageData["company_contact_no"] || "",
        company_email: pageData["company_email"] || "",
        company_website: pageData["company_website"] || "",
      }}
      validationSchema={getPageContactInfoDetailsYupSchema(yup)}
      onSubmit={(values, { setSubmitting }) => {
        values.company_contact_no = formatPhoneNumberIntl(
          values.company_contact_no
        );
        values.company_email = values.company_email.trim();
        mutate(
          { pageData, values, type: "contact_info" },
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
      {({ values, handleChange, setFieldValue }) => (
        <Form>
          <VStack alignItems="flex-start" w="full" spacing={4}>
            {/* <ButtonGroup spacing="6">
              <Button colorScheme="primary" type="submit" isLoading={isLoading}>
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
            {/* <HStack spacing={4}>
              <Icon as={ContactInfo} w="6" h="6" />
              <HeadingMedium>Contact Information</HeadingMedium>
            </HStack> */}
            <HeadingSmall textTransform="uppercase">
              Contact Information
            </HeadingSmall>
            <FieldLayout label="Contact Number">
              <PhoneNumberInput
                name="company_contact_no"
                placeholder="Contact Number"
                // style={{ width: "var(--chakra-sizes-sm)" }}
              />
            </FieldLayout>
            <FieldLayout label="Email ID">
              <TextBoxWithValidation
                name="company_email"
                placeholder="Email ID"
              />
            </FieldLayout>
            {!isSubTeamPage && (
              <FieldLayout label="Website URL">
                <TextBoxWithValidation
                  name="company_website"
                  placeholder="Website URL"
                />
              </FieldLayout>
            )}
            <FieldLayout label="Address Line 1">
              <TextBoxWithValidation
                name="address.line1"
                placeholder="Address Line 1"
              />
            </FieldLayout>
            <FieldLayout label="Address Line 2">
              <TextBoxWithValidation
                name="address.line2"
                placeholder="Address Line 2"
              />
            </FieldLayout>
            <FieldLayout label="Pincode / Zip">
              <TextBoxWithValidation
                name="address.pincode"
                placeholder="Pincode / Zip"
              />
            </FieldLayout>
            <FieldLayout label="Country">
              <SelectWithValidation
                name="address.country"
                placeholder="Select Country"
                onChange={(e) => {
                  handleChange(e);
                  setFieldValue("address.state", "");
                }}
              >
                {countriesData.map(({ country_code, country_name }) => (
                  <option key={country_code} value={country_code}>
                    {country_name}
                  </option>
                ))}
              </SelectWithValidation>
            </FieldLayout>
            <FieldLayout label="State">
              <SelectWithValidation
                name="address.state"
                placeholder="Select State"
              >
                {values.address.country &&
                  countriesData
                    .find(({ country_code }) => {
                      return country_code === values.address.country;
                    })
                    ?.country_states.map(({ state_code, state_name }) => (
                      <option key={state_code} value={state_code}>
                        {state_name}
                      </option>
                    ))}
                {/* : ( <option>Please Select a country</option>) */}
              </SelectWithValidation>
            </FieldLayout>
            <FieldLayout label="City">
              <TextBoxWithValidation name="address.city" placeholder="City" />
            </FieldLayout>

            <Button colorScheme="primary" type="submit" isLoading={isLoading}>
              Save
            </Button>
          </VStack>
        </Form>
      )}
    </Formik>
  );
};

export default EditContactInformation;
