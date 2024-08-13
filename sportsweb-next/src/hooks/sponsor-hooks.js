import { useMutation, useQueryClient } from "react-query";
import sponsorService from "../services/sponsor-service";

const useCreateSponsor = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return sponsorService.createSponsor(data);
    },
    {
      onSuccess: (_, variables) => {
        const queryKey =
          variables.type === "company"
            ? ["page-sponsors", variables["company_id"]]
            : ["event-sponsors", variables["event_id"]];
        queryClient.invalidateQueries(queryKey);
      },
    }
  );
};

const useUpdateSponsor = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return sponsorService.updateSponsor(data);
    },
    {
      onSuccess: (_, variables) => {
        const queryKey =
          variables.type === "company"
            ? ["page-sponsors", variables["company_id"]]
            : ["event-sponsors", variables["event_id"]];
        queryClient.invalidateQueries(queryKey);
      },
    }
  );
};

const useDeleteSponsor = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return sponsorService.deleteSponsor(data);
    },
    {
      onSuccess: (_, variables) => {
        const queryKey =
          variables.type === "company"
            ? ["page-sponsors", variables.id]
            : ["event-sponsors", variables.id];
        queryClient.invalidateQueries(queryKey);
      },
    }
  );
};

const useSaveSponsorOrder = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return sponsorService.saveSponsorOrder(data);
    },
    {
      onSettled: (_, __, variables) => {
        const queryKey =
          variables.type === "company"
            ? ["page-sponsors", variables.id]
            : ["event-sponsors", variables.id];
        queryClient.invalidateQueries(queryKey);
      },
    }
  );
};

export {
  useCreateSponsor,
  useUpdateSponsor,
  useDeleteSponsor,
  useSaveSponsorOrder,
};
