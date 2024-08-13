import { useMutation, useQueryClient } from "react-query";
import tournamentCategoriesService from "../services/tournament-categories-service";

const useUpdatePointConfig = (eventId) => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => tournamentCategoriesService.updatePointConfig(data),
    {
      onSuccess: () => queryClient.invalidateQueries(["event", eventId]),
    }
  );
};

export { useUpdatePointConfig };
