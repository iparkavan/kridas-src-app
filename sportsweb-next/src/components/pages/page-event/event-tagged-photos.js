import { useRef } from "react";
import { Box, SimpleGrid, GridItem, CircularProgress } from "@chakra-ui/react";
import { useInfiniteEventTaggedPhotos } from "../../../hooks/media-hooks";
import { useIntersectionObserver } from "../../../hooks/common-hooks";
import EmptyContentDisplay from "../../common/empty-content/empty-content-display";
import EventFileDialog from "./event-photos-file-modal";

function EventTaggedPhotos({ eventData, currentEvent }) {
  const {
    data: eventTaggedPhotos = [],
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteEventTaggedPhotos(eventData?.["eventId"]);
  const loadMoreRef = useRef();

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });
  return (
    <Box>
      {eventTaggedPhotos && isLoading ? (
        "Loading..."
      ) : error ? (
        "An error has occurred: " + error.message
      ) : (
        <>
          <SimpleGrid columns={4} w="full" gap={2}>
            {eventTaggedPhotos?.pages?.map((page, idx) => {
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
                      <EventFileDialog
                        media={media}
                        type={media.media_url_meta.resource_type}
                        currentEvent={currentEvent}
                        isTagged={true}
                        eventData={eventData}
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
      {eventTaggedPhotos?.pages &&
        eventTaggedPhotos?.pages[0]?.totalCount === 0 && (
          <EmptyContentDisplay displayText="No Tagged Photos to Display" />
        )}
    </Box>
  );
}

export default EventTaggedPhotos;
