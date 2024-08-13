import { useMutation, useQuery, useQueryClient } from "react-query";
import tournamentService from "../services/tournament-service";

const useFixturesMasterByTournamentCatId = (tournamentCategoryId) => {
  return useQuery(
    ["fixtures-setup", tournamentCategoryId],
    () =>
      tournamentService.getFixturesMasterByTournamentCatId(
        tournamentCategoryId
      ),
    {
      enabled: !!tournamentCategoryId,
    }
  );
};

const useSaveFixturesSetup = () => {
  const queryClient = useQueryClient();
  return useMutation((data) => tournamentService.saveFixturesSetup(data), {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries([
        "fixtures-setup",
        variables.tournamentFixtureMaster.tournamentCategoryId,
      ]);
    },
  });
};

const useGenerateFixtures = () => {
  const queryClient = useQueryClient();
  return useMutation((data) => tournamentService.generateFixtures(data), {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries([
        "fixtures-setup",
        variables.tournamentFixtureMaster.tournamentCategoryId,
      ]);
    },
  });
};

const useSaveFixtures = () => {
  const queryClient = useQueryClient();
  return useMutation((data) => tournamentService.saveFixtures(data), {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries([
        "fixtures-setup",
        variables.tournamentFixtureMaster.tournamentCategoryId,
      ]);
      queryClient.invalidateQueries([
        "fixtures",
        variables.tournamentFixtureMaster.tournamentCategoryId,
      ]);
    },
  });
};

const useFixturesByTournamentCatId = (
  tournamentCategoryId,
  fixturesFilter,
  isEnabled = true
) => {
  return useQuery(
    ["fixtures", tournamentCategoryId, fixturesFilter],
    () =>
      tournamentService.getFixturesByTournamentCatId(
        tournamentCategoryId,
        fixturesFilter
      ),
    {
      enabled: !!tournamentCategoryId && isEnabled,
    }
  );
};

const useUpdateFixture = () => {
  const queryClient = useQueryClient();
  return useMutation((data) => tournamentService.updateFixture(data), {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries([
        "fixtures",
        variables.tournamentCategoryId,
      ]);
    },
  });
};

export {
  useFixturesMasterByTournamentCatId,
  useSaveFixturesSetup,
  useGenerateFixtures,
  useSaveFixtures,
  useFixturesByTournamentCatId,
  useUpdateFixture,
};
