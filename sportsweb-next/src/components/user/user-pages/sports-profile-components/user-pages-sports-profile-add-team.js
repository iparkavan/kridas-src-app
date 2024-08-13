import { useRef } from "react";
import {
  ModalFooter,
  Input,
  Link,
  Text,
  VStack,
  HStack,
  IconButton,
  useDisclosure,
  ButtonGroup,
} from "@chakra-ui/react";
import Button from "../../../ui/button";
import Modal from "../../../ui/modal";
import { Formik, Form, FieldArray } from "formik";
import { useRouter } from "next/router";
import * as yup from "yup";

import { DeleteIcon } from "../../../ui/icons";
import { usePage } from "../../../../hooks/page-hooks";
import { useCreatePageStatistics } from "../../../../hooks/page-statistics-hooks";
import {
  ageGroupValues,
  genderValues,
  skillLevelValues,
} from "../../../../helper/constants/fields-data-sports-profile";
import { CreateTeamStatisticsYupSchema } from "../../../../helper/constants/page-statistics-constants";
import SelectWithValidation from "../../../ui/select/select-with-validation";
import TextBoxWithValidation from "../../../ui/textbox/textbox-with-validation";
import { useSports } from "../../../../hooks/sports-hooks";
import { HeadingSmall } from "../../../ui/heading/heading";

