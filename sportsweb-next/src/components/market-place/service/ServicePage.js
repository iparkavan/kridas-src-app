import { Box, HStack, Radio, SimpleGrid, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import Button from "../../ui/button";
import { HeadingLarge, HeadingMedium } from "../../ui/heading/heading";
import { Share } from "../../ui/icons";
import SelectWithValidation from "../../ui/select/select-with-validation";
import LabelText from "../../ui/text/label-text";
import { TextMedium } from "../../ui/text/text";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import FieldLayout from "../../user/profile-section/user-profile-edit/field-layout";

function ServicePage() {
  const onSubmit = (values) => {
    console.log("Service page", values);
  };
  const initialValues = {
    service_type: "",
    title: "",
    description: "",
    category: "",
    sports: "",
    slot_duration: "",
    available_days: "",
    available_slots: "",
    inclusion: "",
    terms: "",
    add_image: "",
  };
  return (
    <div>
      <SimpleGrid
        p={5}
        bg="white"
        columns={2}
        h="680px"
        mt={10}
        boxShadow="2xl"
        w="1000px"
        borderRadius="lg"
      >
        <Box>
          <VStack>
            <Box>
              <Box
                p={15}
                w="460px"
                h="250px"
                mt={10}
                textAlign="center"
                color="white"
                boxShadow="2xl"
              >
                <LabelText fontSize="2xl"> Company Name</LabelText>
              </Box>
              <Box>
                <VStack alignItems="justify" mt={10}>
                  <HStack>
                    <LabelText fontSize="2xl">Physiotheraphy Session</LabelText>{" "}
                    <Button leftIcon={<Share />}>Share</Button>
                  </HStack>

                  <TextMedium>Salem . Tamil Nadu . India</TextMedium>
                  <TextMedium> Consultation with Dr. Ramprasad</TextMedium>
                  <TextMedium> Physiotheraphy</TextMedium>
                  <TextMedium>General</TextMedium>
                  <HeadingLarge> ₹500</HeadingLarge>
                  <HeadingMedium>Description</HeadingMedium>
                  <TextMedium>
                    Doctor consulation for diagnois and treatment advise
                  </TextMedium>
                </VStack>
              </Box>
            </Box>
          </VStack>
        </Box>
        <Box>
          <VStack>
            <Formik initialValues={initialValues} onSubmit={onSubmit}>
              {(formik) => (
                <Form>
                  <VStack mt={10} alignItems="justify" gap={4}>
                    <HeadingMedium>Fill your details</HeadingMedium>
                    <FieldLayout label="Name">
                      <TextBoxWithValidation
                        name="name"
                        placeholder=""
                        width="300px"
                      />
                    </FieldLayout>
                    <FieldLayout label="Gender">
                      <Radio value="male">male</Radio>
                      <Radio value="female">female</Radio>
                    </FieldLayout>
                    <FieldLayout label="Age">
                      <TextBoxWithValidation
                        name="age"
                        placeholder=""
                        width="150px"
                      />
                    </FieldLayout>
                    <FieldLayout label="Email">
                      <TextBoxWithValidation
                        name="email"
                        placeholder=""
                        width="300px"
                      />
                    </FieldLayout>
                    <FieldLayout label="Date">
                      <TextBoxWithValidation
                        name="date"
                        placeholder="Date"
                        width="200px"
                        // rightIcon={<DateIcon />}
                      />
                    </FieldLayout>
                    <FieldLayout label="Time">
                      <SelectWithValidation
                        name="time"
                        placeholder=""
                        width="200px"
                      />
                    </FieldLayout>
                    <FieldLayout label="Message">
                      <TextBoxWithValidation
                        name="message"
                        placeholder=""
                        width="300px"
                      />
                    </FieldLayout>
                  </VStack>

                  <HStack mt={20} spacing={5} justify="flex-start">
                    <Button type="submit" colorScheme="primary">
                      Book
                    </Button>
                    <Button colorScheme="primary" variant="outline">
                      Cancel
                    </Button>
                  </HStack>
                </Form>
              )}
            </Formik>
          </VStack>
        </Box>
      </SimpleGrid>
    </div>
  );
}
export default ServicePage;
