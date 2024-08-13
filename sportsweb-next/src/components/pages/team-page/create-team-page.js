import { ModalFooter, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as yup from "yup";

import Modal from "../../ui/modal";
import Button from "../../ui/button";
import SelectWithValidation from "../../ui/select/select-with-validation";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import { TextMedium } from "../../ui/text/text";
import { getCreateTeamYupSchema } from "../../../helper/constants/child-page-constants";
import { useCategoriesByType } from "../../../hooks/category-hooks";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";
import { useSports } from "../../../hooks/sports-hooks";
import { useCreateChildPage } from "../../../hooks/team-hooks";

function CreateTeamPage(props) {
  const { isOpen, onClose, pageData } = props;
  const { data: sportsData = [] } = useSports({
    select: (data) => {
      return data.filter((sport) =>
        pageData?.["sports_interested"]?.includes(sport["sports_id"])
      );
    },
  });
  const { data: skillsData = [] } = useCategoriesByType("SKI");
  const { data: genderData = [] } = useLookupTable("GEN");
  const { mutate, isLoading, isError, reset } = useCreateChildPage();

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      title="Add Team Page"
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
    >
      <Formik
        initialValues={{
          team_name: "",
          sports_id: "",
          skill_level: "",
          gender: "",
          age_group: "",
        }}
        validationSchema={getCreateTeamYupSchema(yup)}
        onSubmit={(values) => {
          values["team_name"] = values["team_name"].trim();
          const updatedValues = {
            parent_company_id: pageData?.["company_id"],
            categorywise_statistics: {
              ...values,
              category: "TEA",
            },
          };
          mutate(updatedValues, {
            onSuccess: () => handleClose(),
          });
        }}
      >
        {({ values }) => (
          <Form>
            <VStack spacing={3}>
              <TextBoxWithValidation
                name="team_name"
                label="Team Name"
                placeholder="Enter the Team Name"
              />
              <SelectWithValidation
                name="sports_id"
                label="Sport"
                placeholder="Select Sport"
              >
                {sportsData?.map((sport) => (
                  <option key={sport["sports_id"]} value={sport["sports_id"]}>
                    {sport["sports_name"]}
                  </option>
                ))}
              </SelectWithValidation>
              <SelectWithValidation
                name="skill_level"
                label="Skill Level"
                placeholder="Select Skill Level"
              >
                {skillsData?.map((skill) => (
                  <option
                    key={skill["category_id"]}
                    value={skill["category_id"]}
                  >
                    {skill["category_name"]}
                  </option>
                ))}
              </SelectWithValidation>
              <SelectWithValidation
                name="gender"
                label="Gender"
                placeholder="Select Gender"
              >
                {genderData?.map((gender) => (
                  <option
                    key={gender["lookup_key"]}
                    value={gender["lookup_key"]}
                  >
                    {gender["lookup_value"]}
                  </option>
                ))}
              </SelectWithValidation>
              <SelectWithValidation
                name="age_group"
                label="Age Group"
                placeholder="Select Age Group"
              >
                {values.sports_id &&
                  sportsData
                    .find((s) => s["sports_id"] == values["sports_id"])
                    ?.["sports_age_group"]?.map((ageGroup) => (
                      <option
                        key={ageGroup["age_group_code"]}
                        value={ageGroup["age_group_code"]}
                      >
                        {ageGroup["age_group"]}
                      </option>
                    ))}
              </SelectWithValidation>
            </VStack>

            {isError && (
              <TextMedium mt={3} color="red.500">
                Unable to add team page
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

export default CreateTeamPage;
