import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Divider,
  Flex,
  HStack,
  IconButton,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Field, FieldArray, Form, Formik } from "formik";
import React, { useState } from "react";
import { useCategoriesByType } from "../../../hooks/category-hooks";
import DatePicker from "../../ui/pickers/date-picker";
import SelectWithValidation from "../../ui/select/select-with-validation";
import { TextSmall, TextXtraSmall } from "../../ui/text/text";
import TextAreaWithValidation from "../../ui/textbox/textarea-with-validation";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import { useUpdateEvent } from "../../../hooks/event-hook";

import * as yup from "yup";
import { useRouter } from "next/router";
import {
  ContentState,
  convertFromRaw,
  convertToRaw,
  EditorState,
} from "draft-js";
// import {
//   getDraftCreateYupSchema,
//   getEditAboutEventYupSchema,
//   getEventCreateYupSchema,
// } from "../../../helper/constants/event-constants";
import LabelValuePair from "../../ui/label-value-pair";
import { useCountries } from "../../../hooks/country-hooks";
import CustomFormLabel from "../../ui/form/form-label";
import FieldLayout from "../../user/profile-section/user-profile-edit/field-layout";
import { HeadingMedium } from "../../ui/heading/heading";
import { useToast } from "@chakra-ui/react";
import EventSportListView from "./event-sport-list-view";
import { ArrowLeftIcon, DeleteIcon } from "../../ui/icons";
import EventDraftEditor from "../page-event/event-draft-editor";
import { values } from "draft-js/lib/DefaultDraftBlockRenderMap";
import DeletePopover from "../../ui/popover/delete-popover";
import Modal from "../../ui/modal";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

