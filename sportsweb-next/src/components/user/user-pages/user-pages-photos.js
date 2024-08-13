import {
  Box,
  Button,
  CircularProgress,
  Flex,
  GridItem,
  SimpleGrid,
  Spacer,
} from "@chakra-ui/react";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import { Carousel } from "react-responsive-carousel";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { BsTags, BsThreeDots } from "react-icons/bs";
import { FaPhotoVideo } from "react-icons/fa";
import { useIntersectionObserver } from "../../../hooks/common-hooks";
import { usePageGallery } from "../../../hooks/gallery-hooks";
import { useInfinitePagePhoto } from "../../../hooks/media-hooks";
import { PhotoIcon, UploadIcon } from "../../ui/icons";
import {
  // CreateAlbumCircle,
  CreateAlbumSquare,
} from "../../common/albums/photos-create-album";
// import { UpdateAlbumButton } from "../../common/albums/photos-update-album";
import PageFileDialog from "./user-page-photos/page-photos-file-modal";
// import { SampleUsers } from "../user-photos/sampledata";
import EmptyContentDisplay from "../../common/empty-content/empty-content-display";
import PageTaggedPhotos from "./user-page-photos/pages-photos-tagged-photos";
import { AddPhotos } from "../../common/albums/photos-add";
import Album from "../../common/albums/album-tab";
import Skeleton from "../../ui/skeleton";
import { HeadingMedium } from "../../ui/heading/heading";

function PagePhotos({ currentPage, pageData }) {
  const [album, setAlbum] = useState("general");

  const {
    data: pageMedia = [],
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfinitePagePhoto(pageData?.company_id);

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });
  const loadMoreRef = useRef();

  const { data: albumData = [] } = usePageGallery(pageData?.["company_id"]); // get by company id
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <>
      {pageMedia && isLoading ? (
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
            marginBottom="15"
            direction={{ base: "column", md: "row" }}
            border="1px solid #e6ecf5"
            borderRadius="5px"
          >
            {currentPage && (
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
                  <CreateAlbumSquare type="page" setTabIndex={setTabIndex} />
                  <AddPhotos type="company" id={pageData?.company_id} />
                  {/*  <Flex direction={{ base: "row" }} align="center">
                  <Box p="5">
                    <BsThreeDots size="25px" />
                  </Box>
                </Flex> */}
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
                  {pageMedia && isLoading ? (
                    "Loading..."
                  ) : error ? (
                    "An error has occurred: " + error.message
                  ) : (
                    <>
                      <SimpleGrid columns={4} w="full" gap={2}>
                        {pageMedia?.pages?.map((page, idx) => {
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
                                  <PageFileDialog
                                    media={media}
                                    type={media.media_url_meta.resource_type}
                                    currentPage={currentPage}
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
                  {pageMedia?.pages &&
                    pageMedia?.pages[0]?.totalCount === 0 && (
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
                <PageTaggedPhotos
                  pageData={pageData}
                  currentPage={currentPage}
                />
              </TabPanel>
              <TabPanel>
                <Album
                  currentUser={currentPage}
                  album={album}
                  setAlbum={setAlbum}
                  albumData={albumData}
                  type="page"
                  pageData={pageData}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      )}
    </>
  );
}

export default PagePhotos;
