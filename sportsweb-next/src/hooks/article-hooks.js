import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "react-query";
import articleService from "../services/article-service";

const useCreateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ type, ...data }) => articleService.createArticle(type, data),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries(["articles", response.article_id]);
      },
    }
  );
};

const useCreateArticleFeed = () => {
  return useMutation((data) => articleService.createArticleFeed(data));
};

const useEditArticle = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ values, articleData, feed = null }) =>
      articleService.editArticle(values, articleData, feed),
    {
      onSuccess: (response) =>
        queryClient.invalidateQueries(["articles", response?.article_id]),
    }
  );
};

const useUserArticles = (userId) => {
  return useQuery(
    ["user-articles", userId],
    () => articleService.fetchArticlesByUserId(userId),
    {
      enabled: !!userId,
    }
  );
};

const useInfiniteUserArticles = (userId) => {
  return useInfiniteQuery(
    ["user-articles-infinite", userId],
    (params) => articleService.getInfiniteUserArticles({ ...params, userId }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
      enabled: !!userId,
    }
  );
};

const useFeaturedArticles = () => {
  return useInfiniteQuery(
    ["featured-articles"],
    (params) => articleService.fetchFeaturedArticles({ ...params }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
    }
  );
};

const useGetArticle = (articleId, userId) => {
  return useQuery(
    ["articles", articleId],
    () => articleService.fetchArticleById(articleId, userId),
    {
      enabled: !!articleId,
    }
  );
};

const useInfiniteAllArticles = (filters) => {
  return useInfiniteQuery(
    ["all-published-articles", filters],
    (params) => articleService.fetchPublishedArticles({ ...params, filters }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
    }
  );
};
export {
  useCreateArticle,
  useCreateArticleFeed,
  useEditArticle,
  useUserArticles,
  useGetArticle,
  useInfiniteUserArticles,
  useInfiniteAllArticles,
  useFeaturedArticles,
};
