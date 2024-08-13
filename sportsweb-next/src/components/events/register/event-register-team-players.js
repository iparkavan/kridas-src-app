import { useState } from "react";
import {
  Avatar,
  Box,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  GridItem,
  HStack,
  SimpleGrid,
} from "@chakra-ui/react";
import Button from "../../ui/button";
import Modal from "../../ui/modal";
import { TextMedium, TextSmall } from "../../ui/text/text";
import { referralToPlayerId } from "../../../helper/constants/user-contants";

const EventRegisterTeamPlayers = (props) => {
  const {
    isOpen,
    onClose,
    players,
    helpers,
    sport,
    formik,
    arePreferencesPresent,
  } = props;

  const [selectedPlayers, setSelectedPlayers] = useState([]);

  const handleAddPlayers = () => {
    const teamMembers = formik.values.team_members;
    selectedPlayers.forEach((playerId) => {
      const player = players.find((player) => player.user_id === playerId);
      const playerObj = {
        player_id: referralToPlayerId(player.user_details.referral_code),
        first_name: player.user_details.first_name,
        last_name: player.user_details.last_name,
        email_id: player.user_details.user_email,
        contact_number: player.user_details.user_phone || "",
        dob: new Date(player.user_details.user_dob),
        gender: player.user_details.user_gender || "",
        ...(arePreferencesPresent && { preferences_opted: null }),
        isSelected: true,
      };

      const memberIndex = teamMembers.findIndex((member) => {
        return Object.entries(member).every(([key, val]) => {
          if (
            key === "player_id" ||
            key === "first_name" ||
            key === "last_name" ||
            key === "email_id" ||
            key === "contact_number" ||
            key === "dob" ||
            key === "gender"
          ) {
            return !val;
          }
          return true;
        });
      });
      if (memberIndex === -1) {
        // helpers.push(playerObj);
        teamMembers.push({
          ...playerObj,
          key: teamMembers[teamMembers.length - 1].key + 1,
        });
      } else {
        // helpers.replace(memberIndex, playerObj);
        teamMembers[memberIndex] = {
          ...playerObj,
          key: teamMembers[memberIndex].key,
        };
      }
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Players from Team"
      size="3xl"
      scrollBehavior="inside"
    >
      <CheckboxGroup
        onChange={(values) => setSelectedPlayers(values)}
        value={selectedPlayers}
      >
        <SimpleGrid
          columns={2}
          border="1px"
          borderColor="gray.300"
          p={6}
          borderRadius="lg"
          spacingX={10}
          spacingY={5}
        >
          {players?.map((player) => {
            const fullName = `${player.user_details.first_name} ${player.user_details.last_name}`;

            return (
              <GridItem key={player.user_id}>
                <HStack spacing={3} h="full">
                  <Box
                    border="1px"
                    borderColor="gray.300"
                    p={5}
                    borderRadius="lg"
                    w="full"
                    h="inherit"
                  >
                    <HStack spacing={3} h="inherit">
                      <Avatar
                        name={fullName}
                        src={player.user_details.user_profile_img}
                      />
                      <Box>
                        <TextMedium>{fullName}</TextMedium>
                        <TextSmall>{sport.sports_name}</TextSmall>
                      </Box>
                    </HStack>
                  </Box>
                  <Checkbox borderColor="primary.500" value={player.user_id} />
                </HStack>
              </GridItem>
            );
          })}
        </SimpleGrid>
      </CheckboxGroup>
      <ButtonGroup mt={5} w="full" justifyContent="flex-end" spacing={3}>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleAddPlayers}>Add</Button>
      </ButtonGroup>
    </Modal>
  );
};

export default EventRegisterTeamPlayers;
