import { useMutation, useQuery, useQueryClient } from "react-query";
import accountDeletionService from "../services/account-deletion-service";

const usePostAccountDeletion = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return accountDeletionService.postAccountDeletion(data);
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries([
          "account-deletion-request",
          variables.user_id,
        ]);
      },
    }
  );
};

const useGetAccountDeletionByUserId = (userId) => {
  return useQuery(
    ["account-deletion-request", userId],
    () => accountDeletionService.getAccountDeletionByUserId(userId),
    {
      enabled: !!userId,
    }
  );
};

export { usePostAccountDeletion, useGetAccountDeletionByUserId };
