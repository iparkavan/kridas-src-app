import {
  ModalFooter,
  VStack,
  useDisclosure,
  Box,
  ButtonGroup,
} from "@chakra-ui/react";
import Button from "../../../ui/button";
import Modal from "../../../ui/modal";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import * as yup from "yup";

import { usePage } from "../../../../hooks/page-hooks";
import { useCreatePageStatistics } from "../../../../hooks/page-statistics-hooks";
import { useSports } from "../../../../hooks/sports-hooks";
import { getCreateVenueStatisticsYupSchema } from "../../../../helper/constants/page-statistics-constants";
import TextBoxWithValidation from "../../../ui/textbox/textbox-with-validation";
import TextAreaWithValidation from "../../../ui/textbox/textarea-with-validation";
import SelectWithValidation from "../../../ui/select/select-with-validation";

function AddVenue() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { pageId } = router.query;
  const { data: pageData = {} } = usePage(pageId);
  const { mutate, isLoading } = useCreatePageStatistics();

  const { data: sportsData = [] } = useSports();
  const pageSports = sportsData.filter((sport) =>
    pageData?.["sports_interested"]?.includes(sport["sports_id"])
  );

  return (
    <>
      <Button variant="outline" colorScheme="primary" onClick={onOpen}>
        Add Venue
      </Button>

      <Modal size="2xl" isOpen={isOpen} onClose={onClose} title="Add Venue">
        <Formik
          initialValues={{
            categorywise_statistics: {
              venue_name: "",
              sports_id: "",
              address: "",
            },
          }}
          validationSchema={getCreateVenueStatisticsYupSchema(yup)}
          onSubmit={(values, { setSubmitting }) => {
            const company_id = pageData?.company_id;
            values.categorywise_statistics.venue_name =
              values.categorywise_statistics.venue_name.trim();
            values.categorywise_statistics.address =
              values.categorywise_statistics.address.trim();

            values.categorywise_statistics.category = "VEN";
            mutate(
              { ...values, company_id },
              {
                onSuccess: () => {
                  setSubmitting(false);
                  onClose();
                },
              }
            );
          }}
        >
          {() => (
            <Form>
              <Box
                border="1px solid"
                borderColor="gray.300"
                w="full"
                p={[2, 4, 6]}
              >
                <VStack spacing={6} align="flex-start">
                  <TextBoxWithValidation
                    name="categorywise_statistics.venue_name"
                    width="xs"
                    label="Venue Name"
                    placeholder="Enter the Venue Name"
                  />

                  <SelectWithValidation
                    name="categorywise_statistics.sports_id"
                    width="xs"
                    label="Sport"
                    placeholder="Select Sport"
                  >
                    {pageSports?.map((sport) => (
                      <option key={sport.sports_id} value={sport.sports_id}>
                        {sport.sports_name}
                      </option>
                    ))}
                  </SelectWithValidation>

                  <TextAreaWithValidation
                    name="categorywise_statistics.address"
                    width="xs"
                    label="Address"
                    placeholder="Address"
                  />
                </VStack>
              </Box>
              <ModalFooter>
                <ButtonGroup spacing={3}>
                  <Button
                    variant="outline"
                    colorScheme="primary"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="primary"
                    isLoading={isLoading}
                  >
                    Save
                  </Button>
                </ButtonGroup>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default AddVenue;
