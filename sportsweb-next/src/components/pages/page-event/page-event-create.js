import {
  Avatar,
  Box,
  Circle,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  Image,
  Input,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
  VStack,
  Spacer,
  useBreakpointValue,
  AccordionPanel,
  Link,
} from "@chakra-ui/react";

import React, { useRef, useState } from "react";

import { HeadingMedium } from "../../ui/heading/heading";
import { TextMedium, TextSmall } from "../../ui/text/text";
import DatePicker from "../../ui/pickers/date-picker";
import { useRouter } from "next/router";

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import Modal from "../../ui/modal";
import { BellIcon, DeleteIcon, EditIcon } from "../../ui/icons";

import * as yup from "yup";
import SelectWithValidation from "../../ui/select/select-with-validation";
import PageEventSportsSelect from "./page-event-sports-select";
import { Field, FieldArray, Form, Formik, useFormikContext } from "formik";
import PageLayout from "../../layout/page-layout/page-layout";
import {
  useEventById,
  useEventPrize,
  useUpdateEvent,
} from "../../../hooks/event-hook";
import { useCreateEvent } from "../../../hooks/event-hook";
import { useCategoriesByType } from "../../../hooks/category-hooks";
import { useSports } from "../../../hooks/sports-hooks";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
// import {
//   getEventCreateYupSchema,
//   getDraftCreateYupSchema,
// } from "../../../helper/constants/event-constants";
import TextAreaWithValidation from "../../ui/textbox/textarea-with-validation";
import EventSportlistDeleteModal from "./event-sport-list-delete-modal";
import LabelValuePair from "../../ui/label-value-pair";
import { useCountries } from "../../../hooks/country-hooks";
import {
  convertToRaw,
  convertFromRaw,
  EditorState,
  AtomicBlockUtils,
  ContentState,
} from "draft-js";
import EventFeedEditor from "./event-feed-editor";
import Editor from "@draft-js-plugins/editor";
import "draft-js/dist/Draft.css";
import createToolbarPlugin, {
  Separator,
} from "@draft-js-plugins/static-toolbar";
import "@draft-js-plugins/static-toolbar/lib/plugin.css";
import "@draft-js-plugins/image/lib/plugin.css";
import editorStyles from "../../common/article/static-toolbar-editor.module.css";
import IconButton from "../../ui/icon-button";
import LabelText from "../../ui/text/label-text";
import Button from "../../ui/button";
import CoverImageHandler from "../../common/image-crop-functions/crop-pic-mutate";
import { update } from "draft-js/lib/DefaultDraftBlockRenderMap";
import FieldLayout from "../../user/profile-section/user-profile-edit/field-layout";

import DeletePopover from "../../ui/popover/delete-popover";
import { Accordion, AccordionButton, AccordionItem } from "../../ui/accordion";

import helper from "../../../helper/helper";
import { now } from "next-auth/client/_utils";

import { from } from "form-data";
import EventDraftEditor from "./event-draft-editor";
import CoverImage from "../../common/cover-image";
import EmptyCoverImage from "../../common/empty-cover-image";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";

