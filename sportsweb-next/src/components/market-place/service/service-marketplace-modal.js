import {
  Box,
  // FormControl,
  // FormErrorMessage,
  HStack,
  IconButton,
  Input,
  // NumberDecrementStepper,
  // NumberIncrementStepper,
  // NumberInput,
  // NumberInputField,
  // NumberInputStepper,
  VStack,
} from "@chakra-ui/react";
import { FieldArray, Form, Formik, useFormikContext } from "formik";
import { addMinutes, differenceInMinutes, format, isToday } from "date-fns";
import * as yup from "yup";
import { ContentState, convertFromRaw, convertToRaw } from "draft-js";
import { EditorState } from "draft-js";
import "draft-js/dist/Draft.css";

import {
  days,
  getServiceMarketPlaceYupSchema,
} from "../../../helper/constants/product-constants";
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
import { useUser } from "../../../hooks/user-hooks";
import { TextSmall, TextXtraSmall } from "../../ui/text/text";
import { useLocation } from "../../../hooks/location-hooks";
import { useCountryByISOCode } from "../../../hooks/country-hooks";
import MultiSelect from "../../ui/select/multi-select";
import { DeleteIcon } from "../../ui/icons";
import MarketplaceDraftEditor from "../marketplace-draft-editor";
import LabelText from "../../ui/text/label-text";
import {
  convertToCTFormat,
  processEditCTService,
} from "../../../helper/constants/service-constants";
import {
  convertDateToUTCString,
  covertTimeToUTCDate,
} from "../../../helper/constants/common-constants";

