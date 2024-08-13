import { useQuery } from "react-query";
import tournamentStandingService from "../services/tournament-standing-service";

const useTournamentStandingByCategoryId = (tournamentCategoryId) => {
  return useQuery(
    ["tournament-standing", tournamentCategoryId],
    () =>
      tournamentStandingService.getTournamentStandingByCategoryId(
        tournamentCategoryId
      ),
    {
      enabled: !!tournamentCategoryId,
    }
  );
};

export { useTournamentStandingByCategoryId };
