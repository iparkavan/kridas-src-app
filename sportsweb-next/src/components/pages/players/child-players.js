import { Skeleton } from "@chakra-ui/react";
import { usePlayersByCompanyId } from "../../../hooks/player-hooks";
import PlayersList from "./players-list";

const ChildPlayers = ({ pageData }) => {
  const {
    data: players,
    isLoading,
    isSuccess,
  } = usePlayersByCompanyId(pageData?.company_id);

  return (
    <Skeleton isLoaded={!isLoading}>
      {isSuccess && <PlayersList players={players} isChildPage={true} />}
    </Skeleton>
  );
};

export default ChildPlayers;
