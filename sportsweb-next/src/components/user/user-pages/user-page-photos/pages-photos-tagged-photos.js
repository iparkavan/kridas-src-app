import { useInfinitePageTaggedPhotos } from "../../../../hooks/media-hooks";
import { useIntersectionObserver } from "../../../../hooks/common-hooks";
import { Box, SimpleGrid, GridItem, CircularProgress } from "@chakra-ui/react";
import PageFileDialog from "./page-photos-file-modal";
import EmptyContentDisplay from "../../../common/empty-content/empty-content-display";
import { useRef } from "react";

function PageTaggedPhotos({ pageData, currentPage }) {
  const {
    data: pageTaggedPhotos = [],
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfinitePageTaggedPhotos(pageData?.["company_id"]);
  const loadMoreRef = useRef();

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });
  return (
    <Box>
      {pageTaggedPhotos && isLoading ? (
        "Loading..."
      ) : error ? (
        "An error has occurred: " + error.message
      ) : (
        <>
          <SimpleGrid columns={4} w="full" gap={2}>
            {pageTaggedPhotos?.pages?.map((page, idx) => {
              return page?.content?.map((media) => {
                return (
                  media.media_url_meta.resource_type === "image" && (
                    <GridItem
                      key={media.media_id}
                      colSpan={{
                        base: 4,
                        sm: 2,
                        md: 2,
                        lg: 1,
                        xl: 1,
                      }}
                    >
                      <PageFileDialog
                        media={media}
                        type={media.media_url_meta.resource_type}
                        currentPage={currentPage}
                        isTagged={true}
                        currentPageData={pageData}
                      />
                    </GridItem>
                  )
                );
              });
            })}
            <span ref={loadMoreRef} />
            {isFetchingNextPage && (
              <CircularProgress
                alignSelf="center"
                isIndeterminate
                size="28px"
              />
            )}
          </SimpleGrid>
        </>
      )}
      {pageTaggedPhotos?.pages &&
        pageTaggedPhotos?.pages[0]?.totalCount === 0 && (
          <EmptyContentDisplay displayText="No Tagged Photos to Display" />
        )}
    </Box>
  );
}

export default PageTaggedPhotos;
