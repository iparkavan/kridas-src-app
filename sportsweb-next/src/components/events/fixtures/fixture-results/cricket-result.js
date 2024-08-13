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

const CricketResult = (props) => {
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
      onSubmit={(values) => {
        const updateValues = { ...values };
        updateValues.first_team_stats.overs = +values.first_team_stats.overs;
        updateValues.second_team_stats.overs = +values.second_team_stats.overs;
        handleSave(updateValues);
      }}
    >
      {({ setFieldValue }) => {
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
              <GridItem gridColumn="1 / -1" mb={6}>
                <Divider borderColor="primary.500" />
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
                  <HStack justifyContent="center" spacing={1}>
                    <Box w="80px">
                      <TextSmall textAlign="center" bg="gray.100" py={1}>
                        Score
                      </TextSmall>
                      <NumberWithValidation
                        name="first_team_stats.score"
                        stepper={false}
                        inputProps={{ p: 3 }}
                        mt={1}
                        onChange={(_, numValue) => {
                          setFieldValue("first_team_stats.score", numValue);
                          setFieldValue("first_team_score", numValue);
                        }}
                      />
                    </Box>

                    <Box w="80px">
                      <TextSmall textAlign="center" bg="gray.100" py={1}>
                        Wickets
                      </TextSmall>
                      <NumberWithValidation
                        name="first_team_stats.wickets"
                        stepper={false}
                        inputProps={{ p: 3 }}
                        mt={1}
                      />
                    </Box>

                    <Box w="80px">
                      <TextSmall textAlign="center" bg="gray.100" py={1}>
                        Overs
                      </TextSmall>
                      <NumberWithValidation
                        name="first_team_stats.overs"
                        stepper={false}
                        inputProps={{ p: 3 }}
                        mt={1}
                        precision={1}
                      />
                    </Box>
                  </HStack>
                </VStack>
              </GridItem>

              <GridItem justifySelf="center">
                <VsSvg />
              </GridItem>

              <GridItem>
                <VStack>
                  <TextMedium fontWeight="bold" fontSize="xl">
                    {fixture.secondTeamName}
                  </TextMedium>
                  <HStack justifyContent="center" spacing={1}>
                    <Box w="80px">
                      <TextSmall textAlign="center" bg="gray.100" py={1}>
                        Score
                      </TextSmall>
                      <NumberWithValidation
                        name="second_team_stats.score"
                        stepper={false}
                        inputProps={{ p: 3 }}
                        mt={1}
                        onChange={(_, numValue) => {
                          setFieldValue("second_team_stats.score", numValue);
                          setFieldValue("second_team_score", numValue);
                        }}
                      />
                    </Box>

                    <Box w="80px">
                      <TextSmall textAlign="center" bg="gray.100" py={1}>
                        Wickets
                      </TextSmall>
                      <NumberWithValidation
                        name="second_team_stats.wickets"
                        stepper={false}
                        inputProps={{ p: 3 }}
                        mt={1}
                      />
                    </Box>

                    <Box w="80px">
                      <TextSmall textAlign="center" bg="gray.100" py={1}>
                        Overs
                      </TextSmall>
                      <NumberWithValidation
                        name="second_team_stats.overs"
                        stepper={false}
                        inputProps={{ p: 3 }}
                        mt={1}
                        precision={1}
                      />
                    </Box>
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

export default CricketResult;
