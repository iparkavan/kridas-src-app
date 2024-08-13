import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  Spacer,
  Heading,
  Text,
  Select,
  VStack,
  HStack,
  Radio,
  Box,
  RadioGroup,
  Input,
  useDisclosure,
  Checkbox,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import PageSponsorshipSuccessModal from "./user-page-sponsorship-success-modal";
import { useState } from "react";
import { useCategoriesByType } from "../../../../hooks/category-hooks";
import { useRouter } from "next/router";
import { usePage } from "../../../../hooks/page-hooks";
import { usePageStatistics } from "../../../../hooks/page-statistics-hooks";
import { useSports } from "../../../../hooks/sports-hooks";
import { useCreatePageSponsorInfo } from "../../../../hooks/page-sponsor-info-hooks";
import { getPageSponsorshipYupSchema } from "../../../../helper/constants/page-sponsorship-constants";
import * as yup from "yup";
import SelectWithValidation from "../../../ui/select/select-with-validation";
import TextBoxWithValidation from "../../../ui/textbox/textbox-with-validation";

function PageCreateSponsorshipModal({ onClose }) {
  const {
    onOpen,
    isOpen,
    onClose: onPageCreateSponsorshipClose,
  } = useDisclosure();
  const { onOpen: onSponsorshipSuccessOpen, isOpen: isSponsorshipSuccessOpen } =
    useDisclosure();
  const [mode, setMode] = useState(false);
  const { data: ROICategories = [] } = useCategoriesByType("PRO");
  const { mutate, isLoading } = useCreatePageSponsorInfo();
  const PageROICategories = ROICategories?.sort(
    (a, b) => a.category_id - b.category_id
  );
  const router = useRouter();
  const { pageId } = router.query;
  const { data: pageData = {} } = usePage(pageId);
  const { data: PageStatisticsData = [] } = usePageStatistics(pageId);
  const { data: sportsData = [] } = useSports();
  //TeamStatistics
  const pageTeamStatisticsData = PageStatisticsData.filter(
    ({ categorywise_statistics }) => categorywise_statistics.category === "team"
  ).sort((a, b) => Date.parse(a.created_date) - Date.parse(b.created_date));
  const TeamSportsValues = pageTeamStatisticsData.map(
    ({ categorywise_statistics }) => categorywise_statistics.sports_id
  );
  //VenueStatistics
  const pageVenueStatisticsData = PageStatisticsData.filter(
    ({ categorywise_statistics }) =>
      categorywise_statistics.category === "venue"
  ).sort((a, b) => Date.parse(a.created_date) - Date.parse(b.created_date));
  const VenueSportsValues = pageVenueStatisticsData.map(
    ({ categorywise_statistics }) => categorywise_statistics.sports_id
  );
  //AcademyStatistics
  const pageAcademyStatisticsData = PageStatisticsData.filter(
    ({ categorywise_statistics }) =>
      categorywise_statistics.category === "academy"
  ).sort((a, b) => Date.parse(a.created_date) - Date.parse(b.created_date));
  const AcademySportsValues = pageAcademyStatisticsData.map(
    ({ categorywise_statistics }) => categorywise_statistics.sports_id
  );

  //Submit Function
  const handleSubmit = (values) => {
    if (values.previous_current_sponsor === "")
      values.previous_current_sponsor = null;
    values.company_id = pageData?.company_id;
    const roi_options = values.roi_options.map((value) => +value);
    values.category_id = +values.category_id;
    values.sports_id = +values.sports_id;
    mutate(
      {
        ...values,
        roi_options,
      },
      {
        onSuccess: () => {
          onPageCreateSponsorshipClose();
          onSponsorshipSuccessOpen();
        },
      }
    );
  };

  return (
    <>
      <Button
        bg="blue.400"
        w="36"
        borderRadius="none"
        color="white"
        _hover={{ color: "black" }}
        onClick={onOpen}
      >
        Proceed
      </Button>
      <Modal size="xl" isOpen={isOpen} onClose={onClose}>
        <Formik
          initialValues={{
            previous_current_sponsor: null,
            roi_options: [],
            category_id: "",
            sports_id: "",
          }}
          validationSchema={getPageSponsorshipYupSchema(yup, mode)}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ values, errors }) => (
            <Form>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader
                  h="51px"
                  bg="linear-gradient(90deg, #EC008C 0%, #FC6767 100%)"
                  color="white"
                  px={4}
                  fontWeight="400"
                >
                  Get Sponsorship
                </ModalHeader>
                <ModalCloseButton color="white" fontSize="15px" />
                <ModalBody pl={[4, 5, 6]} pt={[3, 4, 5]} pb={0}>
                  <VStack spacing={6} align="flex-start">
                    <VStack align="flex-start" spacing={1}>
                      <Text color="#000000">
                        Create your Sponsorship profile
                      </Text>
                      <Text fontSize="14px" color="#555555">
                        We will start with creating a sponsorship profile, which
                        can be used for finalizing deals with Sponsors.{" "}
                      </Text>
                    </VStack>
                    <VStack align="flex-start" spacing={0}>
                      <Text>
                        <b>Select a Sub-Category</b>
                      </Text>
                      <SelectWithValidation
                        placeholder="Select a category"
                        width="xs"
                        variant="flushed"
                        color="black"
                        borderBottomColor="#2F80ED"
                        iconColor="#ED1C24"
                        name="category_id"
                      >
                        {pageData?.category_arr?.map(
                          ({ category_id, category_name }) => (
                            <option value={category_id} key={category_id}>
                              {category_name}
                            </option>
                          )
                        )}
                      </SelectWithValidation>
                    </VStack>
                    <VStack align="flex-start" spacing={0}>
                      <Text>
                        <b>Select sports</b>
                      </Text>
                      <SelectWithValidation
                        placeholder="Select a sport"
                        width="xs"
                        variant="flushed"
                        color="black"
                        borderBottomColor="#2F80ED"
                        iconColor="#ED1C24"
                        name="sports_id"
                      >
                        {pageData?.category_arr?.find(
                          ({ category_id }) =>
                            category_id === +values.category_id
                        )?.category_name === "Team" &&
                          TeamSportsValues.map((id) => (
                            <option value={id} key={id}>
                              {
                                sportsData?.find(
                                  ({ sports_id }) => sports_id === id
                                )?.sports_name
                              }
                            </option>
                          ))}
                        {pageData?.category_arr?.find(
                          ({ category_id }) =>
                            category_id === +values.category_id
                        )?.category_name === "Venue" &&
                          VenueSportsValues.map((id) => (
                            <option value={id} key={id}>
                              {
                                sportsData?.find(
                                  ({ sports_id }) => sports_id === id
                                )?.sports_name
                              }
                            </option>
                          ))}
                        {pageData?.category_arr?.find(
                          ({ category_id }) =>
                            category_id === +values.category_id
                        )?.category_name === "Academy" &&
                          AcademySportsValues.map((id) => (
                            <option value={id} key={id}>
                              {
                                sportsData?.find(
                                  ({ sports_id }) => sports_id === id
                                )?.sports_name
                              }
                            </option>
                          ))}
                      </SelectWithValidation>
                    </VStack>
                    <VStack align="flex-start" spacing={0}>
                      <Text>
                        <b>Current Sponsorship Status</b>
                      </Text>
                      <RadioGroup defaultValue="1" pt={2}>
                        <VStack spacing={2} align="flex-start">
                          <Radio
                            value="1"
                            borderColor="#2F80ED"
                            onChange={() => {
                              values.previous_current_sponsor = "";
                              setMode(false);
                            }}
                          >
                            I do not have any sponsorship now
                          </Radio>
                          <Radio
                            value="2"
                            borderColor="#2F80ED"
                            onChange={() => setMode(true)}
                          >
                            I had/have sponsorship
                          </Radio>
                        </VStack>
                      </RadioGroup>

                      <Box pl={6} display={mode ? "block" : "none"}>
                        <TextBoxWithValidation
                          variant="flushed"
                          width="xs"
                          borderBottomColor="#2F80ED"
                          placeholder="Enter sponsor name"
                          name="previous_current_sponsor"
                        />
                      </Box>
                    </VStack>
                    <VStack spacing={0} align="flex-start">
                      <Text>
                        <b>Common ROI</b>
                      </Text>
                      <Text fontSize="14px" color="#555555">
                        Select the ROI you will be able to provide to the
                        Sponsors.
                      </Text>
                      <FormControl
                        id="roi_options"
                        isInvalid={errors["roi_options"]}
                      >
                        {PageROICategories?.map(
                          ({ category_id, category_name, category_desc }) => (
                            <Field name="roi_options" key={category_id}>
                              {({ field }) => {
                                return (
                                  <VStack pt={2} align="flex-start" spacing={0}>
                                    <Checkbox
                                      {...field}
                                      borderColor="#2F80ED"
                                      value={category_id}
                                    >
                                      {category_name}
                                    </Checkbox>
                                    <Box pl={6}>
                                      <Text fontSize="14px" color="#555555">
                                        {category_desc}
                                      </Text>
                                    </Box>
                                  </VStack>
                                );
                              }}
                            </Field>
                          )
                        )}
                        {errors["roi_options"] && (
                          <FormErrorMessage mt={5}>
                            Please select atleast one ROI option.
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </VStack>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Flex w="full" pt={5} gap={3}>
                    <Spacer />
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      bg
                      w="36"
                      borderRadius="none"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      bg="blue.400"
                      w="36"
                      borderRadius="none"
                      color="white"
                      _hover={{ color: "black" }}
                      type="submit"
                      isLoading={isLoading}
                    >
                      Submit
                    </Button>
                  </Flex>
                </ModalFooter>
              </ModalContent>
            </Form>
          )}
        </Formik>
      </Modal>
      <PageSponsorshipSuccessModal
        isOpen={isSponsorshipSuccessOpen}
        onClose={onClose}
      />
    </>
  );
}
export default PageCreateSponsorshipModal;
