import {
  Box,
  ButtonGroup,
  Checkbox,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { Field, Form, Formik, useFormikContext } from "formik";
import * as yup from "yup";
import CreatableSelect from "react-select/creatable";

import { getSponsorsYupSchema } from "../../../helper/constants/sponsor-constants";
import {
  useCreateSponsor,
  useUpdateSponsor,
} from "../../../hooks/sponsor-hooks";
import Button from "../../ui/button";
import Modal from "../../ui/modal";
import { TextMedium, TextSmall } from "../../ui/text/text";
import TextAreaWithValidation from "../../ui/textbox/textarea-with-validation";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import FieldLayout from "../../user/profile-section/user-profile-edit/field-layout";
import {
  useCategoriesById,
  useCategoriesByType,
} from "../../../hooks/category-hooks";
import SelectWithValidation from "../../ui/select/select-with-validation";
import MultiSelect from "../../ui/select/multi-select";
import { usePages } from "../../../hooks/page-hooks";
import { useUser } from "../../../hooks/user-hooks";

const MultiSelectCategories = (props) => {
  const { values } = useFormikContext();
  const categoryId = values.main_category_type.split(",")[0];
  const { data: subCategories = [] } = useCategoriesById(categoryId, {
    select: (data) => {
      return data?.map((category) => ({
        ...category,
        value: category.category_id,
        label: category.category_name,
      }));
    },
  });
  return <MultiSelect {...props} options={subCategories} />;
};

const SponsorSelect = () => {
  const { setFieldValue, setFieldTouched, touched, errors } =
    useFormikContext();
  const { data: pagesData = [] } = usePages();
  const pageOptions = pagesData?.map((data) => ({
    value: data.company_id,
    label: data.company_name,
  }));

  const isTouchedAndError = touched.sponsor_name && errors.sponsor_name;

  return (
    <Box w="full">
      <CreatableSelect
        styles={{
          control: (styles) => ({
            ...styles,
            border: isTouchedAndError
              ? "2px solid var(--chakra-colors-red-500)"
              : "1px solid var(--chakra-colors-gray-300)",

            ":hover": {
              border: isTouchedAndError
                ? "2px solid var(--chakra-colors-red-500)"
                : "1px solid var(--chakra-colors-gray-300)",
            },
            ":focus": {
              border: isTouchedAndError
                ? "2px solid var(--chakra-colors-red-500)"
                : "1px solid var(--chakra-colors-gray-300)",
            },
            fontSize: "var(--chakra-fontSizes-sm)",
          }),
        }}
        placeholder="Sponsor Name"
        isClearable
        options={pageOptions}
        isValidNewOption={(inputValue) => !!inputValue.trim()}
        onChange={(value) => {
          setFieldValue("sponsor_name", value);
        }}
        onBlur={() => setFieldTouched("sponsor_name", true)}
      />
      {isTouchedAndError && (
        <TextSmall mt={1} color="red.500">
          {errors.sponsor_name}
        </TextSmall>
      )}
    </Box>
  );
};

const SponsorsModal = (props) => {
  const { isOpen, onClose, mode, type, id, editInitialValues, sports } = props;
  const {
    mutate: createMutate,
    isLoading: createIsLoading,
    isError: createIsError,
    reset: createReset,
  } = useCreateSponsor();
  const {
    mutate: updateMutate,
    isLoading: updateIsLoading,
    isError: updateIsError,
    reset: updateReset,
  } = useUpdateSponsor();

  const handleClose = () => {
    createReset();
    updateReset();
    onClose();
  };

  const { data: userData } = useUser();
  const { data: categories = [] } = useCategoriesByType("CAT");
  const { data: nonSportingCategories = [] } = useCategoriesByType("NSC");
  const categoryOptions = nonSportingCategories?.map((category) => ({
    ...category,
    value: category.category_id,
    label: category.category_name,
  }));

  const sportsOptions = sports.map((sport) => ({
    ...sport,
    value: sport.sports_id,
    label: sport.sports_name,
  }));

  const initialValues = editInitialValues ?? {
    sponsor_name: "",
    sponsor_desc: "",
    sponsor_media_url: null,
    sponsor_click_url: "",
    [`${type}_sponsor_type_name`]: "",
    is_featured: false,
    [`${type}_id`]: id,
    // New sponsor page fields
    main_category_type: "",
    company_type: [],
    sports_interest: [],
    category_id: "0",
    company_category: [],
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === "add" ? "Add Sponsor" : "Edit Sponsor"}
      size="xl"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={getSponsorsYupSchema(yup, mode, type)}
        onSubmit={(values) => {
          const isNewSponsor = Boolean(values.sponsor_name?.__isNew__);
          const updatedValues = { type };

          if (isNewSponsor) {
            updatedValues.sponsor_name = values.sponsor_name.value.trim();
            updatedValues.main_category_type =
              values.main_category_type.split(",")[0];
            updatedValues.company_type = values.company_type.map(
              (type) => type.value
            );
            updatedValues.category_id = values.category_id;

            if (updatedValues.category_id === "0") {
              updatedValues.sports_interest = values.sports_interest.map(
                (type) => type.value
              );
            } else {
              updatedValues.company_category = values.company_category.map(
                (type) => type.value
              );
            }

            updatedValues.user_id = userData.user_id;
          } else {
            updatedValues.sponsor_page_id = values.sponsor_name.value;
            updatedValues.sponsor_name = values.sponsor_name.label;
          }

          updatedValues.sponsor_desc = values.sponsor_desc.trim();
          updatedValues.sponsor_click_url = values.sponsor_click_url.trim();
          updatedValues[`${type}_sponsor_type_name`] =
            values[`${type}_sponsor_type_name`].trim();
          updatedValues.is_featured = values.is_featured;
          updatedValues[`${type}_id`] = values[`${type}_id`];
          if (values.sponsor_media_url instanceof File) {
            updatedValues.sponsor_media_url = values.sponsor_media_url;
          }

          const mutate = mode === "add" ? createMutate : updateMutate;
          mutate(updatedValues, {
            onSuccess: () => handleClose(),
          });
        }}
      >
        {({
          values,
          handleChange,
          errors,
          touched,
          setFieldTouched,
          setFieldValue,
        }) => {
          const isNewSponsor = Boolean(values.sponsor_name?.__isNew__);

          return (
            <Form>
              <VStack alignItems="flex-start" spacing={5}>
                <FieldLayout label="Sponsor Name">
                  <SponsorSelect />
                </FieldLayout>

                {isNewSponsor && (
                  <>
                    <FieldLayout label="Category">
                      <SelectWithValidation
                        name="main_category_type"
                        placeholder="Select"
                        // w="xl"
                        onChange={(e) => {
                          handleChange(e);
                          setFieldValue("company_type", []);
                          setFieldTouched("company_type", false);
                          setFieldValue("category_id", "0");
                        }}
                      >
                        {categories?.map((category) => (
                          <option
                            key={category.category_id}
                            value={`${category.category_id},${category.category_type}`}
                          >
                            {category.category_name}
                          </option>
                        ))}
                      </SelectWithValidation>
                    </FieldLayout>
                    <FieldLayout label="Sub-Categories">
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
                        <Box w="full" mr={{ base: "4", md: "2" }}>
                          <Field name="category_id">
                            {({ field }) => (
                              <RadioGroup colorScheme="primary" {...field}>
                                <Stack direction="row" spacing={4}>
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

                    {values.category_id === "0" ? (
                      <FieldLayout label="Sports Associated">
                        <MultiSelect
                          isMulti
                          placeholder="Select"
                          id="sports_interest"
                          instanceId="sports_interest"
                          name="sports_interest"
                          options={sportsOptions}
                        />
                      </FieldLayout>
                    ) : (
                      <FieldLayout label="Category Associated">
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
                  </>
                )}

                <FieldLayout label="Sponsor Description">
                  <TextAreaWithValidation
                    name="sponsor_desc"
                    placeholder="Sponsor Description"
                  />
                </FieldLayout>
                <FieldLayout label="Sponsor Logo">
                  <Box>
                    <HStack spacing={5}>
                      <Button
                        as="label"
                        variant="outline"
                        cursor="pointer"
                        minW="none"
                        size="sm"
                      >
                        Choose File
                        <Input
                          type="file"
                          id="upload-file"
                          display="none"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              setFieldValue(
                                "sponsor_media_url",
                                e.target.files[0]
                              );
                            }
                          }}
                        />
                      </Button>
                      <TextSmall>
                        {values.sponsor_media_url?.name ||
                          values.sponsor_media_url?.original_filename ||
                          "No file chosen"}
                      </TextSmall>
                    </HStack>
                    {errors.sponsor_media_url && touched.sponsor_media_url && (
                      <TextSmall mt={2} color="red.500">
                        {errors.sponsor_media_url}
                      </TextSmall>
                    )}
                    <TextSmall mt={2}>
                      JPG, JPEG or PNG (5 MB maximum)
                    </TextSmall>
                  </Box>
                </FieldLayout>
                <FieldLayout label="Sponsor URL">
                  <TextBoxWithValidation
                    name="sponsor_click_url"
                    placeholder="Sponsor URL"
                  />
                </FieldLayout>
                <FieldLayout label="Sponsor Type">
                  <TextBoxWithValidation
                    name={`${type}_sponsor_type_name`}
                    placeholder="Sponsor Type"
                  />
                </FieldLayout>
                <FieldLayout label="Featured Sponsor">
                  <Field name="is_featured">
                    {({ field }) => {
                      return (
                        <Checkbox
                          borderColor="gray.300"
                          isChecked={values.is_featured}
                          {...field}
                        />
                      );
                    }}
                  </Field>
                </FieldLayout>

                {createIsError && (
                  <TextMedium color="red.500">
                    Failed to add sponsor. Please try again.
                  </TextMedium>
                )}
                {updateIsError && (
                  <TextMedium color="red.500">
                    Failed to edit sponsor. Please try again.
                  </TextMedium>
                )}
                <ButtonGroup alignSelf="flex-end" spacing={3}>
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={createIsLoading || updateIsLoading}
                  >
                    Save
                  </Button>
                </ButtonGroup>
              </VStack>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default SponsorsModal;
