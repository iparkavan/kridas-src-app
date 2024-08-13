import { useMutation, useQueryClient } from "react-query";
import followerService from "../services/follower-service";

const useCreateFollower = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ type, ...data }) => {
      return followerService.createFollower(type, data);
    },
    {
      onSuccess: (_, variables) => {
        const { type } = variables;
        if (type === "user-follower") {
          queryClient.invalidateQueries([
            "user-followers",
            variables["following_userid"],
          ]);
        } else if (type === "page-follower") {
          queryClient.invalidateQueries([
            "page-followers",
            variables["following_companyid"],
          ]);
        } else if (type === "event-follower") {
          queryClient.invalidateQueries([
            "event-follower",
            variables["following_event_id"],
          ]);
        }
      },
    }
  );
};

const useRemoveFollower = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ type, ...data }) => {
      return followerService.removeFollower(type, data);
    },
    {
      onSuccess: (_, variables) => {
        const { type } = variables;
        if (type === "user-follower") {
          queryClient.invalidateQueries([
            "user-followers",
            variables["following_userid"],
          ]);
        } else if (type === "page-follower") {
          queryClient.invalidateQueries([
            "page-followers",
            variables["following_companyid"],
          ]);
        } else if (type === "event-follower") {
          queryClient.invalidateQueries([
            "event-follower",
            variables["following_event_id"],
          ]);
        }
      },
    }
  );
};

export { useCreateFollower, useRemoveFollower };
