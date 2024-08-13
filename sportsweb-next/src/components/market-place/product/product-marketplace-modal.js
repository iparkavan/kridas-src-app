import {
  Box,
  FormControl,
  FormErrorMessage,
  HStack,
  Image,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik, useFormikContext } from "formik";
import * as yup from "yup";
import { ContentState, convertFromRaw, convertToRaw } from "draft-js";
import { EditorState } from "draft-js";
import "draft-js/dist/Draft.css";

import { getProductMarketPlaceYupSchema } from "../../../helper/constants/product-constants";
import {
  useCategoriesById,
  useCategoriesByType,
} from "../../../hooks/category-hooks";
import Button from "../../ui/button";
import LabelValuePair from "../../ui/label-value-pair";
import Modal from "../../ui/modal";
import SelectWithValidation from "../../ui/select/select-with-validation";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import { useUpdateProduct, useAddProduct } from "../../../hooks/product-hooks";
import DatePicker from "../../ui/pickers/date-picker";
import { useUser } from "../../../hooks/user-hooks";
import { TextSmall, TextXtraSmall } from "../../ui/text/text";
import helper from "../../../helper/helper";
import { useLocation } from "../../../hooks/location-hooks";
import { useCountryByISOCode } from "../../../hooks/country-hooks";
import MarketplaceDraftEditor from "../marketplace-draft-editor";
import LabelText from "../../ui/text/label-text";

