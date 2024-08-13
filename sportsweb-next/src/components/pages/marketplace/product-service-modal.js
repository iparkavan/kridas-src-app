import { Box, HStack, Input, VStack } from "@chakra-ui/react";
import { Form, Formik, useFormikContext } from "formik";
import * as yup from "yup";
import { getAddProductYupSchema } from "../../../helper/constants/product-constants";
import { useUpdateProduct, useAddProduct } from "../../../hooks/product-hooks";
import { useUser } from "../../../hooks/user-hooks";
import Modal from "../../ui/modal";
import SelectWithValidation from "../../ui/select/select-with-validation";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import Button from "../../ui/button";
import { TextSmall } from "../../ui/text/text";
import {
  useCategoriesById,
  useCategoriesByType,
} from "../../../hooks/category-hooks";
import LabelText from "../../ui/text/label-text";
import { useLocation } from "../../../hooks/location-hooks";
import { useCountryByISOCode } from "../../../hooks/country-hooks";

const ProductServiceModal = (props) => {
  const { isOpen, onClose, mode, type, pageId, productData } = props;

  let categoryTypeCode, productTypeCode, typeName;
  if (type === "product") {
    categoryTypeCode = "PCS";
    typeName = "Product";
    productTypeCode = "VCH";
  } else if (type === "service") {
    categoryTypeCode = "SCS";
    typeName = "Service";
    productTypeCode = "SER";
  }

  const { data: userData } = useUser();
  const { data: categoryData } = useCategoriesByType(categoryTypeCode);
  const { mutate: createMutate, isLoading: isCreateLoading } = useAddProduct();
  const { mutate: updateMutate, isLoading: isUpdateLoading } =
    useUpdateProduct();
  const { data: locationData } = useLocation();
  const { data: countryData } = useCountryByISOCode(locationData?.countryCode);

  const isModeEdit = mode === "edit";

  const ProductCategorySelect = () => {
    const { values } = useFormikContext();
    const sportCategoryId = values.sportCategory;
    const { data: productCategoriesData } = useCategoriesById(sportCategoryId);

    return (
      <SelectWithValidation
        name="productCategory"
        placeholder="Select Category"
        maxW="sm"
        label={`${typeName} Category`}
      >
        {productCategoriesData?.map((category) => (
          <option key={category.category_id} value={category.category_id}>
            {category.category_name}
          </option>
        ))}
      </SelectWithValidation>
    );
  };

  let initialValues;
  if (isModeEdit) {
    initialValues = {
      productName: productData.productName,
      productDesc: productData.productDesc,
      sportCategory: productData.productCategories[1].categoryId,
      productCategory: productData.productCategories[0].categoryId,
      file: null,
    };
  } else {
    initialValues = {
      productName: "",
      productDesc: "",
      sportCategory: "",
      productCategory: "",
      file: null,
    };
  }

  const onSubmit = ({ sportCategory, productCategory, ...values }) => {
    const productCategories = [
      {
        categoryId: productCategory,
      },
      {
        categoryId: sportCategory,
      },
    ];

    const product = {
      productName: values.productName.trim(),
      productDesc: values.productDesc.trim(),
      productTypeId: productTypeCode,
      productCategories,
      quantity: 0,
      createdBy: userData.user_id,
      availabilityStatus: "NAV",
      productLocation: countryData?.country_code,
      file: values.file,
    };
    if (isModeEdit) {
      product.productId = productData.productId;
      updateMutate(product, {
        onSuccess: () => onClose(),
      });
    } else {
      product.companyId = pageId;
      createMutate(product, {
        onSuccess: () => onClose(),
      });
    }
  };

  const isFileMandatory = !isModeEdit;

  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      onClose={onClose}
      title={isModeEdit ? `Edit ${typeName}` : `Add ${typeName}`}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={getAddProductYupSchema(yup, isFileMandatory)}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form>
            <VStack
              p={5}
              border="1px"
              borderColor="gray.300"
              borderRadius="sm"
              alignItems="flex-start"
              spacing={5}
            >
              <TextBoxWithValidation
                name="productName"
                placeholder="Title"
                maxW="sm"
                label="Title"
              />

              <TextBoxWithValidation
                name="productDesc"
                placeholder="Description"
                maxW="sm"
                label="Description"
              />

              <SelectWithValidation
                name="sportCategory"
                placeholder="Select Sport"
                maxW="sm"
                label="Sport"
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldValue("productCategory", "");
                }}
              >
                {categoryData?.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category_name}
                  </option>
                ))}
              </SelectWithValidation>

              <ProductCategorySelect />

              <Box>
                <LabelText mb={1}>Add Image</LabelText>
                <Input
                  type="file"
                  name="file"
                  onChange={(e) =>
                    formik.setFieldValue("file", e.target.files[0])
                  }
                />
                {formik.errors?.file && formik.touched?.file && (
                  <TextSmall color="red.500">{formik.errors.file} </TextSmall>
                )}
              </Box>
            </VStack>
            <HStack mt={5} spacing={5} justify="flex-end">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isCreateLoading || isUpdateLoading}
              >
                Save
              </Button>
            </HStack>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ProductServiceModal;
