import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "react-query";
import pageService from "../services/page-service";
import { useRouter } from "next/router";

const useCreatePage = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return pageService.createPage(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user-pages"]);
      },
    }
  );
};

const usePage = (pageId, userId, queryKeyString = "page") => {
  const queryKey = [queryKeyString, pageId];
  return useQuery(queryKey, () => pageService.getPage(pageId, userId), {
    enabled: !!pageId,
  });
};

const usePages = () => {
  return useQuery(["pages"], () => pageService.getAllPages());
};

const useUpdatePage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { pageId } = router.query;
  return useMutation(
    ({ type, ...data }) => {
      return pageService.updatePage(type, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["page", pageId]);
        queryClient.invalidateQueries(["initialPage", pageId]);
        queryClient.invalidateQueries(["statistics"]);
      },
    }
  );
};

const useInfiniteUserPages = (userId) => {
  return useInfiniteQuery(
    ["user-pages"],
    (params) => pageService.getInfiniteUserPages({ ...params, userId }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
    }
  );
};

const useChildPagesSearch = (venue_name) => {
  // console.log(venue_name, "venue form hook 1");
  return useQuery(["venue-pages", venue_name], () =>
    pageService.getInfiniteSearchChildPages(venue_name)
  );
};

const useInfinitePages = (
  pageName,
  city,
  parentCategories,
  subCategories,
  sportIds,
  userId
) => {
  return useInfiniteQuery(
    [
      "pages-search",
      pageName,
      city,
      parentCategories,
      subCategories,
      sportIds,
      userId,
    ],
    (params) =>
      pageService.getInfinitePages({
        ...params,
        pageName,
        city,
        parentCategories,
        subCategories,
        sportIds,
        userId,
      }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
    }
  );
};

const usePageFollowersData = (pageId) => {
  return useQuery(
    ["page-followers", pageId],
    () => pageService.getPageFollowersById(pageId),
    {
      enabled: !!pageId,
    }
  );
};

const useChildPages = (data, isEnabled = false) => {
  return useQuery(
    ["child-pages", data.company_id, { ...data }],
    () => pageService.getChildPagesById(data),
    {
      enabled: !!data.company_id || isEnabled,
    }
  );
};

const useParentTeamPages = (data, config = {}) => {
  return useQuery(
    ["parent-team-pages", data.user_id],
    () => pageService.getParentTeamPages(data),
    {
      ...config,
    }
  );
};

export {
  useCreatePage,
  usePage,
  useUpdatePage,
  usePages,
  useInfiniteUserPages,
  usePageFollowersData,
  useInfinitePages,
  useChildPages,
  useChildPagesSearch,
  useParentTeamPages,
};
