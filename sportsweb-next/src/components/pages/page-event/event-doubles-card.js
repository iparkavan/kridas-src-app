import React from "react";
import {
  Avatar,
  Box,
  HStack,
  LinkBox,
  LinkOverlay,
  Stack,
} from "@chakra-ui/react";
import { HeadingSmall } from "../../ui/heading/heading";
import Skeleton from "../../ui/skeleton";
import routes from "../../../helper/constants/route-constants";
import ViewPreferences from "../../events/preferences/view-preferences";

function EventDoublesCard(props) {
  const { isLoading, eventTeamData, currentEvent, tournamentCategory } = props;
  const updatedPlayers = {};
  eventTeamData &&
    eventTeamData.forEach((team) => {
      if (team) {
        const tournament_player_reg_id = team.tournament_player_reg_id;
        const tournamentPlayerRegId = updatedPlayers[tournament_player_reg_id];
        if (tournamentPlayerRegId) {
          updatedPlayers[tournament_player_reg_id].push(team);
        } else {
          updatedPlayers[tournament_player_reg_id] = [team];
        }
      }
    });

  return (
    <>
      {eventTeamData && isLoading ? (
        <Skeleton w="full" minH="100vh">
          Loading..
        </Skeleton>
      ) : (
        <>
          {Object.keys(updatedPlayers)?.map((tournamentPlayerRegId) => (
            <Box key={tournamentPlayerRegId} p={2}>
              <Stack
                maxW={["220px", "200px", "250px"]}
                w={["220px", "200px", "250px"]}
                bg={"white"}
                boxShadow={"xl"}
                borderRadius={"10px"}
                overflow={"hidden"}
                p={8}
                spacing={4}
                pos="relative"
              >
                {currentEvent && (
                  <ViewPreferences
                    players={updatedPlayers[tournamentPlayerRegId]}
                    tournamentCategory={tournamentCategory}
                  />
                )}
                {updatedPlayers[tournamentPlayerRegId]?.map((data) => (
                  <LinkBox key={data.user_id}>
                    <HStack>
                      <Avatar
                        name={data.first_name}
                        src={data.user_profile_img}
                      />
                      <HeadingSmall noOfLines={2}>
                        <LinkOverlay href={routes.userProfile(data.user_id)}>
                          {data.first_name} {data.last_name}
                        </LinkOverlay>
                      </HeadingSmall>
                    </HStack>
                  </LinkBox>
                ))}
              </Stack>
            </Box>
          ))}
        </>
      )}
    </>
  );
}

export default EventDoublesCard;
