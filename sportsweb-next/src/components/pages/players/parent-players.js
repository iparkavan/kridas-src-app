import { Skeleton } from "@chakra-ui/react";
import { usePlayersByParentCompanyId } from "../../../hooks/player-hooks";
import PlayersList from "./players-list";

const ParentPlayers = ({ pageData }) => {
  const {
    data: players,
    isLoading,
    isSuccess,
  } = usePlayersByParentCompanyId(pageData?.company_id);

  return (
    <Skeleton isLoaded={!isLoading}>
      {isSuccess && <PlayersList players={players} isChildPage={false} />}
    </Skeleton>
  );
};

export default ParentPlayers;
