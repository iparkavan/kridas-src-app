import {
  ModalFooter,
  ButtonGroup,
  VStack,
  useDisclosure,
  Box,
  IconButton,
} from "@chakra-ui/react";
import Button from "../../../ui/button";
import Modal from "../../../ui/modal";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { useRouter } from "next/router";

import {
  useStatisticsById,
  useUpdateStatisticsById,
} from "../../../../hooks/page-statistics-hooks";

import { getCreateAcademyStatisticsYupSchema } from "../../../../helper/constants/page-statistics-constants";
import SelectWithValidation from "../../../ui/select/select-with-validation";
import { useSports } from "../../../../hooks/sports-hooks";
import TextBoxWithValidation from "../../../ui/textbox/textbox-with-validation";
import TextAreaWithValidation from "../../../ui/textbox/textarea-with-validation";
import { EditIcon } from "../../../ui/icons";
import { useCategoriesByType } from "../../../../hooks/category-hooks";
import { useLookupTable } from "../../../../hooks/lookup-table-hooks";
import { usePage } from "../../../../hooks/page-hooks";

function EditAcademy({ statisticsId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { pageId } = router.query;
  const { data: pageData = {} } = usePage(pageId);
  const { data: statistic } = useStatisticsById(statisticsId);
  const { mutate, isLoading } = useUpdateStatisticsById();
  const { data: sportsData = [] } = useSports();
  const { data: skillsData = [] } = useCategoriesByType("SKI");
  const { data: genderData = [] } = useLookupTable("GEN");

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

      <Modal size="2xl" isOpen={isOpen} onClose={onClose} title="Edit Academy">
        <Formik
          initialValues={{
            categorywise_statistics: {
              academy_name:
                statistic?.categorywise_statistics?.academy_name || "",
              sports_id: statistic?.categorywise_statistics?.sports_id || "",
              skill_level:
                statistic?.categorywise_statistics?.skill_level || "",
              gender: statistic?.categorywise_statistics?.gender || "",
              age_group: statistic?.categorywise_statistics?.age_group || "",
              category: statistic?.categorywise_statistics?.category || "ACD",
              // address: statistic?.categorywise_statistics?.address || "",
            },
          }}
          validationSchema={getCreateAcademyStatisticsYupSchema(yup)}
          onSubmit={(values, { setSubmitting }) => {
            values.categorywise_statistics.academy_name =
              values.categorywise_statistics.academy_name.trim();
            // values.categorywise_statistics.address =
            //   values.categorywise_statistics.address.trim();

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
                    placeholder="Address"
                    label="Address"
                  /> */}
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

export default EditAcademy;
