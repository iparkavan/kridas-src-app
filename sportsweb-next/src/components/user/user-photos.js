import { useState } from "react";
import {
  Flex,
  Box,
  Spacer,
  SimpleGrid,
  GridItem,
  Button,
  // CircularProgress,
} from "@chakra-ui/react";
import { BsTags } from "react-icons/bs";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { AddPhotos } from "../common/albums/photos-add";
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
// import { Carousel } from "react-responsive-carousel";
import { FileDialog } from "./user-photos/user-photos-file-modal";
// import { SampleUsers } from "./user-photos/sampledata";
import { useInfiniteUserPhoto } from "../../hooks/media-hooks";
import { useUserGallery } from "../../hooks/gallery-hooks";
import { useIntersectionObserver } from "../../hooks/common-hooks";
import { useRef } from "react";
import { FaPhotoVideo } from "react-icons/fa";
import { UploadIcon, PhotoIcon } from "../ui/icons";
import EmptyContentDisplay from "../common/empty-content/empty-content-display";
import UserTaggedPhotos from "./user-photos/user-photos-tagged-photos";
import { CreateAlbumSquare } from "../common/albums/photos-create-album";
import Album from "../common/albums/album-tab";
import { HeadingMedium } from "../ui/heading/heading";
import Skeleton from "../ui/skeleton";

const UserPhotos = ({ currentUser, userData }) => {
  const [album, setAlbum] = useState("general");
  const loadMoreRef = useRef();
  const {
    data: userMedia = [],
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteUserPhoto(userData?.["user_id"]);

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });
  const { data: albumData = [] } = useUserGallery(userData?.user_id);
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      {userMedia && isLoading ? (
        <Skeleton w="full" minH="100vh">
          Loading..
        </Skeleton>
      ) : error ? (
        "An error has occurred: " + error.message
      ) : (
        <Box>
          <Flex
            bg="#ffffff"
            align="center"
            justify="flex-start"
            marginBottom="15px"
            direction={{ base: "column", md: "row" }}
            border="1px solid #e6ecf5"
            borderRadius="5px"
          >
            {currentUser && (
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
                  <CreateAlbumSquare type="user" setTabIndex={setTabIndex} />
                  <AddPhotos type="user" id={userData?.user_id} />
                </Flex>
              </Flex>
            )}
          </Flex>
          <Tabs
            isFitted
            isLazy
            index={tabIndex}
            onChange={(index) => setTabIndex(index)}
            variant={"enclosed"}
          >
            <TabList mb="1em">
              <Tab
                fontWeight="medium"
                color="gray.600"
                _selected={{ color: "white", bg: "primary.500" }}
                _focus={{ boxShadow: "none" }}
              >
                <UploadIcon fontSize="20px" style={{ marginRight: "5px" }} />{" "}
                Your Uploads
              </Tab>
              <Tab
                fontWeight="medium"
                color="gray.600"
                _selected={{ color: "white", bg: "primary.500" }}
                _focus={{ boxShadow: "none" }}
              >
                <BsTags fontSize="20px" style={{ marginRight: "5px" }} /> Tagged
                Photos
              </Tab>
              <Tab
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
                  {userMedia && isLoading ? (
                    "Loading..."
                  ) : error ? (
                    "An error has occurred: " + error.message
                  ) : (
                    <>
                      <SimpleGrid columns={4} w="full" gap={2}>
                        {userMedia?.pages?.map((page, idx) => {
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
                                  <FileDialog
                                    media={media}
                                    type={media.media_url_meta.resource_type}
                                    currentUser={currentUser}
                                  />
                                </GridItem>
                              )
                            );
                          });
                        })}
                        {/* <span ref={loadMoreRef} /> */}
                        {/* {isFetchingNextPage && (
                          <CircularProgress
                            alignSelf="center"
                            isIndeterminate
                            size="28px"
                          />
                        )} */}
                      </SimpleGrid>
                    </>
                  )}
                  {userMedia?.pages &&
                    userMedia?.pages[0]?.totalCount === 0 && (
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
                <UserTaggedPhotos
                  userData={userData}
                  currentUser={currentUser}
                />
              </TabPanel>
              <TabPanel>
                <Album
                  currentUser={currentUser}
                  album={album}
                  setAlbum={setAlbum}
                  albumData={albumData}
                  type="user"
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      )}
    </>
  );
};

export default UserPhotos;