function ServiceMarketplaceModal(props) {
  const {
    isOpen,
    onClose,
    serviceData,
    type,
    pageId,
    wasProductInMarketplace = false,
  } = props;
  const { data: categoryData } = useCategoriesByType("SCS");
  const { data: userData } = useUser();

  const { mutate: createMutate, isLoading: isCreateLoading } = useAddProduct();
  const { mutate: updateMutate, isLoading: isUpdateLoading } =
    useUpdateProduct();
  const { data: locationData } = useLocation();
  const { data: countryData } = useCountryByISOCode(locationData?.countryCode);

  const isTypeEdit = type === "edit";

  const ServiceCategorySelect = () => {
    const { values } = useFormikContext();
    const sportCategoryId = values.sportCategory;
    const { data: productCategories } = useCategoriesById(sportCategoryId);

    return (
      <SelectWithValidation
        name="productCategory"
        placeholder="Select Category"
        maxW="sm"
        label="Service Category"
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

  const dayOptions = Object.entries(days).map(([dayCode, dayName]) => ({
    value: dayCode,
    label: dayName,
  }));

  const scheduleObj = {
    duration: "",
    days: [],
    slots: [],
  };

  let initialValues;
  if (isTypeEdit) {
    const serviceWeeklySchedules = serviceData.services.serviceWeeklySchedules;
    const isCalendarType =
      serviceWeeklySchedules.length > 0 &&
      serviceWeeklySchedules.some(
        (sws) => sws.weeklyScheduleDetails.length > 0
      );
    const serviceType = isCalendarType ? "CT" : "OTP";
    let updatedServiceWeeklySchedules = [];
    if (isCalendarType) {
      serviceWeeklySchedules.forEach((sws) => {
        const isWeeklySchedulePresent = sws.weeklyScheduleDetails.length > 0;
        if (!isWeeklySchedulePresent) return;
        let duration;
        const day = { value: sws.weekDay, label: days[sws.weekDay] };
        const slots = sws.weeklyScheduleDetails.map((wsd) => {
          const startDate = covertTimeToUTCDate(wsd.startTime);
          const endDate = covertTimeToUTCDate(wsd.endTime);
          if (!duration) {
            duration = differenceInMinutes(endDate, startDate);
          }
          return {
            label: `${format(startDate, "hh:mm aa")} - ${format(
              endDate,
              "hh:mm aa"
            )}`,
            value: `${wsd.startTime}-${wsd.endTime}`,
          };
        });
        const existingSlots = updatedServiceWeeklySchedules.find(
          (usws) =>
            usws.slots.length === slots.length &&
            usws.slots.every((slot) =>
              slots.find((s) => s.value === slot.value)
            )
        );
        if (existingSlots) {
          existingSlots.days.push(day);
        } else {
          updatedServiceWeeklySchedules.push({ duration, days: [day], slots });
        }
      });
    }

    initialValues = {
      serviceType,
      productName: serviceData.productName,
      productDesc: serviceData.productDesc,
      sportCategory: serviceData.productCategories[1].categoryId,
      productCategory: serviceData.productCategories[0].categoryId,
      quantity: serviceData.quantity || 1,
      productBasePrice: serviceData.productPricing.productBasePrice,
      productSplPrice: serviceData.productPricing.productSplPrice,
      productPriceCurrency: serviceData.productPricing.productPriceCurrency,
      commision: "",
      inclusions: EditorState.createWithContent(
        getContentState(serviceData.services.inclusions)
      ),
      serviceTerms: EditorState.createWithContent(
        getContentState(serviceData.services.serviceTerms)
      ),
      serviceWeeklySchedules: updatedServiceWeeklySchedules,
      file: null,
    };
  } else {
    initialValues = {
      serviceType: "",
      quantity: 1,
      productBasePrice: "",
      productSplPrice: "",
      productPriceCurrency: countryData?.country_currency,
      commision: "",
      inclusions: EditorState.createWithContent(
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
      serviceTerms: EditorState.createWithContent(
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
      serviceWeeklySchedules: [scheduleObj],
      file: null,
    };
    if (serviceData) {
      initialValues.productName = serviceData.productName;
      initialValues.productDesc = serviceData.productDesc;
      initialValues.sportCategory = serviceData.productCategories[1].categoryId;
      initialValues.productCategory =
        serviceData.productCategories[0].categoryId;
    } else {
      initialValues.productName = "";
      initialValues.productDesc = "";
      initialValues.sportCategory = "";
      initialValues.productCategory = "";
    }
  }

  const onSubmit = ({
    serviceType,
    productName,
    productDesc,
    sportCategory,
    productCategory,
    quantity,
    productBasePrice,
    productSplPrice,
    productPriceCurrency,
    inclusions,
    serviceTerms,
    serviceWeeklySchedules,
    file,
  }) => {
    const inclusionsContentState = inclusions.getCurrentContent();
    const updatedInclusions = JSON.stringify(
      convertToRaw(inclusionsContentState)
    );

    const serviceTermsContentState = serviceTerms.getCurrentContent();
    const updatedServiceTerms = JSON.stringify(
      convertToRaw(serviceTermsContentState)
    );

    const service = {
      productName: productName.trim(),
      productDesc: productDesc.trim(),
      productTypeId: "SER",
      productCategories: [
        { categoryId: productCategory },
        { categoryId: sportCategory },
      ],
      quantity,
      createdBy: userData.user_id,
      availabilityStatus: "AVL",
      productLocation: countryData?.country_code,
      services: {
        inclusions: updatedInclusions,
        serviceTerms: updatedServiceTerms,
        createdBy: userData.user_id,
        // serviceWeeklySchedules,
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
      service.productId = serviceData.productId;
      service.services.productId = serviceData.productId;
      service.productPricing.productId = serviceData.productId;
      service.services.serviceId = serviceData.services.serviceId;
      service.productPricing.productPricingId =
        serviceData.productPricing.productPricingId;
      service.productPricing.taxRateId = serviceData.productPricing.taxRateId;
      let processedServiceWeeklySchedules = [];
      if (serviceType === "CT") {
        const updatedServiceWeeklySchedules = convertToCTFormat(
          serviceWeeklySchedules
        );
        processedServiceWeeklySchedules = processEditCTService(
          serviceData.services.serviceWeeklySchedules,
          updatedServiceWeeklySchedules
        );
      } else {
        // To remove schedules when editing from CT to OTP Service
        processedServiceWeeklySchedules = processEditCTService(
          serviceData.services.serviceWeeklySchedules,
          []
        );
      }
      service.services.serviceWeeklySchedules = processedServiceWeeklySchedules;
      updateMutate(service, {
        onSuccess: () => {
          onClose();
        },
      });
    } else {
      let updatedWeeklySchedules = [];
      if (serviceType === "CT") {
        updatedWeeklySchedules = convertToCTFormat(serviceWeeklySchedules);
      }

      service.services.serviceWeeklySchedules = updatedWeeklySchedules;
      if (serviceData) {
        service.productId = serviceData.productId;
        service.services.productId = serviceData.productId;
        service.productPricing.productId = serviceData.productId;
        updateMutate(service, {
          onSuccess: () => {
            onClose();
          },
        });
      } else {
        service.companyId = pageId;
        createMutate(service, {
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
      modalTitle = "Edit Service";
    }
  } else {
    modalTitle = "Add To Market Place";
  }

  const isImageMandatory = !isTypeEdit && !serviceData;

  return (
    <Modal size="4xl" isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={getServiceMarketPlaceYupSchema(yup, isImageMandatory)}
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
              <SelectWithValidation
                name="serviceType"
                placeholder="Service Type"
                maxW="sm"
                label="Service Type"
              >
                <option value="OTP">One Time Purchase</option>
                <option value="CT">Calendar Type</option>
              </SelectWithValidation>

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

              <ServiceCategorySelect />

              {formik.values.serviceType === "CT" && (
                <FieldArray
                  name="serviceWeeklySchedules"
                  render={(helpers) => {
                    const serviceWeeklySchedules =
                      formik.values.serviceWeeklySchedules;
                    return (
                      <>
                        {serviceWeeklySchedules.map((weeklySchedule, index) => {
                          const availableDays = dayOptions.filter((day) => {
                            const isDaySelected = serviceWeeklySchedules.some(
                              (schedule) =>
                                schedule.days.some(
                                  (scheduleDay) =>
                                    scheduleDay.value === day.value
                                )
                            );
                            return !isDaySelected;
                          });

                          let availableSlots = [];
                          if (weeklySchedule.duration) {
                            let currentDate = new Date();
                            currentDate.setHours(0, 0, 0, 0);
                            const minutes = +weeklySchedule.duration;

                            // while (isToday(addMinutes(currentDate, minutes))) {
                            while (isToday(currentDate)) {
                              let dateOne = new Date(currentDate);
                              currentDate = addMinutes(currentDate, minutes);
                              const startTime = convertDateToUTCString(dateOne);
                              const endTime =
                                convertDateToUTCString(currentDate);
                              const slotObj = {
                                label: `${format(
                                  dateOne,
                                  "hh:mm aa"
                                )} - ${format(currentDate, "hh:mm aa")}`,
                                value: `${startTime}-${endTime}`,
                              };
                              availableSlots.push(slotObj);
                            }
                          }

                          return (
                            <HStack
                              key={index}
                              spacing={5}
                              alignItems="flex-start"
                              w="full"
                            >
                              <Box w="xs">
                                <SelectWithValidation
                                  name={`serviceWeeklySchedules[${index}].duration`}
                                  placeholder="Duration"
                                  label="Slot Duration"
                                  onChange={(e) => {
                                    formik.handleChange(e);
                                    formik.setFieldTouched(
                                      `serviceWeeklySchedules[${index}].slots`,
                                      false
                                    );
                                    formik.setFieldValue(
                                      `serviceWeeklySchedules[${index}].slots`,
                                      []
                                    );
                                  }}
                                >
                                  <option value="30">30 mins</option>
                                  <option value="60">1 hour</option>
                                  <option value="120">2 hours</option>
                                </SelectWithValidation>
                              </Box>

                              <MultiSelect
                                isMulti
                                placeholder="Available Days"
                                label="Available Days"
                                id="available_days"
                                instanceId="available_days"
                                name={`serviceWeeklySchedules[${index}].days`}
                                options={availableDays}
                              />

                              <MultiSelect
                                isMulti
                                placeholder="Available Slots"
                                label="Available Slots"
                                id="available_slots"
                                instanceId="available_slots"
                                name={`serviceWeeklySchedules[${index}].slots`}
                                options={availableSlots}
                              />

                              <IconButton
                                variant="ghost"
                                colorScheme="primary"
                                alignSelf="center"
                                icon={<DeleteIcon />}
                                onClick={() => helpers.remove(index)}
                                disabled={
                                  formik.values.serviceWeeklySchedules
                                    .length === 1
                                }
                              />
                            </HStack>
                          );
                        })}
                        <Button
                          fontSize="sm"
                          variant="link"
                          onClick={() => helpers.push(scheduleObj)}
                        >
                          + Add Slot
                        </Button>
                      </>
                    );
                  }}
                />
              )}

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

              {/* {formik.values.serviceType === "OTP" && (
                <LabelValuePair label="No of users can avail the service">
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
                      maxW="150px"
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
              )} */}

              <Box w="full" maxW="sm">
                <LabelText mb={1}>Inclusions</LabelText>
                <MarketplaceDraftEditor
                  formik={formik}
                  name="inclusions"
                  placeholder="Inclusions"
                />
              </Box>

              <Box w="full" maxW="sm">
                <LabelText mb={1}>Terms and Conditions</LabelText>
                <MarketplaceDraftEditor
                  formik={formik}
                  name="serviceTerms"
                  placeholder="Terms and Conditions"
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

export default ServiceMarketplaceModal;
