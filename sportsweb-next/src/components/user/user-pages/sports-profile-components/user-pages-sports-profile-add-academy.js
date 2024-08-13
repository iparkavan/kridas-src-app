import {
  VStack,
  useDisclosure,
  Box,
  ButtonGroup,
  ModalFooter,
} from "@chakra-ui/react";
import Button from "../../../ui/button";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import Modal from "../../../ui/modal";
import * as yup from "yup";

import { usePage } from "../../../../hooks/page-hooks";
import { useCreatePageStatistics } from "../../../../hooks/page-statistics-hooks";
import { getCreateAcademyStatisticsYupSchema } from "../../../../helper/constants/page-statistics-constants";
import SelectWithValidation from "../../../ui/select/select-with-validation";
import { useSports } from "../../../../hooks/sports-hooks";
import TextBoxWithValidation from "../../../ui/textbox/textbox-with-validation";
import TextAreaWithValidation from "../../../ui/textbox/textarea-with-validation";
import { useCategoriesByType } from "../../../../hooks/category-hooks";
import { useLookupTable } from "../../../../hooks/lookup-table-hooks";

function AddAcademy() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { pageId } = router.query;
  const { data: pageData = {} } = usePage(pageId);
  const { mutate, isLoading } = useCreatePageStatistics();
  const { data: sportsData = [] } = useSports();
  const { data: skillsData = [] } = useCategoriesByType("SKI");
  const { data: genderData = [] } = useLookupTable("GEN");

  const pageSports = sportsData.filter((sport) =>
    pageData?.["sports_interested"]?.includes(sport["sports_id"])
  );

  return (
    <>
      <Button variant="outline" colorScheme="primary" onClick={onOpen}>
        Add Academy
      </Button>

      <Modal size="2xl" isOpen={isOpen} onClose={onClose} title="Add Academy">
        <Formik
          initialValues={{
            categorywise_statistics: {
              academy_name: "",
              sports_id: "",
              skill_level: "",
              gender: "",
              age_group: "",
              // address: "",
            },
          }}
          validationSchema={getCreateAcademyStatisticsYupSchema(yup)}
          onSubmit={(values, { setSubmitting }) => {
            const company_id = pageData?.company_id;
            values.categorywise_statistics.academy_name =
              values.categorywise_statistics.academy_name.trim();
            // values.categorywise_statistics.address =
            //   values.categorywise_statistics.address.trim();
            values.categorywise_statistics.category = "ACD";
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
          {({ values, handleChange, setFieldTouched, setFieldValue }) => (
            <Form>
              <Box
                border="1px solid"
                borderColor="gray.300"
                w="full"
                p={[2, 4, 6]}
              >
                <VStack align="flex-start" spacing={4}>
                  <TextBoxWithValidation
                    name="categorywise_statistics.academy_name"
                    width="xs"
                    label="Academy Name"
                    placeholder="Enter the Academy Name"
                  />

                  <SelectWithValidation
                    name="categorywise_statistics.sports_id"
                    width="xs"
                    label="Sport"
                    placeholder="Select Sport"
                    onChange={(e) => {
                      handleChange(e);
                      setFieldTouched(
                        "categorywise_statistics.age_group",
                        false
                      );
                      setFieldValue("categorywise_statistics.age_group", "");
                    }}
                  >
                    {pageSports?.map((sport) => (
                      <option key={sport.sports_id} value={sport.sports_id}>
                        {sport.sports_name}
                      </option>
                    ))}
                  </SelectWithValidation>

                  <SelectWithValidation
                    name="categorywise_statistics.skill_level"
                    width="xs"
                    label="Skill Level"
                    placeholder="Select Skill Level"
                  >
                    {skillsData?.map((skill) => (
                      <option key={skill.category_id} value={skill.category_id}>
                        {skill.category_name}
                      </option>
                    ))}
                  </SelectWithValidation>

                  <SelectWithValidation
                    name="categorywise_statistics.gender"
                    width="xs"
                    label="Gender"
                    placeholder="Select Gender"
                  >
                    {genderData?.map((gender) => (
                      <option key={gender.lookup_key} value={gender.lookup_key}>
                        {gender.lookup_value}
                      </option>
                    ))}
                  </SelectWithValidation>

                  <SelectWithValidation
                    name="categorywise_statistics.age_group"
                    width="xs"
                    label="Age Group"
                    placeholder="Select Age Group"
                  >
                    {values.categorywise_statistics.sports_id &&
                      sportsData
                        .find(
                          (s) =>
                            s.sports_id ==
                            values.categorywise_statistics.sports_id
                        )
                        ?.sports_age_group?.map((ageGroup) => (
                          <option
                            key={ageGroup.age_group_code}
                            value={ageGroup.age_group_code}
                          >
                            {ageGroup.age_group}
                          </option>
                        ))}
                  </SelectWithValidation>

                  {/* <TextAreaWithValidation
                    name="categorywise_statistics.address"
                    width="xs"
                    label="Address"
                    placeholder="Address"
                  /> */}
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

export default AddAcademy;
