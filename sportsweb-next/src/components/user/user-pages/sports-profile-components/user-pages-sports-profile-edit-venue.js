import {
  ModalFooter,
  VStack,
  useDisclosure,
  IconButton,
  Box,
  ButtonGroup,
} from "@chakra-ui/react";
import Modal from "../../../ui/modal";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { useRouter } from "next/router";

import Button from "../../../ui/button";
import {
  useStatisticsById,
  useUpdateStatisticsById,
} from "../../../../hooks/page-statistics-hooks";
import { getCreateVenueStatisticsYupSchema } from "../../../../helper/constants/page-statistics-constants";
import { useSports } from "../../../../hooks/sports-hooks";
import TextBoxWithValidation from "../../../ui/textbox/textbox-with-validation";
import { EditIcon } from "../../../ui/icons";
import TextAreaWithValidation from "../../../ui/textbox/textarea-with-validation";
import { usePage } from "../../../../hooks/page-hooks";
import SelectWithValidation from "../../../ui/select/select-with-validation";

function EditVenue({ statisticsId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { pageId } = router.query;
  const { data: pageData = {} } = usePage(pageId);
  const { data: statistic } = useStatisticsById(statisticsId);
  const { mutate, isLoading } = useUpdateStatisticsById();
  const { data: sportsData = [] } = useSports();

  const pageSports = sportsData.filter((sport) =>
    pageData?.["sports_interested"]?.includes(sport["sports_id"])
  );

  return (
    <>
      <IconButton
        icon={<EditIcon />}
        variant="ghost"
        colorScheme="primary"
        onClick={onOpen}
        size="sm"
      />

      <Modal size="2xl" isOpen={isOpen} onClose={onClose} title="Edit Venue">
        <Formik
          initialValues={{
            categorywise_statistics: {
              venue_name: statistic?.categorywise_statistics?.venue_name || "",
              sports_id: statistic?.categorywise_statistics?.sports_id || "",
              address: statistic?.categorywise_statistics?.address || "",
              category: statistic?.categorywise_statistics?.category || "VEN",
            },
          }}
          validationSchema={getCreateVenueStatisticsYupSchema(yup)}
          onSubmit={(values, { setSubmitting }) => {
            values.categorywise_statistics.venue_name =
              values.categorywise_statistics.venue_name.trim();
            values.categorywise_statistics.address =
              values.categorywise_statistics.address.trim();

            mutate(
              { statistic, values },
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
                <VStack align="flex-start" spacing={6} w="min-content">
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
                    colorScheme="primary"
                    variant="outline"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="primary"
                    type="submit"
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

export default EditVenue;
