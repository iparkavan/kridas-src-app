import { useMutation, useQuery, useQueryClient } from "react-query";
import teamService from "../services/team-service";

const useTeams = (id, isEnabled = true) => {
  return useQuery(["event-team", id], () => teamService.getTeam(id), {
    enabled: !!id && isEnabled,
  });
};

const useTeamByCompanyId = (id) => {
  return useQuery(
    ["event-player", id],
    () => teamService.getTeamByCompanyId(id),
    {
      enabled: !!id,
    }
  );
};

const useTeamByTeamId = (id) => {
  return useQuery(["user-player", id], () => teamService.getTeamByTeamId(id), {
    enabled: !!id,
  });
};

const useCreateChildPage = () => {
  const queryClient = useQueryClient();
  return useMutation((data) => teamService.createChildPage(data), {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries([
        "child-pages",
        variables["parent_company_id"],
      ]);
    },
  });
};

const useRegisterTeam = () => {
  return useMutation((data) => teamService.registerTeam(data));
};

const useRegisterTeamValidation = () => {
  return useMutation((data) => teamService.registerTeamValidation(data));
};

const usePreferences = (tournamentCategoryId) => {
  return useQuery(["preferences", tournamentCategoryId], () =>
    teamService.getPreferences(tournamentCategoryId)
  );
};

const usePreferencesDetails = (data) => {
  return useQuery(["preferences-details", data], () =>
    teamService.getPreferencesDetails(data)
  );
};

export {
  useTeams,
  useTeamByCompanyId,
  useTeamByTeamId,
  useCreateChildPage,
  useRegisterTeam,
  useRegisterTeamValidation,
  usePreferences,
  usePreferencesDetails,
};
