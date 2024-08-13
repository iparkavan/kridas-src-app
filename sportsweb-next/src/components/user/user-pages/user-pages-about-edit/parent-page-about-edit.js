import {
  Box,
  Radio,
  RadioGroup,
  Stack,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik, useFormikContext } from "formik";
import * as yup from "yup";

import { useUpdatePage } from "../../../../hooks/page-hooks";
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
import { HeadingSmall } from "../../../ui/heading/heading";
import FieldLayout from "../../profile-section/user-profile-edit/field-layout";
import Button from "../../../ui/button";
import { TextSmall } from "../../../ui/text/text";

function ParentPageAboutEdit({ pageData }) {
  const toast = useToast();
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

  const { data: nonSportingCategories = [] } = useCategoriesByType("NSC");
  const categoryOptions = nonSportingCategories?.map((category) => ({
    ...category,
    value: category.category_id,
    label: category.category_name,
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

  const updatedSportsInterested =
    pageData?.["sports_interested"]?.map((sportId) =>
      sportsData.find((s) => s["sports_id"] == sportId)
    ) || [];

  const updatedCompanyCategories =
    pageData?.company_category?.map((categoryId) => {
      const category = nonSportingCategories.find(
        (cat) => cat.category_id === categoryId
      );
      if (category) {
        return {
          ...category,
          value: category.category_id,
          label: category.category_name,
        };
      }
    }) || [];

  return (
    <Formik
      initialValues={{
        company_name: pageData.company_name,
        main_category_type: `${pageData.main_category_type},${pageData.parent_category_type}`,
        company_type: updatedCompanyType,
        sports_interest: updatedSportsInterested,
        company_desc: pageData.company_desc,
        category_id: pageData.category_id.toString(),
        company_category: updatedCompanyCategories,
      }}
      validationSchema={getCreatePageYupSchema(yup)}
      enableReinitialize={true}
      onSubmit={(values) => {
        values.company_name = values.company_name.trim();
        values.company_desc = values.company_desc.trim();
        const main_category_type = values.main_category_type.split(",")[0];
        const company_type = values.company_type.map((type) => type.value);
        const mutateObj = {
          pageData,
          values: {
            ...values,
            main_category_type,
            company_type,
          },
          type: "about_detail",
        };

        if (values.category_id === "0") {
          const sports_interest = values.sports_interest.map(
            (type) => type.value
          );
          mutateObj.values.sports_interest = sports_interest;
          delete mutateObj.values.company_category;
        } else {
          const company_category = values.company_category.map(
            (type) => type.value
          );
          mutateObj.values.company_category = company_category;
          delete mutateObj.values.sports_interest;
        }
        mutate(mutateObj, {
          onSuccess: () =>
            toast({
              title: "Changed successfully",
              position: "top",
              status: "success",
              duration: 1000,
              isClosable: true,
            }),
        });
      }}
    >
      {({ setFieldTouched, setFieldValue, handleChange, values }) => (
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
                  setFieldValue("category_id", "0");
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

            {/* Display radio buttons only if page category is company */}
            {values.main_category_type?.split(",")?.[1] === "CMP" && (
              <FieldLayout label="Company Type">
                <Box w="full" mr={{ base: "4", md: "2" }} my={1}>
                  <Field name="category_id">
                    {({ field }) => (
                      <RadioGroup colorScheme="primary" {...field}>
                        <Stack
                          direction={{ base: "column", lg: "row" }}
                          spacing={{ base: 2, lg: 10 }}
                        >
                          <Radio {...field} value="0">
                            <TextSmall>Sporting Company</TextSmall>
                          </Radio>
                          <Radio {...field} value="1">
                            <TextSmall>Non-Sporting Company</TextSmall>
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    )}
                  </Field>
                </Box>
              </FieldLayout>
            )}

            {/* <FieldLayout label=" Sports Associated">
              <MultiSelect
                isMulti
                placeholder="Select"
                id="sports_interest"
                instanceId="sports_interest"
                name="sports_interest"
                options={sportsData}
              />
            </FieldLayout> */}

            {values.category_id === "0" ? (
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
            ) : (
              <FieldLayout label=" Category Associated">
                <MultiSelect
                  isMulti
                  placeholder="Select"
                  id="company_category"
                  instanceId="company_category"
                  name="company_category"
                  options={categoryOptions}
                />
              </FieldLayout>
            )}

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

export default ParentPageAboutEdit;
