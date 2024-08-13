import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "react-query";
import hashTagService from "../services/hash-tag-service";

const useSearchByTag = () => {
  return useMutation((search_key) => {
    console.log("check tag data--->", search_key);
    let search_text = search_key.replace('#', '')
    console.log("check tag data--->1", search_text);
    return hashTagService.searchByTag(search_text);
  });
};


const useInfiniteFeed = (searchkey, userId) => {
  return useInfiniteQuery(
    [`hash-feeds`],
    (params) => hashTagService.getInfiniteFeeds({ ...params, searchkey, userId }),
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
  useSearchByTag,
  useInfiniteFeed
}