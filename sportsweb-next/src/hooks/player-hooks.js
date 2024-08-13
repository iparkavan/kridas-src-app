import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "react-query";
import playerService from "../services/player-service";

const useAddPlayer = () => {
  const queryClient = useQueryClient();
  return useMutation((data) => playerService.addPlayer(data), {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries([
        "players-filter",
        variables["company_id"],
      ]);
    },
  });
};

const usePlayersByCompanyId = (pageId) => {
  return useQuery(
    ["child-players", pageId],
    () => playerService.getPlayersByCompanyId(pageId),
    {
      enabled: !!pageId,
    }
  );
};

const usePlayersByParentCompanyId = (pageId) => {
  return useQuery(
    ["parent-players", pageId],
    () => playerService.getPlayersByParentCompanyId(pageId),
    {
      enabled: !!pageId,
    }
  );
};

const useUpdatePlayerStatus = () => {
  const queryClient = useQueryClient();
  return useMutation((data) => playerService.updatePlayerStatus(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["players-filter"]);
    },
  });
};

const useInfiniteSearchPlayers = (pageId, filters, enabled = true) => {
  return useInfiniteQuery(
    ["players-filter", pageId, filters],
    (params) =>
      playerService.getInfiniteSearchPlayers({
        ...params,
        filters,
      }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
      enabled,
    }
  );
};

export {
  useAddPlayer,
  usePlayersByCompanyId,
  usePlayersByParentCompanyId,
  useUpdatePlayerStatus,
  useInfiniteSearchPlayers,
};
