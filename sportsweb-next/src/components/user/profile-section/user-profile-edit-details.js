import { VStack, Box, useToast } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { formatPhoneNumberIntl } from "react-phone-number-input";

import { useUpdateUser, useUser } from "../../../hooks/user-hooks";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import SelectWithValidation from "../../ui/select/select-with-validation";
import { getUserDetailsYupSchema } from "../../../helper/constants/user-contants";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";
import { useCountries } from "../../../hooks/country-hooks";
import DatePicker from "../../ui/pickers/date-picker";
import PhoneNumberInput from "../../ui/phone-input/phone-number-input";
import { HeadingSmall } from "../../ui/heading/heading";
import helper from "../../../helper/helper";
import FieldLayout from "./user-profile-edit/field-layout";
import Button from "../../ui/button";
import { convertToPascalCase } from "../../../helper/constants/common-constants";

const UserProfileEditDetails = () => {
  const toast = useToast();
  const { data: userData, error } = useUser();
  const { data: genderData = [] } = useLookupTable("GEN", {
    select: (data) => {
      return data.filter((lookup) => lookup.lookup_key !== "A");
    },
  });
  const { data: countriesData = [] } = useCountries();
  const { mutate, isLoading } = useUpdateUser();

  if (userData) {
    return (
      <Formik
        initialValues={{
          ...userData,
          user_dob:
            (userData["user_dob"] && new Date(userData["user_dob"])) ||
            undefined,
          address: userData.address || {
            line1: "",
            line2: "",
            pincode: "",
            country: "",
            state: "",
            city: "",
          },
        }}
        validationSchema={getUserDetailsYupSchema(yup)}
        enableReinitialize={true}
        onSubmit={(values, { setSubmitting }) => {
          values["user_phone"] = formatPhoneNumberIntl(values["user_phone"]);
          values["address"]["line1"] = values["address"]["line1"].trim();
          values["address"]["line2"] = values["address"]["line2"].trim();
          values["address"]["pincode"] = values["address"]["pincode"].trim();
          values["address"]["city"] = values["address"]["city"].trim();
          const userDob =
            (values["user_dob"] &&
              helper.getJSDateObject(values["user_dob"])) ||
            null;
          const first_name = convertToPascalCase(values["first_name"]);
          const last_name = convertToPascalCase(values["last_name"]);
          mutate(
            {
              userData,
              values: { ...values, user_dob: userDob, first_name, last_name },
            },
            {
              onSettled: (_, error) => {
                setSubmitting(false);
                const toastTitle = error
                  ? "Failed to update your personal information. Please try again."
                  : "Your personal information has been updated.";
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
        {({ values, handleChange, setFieldValue }) => (
          <Form>
            <VStack alignItems="flex-start" w="full" spacing={4}>
              <HeadingSmall textTransform="uppercase">
                Personal Information
              </HeadingSmall>
              <FieldLayout label="First Name">
                <TextBoxWithValidation
                  name="first_name"
                  placeholder="First Name"
                />
              </FieldLayout>
              <FieldLayout label="Last Name">
                <TextBoxWithValidation
                  name="last_name"
                  placeholder="Last Name"
                />
              </FieldLayout>
              <FieldLayout label="Email ID">
                <TextBoxWithValidation
                  name="user_email"
                  placeholder="Email ID"
                  isDisabled
                />
              </FieldLayout>
              <FieldLayout label="Phone / Mobile Number">
                <PhoneNumberInput
                  name="user_phone"
                  placeholder="Phone / Mobile Number"
                />
              </FieldLayout>
              <FieldLayout label="Gender">
                <SelectWithValidation
                  placeholder="Select Gender"
                  name="user_gender"
                >
                  {genderData.map((gender) => (
                    <option
                      key={gender["lookup_key"]}
                      value={gender["lookup_key"]}
                    >
                      {gender["lookup_value"]}
                    </option>
                  ))}
                </SelectWithValidation>
              </FieldLayout>
              <FieldLayout label="Date of Birth">
                <Box w={{ base: "full", md: "xs" }}>
                  <DatePicker name="user_dob" placeholderText="Date of Birth" />
                </Box>
              </FieldLayout>
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
              <FieldLayout label="Pincode">
                <TextBoxWithValidation
                  name="address.pincode"
                  placeholder="Pincode"
                />
              </FieldLayout>
              <FieldLayout label="Country">
                <SelectWithValidation
                  placeholder="Select Country"
                  name="address.country"
                  onChange={(e) => {
                    handleChange(e);
                    setFieldValue("address.state", "");
                  }}
                >
                  {countriesData.map((country) => (
                    <option
                      key={country["country_code"]}
                      value={country["country_code"]}
                    >
                      {country["country_name"]}
                    </option>
                  ))}
                </SelectWithValidation>
              </FieldLayout>
              <FieldLayout label="State">
                <SelectWithValidation
                  placeholder="Select State"
                  name="address.state"
                >
                  {
                    values.address?.country &&
                      countriesData
                        ?.find(
                          (country) =>
                            country["country_code"] === values.address.country
                        )
                        ?.["country_states"]?.map((state) => (
                          <option
                            key={state["state_code"]}
                            value={state["state_code"]}
                          >
                            {state["state_name"]}
                          </option>
                        ))
                    // : (
                    //   <option>Please select a country</option>
                    // )
                  }
                </SelectWithValidation>
              </FieldLayout>
              <FieldLayout label="City / Town">
                <TextBoxWithValidation
                  name="address.city"
                  placeholder="City / Town"
                />
              </FieldLayout>
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

export default UserProfileEditDetails;
