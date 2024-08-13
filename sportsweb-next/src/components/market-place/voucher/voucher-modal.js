import {
  Box,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  VStack,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { ContentState, convertFromRaw, convertToRaw } from "draft-js";
import { EditorState } from "draft-js";
import "draft-js/dist/Draft.css";

import { getVoucherMarketPlaceYupSchema } from "../../../helper/constants/product-constants";
import { useUser } from "../../../hooks/user-hooks";
import LabelValuePair from "../../ui/label-value-pair";
import Modal from "../../ui/modal";
import SelectWithValidation from "../../ui/select/select-with-validation";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import Button from "../../ui/button";
import { TextSmall, TextXtraSmall } from "../../ui/text/text";
import DatePicker from "../../ui/pickers/date-picker";
import { useCategoriesByType } from "../../../hooks/category-hooks";
import { useAddProduct, useUpdateProduct } from "../../../hooks/product-hooks";
import helper from "../../../helper/helper";
import { useLocation } from "../../../hooks/location-hooks";
import { useCountryByISOCode } from "../../../hooks/country-hooks";
import LabelText from "../../ui/text/label-text";
import MarketplaceDraftEditor from "../marketplace-draft-editor";

const VoucherModal = (props) => {
  const {
    isOpen,
    onClose,
    type,
    pageData,
    voucherData,
    isNonSportingPage,
    onEventOpen,
    setVoucherId,
  } = props;
  const { data: userData } = useUser();
  const { data: categoryData } = useCategoriesByType("PCS");
  const { data: nonSportingCategories } = useCategoriesByType("NSC");

  const { mutate: createMutate, isLoading: isCreateLoading } = useAddProduct();
  const { mutate: updateMutate, isLoading: isUpdateLoading } =
    useUpdateProduct();
  const { data: locationData } = useLocation();
  const { data: countryData } = useCountryByISOCode(locationData?.countryCode);

  const isTypeEdit = type === "edit";

  const getContentState = (value) => {
    let contentState;
    try {
      contentState = convertFromRaw(JSON.parse(value));
    } catch (e) {
      contentState = ContentState.createFromText(value);
    }
    return contentState;
  };

  const splitVoucherId = (strId) => {
    const splitId = strId.split(" ");
    setVoucherId(splitId[3]);
  };

  let initialValues;
  if (isTypeEdit) {
    initialValues = {
      // Have hardcoded it to cash voucher as of now
      brandType: "CSH",
      brand: "",
      productBasePrice: voucherData.productPricing.productBasePrice,
      productSplPrice: voucherData.productPricing.productSplPrice,
      productPriceCurrency: voucherData.productPricing.productPriceCurrency,
      productDesc: voucherData.productDesc,
      redemptionTillDate: new Date(voucherData.voucher.redemptionTillDate),
      sportCategory: voucherData.productCategories[0].categoryId,
      voucherTerms: EditorState.createWithContent(
        getContentState(voucherData.voucher.voucherTerms)
      ),
      quantity: voucherData.quantity,
      file: null,
    };
  } else {
    initialValues = {
      brandType: "CSH",
      brand: "",
      productBasePrice: "",
      productSplPrice: "",
      productPriceCurrency: countryData?.country_currency,
      productDesc: "",
      redemptionTillDate: "",
      sportCategory: "",
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
      quantity: 1,
      file: null,
    };
  }

  const onSubmit = ({
    brandType,
    brand,
    productBasePrice,
    productSplPrice,
    productPriceCurrency,
    productDesc,
    redemptionTillDate,
    sportCategory,
    voucherTerms,
    quantity,
    file,
  }) => {
    const voucherTermsContentState = voucherTerms.getCurrentContent();
    const updatedVoucherTerms = JSON.stringify(
      convertToRaw(voucherTermsContentState)
    );

    const voucherObj = {
      productDesc: productDesc.trim(),
      productTypeId: "CVCH",
      productCategories: [{ categoryId: sportCategory }],
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
      voucherObj.productId = voucherData.productId;
      voucherObj.voucher.productId = voucherData.productId;
      voucherObj.productPricing.productId = voucherData.productId;
      voucherObj.voucher.voucherId = voucherData.voucher.voucherId;
      voucherObj.productPricing.productPricingId =
        voucherData.productPricing.productPricingId;
      voucherObj.productPricing.taxRateId =
        voucherData.productPricing.taxRateId;
      updateMutate(voucherObj, {
        onSuccess: () => {
          onClose();
        },
      });
    } else {
      voucherObj.productName = `${pageData.company_name} Cash Voucher`;
      voucherObj.companyId = pageData.company_id;
      createMutate(voucherObj, {
        onSuccess: (data) => {
          splitVoucherId(data.message);
          onClose();
          onEventOpen();
        },
      });
    }
  };

  const isFileMandatory = !isTypeEdit;

  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      onClose={onClose}
      title={isTypeEdit ? "Edit Voucher" : "Add Voucher"}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={getVoucherMarketPlaceYupSchema(yup, isFileMandatory)}
        onSubmit={onSubmit}
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
              <HStack w="full" spacing={10}>
                <Field name="brandType">
                  {({ field }) => {
                    return (
                      <RadioGroup colorScheme="primary" {...field}>
                        <HStack spacing={5}>
                          <Radio {...field} value="CSH">
                            Cash
                          </Radio>
                          <Radio {...field} value="BRD">
                            Brand
                          </Radio>
                        </HStack>
                      </RadioGroup>
                    );
                  }}
                </Field>

                <SelectWithValidation
                  name="brand"
                  placeholder="Select Brand"
                  maxW="2xs"
                  disabled={formik.values.brandType !== "BRD"}
                />
              </HStack>

              <HStack alignItems="flex-start" spacing={4}>
                <Box w="full">
                  <TextBoxWithValidation
                    name="productBasePrice"
                    placeholder="Actual Amount"
                    label="Actual Amount"
                    type="number"
                  />
                  <TextXtraSmall mt={1} color="gray.500">
                    * Inclusive of Tax
                  </TextXtraSmall>
                </Box>

                <TextBoxWithValidation
                  name="productSplPrice"
                  placeholder="Special Amount"
                  label="Special Amount"
                  type="number"
                />

                <TextBoxWithValidation
                  name="productPriceCurrency"
                  placeholder="Currency"
                  label="Currency"
                  disabled
                />
                {/* <SelectWithValidation
                    name="productPriceCurrency"
                    placeholder="Currency"
                  >
                    <option value="INR">INR</option>
                    <option value="SGD">SGD</option>
                  </SelectWithValidation> */}
              </HStack>

              <TextBoxWithValidation
                name="productDesc"
                placeholder="Description"
                label="Description"
                maxW="sm"
              />

              <LabelValuePair label="Valid Till">
                <DatePicker
                  name="redemptionTillDate"
                  placeholderText="Valid Till"
                />
              </LabelValuePair>

              {isNonSportingPage ? (
                <SelectWithValidation
                  name="sportCategory"
                  placeholder="Select Category"
                  label="Category"
                  maxW="sm"
                >
                  {nonSportingCategories?.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.category_name}
                    </option>
                  ))}
                </SelectWithValidation>
              ) : (
                <SelectWithValidation
                  name="sportCategory"
                  placeholder="Select Sport"
                  label="Sport"
                  maxW="sm"
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
              )}

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
                  <FormErrorMessage>{formik.errors?.quantity}</FormErrorMessage>
                </FormControl>
              </LabelValuePair>

              <Box w="full" maxW="sm">
                <LabelText mb={1}>Terms and Conditions</LabelText>
                <MarketplaceDraftEditor
                  formik={formik}
                  name="voucherTerms"
                  placeholder="Terms & Conditions"
                />
              </Box>

              <LabelValuePair label="Add Image">
                <Input
                  type="file"
                  name="file"
                  onChange={(e) =>
                    formik.setFieldValue("file", e.target.files[0])
                  }
                />
                {formik.errors?.file && formik.touched?.file && (
                  <TextSmall mt={1} color="red.500">
                    {formik.errors.file}
                  </TextSmall>
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
};

export default VoucherModal;
