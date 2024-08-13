import { IconButton, useDisclosure } from "@chakra-ui/react";
import { OptionsIcon } from "../../ui/icons";
import PreferencesModal from "./preferences-modal";
import { useInfiniteSearchPlayers } from "../../../hooks/player-hooks";

const ViewPreferences = (props) => {
  let { players, team, tournamentCategory } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isTeam = Boolean(team);
  const {
    data: playersData,
    isLoading,
    isSuccess,
  } = useInfiniteSearchPlayers(
    team?.company_id,
    {
      child_company_id: team?.company_id,
      size: 100,
    },
    isTeam && isOpen
  );

  if (isTeam && isSuccess) {
    players = playersData.pages[0].content.map((p) => ({
      first_name: p.user_details.first_name,
      last_name: p.user_details.last_name,
      preferences_opted: p.preferences_opted,
    }));
  }

  const preferencesOffered = tournamentCategory.preferencesOffered
    ? JSON.parse(tournamentCategory.preferencesOffered)
    : tournamentCategory.preferencesOffered;

  const isApparelPresent = Boolean(
    preferencesOffered?.apparel_preference.length > 0
  );
  const isFoodPresent = Boolean(preferencesOffered?.food_preference.length > 0);
  const arePreferencesPresent = isApparelPresent || isFoodPresent;
  if (!arePreferencesPresent) {
    return null;
  }

  return (
    <>
      <IconButton
        aria-label="View Preferences"
        variant="ghost"
        size="sm"
        icon={<OptionsIcon fontSize="16px" />}
        pos="absolute"
        top="8px"
        left="8px"
        onClick={onOpen}
      />
      <PreferencesModal
        isOpen={isOpen}
        onClose={onClose}
        players={players}
        isPlayersLoading={isLoading}
        isApparelPresent={isApparelPresent}
        isFoodPresent={isFoodPresent}
      />
    </>
  );
};

export default ViewPreferences;
