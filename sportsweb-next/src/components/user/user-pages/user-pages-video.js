import {
  Box,
  CircularProgress,
  Container,
  Flex,
  GridItem,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import React, { useState, useRef } from "react";
import { useIntersectionObserver } from "../../../hooks/common-hooks";
import { useInfinitePageVideo } from "../../../hooks/media-hooks";
// import { VideoDialog } from "../user-video/user-video-modal";
import EmptyContentDisplay from "../../common/empty-content/empty-content-display";
import PageFileDialog from "./user-page-photos/page-photos-file-modal";

function PageVideos({ pageData, currentPage }) {
  const loadMoreRef = useRef();
  const [show, setShow] = useState("video");
  const {
    data: videosData = [],
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfinitePageVideo(pageData?.["company_id"]);

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });
  /*  const dateAgo = (date) => {
    return formatDistance(new Date(date), new Date(), { addSuffix: true });
  }; */
  return (
    <>
      <Container maxW="container.xl" p={0} bg="#edf2f6" color="#898ea8" ml={0}>
        <Flex>
          <VStack w="full">
            <Box w="full" justifyContent="center">
              {show === "video" && videosData ? (
                <Box>
                  {isLoading ? (
                    "Loading..."
                  ) : error ? (
                    "An error has occurred: " + error.message
                  ) : (
                    <SimpleGrid columns={4} w="full" gap={4} bg="white">
                      {videosData?.pages?.map((page, idx) => {
                        return page?.content?.length > 0 ? (
                          page?.content?.map((media, index) => {
                            if (
                              media?.media_url_meta?.resource_type === "video"
                            )
                              return (
                                <GridItem
                                  w="100%"
                                  minHeight="100%"
                                  bg="white"
                                  colSpan={{ base: 4, md: 2, lg: 2, xl: 1 }}
                                  key={index}
                                >
                                  {/* <VideoDialog
                                    media={media}
                                    pageData={pageData}
                                  /> */}
                                  <PageFileDialog
                                    media={media}
                                    type={media.media_url_meta.resource_type}
                                    currentPage={currentPage}
                                    currentPageData={pageData}
                                  />
                                  <span ref={loadMoreRef} />
                                </GridItem>
                              );
                          })
                        ) : (
                          <GridItem colSpan={4}>
                            <EmptyContentDisplay displayText="No videos to display" />
                          </GridItem>
                        );
                      })}
                      {isFetchingNextPage && (
                        <CircularProgress
                          alignSelf="center"
                          isIndeterminate
                          size="24px"
                        />
                      )}
                    </SimpleGrid>
                  )}
                </Box>
              ) : (
                <Box pt={4} w="full" justifyContent="center">
                  <Box>No Videos found</Box>
                </Box>
              )}
            </Box>
          </VStack>
        </Flex>
      </Container>
    </>
  );
}

export default PageVideos;
