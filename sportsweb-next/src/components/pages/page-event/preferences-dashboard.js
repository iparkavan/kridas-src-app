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
import { TextMedium } from "../../ui/text/text";
import { BackButton } from "../../ui/icons";
import { usePreferences } from "../../../hooks/team-hooks";
import { HeadingMedium } from "../../ui/heading/heading";
import Button from "../../ui/button";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";
import PreferencesDetailed from "./preferences-detailed";

const PreferencesDashboard = (props) => {
  const { setShowPreferences, tournamentCategory } = props;
  const [showDetailed, setShowDetailed] = useState(false);

  const { data: apparelData } = useLookupTable("APP");
  const { data: sizesData } = useLookupTable("ASZ");
  const { data: foodData } = useLookupTable("FDO");

  const { data: preferencesData, isLoading } = usePreferences(
    tournamentCategory.tournamentCategoryId
  );

  return (
    <Box>
      {showDetailed ? (
        <PreferencesDetailed
          setShowDetailed={setShowDetailed}
          tournamentCategory={tournamentCategory}
        />
      ) : (
        <Box>
          <HStack mb={5} justifyContent="space-between">
            <IconButton
              aria-label="Back"
              variant="ghost"
              icon={<BackButton fontSize="20px" />}
              onClick={() => setShowPreferences(false)}
            />
            <HeadingMedium fontSize="2xl" color="primary.500">
              Preferences Dashboard
            </HeadingMedium>
            <Button
              variant="link"
              textDecoration="underline"
              onClick={() => setShowDetailed(true)}
            >
              Detailed Preferences
            </Button>
          </HStack>

          {isLoading && <Skeleton h={6} />}

          {preferencesData?.apparel_preferences &&
            Object.keys(preferencesData.apparel_preferences).length > 0 && (
              <>
                <HeadingMedium>Apparel Preferences</HeadingMedium>
                {Object.entries(preferencesData.apparel_preferences).map(
                  ([apparelKey, apparelValue]) => {
                    const apparelName = apparelData?.find(
                      ({ lookup_key }) => lookup_key === apparelKey
                    )?.lookup_value;

                    return (
                      <Box key={apparelKey} mt={5} borderRadius="xl">
                        <TextMedium color="primary.500">
                          {apparelName} - Size (Inches)
                        </TextMedium>
                        <Grid
                          mt={4}
                          templateColumns="repeat(4, max-content)"
                          gap={6}
                        >
                          {Object.entries(apparelValue).map(
                            ([apparelSize, apparelCount]) => {
                              const sizeName = sizesData?.find(
                                ({ lookup_key }) => lookup_key === apparelSize
                              )?.lookup_value;

                              return (
                                <GridItem
                                  key={apparelSize}
                                  p={4}
                                  border="1px solid"
                                  borderColor="primary.500"
                                  borderRadius="xl"
                                  shadow="lg"
                                  minW="140px"
                                >
                                  <VStack>
                                    <TextMedium fontSize="xl">
                                      {apparelSize} {sizeName?.slice(-4)}
                                    </TextMedium>
                                    <TextMedium
                                      fontSize="4xl"
                                      fontWeight="medium"
                                    >
                                      {apparelCount}
                                    </TextMedium>
                                  </VStack>
                                </GridItem>
                              );
                            }
                          )}
                        </Grid>
                      </Box>
                    );
                  }
                )}
              </>
            )}

          {preferencesData?.food_preferences &&
            Object.keys(preferencesData.food_preferences).length > 0 && (
              <>
                <HeadingMedium my={6}>Food Preferences</HeadingMedium>
                <Grid templateColumns="repeat(2, max-content)" gap={6}>
                  {Object.entries(preferencesData.food_preferences).map(
                    ([foodKey, foodValue]) => {
                      const foodName = foodData?.find(
                        ({ lookup_key }) => lookup_key === foodKey
                      )?.lookup_value;

                      return (
                        <GridItem key={foodKey}>
                          <VStack>
                            <TextMedium color="primary.500">
                              {foodName}
                            </TextMedium>
                            <Box
                              p={6}
                              minW="140px"
                              border="1px solid"
                              borderColor="primary.500"
                              borderRadius="xl"
                              shadow="lg"
                            >
                              <TextMedium
                                fontSize="4xl"
                                fontWeight="medium"
                                textAlign="center"
                              >
                                {foodValue}
                              </TextMedium>
                            </Box>
                          </VStack>
                        </GridItem>
                      );
                    }
                  )}
                </Grid>
              </>
            )}
        </Box>
      )}
    </Box>
  );
};

export default PreferencesDashboard;
