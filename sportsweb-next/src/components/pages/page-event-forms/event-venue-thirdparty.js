import { HStack, Text, VStack } from "@chakra-ui/react";
import { FieldArray, Formik } from "formik";
import React, { Fragment } from "react";
import { useCountries } from "../../../hooks/country-hooks";
import Button from "../../ui/button";
import IconButton from "../../ui/icon-button";
import { DeleteIcon } from "../../ui/icons";
import DeletePopover from "../../ui/popover/delete-popover";
import SelectWithValidation from "../../ui/select/select-with-validation";
import { TextSmall } from "../../ui/text/text";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";

function EventVenueThirdParty({
  formik,
  venueObjThirdParty,
  index,
  arrayHelpers,
}) {
  const { data: countriesData = [] } = useCountries();
  return (
    <>
      {/* <VStack alignItems="flex-start" width="full" spacing={6} mt={3}>
        <FieldArray
          name="eventVenueCreate"
          render={(arrayHelpers) => (
      <Fragment>
        {formik?.values?.eventVenueCreate?.map((details, index) => ( */}
      <Fragment key={index}>
        <HStack w="full">
          {/* <Text>{index + 1}</Text> */}
          <TextBoxWithValidation
            name={`eventVenue[${index}].venue_name`}
            placeholder="Enter Venue name"
            fontSize="sm"
          />
          {/* <DeletePopover
            title="Delete Document"
            trigger={
              <IconButton
                size="md"
                icon={<DeleteIcon fontSize="18px" />}
                colorScheme="primary"
                tooltipLabel="Delete Venue"
                disabled={formik.values.eventVenue?.length === 1}
              />
            }
            handleDelete={() => arrayHelpers.remove(index)}
          >
            <TextSmall>Are you sure you want to delete this Field?</TextSmall>
          </DeletePopover> */}
        </HStack>

        <TextBoxWithValidation
          name={`eventVenue[${index}].address.url`}
          placeholder="Map URL"
          fontSize="sm"
        />
        <TextBoxWithValidation
          name={`eventVenue[${index}].address.line1`}
          placeholder="Address"
          fontSize="sm"
        />
        <HStack w="full" align="self-start">
          <TextBoxWithValidation
            name={`eventVenue[${index}].address.city`}
            placeholder="City / Town"
            fontSize="sm"
          />
          <TextBoxWithValidation
            name={`eventVenue[${index}].address.pincode`}
            placeholder="Pincode"
            fontSize="sm"
          />
        </HStack>
        <HStack w="full" align="self-start">
          <SelectWithValidation
            placeholder="Select Country"
            name={`eventVenue[${index}].address.country`}
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
          <SelectWithValidation
            placeholder="Select State"
            name={`eventVenue[${index}].address.state`}
          >
            {formik?.values?.eventVenue[index]?.address?.country &&
              countriesData
                ?.find(
                  (country) =>
                    country["country_code"] ===
                    formik?.values?.eventVenue[index].address.country
                )
                ?.["country_states"]?.map((state) => (
                  <option key={state["state_code"]} value={state["state_code"]}>
                    {state["state_name"]}
                  </option>
                ))}
          </SelectWithValidation>
        </HStack>
      </Fragment>
      {/* ))}
        <Button
          pt={5}
          variant="link"
          colorScheme="primary"
          fontWeight="normal"
          onClick={() => {
            arrayHelpers.push(venueObjThirdParty);
          }}
        >
          + Add Another
        </Button>
      </Fragment>
       )}
         />
       </VStack>  */}
    </>
  );
}

export default EventVenueThirdParty;
