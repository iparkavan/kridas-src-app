import { useRef, useState } from "react";
import {
  VStack,
  Container,
  SimpleGrid,
  Box,
  CircularProgress,
  Flex,
  GridItem,
} from "@chakra-ui/react";

// import styles from "./user-video/Style-video.module.css";
// import FormUi from "./user-video/User-video-Form_ui";
// import More from "./user-video/User-video-more";
import { useInfiniteUserVideo } from "../../hooks/media-hooks";
import { useIntersectionObserver } from "../../hooks/common-hooks";
// import { VideoDialog } from "./user-video/user-video-modal";
import EmptyContentDisplay from "../common/empty-content/empty-content-display";
import { FileDialog } from "./user-photos/user-photos-file-modal";

function UserVideos({ userData, currentUser }) {
  const [show, setShow] = useState("video");
  const loadMoreRef = useRef();
  const {
    data: videosData = [],
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteUserVideo(userData?.["user_id"]);
  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });

  const [isModal, setIsModal] = useState(false);

  const [videoUrl, setVideoUrl] = useState("");
  const videoRef = useRef();

  return (
    <>
      <Container maxW="container.xl" p={0} color="#898ea8" ml={0}>
        <Flex>
          <VStack w="full" mt={[300, 300, 0]}>
            <Box w="full" justifyContent="center">
              {show === "video" && videosData ? (
                <Box>
                  {isLoading ? (
                    "Loading..."
                  ) : error ? (
                    "An error has occurred: " + error.message
                  ) : (
                    <SimpleGrid columns={4} w="full" gap={4}>
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
                                  {/* <VideoDialog media={media} /> */}
                                  <FileDialog
                                    media={media}
                                    type={media.media_url_meta.resource_type}
                                    currentUser={currentUser}
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

export default UserVideos;
