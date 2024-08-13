import { VStack, useToast } from "@chakra-ui/react";
import { Form, Formik, useFormikContext } from "formik";
import * as yup from "yup";

import { usePage, useUpdatePage } from "../../../../hooks/page-hooks";
import SelectWithValidation from "../../../ui/select/select-with-validation";
import TextAreaWithValidation from "../../../ui/textbox/textarea-with-validation";
import MultiSelect from "../../../ui/select/multi-select";
import { getEditChildPageYupSchema } from "../../../../helper/constants/page-constants";
import TextBoxWithValidation from "../../../ui/textbox/textbox-with-validation";
import {
  useCategoriesById,
  useCategoriesByType,
} from "../../../../hooks/category-hooks";
import { useSports } from "../../../../hooks/sports-hooks";
import { HeadingSmall } from "../../../ui/heading/heading";
import FieldLayout from "../../profile-section/user-profile-edit/field-layout";
import Button from "../../../ui/button";
import { usePageStatistics } from "../../../../hooks/page-statistics-hooks";
import { useLookupTable } from "../../../../hooks/lookup-table-hooks";

function ChildPageAboutEdit({ pageData, isSubTeamPage }) {
  const toast = useToast();
  const { data: categories = [] } = useCategoriesByType("CAT");
  const { mutate, isLoading } = useUpdatePage();
  const { data: sportsData = [] } = useSports({}, true);
  const { data: skillsData = [] } = useCategoriesByType("SKI");
  const { data: genderData = [] } = useLookupTable("GEN");

  const { data: pageStatisticsData = [] } = usePageStatistics(
    pageData?.["company_id"]
  );

  const { data: parentPageData } = usePage(
    pageData?.["company_type_name"]?.["parent_page_id"]
  );

  const childPageSports = sportsData.filter((sport) =>
    parentPageData?.["sports_interested"]?.includes(sport["sports_id"])
  );

  const childPageMultiSports = childPageSports.map((sport) => ({
    ...sport,
    value: sport.sports_id,
    label: sport.sports_name,
  }));

  const MultiSelectCategories = (props) => {
    const { values } = useFormikContext();
    const categoryId = values?.["main_category_type"]?.split(",")[0];
    const { data: subCategories = [] } = useCategoriesById(categoryId, {
      select: (data) => {
        return data?.map((category) => ({
          ...category,
          value: category["category_id"],
          label: category["category_name"],
        }));
      },
    });
    return <MultiSelect {...props} options={subCategories} />;
  };

  const updatedCompanyType =
    pageData?.["category_arr"]?.map((category) => ({
      ...category,
      value: category["category_id"],
      label: category["category_name"],
    })) || [];

  let initialValues = {
    company_name: pageData.company_name,
    main_category_type: `${pageData.main_category_type},${pageData.parent_category_type}`,
    company_type: updatedCompanyType,
    company_desc: pageData.company_desc,
  };

  const isSubCatTeam = Boolean(
    pageData?.category_arr?.find((cat) => cat.category_type === "TEA")
  );
  const isSubCatVenue = Boolean(
    pageData?.category_arr?.find((cat) => cat.category_type === "VEN")
  );
  const isSubCatAcademy = Boolean(
    pageData?.category_arr?.find((cat) => cat.category_type === "ACD")
  );

  if (isSubCatTeam) {
    const teamStatistic = pageStatisticsData?.find(
      (statistic) => statistic?.categorywise_statistics?.category === "TEA"
    );
    initialValues.sports_id = pageData?.sports_interested?.[0];
    // initialValues.sports_id = teamStatistic?.categorywise_statistics?.sports_id;
    initialValues.skill_level =
      teamStatistic?.categorywise_statistics?.skill_level;
    initialValues.gender = teamStatistic?.categorywise_statistics?.gender;
    initialValues.age_group = teamStatistic?.categorywise_statistics?.age_group;
  } else if (isSubCatVenue || isSubCatAcademy) {
    const initialMultiSports = pageData?.["sports_interested"]?.map((sportId) =>
      childPageMultiSports.find((s) => s["sports_id"] == sportId)
    );
    initialValues.sports_interest = initialMultiSports;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getEditChildPageYupSchema(yup)}
      enableReinitialize={true}
      onSubmit={(values) => {
        values.company_name = values.company_name.trim();
        values.company_desc = values.company_desc.trim();
        const main_category_type = values.main_category_type.split(",")[0];
        const company_type = values.company_type.map((type) => type.value);

        let {
          sports_interest,
          sports_id,
          skill_level,
          gender,
          age_group,
          ...updatedValues
        } = values;

        if (isSubCatTeam) {
          const categorywise_statistics = {
            team_name: values.company_name,
            sports_id,
            skill_level,
            gender,
            age_group,
            category: "TEA",
          };
          updatedValues = {
            ...updatedValues,
            categorywise_statistics,
            sports_interest: [sports_id],
          };
        }

        if (isSubCatVenue || isSubCatAcademy) {
          const updatedSportsInterest = sports_interest.map(
            (type) => type.value
          );
          updatedValues = {
            ...updatedValues,
            sports_interest: updatedSportsInterest,
          };
        }

        updatedValues = {
          ...updatedValues,
          main_category_type,
          company_type,
        };

        mutate(
          {
            pageData,
            values: updatedValues,
            type: "about_detail",
          },
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
      {({ values, setFieldTouched, setFieldValue, handleChange }) => (
        <Form>
          <VStack alignItems="flex-start" w="full" spacing={4}>
            <HeadingSmall textTransform="uppercase">
              About This Page
            </HeadingSmall>
            <FieldLayout label="Page Name">
              <TextBoxWithValidation
                name="company_name"
                placeholder="Enter name"
              />
            </FieldLayout>
            <FieldLayout label="Page Category">
              <SelectWithValidation
                name="main_category_type"
                placeholder="Select"
                onChange={(e) => {
                  handleChange(e);
                  setFieldValue("company_type", []);
                  setFieldTouched("company_type", false);
                }}
                disabled={true}
              >
                {categories?.map((category) => (
                  <option
                    key={category["category_id"]}
                    value={`${category["category_id"]},${category["category_type"]}`}
                  >
                    {category["category_name"]}
                  </option>
                ))}
              </SelectWithValidation>
            </FieldLayout>
            <FieldLayout label="Page Sub-Categories">
              <MultiSelectCategories
                isMulti
                placeholder="Select"
                id="company_type"
                instanceId="company_type"
                name="company_type"
                isDisabled={true}
              />
            </FieldLayout>
            <FieldLayout label=" Sports Associated">
              {isSubCatTeam ? (
                <SelectWithValidation
                  name="sports_id"
                  placeholder="Select Sport"
                  disabled={isSubTeamPage}
                >
                  {childPageSports?.map((sport) => (
                    <option key={sport["sports_id"]} value={sport["sports_id"]}>
                      {sport["sports_name"]}
                    </option>
                  ))}
                </SelectWithValidation>
              ) : (
                <MultiSelect
                  isMulti
                  placeholder="Select"
                  id="sports_interest"
                  instanceId="sports_interest"
                  name="sports_interest"
                  options={childPageMultiSports}
                />
              )}
            </FieldLayout>
            <FieldLayout label="Introduction">
              <TextAreaWithValidation
                name="company_desc"
                placeholder="Type an introduction"
              />
            </FieldLayout>
            {isSubCatTeam && (
              <>
                <FieldLayout label="Skill Level">
                  <SelectWithValidation
                    name="skill_level"
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
                </FieldLayout>
                <FieldLayout label="Gender">
                  <SelectWithValidation
                    name="gender"
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
                </FieldLayout>
                <FieldLayout label="Age Group">
                  <SelectWithValidation
                    name="age_group"
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
                </FieldLayout>
              </>
            )}
            <Button type="submit" isLoading={isLoading}>
              Save
            </Button>
          </VStack>
        </Form>
      )}
    </Formik>
  );
}

export default ChildPageAboutEdit;