function PageEventCreate({ type, Id }) {
  const router = useRouter();
  const { id } = router.query;
  const { data: eventData, isLoading } = useEventById(id);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: publishIsOpen,
    onOpen: publishOnOpen,
    onClose: publishOnClose,
  } = useDisclosure();

  const iconButtonSize = useBreakpointValue({ base: "sm", md: "md" });
  const { data: categories = [], isLoading: isCatLoading } =
    useCategoriesByType("EVT");
  const { data: sports = [] } = useSports();
  const { data: countriesData = [] } = useCountries();
  const { data: docType = [] } = useLookupTable("EDT");
  const { data: prizeData = [] } = useEventPrize("PRZ");
  const { mutate: createMutate, isLoading: createLoading } = useCreateEvent();
  const { mutate: updateMutate, isLoading: updateLoading } = useUpdateEvent();
  const [coverImage, setCoverImage] = useState(null);
  const [sportMode, setSportMode] = useState("view");
  const [currentSport, setCurrentSport] = useState(null);
  const [cropped, setCropped] = useState(null);
  const [status, setStatus] = useState("");
  const [isdelete, setIsDelete] = useState();

  const [currentIndex, setCurrentIndex] = useState();
  // const time = moment("start_time").format();HE
  // console.log(time, "monent time formated");
  const profilePicRef = useRef();
  const coverPicRef = useRef();

  const eventCategoryId = categories?.find(
    ({ category_name }) => eventData?.category_name === category_name
  )?.category_id;
  const eventCategoryType = categories?.find(
    ({ category_name }) => eventData?.category_name === category_name
  )?.category_type;

  const datenew = new Date(eventData?.event_startdate);

  const getContentState = (value) => {
    let contentState;
    try {
      contentState = convertFromRaw(JSON.parse(value));
    } catch (e) {
      contentState = ContentState.createFromText(value);
    }
    return contentState;
  };

  const defaultDescContent = eventData?.event_desc
    ? getContentState(eventData.event_desc)
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

  const defaultRulesContent = eventData?.event_rules
    ? getContentState(eventData.event_rules)
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

  if (isLoading || isCatLoading) return <Skeleton>Loading..</Skeleton>;
  else
    return (
      <Formik
        initialValues={{
          event_name: eventData?.event_name || "",
          event_desc: EditorState.createWithContent(defaultDescContent),
          event_startdate:
            (eventData?.event_startdate &&
              // date.getTimezoneOffset()
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
          event_status: eventData?.event_status || "",
          sports_list:
            eventData?.sport_list?.filter((s) => s["sport_id"]) || [],
          event_rules: EditorState.createWithContent(defaultRulesContent),
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
          // start_date = helper.getJSDateObject(start_date)
          virtual_venue_url: eventData?.virtual_venue_url || "",
          event_banner: eventData?.event_banner || null,
          event_logo: eventData?.event_logo || null,
          event_category: eventData?.event_category_refid
            ? `${eventData.event_category_refid},${eventCategoryType}`
            : "",
          venue_type: eventData?.virtual_venue_url ? "VIR" : "VEN",
        }}
        // validationSchema={
        //   status === "PUB"
        //     ? getEventCreateYupSchema(yup)
        //     : getDraftCreateYupSchema(yup)
        // }
        onSubmit={({ venue_type, ...values }) => {
          let event_venue_other, virtual_venue_url;
          if (venue_type === "VEN") {
            event_venue_other = values.event_venue_other;
            virtual_venue_url = null;
          } else {
            virtual_venue_url = values.virtual_venue_url;
            event_venue_other = null;
          }

          /*    const sports_list = values.sports_list?.map((sport) => {
            return { ...sport, doc_list: JSON.stringify(sport.doc_list) };
          }); */

          const company_id = id;

          if (values.event_category?.includes(",")) {
            values.event_category = values.event_category?.split(",")[0];
          }

          const event_startdate = values.event_startdate.toISOString();
          const event_enddate = values.event_enddate.toISOString();

          const event_reg_startdate = values.event_reg_startdate.toISOString();
          const event_reg_lastdate = values.event_reg_lastdate.toISOString();

          const descContentState = values.event_desc.getCurrentContent();
          const event_desc = convertToRaw(descContentState);
          const rulesContentState = values.event_rules.getCurrentContent();
          const event_rules = convertToRaw(rulesContentState);
          if (!eventData && values.event_status === "DRT") {
            createMutate(
              {
                ...values,
                company_id,
                /*    sports_list, */
                // event_status: status
                event_venue_other,
                virtual_venue_url,
                event_startdate,
                event_enddate,
                event_reg_startdate,
                event_reg_lastdate,
                event_desc,
                event_rules,
              },
              {
                onSuccess: () => router?.push(`/page/${id}?tab=events`),
              }
            );
          } else if (eventData?.event_id && values.event_status === "DRT") {
            updateMutate(
              {
                // event_name,
                ...values,
                event_id: eventData?.event_id,
                company_id: eventData?.company?.company_id,
                parent_event_id: eventData?.parent_event_id,
                /*     sports_list, */
                event_venue_other,
                virtual_venue_url,
                event_startdate,
                event_enddate,
                event_reg_startdate,
                event_reg_lastdate,
                event_desc,
                event_rules,
              },
              {
                onSuccess: () =>
                  router?.push(
                    `/page/${eventData?.company?.company_id}?tab=events`
                  ),
              }
            );
          } else publishOnOpen();
          // if (eventData) {
          // if (values.event_status === "DRT") {
          //   updateMutate(
          //     {
          //       // event_name,
          //       ...values,
          //       event_id: eventData?.event_id,
          //       company_id: eventData?.company?.company_id,
          //       parent_event_id: eventData?.parent_event_id,
          //       event_venue_other,
          //       virtual_venue_url,
          //     },
          //     {
          //       onSuccess: () =>
          //         router?.push(
          //           `/page/${eventData?.company?.company_id}?tab=events`
          //         ),
          //     }
          //   );
          // } else publishOnOpen();
          // } else {
          // createMutate(
          //   {
          //     ...values,
          //     company_id,
          //     // event_status: status
          //     event_venue_other,
          //     virtual_venue_url,
          //   },
          //   {
          //     onSuccess: () => router?.push(`/page/${id}?tab=events`),
          //   }
          //   );
          // }
        }}
      >
        {(formik) => (
          <VStack align="stretch" spacing={8}>
            <HeadingMedium>Create Event</HeadingMedium>
            <Box
              backgroundColor="white"
              borderTopRadius="10px"
              position="relative"
            >
              {!formik.values.event_banner ? (
                <EmptyCoverImage bgColor={"gray.300"}>
                  Event Banner
                </EmptyCoverImage>
              ) : formik?.values.event_banner instanceof File ? (
                <CoverImage
                  coverimage={URL.createObjectURL(formik.values?.event_banner)}
                />
              ) : (
                <CoverImage coverimage={formik.values?.event_banner} />
              )}

              {/*    <Input
                type="file"
                values={formik.values.event_banner}
                id="event_banner"
                display="none"
                ref={coverPicRef}
                // onChange={formik.handleChange}
                onChange={(e) => {
                  formik.setFieldValue("event_banner", e.target.files[0]);
                  setCoverImage(e.target.files);
                }}
              />
              <IconButton
                aria-label="upload picture"
                variant="solid"
                icon={<EditIcon color="white" fontSize="18px" />}
                tooltipLabel="Edit Event Cover Pic"
                size="sm"
                colorScheme="primary"
                // border="2px solid white"
                position="absolute"
                borderRadius="base"
                top="1px"
                right="0px"
                onClick={() => coverPicRef.current.click()}
              /> */}
              <CoverImageHandler
                type="eventCreate"
                setCoverImage={setCoverImage}
                setFieldValue={formik.setFieldValue}
                coverImage={eventData?.event_banner}
              />

              {/* <IconButton
                  aria-label="upload picture"
                  icon={<EditIcon color="white" />}
                  tooltipLabel
                  isRound
                  size="xs"
                  colorScheme="primary"
                  border="2px solid white"
                  position="absolute"
                  top="10px"
                  right="10px"
                  onClick={() => coverPicRef.current.click()}
                /> */}

              <Flex justifyContent={"flex-start"} mt={-12} py={3} px={10}>
                <HStack>
                  {!formik.values.event_logo ? (
                    <Circle
                      size="24"
                      name="event_logo"
                      bg="gray.600"
                      color="white"
                      mt={-12}
                    >
                      <TextSmall>LOGO</TextSmall>
                    </Circle>
                  ) : formik?.values.event_logo instanceof File ? (
                    <Avatar
                      size={"xl"}
                      name="event_logo"
                      alt="event profile image"
                      src={URL?.createObjectURL(formik.values?.event_logo)}
                      mt={-12}
                    />
                  ) : (
                    <Avatar
                      size={"xl"}
                      name="event_logo"
                      alt="logo"
                      src={formik.values?.event_logo}
                      mt={-14}
                    />
                  )}
                  <Input
                    type="file"
                    id="event_logo"
                    display="none"
                    ref={profilePicRef}
                    onChange={(e) => {
                      formik.setFieldValue("event_logo", e.target.files[0]);
                    }}
                  />
                  <IconButton
                    aria-label="upload picture"
                    icon={<EditIcon color="white" fontSize="18px" />}
                    isRound
                    variant="solid"
                    size="xs"
                    tooltipLabel="Edit Event Logo"
                    colorScheme="primary"
                    // border="2px solid white"
                    position="relative"
                    bottom="12"
                    right="20px"
                    _focus={{ boxShadow: "none" }}
                    onClick={() => profilePicRef.current.click()}
                  />

                  <Box p={6} alignItems={"baseline"}>
                    <VStack ml={-10}>
                      <Box height="25px"></Box>
                      <VStack spacing={0} align={"flex-start"}>
                        <Text color="gray.500" fontWeight="bold">
                          {formik.values.event_name
                            ? formik.values.event_name
                            : "Event Name"}
                        </Text>
                        <Text color="gray.500" fontSize="sm">
                          {formik.values.event_category
                            ? categories?.find(
                                (category) =>
                                  category["category_id"] ===
                                    +formik.values.event_category?.split(
                                      ","
                                    )[0] ||
                                  category["category_name"] ===
                                    formik.values.event_category
                              )?.["category_name"]
                            : "Category"}
                        </Text>
                      </VStack>
                    </VStack>
                  </Box>
                </HStack>
              </Flex>
            </Box>
            <Form>
              <VStack p={{ base: "2", md: "2", lg: "5" }} bg="white" gap={5}>
                <FieldLayout label=" Event Name">
                  <TextBoxWithValidation
                    name="event_name"
                    placeholder="Enter your Event Name"
                    fontSize="sm"
                    // disabled={eventData && true}
                  />
                </FieldLayout>

                <FieldLayout label="Event Category">
                  <SelectWithValidation
                    name="event_category"
                    placeholder={eventData ? null : "Select Category"}
                    // onChange={() => removeData?.remove(indexArray)}
                    disabled={formik?.values?.sports_list?.length > 0 && true}
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
                <FieldLayout label="Dates of the Event">
                  {/* <Flex gap={4}> */}
                  {/* <Box> */}
                  <DatePicker
                    name="event_startdate"
                    placeholderText="From"
                    value={formik.values.event_startdate}
                    // onChange={(e) => {
                    //   formik.handleChange(e);
                    // }}
                    showTimeSelect
                    dateFormat="MM/dd/yyyy h:mm aa"
                  />

                  {/* </Box> */}
                  {/* <Box mr={{ base: "4", md: "2" }}> */}
                  <DatePicker
                    name="event_enddate"
                    placeholderText="To"
                    value={formik.values.event_enddate}
                    // onChange={(e) => {
                    //   formik.handleChange(e);
                    // }}
                    showTimeSelect
                    dateFormat="MM/dd/yyyy h:mm aa"

                    // disabled={eventData && true}
                  />
                  {/* </Box> */}
                  {/* </Flex> */}
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
                  />

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

                <Flex
                  justify="space-between"
                  w="full"
                  direction={{ base: "column", md: "row" }}
                  gap={{ base: 2, md: 10 }}
                  // gap={{ base: "5", md: "2", sm: "1" }}
                  // bg="red"
                >
                  <LabelText
                    p={{ base: "1", md: "2", sm: "1", lg: "1" }}
                    minW="25%"
                  >
                    Event Venue
                  </LabelText>
                  <Box w="full" mt={3}>
                    <Field name="venue_type">
                      {({ field }) => (
                        <RadioGroup {...field}>
                          <Stack spacing={5} direction="row">
                            <Box>
                              <Radio
                                borderColor="primary.500"
                                colorScheme="primary"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  formik.setFieldValue("virtual_venue_url", "");
                                }}
                                value="VEN"
                              >
                                <TextSmall
                                  fontWeight="bold"
                                  color="primary.600"
                                >
                                  Venue
                                </TextSmall>
                              </Radio>
                            </Box>
                            <Box>
                              <Radio
                                borderColor="primary.500"
                                colorScheme="primary"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  formik.setFieldValue("event_venue_other", "");
                                }}
                                value="VIR"
                              >
                                <TextSmall
                                  fontWeight="bold"
                                  color="primary.600"
                                >
                                  Virtual URL
                                </TextSmall>
                              </Radio>
                            </Box>
                          </Stack>
                        </RadioGroup>
                      )}
                    </Field>
                    {formik.values.venue_type === "VIR" && (
                      <Box w="full" mt={3}>
                        <TextBoxWithValidation
                          name="virtual_venue_url"
                          placeholder="Enter your URL"
                          // disabled={eventData && true}
                          fontSize="sm"
                        />
                      </Box>
                    )}
                    {formik.values.venue_type === "VEN" ? (
                      <VStack
                        alignItems="flex-start"
                        width="full"
                        spacing={6}
                        mt={3}
                      >
                        <TextBoxWithValidation
                          name="event_venue_other.line1"
                          placeholder="Venue Name"
                          fontSize="sm"
                        />
                        <TextBoxWithValidation
                          name="event_venue_other.line2"
                          placeholder="Address"
                          fontSize="sm"
                        />
                        <TextBoxWithValidation
                          name="event_venue_other.city"
                          placeholder="City / Town"
                          fontSize="sm"
                        />
                        <TextBoxWithValidation
                          name="event_venue_other.pincode"
                          placeholder="Pincode"
                          fontSize="sm"
                        />
                        <SelectWithValidation
                          placeholder="Select Country"
                          name="event_venue_other.country"
                        >
                          {countriesData.map((country) => (
                            <option
                              key={country["country_code"]}
                              value={country["country_code"]}
                            >
                              {country["country_name"]}
                            </option>
                          ))}
                        </SelectWithValidation>
                        <SelectWithValidation
                          placeholder="Select State"
                          name="event_venue_other.state"
                        >
                          {formik?.values?.event_venue_other?.country ? (
                            countriesData
                              ?.find(
                                (country) =>
                                  country["country_code"] ===
                                  formik?.values?.event_venue_other.country
                              )
                              ?.["country_states"]?.map((state) => (
                                <option
                                  key={state["state_code"]}
                                  value={state["state_code"]}
                                >
                                  {state["state_name"]}
                                </option>
                              ))
                          ) : (
                            <option>Please select a country</option>
                          )}
                        </SelectWithValidation>
                      </VStack>
                    ) : null}
                  </Box>
                </Flex>

                <VStack
                  w="full"
                  direction={{ base: "column", md: "row" }}
                  gap={2}
                  // bg="red.300"
                  // align={{ base: "flex-start", md: "center" }}
                >
                  <Box w="full">
                    <Button
                      _focus={{ boxShadow: "none" }}
                      colorScheme="primary"
                      variant="outline"
                      onClick={onOpen}
                      disabled={!formik.values.event_category && true}
                    >
                      + Add Sports
                    </Button>
                    {formik.errors["sports_list"] && (
                      <TextSmall color="red">
                        {formik.errors["sports_list"]}
                      </TextSmall>
                    )}
                  </Box>
                  <Box w="full">
                    <FieldArray
                      name="sports_list"
                      render={(arrayHelpers) => (
                        <>
                          <Accordion
                            defaultIndex={[0]}
                            // defaultIndex={index == 0 ? 0 : null}
                            // key={index}
                            allowToggle
                            w="full"
                          >
                            {formik?.values["sports_list"]
                              ?.filter((s) => s?.is_delete == "N")
                              ?.map((sport, index) => (
                                <AccordionItem key={index}>
                                  <AccordionButton bg="gray.300" py={3} px={4}>
                                    <Flex gap={2}>
                                      <TextSmall fontWeight="medium">
                                        {
                                          sports.find(
                                            (s) =>
                                              s["sports_id"] ==
                                              sport["sport_id"]
                                          )?.["sports_name"]
                                        }
                                      </TextSmall>
                                      {"-"}
                                      <TextSmall fontWeight="medium">
                                        {formik?.values?.event_category?.split(
                                          ","
                                        )[1] === "TOU"
                                          ? sports
                                              .find(
                                                (s) =>
                                                  s["sports_id"] ==
                                                  sport["sport_id"]
                                              )
                                              ?.sports_category.find(
                                                (category) => {
                                                  return (
                                                    category["category_code"] ==
                                                    sport["tournament_category"]
                                                  );
                                                }
                                              )?.category_name
                                          : sport.tournament_category}
                                      </TextSmall>
                                    </Flex>

                                    <Spacer />
                                    <Flex gap={5}>
                                      <DeletePopover
                                        title={
                                          <TextSmall color="black">
                                            Delete Sport
                                          </TextSmall>
                                        }
                                        trigger={
                                          <IconButton
                                            size={iconButtonSize}
                                            icon={
                                              <DeleteIcon fontSize="18px" />
                                            }
                                            // colorScheme="primary"
                                            // tooltipLabel="Delete Sport"
                                          />
                                        }
                                        handleDelete={() => {
                                          arrayHelpers.replace(index, {
                                            ...formik.values.sports_list[index],
                                            is_delete: "Y",
                                          });
                                        }}
                                      >
                                        <TextSmall color="black">
                                          Are you sure you want to delete this
                                          sport?
                                        </TextSmall>
                                      </DeletePopover>
                                      <IconButton
                                        icon={<EditIcon fontSize="18px" />}
                                        cursor="pointer"
                                        onClick={() => {
                                          setSportMode("edit");
                                          setCurrentSport(sport);
                                          setCurrentIndex(index);
                                          onOpen();
                                        }}
                                      ></IconButton>
                                    </Flex>
                                  </AccordionButton>
                                  <AccordionPanel>
                                    <VStack
                                      alignItems="flex-start"
                                      w="full"
                                      spacing={5}
                                    >
                                      {/* <FieldLayout label="Category">
                                      {formik?.values?.event_category?.split(
                                        ","
                                      )[1] === "TOU"
                                        ? sports
                                            .find(
                                              (s) =>
                                                s["sports_id"] ==
                                                sport["sport_id"]
                                            )
                                            ?.sports_category.find(
                                              (category) => {
                                                return (
                                                  category["category_code"] ==
                                                  sport["tournament_category"]
                                                );
                                              }
                                            )?.category_name
                                        : sport.tournament_category}
                                    </FieldLayout> */}
                                      {formik?.values?.event_category?.split(
                                        ","
                                      )[1] === "TOU" ? (
                                        <FieldLayout label="Format">
                                          {
                                            sports
                                              .find(
                                                (s) =>
                                                  s["sports_id"] ==
                                                  sport["sport_id"]
                                              )
                                              ?.sports_format.find(
                                                (category) => {
                                                  return (
                                                    category["format_code"] ==
                                                    sport["tournament_format"]
                                                  );
                                                }
                                              )?.format_name
                                          }
                                        </FieldLayout>
                                      ) : null}
                                      {sport.reg_fee && (
                                        <FieldLayout label="Registeration Fees">
                                          {sport.reg_fee} {sport.regFeeCurrency}
                                        </FieldLayout>
                                      )}
                                      <FieldLayout label="Min Age">
                                        {sport.min_age}
                                      </FieldLayout>
                                      <FieldLayout label="Max Age">
                                        {sport.max_age}
                                      </FieldLayout>

                                      <FieldLayout label="Min Players">
                                        {sport.minimum_players}
                                      </FieldLayout>
                                      <FieldLayout label="Max Players">
                                        {sport.maximum_players}
                                      </FieldLayout>
                                      <FieldLayout label="Min Teams">
                                        {sport.min_reg_count}
                                      </FieldLayout>
                                      <FieldLayout label="Max Teams">
                                        {sport.max_reg_count}
                                      </FieldLayout>
                                      {/*  <FieldLayout label="Price">
                                        {
                                          prizeData?.find((prize) =>
                                            prize["category_id"] ==
                                            Array.isArray(
                                              sport.tournament_category_prizes
                                            )
                                              ? sport
                                                  .tournament_category_prizes[0]
                                              : sport.tournament_category_prizes.slice(
                                                  1,
                                                  -1
                                                )
                                          )?.category_name
                                        }
                                      </FieldLayout> */}
                                      <FieldLayout label="Description">
                                        <Text
                                          w={{
                                            base: "fit-content",
                                            md: "56",
                                            sm: "56",
                                            lg: "container.md",
                                          }}
                                        >
                                          {sport.sport_desc}
                                        </Text>
                                      </FieldLayout>
                                      {sport?.doc_list?.length > 0 && (
                                        <FieldLayout label="Documents">
                                          {Array.isArray(sport.doc_list)
                                            ? sport.doc_list?.map(
                                                (doc, index) => (
                                                  <Link
                                                    href={doc.url}
                                                    color="primary.500"
                                                    isExternal
                                                    key={index}
                                                  >
                                                    {
                                                      docType.find(
                                                        (document) =>
                                                          document[
                                                            "lookup_key"
                                                          ] === doc.type
                                                      )?.["lookup_value"]
                                                    }
                                                    - {doc?.name}
                                                  </Link>
                                                )
                                              )
                                            : JSON.parse(sport.doc_list)?.map(
                                                (doc, index) => (
                                                  <Link
                                                    href={doc.url}
                                                    color="primary.500"
                                                    isExternal
                                                    key={index}
                                                  >
                                                    {
                                                      docType.find(
                                                        (document) =>
                                                          document[
                                                            "lookup_key"
                                                          ] === doc.type
                                                      )?.["lookup_value"]
                                                    }
                                                    - {doc?.name}
                                                  </Link>
                                                )
                                              )}
                                        </FieldLayout>
                                      )}
                                      {sport.tournament_category_prizes.length >
                                      (
                                        <FieldLayout label="Prizes">
                                          <HStack>
                                            {sport.tournament_category_prizes?.map(
                                              (prizeId, index) => {
                                                const categoryName =
                                                  prizeData?.find(
                                                    ({ category_id }) =>
                                                      category_id == prizeId
                                                  )?.category_name;
                                                return (
                                                  <Text key={prizeId}>
                                                    {categoryName}
                                                    {index !==
                                                      sport
                                                        .tournament_category_prizes
                                                        .length -
                                                        1 && ","}
                                                  </Text>
                                                );
                                              }
                                            )}
                                          </HStack>
                                        </FieldLayout>
                                      )}
                                    </VStack>
                                  </AccordionPanel>
                                </AccordionItem>
                              ))}
                          </Accordion>

                          <PageEventSportsSelect
                            arrayHelpers={arrayHelpers}
                            // onOpen={onOpen}
                            onClose={onClose}
                            isOpen={isOpen}
                            sportMode={sportMode}
                            setSportMode={setSportMode}
                            currentSport={currentSport}
                            currentIndex={currentIndex}
                            setCurrentIndex={setCurrentIndex}
                            createformik={formik}
                            docType={docType}
                            prizeData={prizeData}
                          />
                        </>
                      )}
                    ></FieldArray>
                  </Box>
                </VStack>

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
                <Flex
                  direction={{ base: "column", md: "row" }}
                  w="full"
                  justify="flex-start"
                  gap={{ base: "5", md: "2", sm: "1", lg: "5" }}
                  // bg="red"
                  pt={5}
                >
                  <Button
                    colorScheme="primary"
                    type="submit"
                    // onClick={() => {
                    //   setStatus("PUB");
                    // }}
                    onClick={() => {
                      formik.setFieldValue("event_status", "PUB");
                      setStatus("PUB");
                    }}
                    isLoading={
                      formik.values.event_status === "PUB" &&
                      (createLoading || updateLoading)
                    }
                    disabled={!formik?.values?.sports_list?.length > 0 && true}
                  >
                    Save & Publish
                  </Button>
                  <Modal
                    size="2xl"
                    isOpen={publishIsOpen}
                    onClose={publishOnClose}
                    title={"Publish Event"}
                  >
                    <EventFeedEditor
                      // id={Id}
                      // feedContent={feedContent}
                      type="company"
                      eventData={formik?.values}
                      data={eventData}
                      onClosed={onClose}
                      // eventStatus={eventData?.event_status}
                      // pageId={eventData?.company?.company_id}
                      pageId={eventData?.company?.company_id || id}
                      eventId={eventData?.event_id}
                      coverImage={coverImage}
                      coverImageMetaData={eventData?.event_banner_meta}
                    />
                  </Modal>

                  <Button
                    colorScheme="primary"
                    // onClick={() => {
                    //   setStatus("DRT");
                    // }}

                    onClick={() => {
                      formik.setFieldValue("event_status", "DRT");
                      setStatus("DRT");
                    }}
                    type="submit"
                    isLoading={
                      formik.values.event_status === "DRT" &&
                      (createLoading || updateLoading)
                    }
                  >
                    Save as Draft
                  </Button>

                  {!eventData ? (
                    <Button
                      colorScheme="red"
                      onClick={() => router?.push(`/page/${id}?tab=events`)}
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Button
                      colorScheme="red"
                      onClick={() =>
                        router?.push(
                          `/page/${eventData?.company?.company_id}?tab=events`
                        )
                      }
                    >
                      Cancel
                    </Button>
                  )}
                </Flex>
              </VStack>
            </Form>
          </VStack>
        )}
      </Formik>
    );
}

export default PageEventCreate;