function ProductMarketplaceModal(props) {
  const {
    isOpen,
    onClose,
    productData,
    type,
    pageId,
    wasProductInMarketplace = false,
  } = props;
  const { data: categoryData } = useCategoriesByType("PCS");
  const { data: userData } = useUser();

  const { mutate: createMutate, isLoading: isCreateLoading } = useAddProduct();
  const { mutate: updateMutate, isLoading: isUpdateLoading } =
    useUpdateProduct();
  const { data: locationData } = useLocation();
  const { data: countryData } = useCountryByISOCode(locationData?.countryCode);

  const isTypeEdit = type === "edit";

  const ProductCategorySelect = () => {
    const { values } = useFormikContext();
    const sportCategoryId = values.sportCategory;
    const { data: productCategories } = useCategoriesById(sportCategoryId);

    return (
      <SelectWithValidation
        name="productCategory"
        placeholder="Select Category"
        maxW="sm"
        label="Product Category"
      >
        {productCategories?.map((category) => (
          <option key={category.category_id} value={category.category_id}>
            {category.category_name}
          </option>
        ))}
      </SelectWithValidation>
    );
  };

  const getContentState = (value) => {
    let contentState;
    try {
      contentState = convertFromRaw(JSON.parse(value));
    } catch (e) {
      contentState = ContentState.createFromText(value);
    }
    return contentState;
  };

  let initialValues;
  if (isTypeEdit) {
    initialValues = {
      productName: productData.productName,
      productDesc: productData.productDesc,
      sportCategory: productData.productCategories[1].categoryId,
      productCategory: productData.productCategories[0].categoryId,
      redemptionTillDate: new Date(productData.voucher.redemptionTillDate),
      quantity: productData.quantity || 1,
      productBasePrice: productData.productPricing.productBasePrice,
      productSplPrice: productData.productPricing.productSplPrice,
      productPriceCurrency: productData.productPricing.productPriceCurrency,
      commision: "",
      voucherTerms: EditorState.createWithContent(
        getContentState(productData.voucher.voucherTerms)
      ),
      file: null,
      // file: productData.productMediaUrl,
    };
  } else {
    initialValues = {
      redemptionTillDate: "",
      quantity: 1,
      productBasePrice: "",
      productSplPrice: "",
      productPriceCurrency: countryData?.country_currency,
      commision: "",
      voucherTerms: EditorState.createWithContent(
        convertFromRaw({
          entityMap: {},
          blocks: [
            {
              text: "",
              key: "foo",
              type: "unstyled",
              entityRanges: [],
            },
          ],
        })
      ),
      file: null,
    };
    if (productData) {
      initialValues.productName = productData.productName;
      initialValues.productDesc = productData.productDesc;
      initialValues.sportCategory = productData.productCategories[1].categoryId;
      initialValues.productCategory =
        productData.productCategories[0].categoryId;
    } else {
      initialValues.productName = "";
      initialValues.productDesc = "";
      initialValues.sportCategory = "";
      initialValues.productCategory = "";
    }
  }

  const onSubmit = ({
    productName,
    productDesc,
    sportCategory,
    productCategory,
    redemptionTillDate,
    quantity,
    productBasePrice,
    productSplPrice,
    productPriceCurrency,
    voucherTerms,
    file,
  }) => {
    const voucherTermsContentState = voucherTerms.getCurrentContent();
    const updatedVoucherTerms = JSON.stringify(
      convertToRaw(voucherTermsContentState)
    );

    const product = {
      productName: productName.trim(),
      productDesc: productDesc.trim(),
      productTypeId: "VCH",
      productCategories: [
        { categoryId: productCategory },
        { categoryId: sportCategory },
      ],
      quantity,
      createdBy: userData.user_id,
      availabilityStatus: "AVL",
      productLocation: countryData?.country_code,
      voucher: {
        voucherRedemptionType: "DT",
        redemptionTillDate: helper.getJSDateObject(redemptionTillDate),
        voucherTerms: updatedVoucherTerms,
      },
      productPricing: {
        productBasePrice: +productBasePrice,
        productSplPrice: productSplPrice ? +productSplPrice : +productBasePrice,
        productPriceCurrency,
        isActive: true,
        taxRateId: null,
      },
      file,
    };

    if (isTypeEdit) {
      product.productId = productData.productId;
      product.voucher.productId = productData.productId;
      product.productPricing.productId = productData.productId;
      product.voucher.voucherId = productData.voucher.voucherId;
      product.productPricing.productPricingId =
        productData.productPricing.productPricingId;
      product.productPricing.taxRateId = productData.productPricing.taxRateId;
      updateMutate(product, {
        onSuccess: () => {
          onClose();
        },
      });
    } else {
      if (productData) {
        product.productId = productData.productId;
        product.voucher.productId = productData.productId;
        product.productPricing.productId = productData.productId;
        updateMutate(product, {
          onSuccess: () => {
            onClose();
          },
        });
      } else {
        product.companyId = pageId;
        createMutate(product, {
          onSuccess: () => {
            onClose();
          },
        });
      }
    }
  };

  let modalTitle;
  if (isTypeEdit) {
    if (wasProductInMarketplace) {
      modalTitle = "Add To Market Place";
    } else {
      modalTitle = "Edit Product";
    }
  } else {
    modalTitle = "Add To Market Place";
  }

  const isImageMandatory = !isTypeEdit && !productData;

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={getProductMarketPlaceYupSchema(yup, isImageMandatory)}
        enableReinitialize={true}
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

              <HStack spacing={5} alignItems="flex-start">
                <LabelValuePair label="Voucher Details">
                  <DatePicker
                    name="redemptionTillDate"
                    placeholderText="Valid Till"
                  />
                </LabelValuePair>

                <LabelValuePair label="No of Vouchers">
                  <FormControl
                    isInvalid={Boolean(
                      formik.touched?.quantity && formik.errors?.quantity
                    )}
                  >
                    <NumberInput
                      value={formik.values.quantity}
                      onChange={(value) =>
                        formik.setFieldValue("quantity", +value)
                      }
                      maxW="100px"
                      min={1}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>
                      {formik.errors?.quantity}
                    </FormErrorMessage>
                  </FormControl>
                </LabelValuePair>
              </HStack>

              <HStack spacing={5} alignItems="flex-start" w="full">
                <Box w="full">
                  <TextBoxWithValidation
                    name="productBasePrice"
                    placeholder="Actual Cost"
                    label="Actual Cost"
                    type="number"
                    // maxW="150px"
                  />
                  <TextXtraSmall mt={1} color="gray.500">
                    * Inclusive of Tax
                  </TextXtraSmall>
                </Box>
                <TextBoxWithValidation
                  name="productSplPrice"
                  placeholder="Special Cost"
                  label="Special Cost"
                  type="number"
                  // maxW="150px"
                />
                <TextBoxWithValidation
                  name="productPriceCurrency"
                  placeholder="Currency"
                  label="Currency"
                  disabled
                  // maxW="150px"
                />
                {/* <SelectWithValidation
                  name="productPriceCurrency"
                  placeholder="Currency"
                  label="Currency"
                  // maxW="150px"
                >
                  <option>INR</option>
                  <option>SGD</option>
                </SelectWithValidation> */}
              </HStack>
              <SelectWithValidation
                name="commision"
                label="Commision % for Kridas"
                disabled
                maxW="150px"
              >
                <option>10%</option>
              </SelectWithValidation>
              <Box w="full" maxW="sm">
                <LabelText mb={1}>Terms and Conditions</LabelText>
                <MarketplaceDraftEditor
                  formik={formik}
                  name="voucherTerms"
                  placeholder="Terms and Conditions"
                />
              </Box>
              <LabelValuePair label="Add Image">
                {/* <Box w={80} h={32}> */}
                {/* <Image
                  src={productData.productMediaList[0].productMediaUrl}
                  alt="/image"
                  w={80}
                  maxH={20}
                  borderRadius={10}
                  objectFit="cover"
                  onChange={(e) =>
                    formik.setFieldValue("file", e.target.files[0])
                  }
                /> */}
                {/* </Box> */}
                <Input
                  type="file"
                  name="file"
                  onChange={(e) =>
                    formik.setFieldValue("file", e.target.files[0])
                  }
                />
                {formik.touched?.file && formik.errors?.file && (
                  <TextSmall color="red.500">{formik.errors.file} </TextSmall>
                )}
              </LabelValuePair>
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
}

export default ProductMarketplaceModal;
