import { VStack, ButtonGroup, HStack, Icon } from "@chakra-ui/react";
import { Form, Formik, useFormikContext } from "formik";
import { useRouter } from "next/router";
import * as yup from "yup";

import { useUpdatePage } from "../../../../hooks/page-hooks";
import { usePage } from "../../../../hooks/page-hooks";
import SelectWithValidation from "../../../ui/select/select-with-validation";
import TextAreaWithValidation from "../../../ui/textbox/textarea-with-validation";
import MultiSelect from "../../../ui/select/multi-select";
import { getCreatePageYupSchema } from "../../../../helper/constants/page-constants";
import TextBoxWithValidation from "../../../ui/textbox/textbox-with-validation";
import {
  useCategoriesById,
  useCategoriesByType,
} from "../../../../hooks/category-hooks";
import { useSports } from "../../../../hooks/sports-hooks";
import { HeadingMedium, HeadingSmall } from "../../../ui/heading/heading";
import { AboutDetail } from "../../../ui/icons";
import FieldLayout from "../../profile-section/user-profile-edit/field-layout";
import Button from "../../../ui/button";
import { useToast } from "@chakra-ui/react";

function AboutPageEdit({ pageData }) {
  // const router = useRouter();
  // const { pageId } = router.query;
  const toast = useToast();
  // const { data: pageData = {} } = usePage(pageId);
  const { data: categories = [] } = useCategoriesByType("CAT");
  const { data: sportsData = [] } = useSports(
    {
      select: (data) => {
        return data?.map((sport) => ({
          ...sport,
          value: sport["sports_id"],
          label: sport["sports_name"],
        }));
      },
    },
    true
  );
  const { mutate, isLoading } = useUpdatePage();

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

  const updatedSportsInterested = pageData?.["sports_interested"]?.map(
    (sportId) => sportsData.find((s) => s["sports_id"] == sportId)
  );

  return (
    <Formik
      initialValues={{
        company_name: pageData.company_name,
        main_category_type: `${pageData.main_category_type},${pageData.parent_category_type}`,
        company_type: updatedCompanyType,
        sports_interest: updatedSportsInterested,
        company_desc: pageData.company_desc,
      }}
      validationSchema={getCreatePageYupSchema(yup)}
      enableReinitialize={true}
      onSubmit={(values) => {
        const main_category_type = values.main_category_type.split(",")[0];
        const company_type = values.company_type.map((type) => type.value);
        const sports_interest = values.sports_interest.map(
          (type) => type.value
        );
        mutate(
          {
            pageData,
            values: {
              ...values,
              main_category_type,
              company_type,
              sports_interest,
            },
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
      {({ setFieldTouched, setFieldValue, handleChange }) => (
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
              />
            </FieldLayout>
            <FieldLayout label=" Sports Associated">
              <MultiSelect
                isMulti
                placeholder="Select"
                id="sports_interest"
                instanceId="sports_interest"
                name="sports_interest"
                options={sportsData}
              />
            </FieldLayout>
            <FieldLayout label="Introduction">
              <TextAreaWithValidation
                name="company_desc"
                placeholder="Type an introduction"
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

export default AboutPageEdit;
