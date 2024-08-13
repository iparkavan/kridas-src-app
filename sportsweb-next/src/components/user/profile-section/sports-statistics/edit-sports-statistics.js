import { Box, ButtonGroup, SimpleGrid } from "@chakra-ui/react";
import { FieldArray } from "formik";

import {
  cricketFields,
  softballFields,
  sportsStats,
} from "../../../../helper/constants/sport-statistics-constants";
import Button from "../../../ui/button";
import SelectWithValidation from "../../../ui/select/select-with-validation";
import { TextSmall } from "../../../ui/text/text";
import TextBoxWithValidation from "../../../ui/textbox/textbox-with-validation";

const EditSportsStatistics = ({ formik, sports, sportsStatisticsIndex }) => {
  const { values } = formik;
  const selectedSport = sports?.find(
    (sport) =>
      sport["sports_id"] ==
      values?.["sports_statistics"][sportsStatisticsIndex]["sports_id"]
  );

  const currentSportStatistics = sportsStats.find(
    (sportStat) => sportStat.sportsCode === selectedSport?.["sports_code"]
  );

  const isSubStatisticsPresent =
    selectedSport?.["sports_code"] === "SPOR05" ||
    selectedSport?.["sports_code"] === "SPOR12" ||
    selectedSport?.["sports_code"] === "SPOR13";

  let sportFields = {};
  let fieldName = "";
  if (selectedSport?.["sports_code"] === "SPOR05") {
    sportFields = cricketFields;
    fieldName = "role_type";
  } else if (selectedSport?.["sports_code"] === "SPOR12") {
    sportFields = softballFields;
    fieldName = "softBallStatic";
  } else if (selectedSport?.["sports_code"] === "SPOR13") {
    sportFields = softballFields;
    fieldName = "baseBallStatic";
  }

  if (selectedSport && !selectedSport["is_stats_enabled"]) {
    return (
      <Box>
        <TextSmall fontWeight="medium">
          {selectedSport["sports_name"]} Statistics
        </TextSmall>
        <TextSmall>
          {selectedSport["sports_name"]} statistics fields will be added soon.
          Please enter your statistics as URL or upload as document in the given
          below section.
        </TextSmall>
      </Box>
    );
  }

  if (selectedSport) {
    return (
      <FieldArray
        name={`sports_statistics[${sportsStatisticsIndex}].sportwise_statistics.statsInfo`}
        render={(arrayHelpers) => (
          <>
            <TextSmall fontWeight="medium">
              {selectedSport["sports_name"]} Statistics
            </TextSmall>
            {values["sports_statistics"][
              sportsStatisticsIndex
            ]?.sportwise_statistics?.statsInfo.map((stat, index) => (
              <>
                <SimpleGrid
                  key={index}
                  columns={[1, 2, 2, 3, 4]}
                  spacingX={[0, 5, 10]}
                  spacingY={[2, 4]}
                  w="full"
                  alignItems="flex-end"
                >
                  {currentSportStatistics?.items.map((item) => {
                    if (item.type === "dropDown") {
                      return (
                        <SelectWithValidation
                          name={`sports_statistics[${sportsStatisticsIndex}].sportwise_statistics.statsInfo[${index}][${item.name}]`}
                          label={item.label}
                          placeholder="Select"
                        >
                          {item.options.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.value}
                            </option>
                          ))}
                        </SelectWithValidation>
                      );
                    }

                    return (
                      <TextBoxWithValidation
                        key={item.name}
                        name={`sports_statistics[${sportsStatisticsIndex}].sportwise_statistics.statsInfo[${index}][${item.name}]`}
                        // placeholder={`Enter ${item.label}`}
                        label={item.label}
                      />
                    );
                  })}
                </SimpleGrid>

                {isSubStatisticsPresent &&
                  sportFields[
                    values["sports_statistics"][sportsStatisticsIndex][
                      "sportwise_statistics"
                    ].statsInfo[index][fieldName]
                  ]?.length > 0 && (
                    <SimpleGrid
                      key={index}
                      columns={[1, 1, 2, 2, 4]}
                      spacingX={10}
                      spacingY={5}
                      w="full"
                      alignItems="flex-end"
                    >
                      {sportFields[
                        values["sports_statistics"][sportsStatisticsIndex][
                          "sportwise_statistics"
                        ].statsInfo[index][fieldName]
                      ]?.map((field) => (
                        <TextBoxWithValidation
                          key={field.name}
                          name={`sports_statistics[${sportsStatisticsIndex}].sportwise_statistics.statsInfo[${index}].statsSubInfo[${field.name}]`}
                          label={field.label}
                        />
                      ))}
                    </SimpleGrid>
                  )}
              </>
            ))}

            <ButtonGroup spacing={5} variant="link" colorScheme="primary">
              {currentSportStatistics?.multiple && (
                <Button
                  fontSize="sm"
                  onClick={() => arrayHelpers.push({ statsSubInfo: {} })}
                >
                  + Add Another
                </Button>
              )}
              {values["sports_statistics"][sportsStatisticsIndex][
                "sportwise_statistics"
              ].statsInfo.length > 1 && (
                <Button fontSize="sm" onClick={() => arrayHelpers.pop()}>
                  Remove
                </Button>
              )}
            </ButtonGroup>
          </>
        )}
      />
    );
  }

  return null;
};

export default EditSportsStatistics;
