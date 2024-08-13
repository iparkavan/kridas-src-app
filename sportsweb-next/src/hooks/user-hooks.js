import { useQuery, useMutation, useQueryClient } from "react-query";
import { useSession } from "next-auth/react";
import userService from "../services/user-service";

const useUser = () => {
  const { data: session, status } = useSession();
  return useQuery(["user"], () => userService.getUser(session.user.userId), {
    select: (data) => {
      data["full_name"] = `${data["first_name"]} ${data["last_name"]}`;
      return data;
    },
    // refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: status === "authenticated",
  });
};

const useUserById = (userId) => {
  return useQuery(["user", userId], () => userService.getUser(userId), {
    select: (data) => {
      data["full_name"] = `${data["first_name"]} ${data["last_name"]}`;
      return data;
    },
    enabled: !!userId,
  });
};

const useUserByUsername = (username, userId) => {
  return useQuery(
    ["user", username],
    () => userService.getUserByUsername(username, userId),
    {
      select: (data) => {
        data["full_name"] = `${data["first_name"]} ${data["last_name"]}`;
        return data;
      },
      enabled: !!username,
    }
  );
};

const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ type, ...data }) => {
      return userService.updateUser(type, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
      },
    }
  );
};

const useChangeUserPassword = () => {
  return useMutation((data) => {
    return userService.updatePassword(data);
  });
};

const useResetUserPassword = () => {
  return useMutation((data) => {
    return userService.resetPassword(data);
  });
};

const useSearchByName = () => {
  return useMutation((data) => {
    return userService.searchByName(data);
  });
};

const useUserFollowersById = (userId, type = "") => {
  return useQuery(
    ["user-followers", userId, type],
    () => userService.getUserFollowers(userId, type),
    {
      enabled: !!userId,
    }
  );
};

const useActivateUser = () => {
  return useMutation((data) => {
    return userService.activateUser(data);
  });
};

const useUserByPlayerId = (playerId) => {
  return useQuery(
    ["player", playerId],
    () => userService.getUserByPlayerId(playerId),
    {
      enabled: !!playerId,
    }
  );
};

export {
  useUser,
  useUpdateUser,
  useChangeUserPassword,
  useResetUserPassword,
  useSearchByName,
  useUserById,
  useUserByUsername,
  useUserFollowersById,
  useActivateUser,
  useUserByPlayerId,
};
