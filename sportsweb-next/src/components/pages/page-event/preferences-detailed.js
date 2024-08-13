import { useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Skeleton,
  VStack,
} from "@chakra-ui/react";
import { BackButton } from "../../ui/icons";
import { TextCustom, TextMedium, TextSmall } from "../../ui/text/text";
import { usePreferencesDetails } from "../../../hooks/team-hooks";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";
import { HeadingMedium } from "../../ui/heading/heading";
import PreferencesFilter from "./preferences-filter";
import Button from "../../ui/button";

const PreferencesDetailed = (props) => {
  const { setShowDetailed, tournamentCategory } = props;

  const { data: apparelData = [] } = useLookupTable("APP");
  const { data: sizesData = [] } = useLookupTable("ASZ");
  const { data: foodData = [] } = useLookupTable("FDO");

  const [filters, setFilters] = useState({
    apparel_preference: {},
    food_preference: "",
  });

  const {
    data: playerPreferencesData,
    isLoading,
    isSuccess,
  } = usePreferencesDetails({
    tournament_category_id: tournamentCategory.tournamentCategoryId,
    ...filters,
  });

  const preferencesOffered = tournamentCategory.preferencesOffered
    ? JSON.parse(tournamentCategory.preferencesOffered)
    : tournamentCategory.preferencesOffered;
  const isApparelPresent = Boolean(
    preferencesOffered?.apparel_preference.length > 0
  );
  const isFoodPresent = Boolean(preferencesOffered?.food_preference.length > 0);

  const arePlayersPresent = Boolean(
    isSuccess && playerPreferencesData?.length > 0
  );

  let areFiltersApplied = false;
  if (isApparelPresent) {
    areFiltersApplied = Object.values(filters.apparel_preference).some(
      (val) => val
    );
  }
  if (isFoodPresent) {
    areFiltersApplied = areFiltersApplied || Boolean(filters.food_preference);
  }

  const handleClearFilters = () => {
    setFilters({
      apparel_preference: {},
      food_preference: "",
    });
  };

  return (
    <Box>
      <IconButton
        aria-label="Back"
        variant="ghost"
        icon={<BackButton fontSize="20px" />}
        onClick={() => setShowDetailed(false)}
      />
      <HStack mt={2} ml={2} mb={5}>
        <HeadingMedium fontSize="2xl" mr="auto">
          Detailed Preferences
        </HeadingMedium>
        <PreferencesFilter
          filters={filters}
          setFilters={setFilters}
          tournamentCategory={tournamentCategory}
          apparelData={apparelData}
          sizesData={sizesData}
          foodData={foodData}
          areFiltersApplied={areFiltersApplied}
        />
        {areFiltersApplied && (
          <Button variant="outline" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        )}
      </HStack>

      {isLoading && <Skeleton h={6} />}

      {!isLoading && !arePlayersPresent && (
        <TextMedium ml={2}>No players are present</TextMedium>
      )}

      {arePlayersPresent && (
        <Grid
          templateColumns={`auto ${isApparelPresent ? "auto" : ""} ${
            isFoodPresent ? "auto" : ""
          }`}
          gap={5}
          justifyItems="center"
        >
          <GridItem>
            <TextCustom color="primary.500" fontSize="xl">
              Name
            </TextCustom>
          </GridItem>
          {isApparelPresent && (
            <GridItem>
              <TextCustom color="primary.500" fontSize="xl">
                Apparel Preference
              </TextCustom>
            </GridItem>
          )}
          {isFoodPresent && (
            <GridItem>
              <TextCustom color="primary.500" fontSize="xl">
                Food Preference
              </TextCustom>
            </GridItem>
          )}

          {playerPreferencesData?.map((player) => {
            const fullName = `${player.first_name} ${player.last_name}`;
            let apparels, isTShirtPresent, nameToPrint, noToPrint;
            const isPlayerApparelPresent = Boolean(
              player.preferences_opted?.apparel_preference
            );
            if (isPlayerApparelPresent) {
              const apparelPreferences =
                player.preferences_opted.apparel_preference;
              apparels = Object.entries(apparelPreferences)
                .map(([key, value]) => {
                  const apparelName = apparelData.find(
                    (app) => app.lookup_key === key
                  )?.lookup_value;
                  return `${apparelName}: ${value.size}`;
                })
                .join(", ");
              isTShirtPresent = Boolean(
                Object.keys(apparelPreferences).find((key) => key === "TST")
              );
              if (isTShirtPresent) {
                nameToPrint =
                  player.preferences_opted.apparel_preference.TST.nameToPrint;
                noToPrint =
                  player.preferences_opted.apparel_preference.TST.numberToPrint;
              }
            }

            let foodPreference;
            const isPlayerFoodPresent = Boolean(
              player.preferences_opted?.food_preference
            );
            if (isPlayerFoodPresent) {
              foodPreference = foodData.find(
                (food) =>
                  food.lookup_key === player.preferences_opted.food_preference
              )?.lookup_value;
            }

            return (
              <>
                <GridItem>
                  <TextMedium>{fullName}</TextMedium>
                </GridItem>
                {isApparelPresent && (
                  <GridItem>
                    {isPlayerApparelPresent ? (
                      <VStack spacing={0}>
                        <TextMedium>{apparels}</TextMedium>
                        {isTShirtPresent && (
                          <>
                            <TextSmall color="gray.500">
                              Name to be Printed: {nameToPrint}
                            </TextSmall>
                            <TextSmall color="gray.500">
                              Number to be Printed: {noToPrint}
                            </TextSmall>
                          </>
                        )}
                      </VStack>
                    ) : (
                      <TextMedium>-</TextMedium>
                    )}
                  </GridItem>
                )}
                {isFoodPresent && (
                  <GridItem>
                    <TextMedium>
                      {isPlayerFoodPresent ? foodPreference : "-"}
                    </TextMedium>
                  </GridItem>
                )}
              </>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default PreferencesDetailed;
