import { useIntersectionObserver } from "../../../hooks/common-hooks";
import { useInfiniteEventPhoto } from "../../../hooks/event-hook";
import {
  Flex,
  Box,
  Spacer,
  SimpleGrid,
  GridItem,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import EmptyContentDisplay from "../../common/empty-content/empty-content-display";
import PageFileDialog from "../../user/user-pages/user-page-photos/page-photos-file-modal";
import { useRef, useState } from "react";
import Skeleton from "../../ui/skeleton";
import { PhotoIcon, UploadIcon } from "../../ui/icons";
import { HeadingMedium } from "../../ui/heading/heading";
import { CreateAlbumSquare } from "../../common/albums/photos-create-album";
import { AddPhotos } from "../../common/albums/photos-add";
import { useEventGallery } from "../../../hooks/gallery-hooks";
import { BsTags } from "react-icons/bs";
import { FaPhotoVideo } from "react-icons/fa";
import EventTaggedPhotos from "./event-tagged-photos";
import Album from "../../common/albums/album-tab";
import EventFileDialog from "./event-photos-file-modal";

function EventPhotos({ eventData, currentEvent }) {
  const [album, setAlbum] = useState("general");

  // Need loadMoreRef?
  const loadMoreRef = useRef();
  const {
    data: eventMedia = [],
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteEventPhoto(eventData.eventId);

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });

  const { data: albumData = [] } = useEventGallery(eventData.eventId);
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box>
      {eventMedia && isLoading ? (
        <Skeleton w="full" minH="100vh">
          Loading..
        </Skeleton>
      ) : error ? (
        "An error has occurred: " + error.message
      ) : (
        <>
          <Flex
            bg="#ffffff"
            align="center"
            justify="flex-start"
            marginBottom="15"
            direction={{ base: "column", md: "row" }}
            border="1px solid #e6ecf5"
            borderRadius="5px"
            p={4}
            gap={3}
          >
            {currentEvent && (
              <Flex w="full">
                <Flex
                  p={4}
                  w="full"
                  h="max-content"
                  align="center"
                  justify="flex-end"
                  gap="3"
                  direction={{ base: "column", md: "row" }}
                >
                  <PhotoIcon size={25} />
                  <HeadingMedium>PHOTOS</HeadingMedium>
                  <Spacer />
                  <CreateAlbumSquare type="event" setTabIndex={setTabIndex} />
                  <AddPhotos
                    type="event"
                    id={eventData.eventId}
                    data={eventData}
                  />
                </Flex>
              </Flex>
            )}
          </Flex>

          <Tabs
            isFitted
            isLazy
            variant="enclosed"
            index={tabIndex}
            onChange={(index) => setTabIndex(index)}
          >
            <TabList mb="1em">
              <Tab
                w="max-content"
                fontWeight="medium"
                color="gray.600"
                _selected={{ color: "white", bg: "primary.500" }}
                _focus={{ boxShadow: "none" }}
              >
                <UploadIcon fontSize="20px" style={{ marginRight: "5px" }} />{" "}
                Your Uploads
              </Tab>
              <Tab
                w="max-content"
                fontWeight="medium"
                color="gray.600"
                _selected={{ color: "white", bg: "primary.500" }}
                _focus={{ boxShadow: "none" }}
              >
                <BsTags fontSize="20px" style={{ marginRight: "5px" }} /> Tagged
                Photos
              </Tab>
              <Tab
                w="max-content"
                fontWeight="medium"
                color="gray.600"
                _selected={{ color: "white", bg: "primary.500" }}
                _focus={{ boxShadow: "none" }}
              >
                <FaPhotoVideo fontSize="25px" style={{ marginRight: "5px" }} />{" "}
                Albums
              </Tab>
            </TabList>
            <TabPanels border={"1px solid #e8e8f7"}>
              <TabPanel>
                <Box>
                  {eventMedia && isLoading ? (
                    "Loading..."
                  ) : error ? (
                    "An error has occurred: " + error.message
                  ) : (
                    <>
                      <SimpleGrid columns={4} w="full" gap={2} p={4}>
                        {eventMedia?.pages?.map((page, idx) => {
                          return page?.content?.map((media) => {
                            return (
                              media.media_url_meta.resource_type ===
                                "image" && (
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
                                    eventData={eventData}
                                  />
                                  {/* <span ref={loadMoreRef} /> */}
                                </GridItem>
                              )
                            );
                          });
                        })}
                      </SimpleGrid>
                    </>
                  )}
                  {eventMedia?.pages &&
                    eventMedia?.pages[0]?.totalCount === 0 && (
                      <EmptyContentDisplay displayText="No Photos to Display" />
                    )}
                  {hasNextPage && (
                    <Button
                      mt={5}
                      variant="link"
                      colorScheme="primary"
                      fontWeight="normal"
                      isLoading={isFetchingNextPage}
                      loadingText="Loading"
                      onClick={fetchNextPage}
                    >
                      Load More
                    </Button>
                  )}
                </Box>
              </TabPanel>
              <TabPanel>
                <EventTaggedPhotos
                  eventData={eventData}
                  currentEvent={currentEvent}
                />
              </TabPanel>
              <TabPanel>
                <Album
                  currentUser={currentEvent}
                  album={album}
                  setAlbum={setAlbum}
                  albumData={albumData}
                  type="event"
                  eventData={eventData}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>

          {/* {hasNextPage && (
            <Button
              mt={5}
              variant="link"
              colorScheme="primary"
              fontWeight="normal"
              isLoading={isFetchingNextPage}
              loadingText="Loading"
              onClick={fetchNextPage}
            >
              Load More
            </Button>
          )} */}
        </>
      )}
      {/* {eventMedia?.pages && eventMedia?.pages[0]?.totalCount === 0 && (
        <EmptyContentDisplay displayText="No Photos to Display" />
      )} */}
    </Box>
  );
}

export default EventPhotos;