function AddTeam() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { pageId } = router.query;
  const { data: pageData = {} } = usePage(pageId);
  const { mutate, isLoading } = useCreatePageStatistics();
  const documentRef = useRef();
  const { data: sportsData = [] } = useSports();

  return (
    <>
      <Button variant="outline" colorScheme="primary" onClick={onOpen}>
        Add Team
      </Button>

      <Modal size="2xl" isOpen={isOpen} onClose={onClose} title={"Add Team"}>
        <Formik
          initialValues={{
            categorywise_statistics: {
              sports_id: "",
              skill_level: "",
              gender: "",
              age_group: "",
              team_name: "",
            },
            statistics_links: [""],
            statistics_docs: [null],
          }}
          validationSchema={CreateTeamStatisticsYupSchema(yup)}
          onSubmit={(values, { setSubmitting }) => {
            const company_id = pageData?.company_id;
            values.categorywise_statistics.category = "team";
            values.categorywise_statistics.sports_id =
              +values.categorywise_statistics.sports_id;

            mutate(
              { company_id, ...values },
              {
                onSuccess: () => {
                  setSubmitting(false);
                  onClose();
                },
              }
            );
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
          
                  <VStack
                    border="1px solid"
                    borderColor="gray.300"
                    w="full"
                    align="flex-start"
                    p={[2, 4, 6]}
                    spacing={7}
                  >
                    <VStack align="flex-start" spacing={4}>
                      <SelectWithValidation
                        name="categorywise_statistics.sports_id"
                        width="xs"
                        placeholder="Select a Sport"
                        label="Sport"
                      >
                        {sportsData.map(({ sports_id, sports_name }) => (
                          <option key={sports_id} value={sports_id}>
                            {sports_name}
                          </option>
                        ))}
                      </SelectWithValidation>

                      <TextBoxWithValidation
                        name="categorywise_statistics.team_name"
                        width="xs"
                        placeholder="Enter Team Name"
                        label="Name of the Team"
                      />
                      <SelectWithValidation
                        name="categorywise_statistics.skill_level"
                        width="xs"
                        placeholder="Select Skill Level"
                        label="Level"
                      >
                        {skillLevelValues.map((skill_level, idx) => (
                          <option key={idx} value={skill_level}>
                            {skill_level}
                          </option>
                        ))}
                      </SelectWithValidation>
                      <SelectWithValidation
                        name="categorywise_statistics.gender"
                        width="xs"
                        placeholder="Select Gender"
                        label="Gender"
                      >
                        {genderValues.map((gender, idx) => (
                          <option key={idx} value={gender}>
                            {gender}
                          </option>
                        ))}
                      </SelectWithValidation>

                      <SelectWithValidation
                        name="categorywise_statistics.age_group"
                        width="xs"
                        placeholder="Select Age Group"
                        label="Age Group"
                      >
                        {ageGroupValues.map((age_group, idx) => (
                          <option key={idx} value={age_group}>
                            {age_group}
                          </option>
                        ))}
                      </SelectWithValidation>
                    </VStack>
                    <VStack align="flex-start" spacing={4} w="full">
                      <HeadingSmall>External Stats URL</HeadingSmall>
                      <FieldArray
                        name="statistics_links"
                        render={(arrayHelpers) => (
                          <VStack
                            alignItems="flex-start"
                            width="full"
                            spacing={6}
                          >
                            {values.statistics_links.map((stat, index) => (
                              <HStack
                                key={index}
                                spacing={6}
                                alignItems="baseline"
                                w="full"
                              >
                                <Text>{index + 1}</Text>
                                <VStack
                                  alignItems="flex-start"
                                  width="full"
                                  spacing={6}
                                >
                                  <TextBoxWithValidation
                                    name={`statistics_links[${index}].link`}
                                    placeholder="Enter link/url"
                                  />
                                </VStack>
                                <IconButton
                                  variant="ghost"
                                  icon={<DeleteIcon />}
                                  colorScheme="primary"
                                  onClick={() => arrayHelpers.remove(index)}
                                />
                              </HStack>
                            ))}

                            <Button
                              variant="link"
                              colorScheme="primary"
                              onClick={() => arrayHelpers.push("")}
                            >
                              + Add another link
                            </Button>
                          </VStack>
                        )}
                      />
                    </VStack>
                    <VStack align="flex-start" spacing={5}>
                      <HeadingSmall>
                        Upload Certificates/Documents/Achievement Proofs
                        (Optional)
                      </HeadingSmall>
                      <FieldArray
                        name="statistics_docs"
                        render={(arrayHelpers) => (
                          <VStack alignItems="flex-start" spacing={7} w="full">
                            {values?.statistics_docs?.map((doc, index) => (
                              <HStack key={index} spacing={10} w="50%">
                                <Text>{index + 1}</Text>
                                <Input
                                  type="file"
                                  display="none"
                                  ref={documentRef}
                                  onChange={(e) => {
                                    if (e.target.files[0]) {
                                      setFieldValue(
                                        `statistics_docs[${index}]`,
                                        e.target.files[0]
                                      );
                                    }
                                  }}
                                />
                                {values.statistics_docs[index] ? (
                                  <Link
                                    href={
                                      values.statistics_docs[index] instanceof
                                      File
                                        ? URL.createObjectURL(
                                            values.statistics_docs[index]
                                          )
                                        : values.statistics_docs[index]
                                    }
                                    isExternal
                                  >
                                    {values.statistics_docs[index] instanceof
                                    File
                                      ? values.statistics_docs[index].name
                                      : values.statistics_docs[index]?.split(
                                          "--"
                                        )[1]}
                                  </Link>
                                ) : (
                                  <Button
                                    colorScheme="primary"
                                    variant="outline"
                                    onClick={() => documentRef.current.click()}
                                  >
                                    Upload
                                  </Button>
                                )}
                                <IconButton
                                  variant="ghost"
                                  icon={<DeleteIcon />}
                                  colorScheme="primary"
                                  onClick={() => arrayHelpers.remove(index)}
                                />
                              </HStack>
                            ))}
                            <Button
                              variant="link"
                              colorScheme="primary"
                              onClick={() => arrayHelpers.push(null)}
                            >
                              + Add Another
                            </Button>
                          </VStack>
                        )}
                      />
                    </VStack>
                  </VStack>
                <ModalFooter>
                  <ButtonGroup spacing={3}>
                    <Button
                      variant="outline"
                      colorScheme="primary"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      colorScheme="primary"
                      isLoading={isLoading}
                    >
                      Save
                    </Button>
                  </ButtonGroup>
                </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default AddTeam;
