import { useState } from "react";
import {
  Box,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import EventTeamsCard from "./event-teams-card";
import { useSports } from "../../../hooks/sports-hooks";
import { useTeams } from "../../../hooks/team-hooks";
import EventDoublesCard from "./event-doubles-card";
import PreferencesDashboard from "./preferences-dashboard";
import Button from "../../ui/button";

function EventTeams({ eventData, sports, currentEvent }) {
  const selectedTab = {
    borderColor: "primary.500",
    color: "white",
    bg: "#3182CE",
  };

  // const { data: sports = [] } = useSports();
  // const [tabIndex, setTabIndex] = useState(0);
  // const [tournamentCategory, setTournamentCategory] = useState(
  //   eventData?.tournaments?.[0]?.tournamentCategories?.[0]
  // );

  return (
    <Box w="full">
      <Tabs
        orientation="vertical"
        w="full"
        bgColor="white"
        size="md"
        variant={"'unstyled"}
        minH="100vh"
        isLazy
      >
        <TabList gap={[1, 4, 5]} w="48">
          {eventData?.tournaments?.map((dataOne) => {
            const sport = sports.find(
              (s) => s["sports_id"] == dataOne["sportsRefid"]
            );
            return dataOne.tournamentCategories.map((tournamentCategory) => {
              const categoryName = sport?.sports_category.find(
                (cat) =>
                  cat.category_code === tournamentCategory.tournamentCategory
              )?.category_name;
              return (
                <Tab
                  key={tournamentCategory.tournamentCategoryId}
                  gap={5}
                  _focus={{ boxShadow: "none" }}
                  p={2}
                  _selected={selectedTab}
                  w="auto"
                  // onClick={() => setTournamentCategory(tournamentCategory)}
                >
                  {sport && sport?.sports_name} - {categoryName}
                </Tab>
              );
            });
          })}
        </TabList>
        <TabPanels>
          {eventData?.tournaments?.map((dataOne) => {
            return dataOne.tournamentCategories.map((tournamentCategory) => {
              return (
                <TabPanel key={tournamentCategory.tournamentCategoryId}>
                  <EventTeam
                    tournamentCategory={tournamentCategory}
                    currentEvent={currentEvent}
                  />
                </TabPanel>
              );
            });
          })}
        </TabPanels>
      </Tabs>
    </Box>
  );
}

const EventTeam = ({ tournamentCategory, currentEvent }) => {
  const [showPreferences, setShowPreferences] = useState(false);

  const { data: eventTeamData = [], isLoading } = useTeams(
    tournamentCategory?.tournamentCategoryId
  );

  const isDoubles = eventTeamData.map((obj) => {
    return obj.tournament_player_reg_id;
  });

  const typeValid = isDoubles.length !== new Set(isDoubles).size;

  const preferencesOffered =
    typeof tournamentCategory.preferencesOffered === "string"
      ? JSON.parse(tournamentCategory.preferencesOffered)
      : tournamentCategory.preferencesOffered;
  const isApparelPresent = Boolean(
    preferencesOffered?.apparel_preference.length > 0
  );
  const isFoodPresent = Boolean(preferencesOffered?.food_preference.length > 0);
  const arePreferencesPresent = isApparelPresent || isFoodPresent;

  return showPreferences ? (
    <PreferencesDashboard
      setShowPreferences={setShowPreferences}
      tournamentCategory={tournamentCategory}
    />
  ) : (
    <>
      {eventTeamData.length > 0 && currentEvent && arePreferencesPresent && (
        <HStack justifyContent="end">
          <Button
            variant="link"
            textDecoration="underline"
            onClick={() => setShowPreferences(true)}
          >
            Preferences Dashboard
          </Button>
        </HStack>
      )}
      <HStack wrap="wrap" mt={2} justifyContent="flex-start">
        {typeValid ? (
          <EventDoublesCard
            isLoading={isLoading}
            eventTeamData={eventTeamData}
            currentEvent={currentEvent}
            tournamentCategory={tournamentCategory}
          />
        ) : (
          <EventTeamsCard
            isLoading={isLoading}
            eventTeamData={eventTeamData}
            currentEvent={currentEvent}
            tournamentCategory={tournamentCategory}
          />
        )}
      </HStack>
    </>
  );
};

export default EventTeams;
