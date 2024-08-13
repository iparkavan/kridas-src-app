import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import * as yup from "yup";
import { ContentState, convertFromRaw, EditorState } from "draft-js";
import { Field, FieldArray, Form, Formik } from "formik";
import React, { useState } from "react";
import { useCategoriesByType } from "../../../hooks/category-hooks";
import Button from "../../ui/button";
import DatePicker from "../../ui/pickers/date-picker";
import SelectWithValidation from "../../ui/select/select-with-validation";
import { TextSmall } from "../../ui/text/text";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import FieldLayout from "../../user/profile-section/user-profile-edit/field-layout";
import EventDraftEditor from "../page-event/event-draft-editor";
import { useSports } from "../../../hooks/sports-hooks";
import DeletePopover from "../../ui/popover/delete-popover";
import { DeleteIcon } from "../../ui/icons";
import IconButton from "../../ui/icon-button";
import {
  useCreateEventNew,
  useEventByIdNew,
  useUpdateEventNew,
} from "../../../hooks/event-hook";
import { useRouter } from "next/router";
import { useUser } from "../../../hooks/user-hooks";
import { convertToRaw } from "draft-js";
// import EventIndemnityForm from "./event-indemnity-form";
// import { MdVerified } from "react-icons/md";
import PhoneNumberInput from "../../ui/phone-input/phone-number-input";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import { getEventCreateYupSchemaFormOne } from "../../../helper/constants/event-constants";
import { useLocation } from "../../../hooks/location-hooks";
import { useCountryByISOCode } from "../../../hooks/country-hooks";

