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
import { TextMedium } from "../../../ui/text/text";
import NumberWithValidation from "../../../ui/number-input/number-with-validation";
import Button from "../../../ui/button";
import TextBoxWithValidation from "../../../ui/textbox/textbox-with-validation";

const FootballResult = (props) => {
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
              columnGap={6}
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
                  {values.first_team_goals_info.map((_, index) => (
                    <HStack key={index}>
                      <TextBoxWithValidation
                        name={`first_team_goals_info[${index}].player_name`}
                        placeholder={`Player Name ${index + 1}`}
                        w="150px"
                      />
                      <TextBoxWithValidation
                        name={`first_team_goals_info[${index}].goal_min`}
                        placeholder="Min. of Goal"
                        w="110px"
                      />
                    </HStack>
                  ))}
                </VStack>
              </GridItem>

              <GridItem>
                <HStack>
                  <NumberWithValidation
                    name="first_team_score"
                    width="70px"
                    min={0}
                    onChange={(value) => {
                      setFieldValue("first_team_score", +value);
                      const firstTeamGoalsInfo = new Array(+value)
                        .fill()
                        .map(() => ({
                          player_name: "",
                          goal_min: "",
                        }));
                      setFieldValue(
                        "first_team_goals_info",
                        firstTeamGoalsInfo
                      );
                    }}
                  />
                  <Box>
                    <VsSvg />
                  </Box>
                  <NumberWithValidation
                    name="second_team_score"
                    width="70px"
                    min={0}
                    onChange={(value) => {
                      setFieldValue("second_team_score", +value);
                      const secondTeamGoalsInfo = new Array(+value)
                        .fill()
                        .map(() => ({
                          player_name: "",
                          goal_min: "",
                        }));
                      setFieldValue(
                        "second_team_goals_info",
                        secondTeamGoalsInfo
                      );
                    }}
                  />
                </HStack>
              </GridItem>

              <GridItem>
                <VStack>
                  <TextMedium fontWeight="bold" fontSize="xl">
                    {fixture.secondTeamName}
                  </TextMedium>
                  {values.second_team_goals_info.map((_, index) => (
                    <HStack key={index}>
                      <TextBoxWithValidation
                        name={`second_team_goals_info[${index}].player_name`}
                        placeholder={`Player Name ${index + 1}`}
                        w="150px"
                      />
                      <TextBoxWithValidation
                        name={`second_team_goals_info[${index}].goal_min`}
                        placeholder="Min.of Goal"
                        w="110px"
                      />
                    </HStack>
                  ))}
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

export default FootballResult;
