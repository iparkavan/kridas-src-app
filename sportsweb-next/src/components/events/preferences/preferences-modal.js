import { Grid, GridItem, Skeleton, VStack } from "@chakra-ui/react";
import Modal from "../../ui/modal";
import { TextCustom, TextMedium, TextSmall } from "../../ui/text/text";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";

const PreferencesModal = (props) => {
  const {
    isOpen,
    onClose,
    players,
    isPlayersLoading,
    isApparelPresent,
    isFoodPresent,
  } = props;

  const { data: apparelData = [] } = useLookupTable("APP");
  const { data: foodData = [] } = useLookupTable("FDO");

  return (
    <Modal size="4xl" isOpen={isOpen} onClose={onClose} title="Preferences">
      {isPlayersLoading ? (
        <Skeleton h={6} />
      ) : (
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

          {players?.map((player) => {
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
    </Modal>
  );
};

export default PreferencesModal;