function EventCreateFormOne({
  nextStep,
  prevStep,
  activeStep,
  steps,
  eventid,
  setEventId,
  isTypeEdit,
  profileImage,
  coverImage,
}) {
  const router = useRouter();
  const { pageId: companyId } = router.query;
  // const eventId = "eabf5ad8-da83-4cb4-ac1b-25c4c171bd86";
  const { data: eventData, isLoading } = useEventByIdNew(eventid);
  const { data: categories = [], isLoading: isCatLoading } =
    useCategoriesByType("EVT");
  const { mutate: createMutate, isLoading: createLoading } =
    useCreateEventNew();
  const { mutate: updateMutate, isLoading: updateLoading } =
    useUpdateEventNew(eventid);
  const { data: userData } = useUser();
  const userId = userData?.user_id;
  const [status, setStatus] = useState("");
  // const [publish, setPublish] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: locationData } = useLocation();
  const { data: countryData } = useCountryByISOCode(locationData?.countryCode);

  const {
    isOpen: isOpenstart,
    onOpen: onOpenstart,
    onClose: onClosestart,
  } = useDisclosure();
  const {
    isOpen: isOpenreg,
    onOpen: onOpenreg,
    onClose: onClosereg,
  } = useDisclosure();
  const cancelRef = React.useRef();

  // const indemnityFormContent = {
  //   entityMap: {},
  //   blocks: [
  //     {
  //       key: "fgfg",
  //       text: "1. I acknowledge and agree that participating in Singapore Regional Badminton Open on 25th March, 2018 at Singapore Badminton Hall, come with inherent risks and that I am physically and mentally fit to join the event.",
  //       type: "unstyled",
  //       depth: 0,
  //       inlineStyleRanges: [],
  //       entityRanges: [],
  //       data: {},
  //     },
  //     {
  //       key: "9k4gq",
  //       text: "2. I have full Knowledge of the foregoing risks and I assume all such risks to myself. In consideration of my participant in the event, Iwill not hold Skiya Sports. ",
  //       type: "unstyled",
  //       depth: 0,
  //       inlineStyleRanges: [],
  //       entityRanges: [],
  //       data: {},
  //     },
  //     {
  //       key: "7scbh",
  //       text: "3. I indemnify Skiya Sports and their appointed officials, staff and employees against any actions, proceedings, liabilities, claims, damages and expenses by any party howsoever arising out of any connection with the above said activity.",
  //       type: "unstyled",
  //       depth: 0,
  //       inlineStyleRanges: [],
  //       entityRanges: [],
  //       data: {},
  //     },
  //     {
  //       key: "fho5m",
  //       text: "4. I undertake to ensure strict compliance with all rules, regulations, requirements and instructions related to the event.",
  //       type: "unstyled",
  //       depth: 0,
  //       inlineStyleRanges: [],
  //       entityRanges: [],
  //       data: {},
  //     },
  //     {
  //       key: "69quq",
  //       text: "5. I represent that I am at least 18 years of age.",
  //       type: "unstyled",
  //       depth: 0,
  //       inlineStyleRanges: [],
  //       entityRanges: [],
  //       data: {},
  //     },
  //   ],
  // };

  const getContentState = (value) => {
    let contentState;
    try {
      contentState = convertFromRaw(JSON.parse(value));
    } catch (e) {
      contentState = ContentState.createFromText(value);
    }
    return contentState;
  };
  const defaultDescContent = eventData?.eventDesc
    ? getContentState(eventData?.eventDesc)
    : convertFromRaw({
        entityMap: {},
        blocks: [
          {
            text: "",
            key: "foo",
            type: "unstyled",
            entityRanges: [],
          },
        ],
      });
  const defaultRulesContent = eventData?.standardEventRules
    ? getContentState(eventData?.standardEventRules)
    : convertFromRaw({
        entityMap: {},
        blocks: [
          {
            text: "",
            key: "foo",
            type: "unstyled",
            entityRanges: [],
          },
        ],
      });
  // const indemnityContentState = eventData?.indemnityClause
  //   ? getContentState(eventData?.indemnityClause)
  //   : convertFromRaw(indemnityFormContent);

  const contactObj = {
    name: "",
    email: "",
    phone_number: "",
    whatsapp_number: "",
  };

  if (isLoading || isCatLoading) return <Skeleton>Loading..</Skeleton>;
  else
    return (
      <Formik
        initialValues={{
          eventName: eventData?.eventName || "",
          eventCategoryId: eventData?.eventCategoryId || "",
          isPublicEvent: eventData?.isPublicEvent || "Y",
          standardEventRules:
            EditorState.createWithContent(defaultRulesContent),
          eventDesc: EditorState.createWithContent(defaultDescContent),
          // indemnityClause: EditorState.createWithContent(indemnityContentState),
          // indemnityClause: JSON.stringify(convertToRaw(indemnityContentState)),
          //  EditorState?.createWithContent(
          //   indemnityContentState
          // ),
          collectPymtOffline: eventData?.collectPymtOffline || "",
          collectPymtOnline:
            eventData?.collectPymtOnline === "N" &&
            eventData?.collectPymtOffline === "N"
              ? "X"
              : eventData?.collectPymtOnline || "Y",
          // collectPymtOnline: "Y",

          eventRegFeeCurrency: countryData?.country_currency,
          eventRegfee: eventData?.eventRegfee || "",
          eventStatus: eventData?.eventStatus || "DRT",
          eventStartdate:
            (eventData?.eventStartdate &&
              // date.getTimezoneOffset()
              new Date(eventData?.eventStartdate)) ||
            undefined,
          eventEnddate:
            (eventData?.eventEnddate && new Date(eventData?.eventEnddate)) ||
            undefined,
          eventRegLastdate:
            (eventData?.eventRegLastdate &&
              new Date(eventData?.eventRegLastdate)) ||
            undefined,
          eventRegStartdate:
            (eventData?.eventRegStartdate &&
              new Date(eventData?.eventRegStartdate)) ||
            undefined,
          eventContacts: eventData?.eventContacts
            ? JSON.parse(eventData.eventContacts)
            : [contactObj],
          saveAndProceed: true,
        }}
        enableReinitialize={true}
        validationSchema={getEventCreateYupSchemaFormOne(yup)}
        onSubmit={({ saveAndProceed, ...values }) => {
          if (values.collectPymtOnline === "Y") {
            values.collectPymtOffline = "N";
          } else {
            values.collectPymtOffline = "Y";
          }

          if (values.collectPymtOnline === "X") {
            values.collectPymtOnline = "N";
            values.collectPymtOffline = "N";
          }

          const descContentState = values.eventDesc.getCurrentContent();
          const eventDesc = JSON.stringify(convertToRaw(descContentState));
          const rulesContentState =
            values.standardEventRules.getCurrentContent();
          const standardEventRules = JSON.stringify(
            convertToRaw(rulesContentState)
          );
          // const indemnityClauseContentState =
          //   values.indemnityClause.getCurrentContent();
          // const indemnityClause = JSON.stringify(
          //   convertToRaw(indemnityClauseContentState)
          // );
          values?.eventContacts.forEach((contact) => {
            contact["name"] = contact["name"].trim();
            contact["email"] = contact["email"].trim();
            contact["phone_number"] = formatPhoneNumberIntl(
              contact["phone_number"]
            );
            if (contact["whatsspp_number"]) {
              contact["whatsspp_number"] = formatPhoneNumberIntl(
                contact["whatsapp_number"]
              );
            }
          });
          // let eventCategoryId;
          // if (values?.eventCategoryId?.includes(",")) {
          //   eventCategoryId = +values?.eventCategoryId?.split(",")[0];
          // }
          // if (values.eventCategoryId?.includes(",")) {
          //   values.eventCategoryId = values.eventCategoryId?.split(",")[0];
          // }
          const eventCategoryId = +values.eventCategoryId;
          const eventRegfee = +values.eventRegfee;

          // createMutate(
          //   {
          //     ...values,
          //     eventDesc,
          //     standardEventRules,
          //     eventCategoryId,
          //     eventRegfee,
          //     companyId,
          //     userId: userId,
          //   },
          //   {
          //     onSuccess: (response) => {
          //       nextStep();
          //       setEventId(response?.message?.substr(15, 36));
          //       // console.log(response?.message?.substr(15, 36), "yes");
          //     },

          //     // onSuccess: console.log("yes"),
          //   },
          //   {
          //     onError: "error occurs",
          //   }
          // );

          // updateMutate(
          //   {
          //     ...values,
          //     eventDesc,
          //     standardEventRules,
          //     eventCategoryId,
          //     eventRegfee,
          //     companyId,
          //     userId: userId,
          //     eventId: eventData?.eventId,
          //     parentEventId: eventData?.parentEventId,
          //   },
          //   {
          //     onSuccess: () => {
          //       toast({
          //         title: `Your event "${eventData.eventName}" has been Edited`,
          //         position: "top",
          //         status: "success",
          //         duration: 8000,
          //         isClosable: true,
          //       });
          //     },

          //     // onSuccess: console.log("yes"),
          //   }
          // );

          if (!eventData?.eventId) {
            createMutate(
              {
                ...values,
                eventDesc,
                standardEventRules,
                // indemnityClause,
                eventCategoryId,
                eventRegfee,
                companyId,
                userId: userId,
                profileImage,
                coverImage,
              },
              {
                onSuccess: (response) => {
                  if (saveAndProceed) {
                    nextStep();
                    setEventId(response?.message?.substr(15, 36));
                    // console.log(response, "yes");
                  } else {
                    router.back();
                  }
                },

                // onSuccess: console.log("yes"),
              },
              {
                onError: "error occurs",
              }
            );
          } else {
            updateMutate(
              {
                ...values,
                eventDesc,
                standardEventRules,
                // indemnityClause,
                eventCategoryId,
                eventRegfee,
                companyId,
                userId: userId,
                eventId: eventData?.eventId,
                parentEventId: eventData?.parentEventId,
                profileImage,
                coverImage,
              },
              {
                onSuccess: () => {
                  // toast({
                  //   title: `Your event "${eventData.eventName}" has been Edited`,
                  //   position: "top",
                  //   status: "success",
                  //   duration: 8000,
                  //   isClosable: true,
                  // });
                  if (saveAndProceed) {
                    nextStep();
                  } else {
                    router.back();
                  }
                },
                // onSuccess: console.log("yes"),
              }
            );
            // console.log("edit");
          }
          // console.log(values, "values onsub,it");
        }}
      >
        {(formik) => (
          <Form>
            <VStack
              p={{ base: "2", md: "2", lg: "5" }}
              bg="white"
              gap={5}
              mt={30}
            >
              <FieldLayout label=" Event Name">
                <TextBoxWithValidation
                  name="eventName"
                  placeholder="Enter your Event Name"
                  fontSize="sm"
                />
              </FieldLayout>
              <FieldLayout label="Event Category">
                <SelectWithValidation
                  name="eventCategoryId"
                  placeholder="Select Event Category"
                  //   placeholder={eventData ? null : "Select Category"}
                  // onChange={() => removeData?.remove(indexArray)}
                  //   disabled={formik?.values?.sports_list?.length > 0 && true}
                >
                  {categories?.map((category) => (
                    <option
                      key={category["category_id"]}
                      // value={`${category["category_id"]},${category["category_type"]}`}
                      value={`${category["category_id"]}`}
                    >
                      {category["category_name"]}
                    </option>
                  ))}
                </SelectWithValidation>
              </FieldLayout>
              <FieldLayout label="Event Type">
                <Field name="isPublicEvent">
                  {({ field }) => (
                    <RadioGroup {...field}>
                      <Stack spacing={5} direction="row">
                        <Radio
                          borderColor="primary.500"
                          colorScheme="primary"
                          {...field}
                          value="Y"
                        >
                          <TextSmall>
                            Public (Registration Open for Public)
                          </TextSmall>
                        </Radio>
                        <Radio
                          borderColor="primary.500"
                          colorScheme="primary"
                          {...field}
                          value="N"
                        >
                          <TextSmall>
                            Private (Registration only by Invitation)
                          </TextSmall>
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  )}
                </Field>
              </FieldLayout>
              <FieldLayout label="Description">
                <EventDraftEditor
                  formik={formik}
                  name="eventDesc"
                  placeholder="Description"
                />
              </FieldLayout>
              <FieldLayout label="Event Start Date">
                {/* <Flex gap={4}> */}
                {/* <Box> */}
                <DatePicker
                  name="eventStartdate"
                  placeholderText="From"
                  showTimeSelect
                  dateFormat="MM/dd/yyyy h:mm aa"
                  value={formik.values.eventStartdate}
                  onChange={(value) => {
                    const isPrevious = value < new Date();
                    if (isPrevious) {
                      onOpenstart();
                    }
                  }}
                />
                <AlertDialog
                  isOpen={isOpenstart}
                  leastDestructiveRef={cancelRef}
                  onClose={onClosestart}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Alert
                      </AlertDialogHeader>

                      <AlertDialogBody>
                        A past date has been selected for Events Start date.
                        Please confirm to continue
                      </AlertDialogBody>
                      <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClosestart}>
                          Ok
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </FieldLayout>
              <FieldLayout label="Event End Date">
                <DatePicker
                  name="eventEnddate"
                  placeholderText="To"
                  showTimeSelect
                  dateFormat="MM/dd/yyyy h:mm aa"
                  // disabled={eventData && true}
                />
              </FieldLayout>

              <FieldLayout label="Event Registration Start Date">
                <DatePicker
                  name="eventRegStartdate"
                  placeholderText="Start"
                  showTimeSelect
                  dateFormat="MM/dd/yyyy h:mm aa"
                  value={formik.values.eventRegStartdate}
                  onChange={(value) => {
                    const isPrevious = value < new Date();

                    if (isPrevious) {
                      onOpenreg();
                    }
                  }}
                />
                <AlertDialog
                  isOpen={isOpenreg}
                  leastDestructiveRef={cancelRef}
                  onClose={onClosereg}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Alert
                      </AlertDialogHeader>

                      <AlertDialogBody>
                        A past date has been selected for Events Registration
                        Start date. Please confirm to continue
                      </AlertDialogBody>

                      <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClosereg}>
                          Ok
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </FieldLayout>
              <FieldLayout label="Event Registration End Date">
                <DatePicker
                  name="eventRegLastdate"
                  placeholderText="End"
                  //   value={formik.values.event_reg_lastdate}
                  showTimeSelect
                  dateFormat="MM/dd/yyyy h:mm aa"
                />
              </FieldLayout>
              <FieldLayout label="Registration Fee">
                <Field name="collectPymtOnline">
                  {({ field }) => (
                    <RadioGroup {...field}>
                      <Stack spacing={5} direction="row">
                        <Radio
                          borderColor="primary.500"
                          colorScheme="primary"
                          {...field}
                          // onChange={(e) => {
                          //   field.onChange(e);
                          //   formik.setFieldValue("virtual_venue_url", "");
                          // }}
                          value="Y"
                        >
                          <TextSmall>Online</TextSmall>
                        </Radio>
                        <Radio
                          borderColor="primary.500"
                          colorScheme="primary"
                          {...field}
                          value="N"
                        >
                          <TextSmall>Offline</TextSmall>
                        </Radio>
                        <Radio
                          borderColor="primary.500"
                          colorScheme="primary"
                          {...field}
                          onChange={(e) => {
                            formik.setFieldValue("eventRegfee", "");
                            field.onChange(e);
                          }}
                          value="X"
                        >
                          <TextSmall>No Payment</TextSmall>
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  )}
                </Field>
              </FieldLayout>

              <FieldLayout label="Event Registration Fee">
                <HStack align="self-start" w="full">
                  {/* <FormControl isInvalid={touched.reg_fee && errors.reg_fee}> */}
                  <FormControl
                    isInvalid={
                      formik.touched?.eventRegfee && formik.errors?.eventRegfee
                    }
                  >
                    <NumberInput
                      // defaultValue={values.reg_fee}
                      value={formik.values.eventRegfee}
                      onChange={(value) =>
                        formik.setFieldValue("eventRegfee", value)
                      }
                      onBlur={() => formik.setFieldTouched("eventRegfee", true)}
                      isDisabled={formik.values.collectPymtOnline === "X"}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>
                      {formik.errors?.eventRegfee}
                    </FormErrorMessage>
                  </FormControl>
                  {/* <SelectWithValidation
                    name="eventRegFeeCurrency"
                    // placeholder="select category"
                  >
                    <option selected hidden disabled value=""></option>
                    <option value="INR">INR</option>
                    <option value="SGD">SGD</option>
                  </SelectWithValidation> */}
                  <TextBoxWithValidation
                    name="eventRegFeeCurrency"
                    disabled
                    // maxW="150px"
                  />
                </HStack>
              </FieldLayout>

              <FieldLayout label="Contact Details">
                <Box
                  bg="#ffffff"
                  p={4}
                  w="full"
                  gap="3"
                  border="1px solid #e6ecf5"
                  borderRadius="5px"
                  direction={{ base: "column", md: "row" }}
                >
                  <VStack align="self-start">
                    <FieldArray
                      name="eventContacts"
                      render={(arrayHelper) => (
                        <>
                          {formik?.values?.eventContacts?.map(
                            (details, index) => (
                              <HStack key={index} align="stretch">
                                <TextBoxWithValidation
                                  name={`eventContacts[${index}].name`}
                                  placeholder="Name"
                                />
                                <TextBoxWithValidation
                                  name={`eventContacts[${index}].email`}
                                  placeholder="Email"
                                />
                                <PhoneNumberInput
                                  name={`eventContacts[${index}].phone_number`}
                                  placeholder="Phone / Mobile Number"
                                />
                                <PhoneNumberInput
                                  name={`eventContacts[${index}].whatsapp_number`}
                                  placeholder="Whatsapp Number"
                                />
                                {/* <TextBoxWithValidation
                                  name={`eventContacts[${index}].phone_number`}
                                  placeholder="Phone Number"
                                /> */}
                                {/* <TextBoxWithValidation
                                  name={`eventContacts[${index}].whatsapp_number`}
                                  placeholder="Whatsapp Number"
                                /> */}
                                <DeletePopover
                                  title="Delete Document"
                                  trigger={
                                    <IconButton
                                      size="md"
                                      icon={<DeleteIcon fontSize="18px" />}
                                      colorScheme="primary"
                                      tooltipLabel="Delete Contact"
                                      disabled={
                                        formik.values.eventContacts?.length ===
                                        1
                                      }
                                    />
                                  }
                                  handleDelete={() => arrayHelper.remove(index)}
                                >
                                  <TextSmall>
                                    Are you sure you want to delete this Field?
                                  </TextSmall>
                                </DeletePopover>
                              </HStack>
                            )
                          )}
                          <Button
                            pt={5}
                            variant="link"
                            colorScheme="primary"
                            fontWeight="normal"
                            onClick={() => {
                              arrayHelper.push(contactObj);
                            }}
                            // disabled={
                            //   formik.values.event_contacts?.length > 0
                            // }
                          >
                            + Add Another
                          </Button>
                        </>
                      )}
                    ></FieldArray>
                  </VStack>
                </Box>
              </FieldLayout>
              <FieldLayout label="Event Rules">
                <EventDraftEditor
                  formik={formik}
                  name="standardEventRules"
                  placeholder="Event Rules"
                />
              </FieldLayout>
              {/* <FieldLayout label="Indemnity Form">
                <Flex gap={2}>
                  <Button colorScheme="blue" variant="link" onClick={onOpen}>
                    Indemnity Form
                  </Button>
                  {eventData?.eventId || publish > 0 ? (
                    <MdVerified size={20} color="green" />
                  ) : null}
                </Flex>
                <EventIndemnityForm
                  isOpen={isOpen}
                  onClose={onClose}
                  setPublish={setPublish}
                  formik={formik}
                />
              </FieldLayout> */}
              <Flex
                direction={{ base: "column", md: "row" }}
                w="full"
                justify="flex-end"
                gap={{ base: "5", md: "2", sm: "1", lg: "5" }}
                // bg="red"
                pt={10}
              >
                <Button
                  colorScheme="primary"
                  // onClick={() => {
                  //   formik.setFieldValue("eventStatus", "DRT");
                  //   setStatus("DRT");
                  // }
                  type="submit"
                  // onClick={() => {
                  //   formik.setFieldValue("saveAndProceed", true);
                  //   formik.handleSubmit();
                  // }}
                  isLoading={
                    formik.values.eventStatus === "DRT" &&
                    (createLoading || updateLoading)
                  }
                  // type="submit"
                  // onClick={() => {
                  //   setStatus("PUB");
                  // }}
                  // onClick={() => {
                  //   formik.setFieldValue("event_status", "PUB");
                  //   setStatus("PUB");
                  // }}
                  // isLoading={
                  //   formik.values.event_status === "PUB" &&
                  //   (createLoading || updateLoading)
                  // }

                  // disabled={!formik?.values?.sports_list?.length > 0 && true}
                >
                  Save & Proceed
                </Button>
                {!isTypeEdit && (
                  <Button
                    colorScheme="primary"
                    onClick={() => {
                      formik.setFieldValue("saveAndProceed", false);
                      formik.handleSubmit();
                    }}
                    // type="submit"
                    isLoading={
                      formik.values.eventStatus === "DRT" &&
                      (createLoading || updateLoading)
                    }
                  >
                    Save as Draft
                  </Button>
                )}

                {!eventData ? (
                  <Button
                    variant="outline"
                    // onClick={() => router.back()}
                    onClick={() => router.push(`/page/${companyId}?tab=events`)}
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={
                      () => router.back()
                      // router.push(`/page/${pageId}?tab=events`)
                    }
                  >
                    Cancel
                  </Button>
                )}
                {eventData?.eventId && (
                  <Button variant="outline" onClick={nextStep}>
                    Next
                  </Button>
                )}
                {/* <Button colorScheme="red" onClick={nextStep}>
                  Next
                </Button> */}
              </Flex>
            </VStack>
          </Form>
        )}
      </Formik>
    );
}

export default EventCreateFormOne;