const PageEventAboutEdit = ({ currentEvent, eventData }) => {
  const { data: categories = [] } = useCategoriesByType("EVT");
  const router = useRouter();
  const { eventId } = router.query;
  const toast = useToast();
  const [mode, setMode] = useState(false);
  const [mode1, setMode1] = useState(true);
  // console.log(eventData, "event data from edit");
  const { mutate, isLoading } = useUpdateEvent();
  const { data: countriesData = [] } = useCountries();
  let address = eventData?.event_venue_other;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenreg,
    onOpen: onOpenreg,
    onClose: onClosereg,
  } = useDisclosure();
  const cancelRef = React.useRef();

  const streamObj = {
    url: "",
    description: "",
  };

  if (eventData) {
    let descContentState;
    try {
      descContentState = convertFromRaw(JSON.parse(eventData.event_desc));
    } catch (e) {
      descContentState = ContentState.createFromText(eventData.event_desc);
    }

    let rulesContentState;
    try {
      rulesContentState = convertFromRaw(JSON.parse(eventData.event_rules));
    } catch (e) {
      rulesContentState = ContentState.createFromText(eventData.event_rules);
    }

    return (
      <>
        <Formik
          initialValues={{
            event_name: eventData?.event_name,
            event_desc: EditorState.createWithContent(descContentState),
            // stream_url: (eventData?.stream_url && {
            //   ...eventData?.stream_url,
            // }) || {
            //   url: "",
            //   description: "",
            // },
            stream_url:
              eventData?.stream_url?.length === 0
                ? [streamObj]
                : eventData?.stream_url || [streamObj],

            event_startdate:
              (eventData?.event_startdate &&
                new Date(eventData.event_startdate)) ||
              undefined,
            event_enddate:
              (eventData?.event_enddate && new Date(eventData.event_enddate)) ||
              undefined,
            event_reg_startdate:
              (eventData?.event_reg_startdate &&
                new Date(eventData.event_reg_startdate)) ||
              undefined,
            event_reg_lastdate:
              (eventData?.event_reg_lastdate &&
                new Date(eventData.event_reg_lastdate)) ||
              undefined,
            event_status: eventData?.event_status,
            event_rules: EditorState.createWithContent(rulesContentState),
            // event_venue_other: null,
            // virtual_venue_url: null,
            event_venue_other: (eventData?.event_venue_other && {
              ...eventData?.event_venue_other,
            }) || {
              line1: "",
              line2: "",
              pincode: "",
              country: "",
              state: "",
              city: "",
            },
            virtual_venue_url: eventData?.virtual_venue_url,
            event_banner: eventData?.event_banner,
            event_logo: eventData?.event_logo,
            event_category: eventData?.event_category_refid,
            venue_type: eventData?.virtual_venue_url ? "VIR" : "VEN",
          }}
          // validationSchema={getEditAboutEventYupSchema(yup)}
          onSubmit={(values) => {
            const event_id = eventId;
            const parent_event_id = eventData.parent_event_id;
            const sports_list = eventData?.sport_list;
            const company_id = eventData.company.company_id;
            const descContentState = values.event_desc.getCurrentContent();
            const event_desc = convertToRaw(descContentState);
            const rulesContentState = values.event_rules.getCurrentContent();
            const event_rules = convertToRaw(rulesContentState);
            const stream_url = values.stream_url?.filter(
              (stream) => stream?.url
            );
            mutate(
              {
                ...values,
                event_id,
                company_id,
                parent_event_id,
                // event_category,
                sports_list,
                event_desc,
                event_rules,
                stream_url,
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
          {(formik) => (
            <Box>
              <HStack w="full" justify="space-between">
                <HeadingMedium>Edit Event</HeadingMedium>
                <Button
                  variant="link"
                  leftIcon={<ArrowLeftIcon />}
                  onClick={() => router.back()}
                >
                  Back
                </Button>
              </HStack>

              <Box bg="white" mt={4} p={6} borderRadius="xl">
                <VStack
                  align="stretch"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  p={6}
                  spacing={5}
                >
                  <Form>
                    <VStack gap={5}>
                      <FieldLayout label="Event Name">
                        <TextBoxWithValidation
                          name="event_name"
                          placeholder="Enter your Event Name"
                        />
                      </FieldLayout>
                      <FieldLayout label="Event Category">
                        <SelectWithValidation
                          name="event_category"
                          placeholder="Select Category"
                          isDisabled
                        >
                          {categories?.map((category) => (
                            <option
                              key={category["category_id"]}
                              value={category["category_id"]}
                            >
                              {category["category_name"]}
                            </option>
                          ))}
                        </SelectWithValidation>
                      </FieldLayout>
                      <FieldLayout label="Date of the Event">
                        <DatePicker
                          name="event_startdate"
                          placeholderText="From"
                          value={formik.values.event_startdate}
                          onChange={(value) => {
                            const isPrevious = value < new Date();

                            if (isPrevious) {
                              onOpen();
                            }
                          }}
                          showTimeSelect
                          dateFormat="MM-dd-yyyy h:mm aa"
                        />

                        <AlertDialog
                          isOpen={isOpen}
                          leastDestructiveRef={cancelRef}
                          onClose={onClose}
                        >
                          <AlertDialogOverlay>
                            <AlertDialogContent>
                              <AlertDialogHeader
                                fontSize="lg"
                                fontWeight="bold"
                              >
                                Alert
                              </AlertDialogHeader>

                              <AlertDialogBody>
                                A past date has been selected for Events Start
                                date. Please confirm to continue
                              </AlertDialogBody>

                              <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={onClose}>
                                  Ok
                                </Button>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialogOverlay>
                        </AlertDialog>

                        <DatePicker
                          name="event_enddate"
                          placeholderText="To"
                          value={formik.values.event_enddate}
                          // onChange={(e) => {
                          //   formik.handleChange(e);
                          // }}
                          showTimeSelect
                          dateFormat="MM-dd-yyyy h:mm aa"
                        />
                      </FieldLayout>

                      <FieldLayout label="Event Registration Dates">
                        <DatePicker
                          name="event_reg_startdate"
                          placeholderText="Start"
                          showTimeSelect
                          dateFormat="MM/dd/yyyy h:mm aa"
                          value={formik.values.event_reg_startdate}
                          // onChange={(e) => {
                          //   formik.handleChange(e);
                          // }}
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
                              <AlertDialogHeader
                                fontSize="lg"
                                fontWeight="bold"
                              >
                                Alert
                              </AlertDialogHeader>

                              <AlertDialogBody>
                                A past date has been selected for Events
                                Registration Start date. Please confirm to
                                continue
                              </AlertDialogBody>

                              <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={onClosereg}>
                                  Ok
                                </Button>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialogOverlay>
                        </AlertDialog>

                        <DatePicker
                          name="event_reg_lastdate"
                          placeholderText="End"
                          value={formik.values.event_reg_lastdate}
                          showTimeSelect
                          dateFormat="MM/dd/yyyy h:mm aa"
                          // onChange={(e) => {
                          //   formik.handleChange(e);
                          // }}
                        />
                      </FieldLayout>
                      <Field name="venue_type">
                        {({ field }) => (
                          <>
                            {formik?.values?.venue_type === "VIR" ? (
                              <FieldLayout label="Virtual url">
                                {formik.values.venue_type === "VIR" ? (
                                  <TextBoxWithValidation
                                    name="virtual_venue_url"
                                    placeholder="Enter your Virtual Id"
                                  />
                                ) : null}
                              </FieldLayout>
                            ) : (
                              // <Box>
                              //   <Radio
                              //     borderColor="primary.500"
                              //     colorScheme="primary"
                              //     {...field}
                              //     onChange={(e) => {
                              //       field.onChange(e);
                              //       formik.setFieldValue(
                              //         "virtual_venue_url",
                              //         ""
                              //       );
                              //     }}
                              //     value="VEN"
                              //   >
                              //     <TextSmall
                              //       fontWeight="bold"
                              //       color="primary.600"
                              //     >
                              //       Venue
                              //     </TextSmall>
                              //   </Radio>
                              // </Box>
                              // <CustomFormLabel>Venue Address</CustomFormLabel>
                              <FieldLayout label="Venue Address">
                                {formik.values.venue_type === "VEN" ? (
                                  <VStack
                                    alignItems="flex-start"
                                    width="full"
                                    spacing={6}
                                  >
                                    {address && address?.line1 && (
                                      <TextBoxWithValidation
                                        name="event_venue_other.line1"
                                        placeholder="Name of the venue"
                                      />
                                    )}

                                    {address && address?.line2 && (
                                      <TextBoxWithValidation
                                        name="event_venue_other.line2"
                                        placeholder="Address Line 2"
                                      />
                                    )}
                                    {address && address?.pincode && (
                                      <TextBoxWithValidation
                                        name="event_venue_other.pincode"
                                        placeholder="Pincode"
                                      />
                                    )}
                                    {address && address?.city && (
                                      <TextBoxWithValidation
                                        name="event_venue_other.city"
                                        placeholder="City / Town"
                                      />
                                    )}
                                    {address && address?.country && (
                                      <SelectWithValidation
                                        placeholder="Select Country"
                                        name="event_venue_other.country"
                                      >
                                        {countriesData?.map((country) => (
                                          <option
                                            key={country["country_code"]}
                                            value={country["country_code"]}
                                          >
                                            {country["country_name"]}
                                          </option>
                                        ))}
                                      </SelectWithValidation>
                                    )}
                                    {address && address?.state && (
                                      <SelectWithValidation
                                        placeholder="Select State"
                                        name="event_venue_other.state"
                                      >
                                        {formik?.values?.event_venue_other
                                          ?.country ? (
                                          countriesData
                                            ?.find(
                                              (country) =>
                                                country["country_code"] ===
                                                formik?.values
                                                  ?.event_venue_other.country
                                            )
                                            ?.["country_states"]?.map(
                                              (state) => (
                                                <option
                                                  key={state["state_code"]}
                                                  value={state["state_code"]}
                                                >
                                                  {state["state_name"]}
                                                </option>
                                              )
                                            )
                                        ) : (
                                          <option>
                                            Please select a country
                                          </option>
                                        )}
                                      </SelectWithValidation>
                                    )}
                                  </VStack>
                                ) : null}
                              </FieldLayout>
                            )}
                          </>
                        )}
                      </Field>
                      <FieldLayout label="Description">
                        <EventDraftEditor
                          formik={formik}
                          name="event_desc"
                          placeholder="Description"
                        />
                      </FieldLayout>
                      <FieldLayout label="Terms and Conditions">
                        <EventDraftEditor
                          formik={formik}
                          name="event_rules"
                          placeholder="Terms and Conditions"
                        />
                      </FieldLayout>
                      <FieldLayout label="Live Stream Url">
                        <VStack align="self-start" w="full">
                          <FieldArray
                            name="stream_url"
                            render={(arrayHelper) => (
                              <>
                                {formik?.values?.stream_url?.map(
                                  (url, index) => (
                                    <VStack key={index} w="full">
                                      <HStack w="full">
                                        <TextBoxWithValidation
                                          name={`stream_url[${index}].url`}
                                          placeholder="Stream url"
                                        />

                                        <DeletePopover
                                          title="Delete Document"
                                          trigger={
                                            <IconButton
                                              size="md"
                                              icon={
                                                <DeleteIcon fontSize="18px" />
                                              }
                                              colorScheme="primary"
                                              tooltipLabel="Delete Document"
                                              disabled={
                                                formik.values.stream_url
                                                  ?.length === 1
                                              }
                                            />
                                          }
                                          handleDelete={() =>
                                            arrayHelper.remove(index)
                                          }
                                        >
                                          <TextSmall>
                                            Are you sure you want to delete this
                                            Field?
                                          </TextSmall>
                                        </DeletePopover>
                                      </HStack>
                                      <TextAreaWithValidation
                                        name={`stream_url[${index}].description`}
                                        placeholder="Description should be below 80
                                        characters"
                                        // inputProps={{ maxLength: 12 }}
                                        maxLength={81}
                                      />
                                      {formik?.values?.stream_url[index]
                                        ?.description?.length === 81 && (
                                        <Text color="red.500">
                                          Description should be below 80
                                          characters
                                        </Text>
                                      )}
                                    </VStack>
                                  )
                                )}
                                <Button
                                  variant="link"
                                  colorScheme="primary"
                                  fontWeight="normal"
                                  onClick={() => {
                                    arrayHelper.push(streamObj);
                                  }}
                                >
                                  + Add Another
                                </Button>
                              </>
                            )}
                          />
                        </VStack>
                      </FieldLayout>
                      {/* <Button
                    variant="outline"
                    colorScheme="primary"
                    borderRadius={4}
                    onClick={() => setShowText(false)}
                  >
                    Cancel
                  </Button> */}
                    </VStack>
                    <Button
                      colorScheme="primary"
                      type="submit"
                      borderRadius={4}
                    >
                      Save
                    </Button>
                  </Form>
                  <Divider borderColor="gray.300" />
                  <EventSportListView
                    eventData={eventData}
                    currentEvent={currentEvent}
                    type="private"
                    aboutformik={formik}
                    // setShowText={setShowText}
                  />
                </VStack>
              </Box>
            </Box>
          )}
        </Formik>
      </>
    );
  }

  return <></>;
};

export default PageEventAboutEdit;
