import {
  Box,
  Divider,
  Grid,
  GridItem,
  HStack,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";

import VsSvg from "../../../../svg/vs-svg";
import { TextMedium, TextSmall } from "../../../ui/text/text";
import NumberWithValidation from "../../../ui/number-input/number-with-validation";
import Button from "../../../ui/button";
import TextBoxWithValidation from "../../../ui/textbox/textbox-with-validation";

const SetsResult = (props) => {
  const {
    fixture,
    matchScore,
    validationSchema,
    date,
    day,
    time,
    venueName,
    isFixtureDetailsPresent,
    isLoading,
    handleSave,
  } = props;

  return (
    <Formik
      initialValues={matchScore}
      validationSchema={validationSchema}
      onSubmit={(values) => handleSave(values)}
    >
      {({ values, setFieldValue }) => {
        return (
          <Form>
            <Grid
              templateColumns="repeat(5, 1fr)"
              border="1px solid"
              borderColor="primary.500"
              p={4}
              borderRadius="lg"
              rowGap={2}
              columnGap={4}
              alignItems="center"
            >
              <GridItem>
                Match {fixture.matchNo} - {fixture.fixtureStage}
              </GridItem>
              <GridItem colSpan={3} justifySelf="center">
                {isFixtureDetailsPresent && (
                  <TextMedium>{venueName}</TextMedium>
                )}
              </GridItem>
              <GridItem justifySelf="end">
                {fixture.courtNo && (
                  <TextMedium>Court No: {fixture.courtNo}</TextMedium>
                )}
              </GridItem>
              <GridItem gridColumn="1 / -1">
                <Divider borderColor="primary.500" />
              </GridItem>

              <GridItem gridColumn="1 / -1" justifySelf="end">
                <HStack>
                  <TextMedium whiteSpace="nowrap" color="primary.500">
                    No. of sets :
                  </TextMedium>
                  <NumberWithValidation
                    maxW="70px"
                    min={1}
                    max={10}
                    name="no_of_sets"
                    inputProps={{ p: 3 }}
                    onChange={(value) => {
                      setFieldValue("no_of_sets", +value);
                      const sets = new Array(+value).fill().map(() => ({
                        first_team_points: "",
                        second_team_points: "",
                      }));
                      setFieldValue("sets", sets);
                    }}
                  />
                </HStack>
              </GridItem>

              <GridItem>
                {isFixtureDetailsPresent && (
                  <Stack spacing={1}>
                    <TextMedium color="gray.500">{time}</TextMedium>
                    <TextMedium fontWeight="medium">{date}</TextMedium>
                    <TextMedium color="gray.500">{day}</TextMedium>
                  </Stack>
                )}
              </GridItem>

              <GridItem>
                <VStack>
                  <TextMedium fontWeight="bold" fontSize="xl">
                    {fixture.firstTeamName}
                  </TextMedium>
                  <HStack
                    justifyContent="center"
                    flexWrap="wrap"
                    spacing={1}
                    rowGap={2}
                  >
                    {values.sets.map((_, index) => (
                      <Box key={index} w="60px">
                        <TextSmall textAlign="center" bg="gray.100" py={1}>
                          Set {index + 1}
                        </TextSmall>
                        <NumberWithValidation
                          stepper={false}
                          name={`sets[${index}].first_team_points`}
                          inputProps={{ p: 3 }}
                          mt={1}
                        />
                      </Box>
                    ))}
                  </HStack>
                </VStack>
              </GridItem>

              <GridItem>
                <HStack justifyContent="center" spacing={4}>
                  <Box>
                    <NumberWithValidation
                      name="first_team_score"
                      min={0}
                      inputProps={{ p: 3 }}
                      w="70px"
                    />
                  </Box>
                  <Box>
                    <VsSvg />
                  </Box>
                  <Box>
                    <NumberWithValidation
                      name="second_team_score"
                      min={0}
                      inputProps={{ p: 3 }}
                      w="70px"
                    />
                  </Box>
                </HStack>
              </GridItem>

              <GridItem>
                <VStack>
                  <HStack>
                    <TextMedium fontWeight="bold" fontSize="xl">
                      {fixture.secondTeamName}
                    </TextMedium>
                  </HStack>

                  <HStack
                    justifyContent="center"
                    flexWrap="wrap"
                    spacing={1}
                    rowGap={2}
                  >
                    {values.sets.map((_, index) => (
                      <Box key={index} w="60px">
                        <TextSmall textAlign="center" bg="gray.100" py={1}>
                          Set {index + 1}
                        </TextSmall>
                        <NumberWithValidation
                          stepper={false}
                          name={`sets[${index}].second_team_points`}
                          inputProps={{ p: 3 }}
                          mt={1}
                        />
                      </Box>
                    ))}
                  </HStack>
                </VStack>
              </GridItem>

              <GridItem />
              <GridItem />

              <GridItem colSpan={3} justifySelf="center" mt={4}>
                <HStack>
                  <TextMedium color="primary.500">Result</TextMedium>
                  <TextBoxWithValidation name="result" />
                </HStack>
              </GridItem>

              <GridItem mt={4} justifySelf="end">
                <Button type="submit" isLoading={isLoading}>
                  Save
                </Button>
              </GridItem>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SetsResult;
