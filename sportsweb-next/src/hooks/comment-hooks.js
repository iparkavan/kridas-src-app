import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import commentService from "../services/comment-service";

const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ queryKey, ...data }) => {
      return commentService.createComment(data);
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(variables.queryKey);
        queryClient.invalidateQueries([variables.feedId, "comments"]);
      },
    }
  );
};

const useInfiniteComments = (feedId) => {
  return useInfiniteQuery(
    [feedId, "comments"],
    (params) => commentService.getInfiniteComments({ ...params, feedId }),
    {
      enabled: !!feedId,
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
    }
  );
};

const useUpdateComment = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ queryKey, ...data }) => {
      return commentService.updateComment(data);
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(variables.queryKey);
        queryClient.invalidateQueries([variables.feedId, "comments"]);
      },
    }
  );
};

const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return commentService.deleteComment(data);
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(variables.queryKey);
        queryClient.invalidateQueries([variables.feedId, "comments"]);
      },
    }
  );
};

export {
  useCreateComment,
  useInfiniteComments,
  useUpdateComment,
  useDeleteComment,
};
