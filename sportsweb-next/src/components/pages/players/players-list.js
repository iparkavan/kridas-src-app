import { SimpleGrid } from "@chakra-ui/react";
import PlayerCard from "./player-card";

const PlayersList = ({ players, isChildPage }) => {
  return (
    <SimpleGrid columns={3} spacingX={10} spacingY={6}>
      {players?.map((player) => (
        <PlayerCard
          key={player.company_team_players_id}
          player={player}
          isChildPage={isChildPage}
        />
      ))}
    </SimpleGrid>
  );
};

export default PlayersList;
