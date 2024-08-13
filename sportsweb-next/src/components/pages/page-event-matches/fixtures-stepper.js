import { Flex } from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import React, { useState } from "react";
import EventRoundRobinFixtures from "./event-fixtures-round-robin";
import EventTeamRoundRobin from "./event-fixtures-team-round-robin";
import EventFixturesRoundRobin from "./event-fixtures-team-round-robin";
import EventGroupKnockoutFixtures from "./event-group-knockout-fixtures";
import EventGroupLeagueFixtures from "./event-group-league-fixtures";

import EventMatchDoubles from "./event-match-doubles";

import EventMatchIndividual from "./event-match-individual";
import EventMatchPreview from "./event-match-preview";
import EventMatchTeam from "./event-match-teams";
import LeagueFixtures from "./league-fixtures";

function FixtureStepper({
  type,
  eventData,
  tournamentCategoryId,
  currentEvent,
  tournamentCategories,
  setMatches,
  matches,
  eventTeamData,
  isLoading,
}) {
  const [noOfReg, setNoOfReg] = useState();
  const [teams, setTeams] = useState([]);
  const [noOfRound, setNoOfRound] = useState();
  const [league, setLeague] = useState();
  const [knockout, setKnockout] = useState();
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  });
  const [groupNo, setGroupNo] = useState();
  const [group, setGroup] = useState();
  const isFormate = eventData.tournaments.map((code) =>
    code.tournamentCategories.map((formateCode) => formateCode.tournamentFormat)
  );

  const isDoubles = eventTeamData.map((obj) => {
    return obj.tournament_player_reg_id;
  });

  const tournamentCategory = tournamentCategories.find(
    (tc) => tc.tournamentCategoryId == tournamentCategoryId
  );

  const formatCode = tournamentCategory?.sports_format.find(
    (sportCategory) =>
      sportCategory.format_code === tournamentCategory.tournamentFormat
  )?.format_code;

  const categoryName = tournamentCategory?.sports_category.find(
    (sportCategory) =>
      sportCategory.category_code === tournamentCategory.tournamentCategory
  )?.category_name;

  const catType = tournamentCategory?.sports_category.find(
    (sportCategory) =>
      sportCategory.category_code === tournamentCategory.tournamentCategory
  )?.type;

  const formatName = tournamentCategory?.sports_format.find(
    (sportCategory) =>
      sportCategory.format_code === tournamentCategory.tournamentFormat
  )?.format_name;

  const typeValid = isDoubles.length !== new Set(isDoubles).size;

  const updatedRegister = [];
  const updatedActivities = {};
  eventTeamData &&
    eventTeamData.forEach((teams) => {
      if (teams) {
        const tournament_player_reg_id = teams.tournament_player_reg_id;
        const dataObj = updatedActivities[tournament_player_reg_id];
        if (dataObj) {
          updatedActivities[tournament_player_reg_id].push(teams);
          updatedRegister.push(tournament_player_reg_id);
        } else {
          updatedActivities[tournament_player_reg_id] = [teams];
        }
      }
    });

  const doubleTeam = Object.keys(updatedActivities).map(
    (tournamentPlayerRegId) =>
      updatedActivities[tournamentPlayerRegId].map((data) => data.first_name)
  );

  const steps = [
    formatCode === "LGEKNO" && catType === "Team" //|| // changed round robin to league/knock out
      ? // (formatCode === "LGEKCK" && catType === "Team")
        {
          label: "Teams",
          component: EventTeamRoundRobin,
        }
      : catType && catType === "Team"
      ? {
          label: "Teams",
          component: EventMatchTeam,
        }
      : catType === "Doubles"
      ? {
          label: "Doubles",
          component: EventMatchDoubles,
        }
      : {
          label: "Participant",
          component: EventMatchIndividual,
        },

    formatCode === "LGEKNO" //RNDROB replaced  to LGEKNO  // changed round robin to league/knock out
      ? {
          label: " League Fixtures",
          component: EventRoundRobinFixtures,
        }
      : formatCode === "GRPKNO" //|| formatCode === "LGEKCK" // LGEKNO REPLACED TO group  // changed  league/knock out to group knockout
      ? {
          label: "League Fixtures",
          component: EventGroupLeagueFixtures,
        }
      : {
          label: "Fixtures",
          component: LeagueFixtures,
        },
    {
      label: "Preview",
      component: EventMatchPreview,
    },
  ];
  if (
    formatCode === "GRPKNO" ||
    formatCode === "LGEKNO" // changed round robin to league/knock out
  ) {
    steps.splice(2, 0, {
      label: "Knockout Fixtures",
      component: EventGroupKnockoutFixtures,
    });
  }
  return (
    <Flex flexDir="column" p={5} width="100%">
      <Steps
        labelOrientation="vertical"
        activeStep={activeStep}
        colorScheme="blue"
      >
        {steps.map((step, index) => {
          const Component = step.component;
          return (
            <Step label={step.label} key={step.label}>
              <Component
                eventData={eventData}
                knockout={knockout}
                setKnockout={setKnockout}
                league={league}
                setLeague={setLeague}
                group={group}
                setGroup={setGroup}
                setGroupNo={setGroupNo}
                groupNo={groupNo}
                setNoOfRound={setNoOfRound}
                noOfRound={noOfRound}
                noOfReg={noOfReg}
                setNoOfReg={setNoOfReg}
                teams={teams}
                setTeams={setTeams}
                formatName={formatName}
                categoryName={categoryName}
                tournamentCategory={tournamentCategory}
                formatCode={formatCode}
                doubleTeam={doubleTeam}
                updatedRegister={updatedRegister}
                updatedActivities={updatedActivities}
                typeValid={typeValid}
                isLoading={isLoading}
                eventTeamData={eventTeamData}
                nextStep={nextStep}
                prevStep={prevStep}
                activeStep={activeStep}
                steps={steps}
                isFormate={isFormate}
                tournamentCategories={tournamentCategories}
                tournamentCategoryId={tournamentCategoryId}
                setMatches={setMatches}
                matches={matches}
              />
            </Step>
          );
        })}
      </Steps>
    </Flex>
  );
}
export default FixtureStepper;
