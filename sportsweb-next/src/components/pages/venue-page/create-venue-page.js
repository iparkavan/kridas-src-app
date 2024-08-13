import { ModalFooter, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as yup from "yup";

import Modal from "../../ui/modal";
import Button from "../../ui/button";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import { TextMedium } from "../../ui/text/text";
import { getCreateVenueYupSchema } from "../../../helper/constants/child-page-constants";
import { useSports } from "../../../hooks/sports-hooks";
import { useCreateChildPage } from "../../../hooks/team-hooks";
import MultiSelect from "../../ui/select/multi-select";

function CreateVenuePage(props) {
  const { isOpen, onClose, pageData } = props;
  const { data: sportsData = [] } = useSports({
    select: (data) => {
      return data
        .filter((sport) =>
          pageData?.["sports_interested"]?.includes(sport["sports_id"])
        )
        ?.map((sport) => ({
          ...sport,
          value: sport["sports_id"],
          label: sport["sports_name"],
        }));
    },
  });
  const { mutate, isLoading, isError, reset } = useCreateChildPage();

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      title="Add Venue Page"
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
    >
      <Formik
        initialValues={{
          venue_name: "",
          sports_interest: [],
        }}
        validationSchema={getCreateVenueYupSchema(yup)}
        onSubmit={(values) => {
          values["venue_name"] = values["venue_name"].trim();
          const sports_interest = values.sports_interest.map(
            (type) => type.value
          );

          const updatedValues = {
            parent_company_id: pageData?.["company_id"],
            categorywise_statistics: {
              ...values,
              sports_interest,
            },
          };

          mutate(updatedValues, {
            onSuccess: () => handleClose(),
          });
        }}
      >
        {() => (
          <Form>
            <VStack spacing={3} alignItems="flex-start">
              <TextBoxWithValidation
                name="venue_name"
                label="Venue Name"
                placeholder="Enter the Venue Name"
              />
              <MultiSelect
                isMulti
                label="Sports"
                placeholder="Select Sports"
                id="sports_interest"
                instanceId="sports_interest"
                name="sports_interest"
                options={sportsData}
              />
            </VStack>

            {isError && (
              <TextMedium mt={3} color="red.500">
                Unable to add venue page
              </TextMedium>
            )}

            <ModalFooter px={0} pb={0} pt={6}>
              <Button variant="outline" mr={3} onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>
                Save
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default CreateVenuePage;
