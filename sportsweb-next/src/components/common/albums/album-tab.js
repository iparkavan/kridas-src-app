import {
  AspectRatio,
  Box,
  Flex,
  GridItem,
  Heading,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import Button from "../../ui/button";
import { formatDistance } from "date-fns";
import { useGalleryData } from "../../../hooks/gallery-hooks";
import PageFileDialog from "../../user/user-pages/user-page-photos/page-photos-file-modal";
import { FileDialog } from "../../user/user-photos/user-photos-file-modal";
import EmptyContentDisplay from "../empty-content/empty-content-display";
import { CreateAlbumCircle } from "./photos-create-album";
import { UpdateAlbumButton } from "./photos-update-album";
import UpdateAlbumInfo from "./update-album-details";
import { HeadingMedium, HeadingSmall } from "../../ui/heading/heading";
import { TextHighlight, TextSmall } from "../../ui/text/text";
import EventFileDialog from "../../pages/page-event/event-photos-file-modal";

function Album(props) {
  const { album, setAlbum, type, currentUser, albumData, pageData, eventData } =
    props;
  //Time formatter
  const timeFormatter = (date) =>
    formatDistance(new Date(date), new Date(), {
      addSuffix: true,
    });
  const { data: galleryData = [] } = useGalleryData(
    album !== "general" && album
  );

  if (album === "general")
    return (
      <Box>
        <SimpleGrid columns={3} w="full" gap={5}>
          {currentUser && (
            <GridItem colSpan={{ base: 3, md: 2, lg: 2, xl: 1 }}>
              <Flex
                border="2px dashed darkgray"
                height="400px"
                direction="column"
                align="center"
                justify="center"
                gap={1}
              >
                <CreateAlbumCircle type={type} />
                <HeadingSmall>Create an Album</HeadingSmall>
                <TextSmall color="#888da8">
                  It only takes a few minutes!
                </TextSmall>
              </Flex>
            </GridItem>
          )}

          {albumData.map(
            (
              {
                gallery_id,
                gallery_name,
                gallery_desc,
                updated_date,
                gallery_media,
              },
              idx
            ) => {
              const postTime = timeFormatter(updated_date);
              return (
                <GridItem
                  key={gallery_id}
                  colSpan={{ base: 4, md: 2, lg: 2, xl: 1 }}
                  cursor="pointer"
                >
                  {gallery_media[0]?.media.media_url_meta?.resource_type ===
                  "image" ? (
                    <Box position="relative">
                      <Image
                        src={gallery_media[0]?.media.media_url}
                        boxSize="230"
                        w="full"
                        objectFit="cover"
                        bg="blue.500"
                        borderRadius="5px"
                        alt="Gallery"
                        // onClick={() => currentUser && setAlbum(gallery_id)}
                        onClick={() => setAlbum(gallery_id)}
                      />
                      {currentUser && (
                        <UpdateAlbumInfo galleryId={gallery_id} type={type} />
                      )}
                    </Box>
                  ) : (
                    <Box position={"relative"}>
                      <AspectRatio
                        maxW="450px"
                        maxH="230px"
                        ratio={1}
                        onClick={() => currentUser && setAlbum(gallery_id)}
                      >
                        <video src={gallery_media[0]?.media.media_url} />
                      </AspectRatio>
                      {currentUser && (
                        <UpdateAlbumInfo type={type} galleryId={gallery_id} />
                      )}
                    </Box>
                  )}
                  <VStack
                    bg="white"
                    border={"1px solid #e8e8f7"}
                    w="full"
                    p="25"
                    h="170px"
                    onClick={() => currentUser && setAlbum(gallery_id)}
                  >
                    <Heading size="sm" textAlign="center">
                      {gallery_name}
                    </Heading>
                    {gallery_desc && (
                      <Text fontSize="14px" textAlign="center">
                        {gallery_desc}
                      </Text>
                    )}
                    <Text color="#888da8" fontSize="13px" textAlign="center">
                      Last Updated: {postTime}
                    </Text>
                    <Box h="75px"></Box>
                    {/*  <Carousel
                        w="full"
                        showThumbs={false}
                        showStatus={false}
                        showArrows={false}
                      >
                        <Flex m="10" align="center" justify="center">
                          <AvatarGroup size="md" max={3}>
                            {SampleUsers.map(({ image }, idx) => (
                              <Avatar key={idx} src={image} />
                            ))}
                          </AvatarGroup>
                        </Flex>
                        <Box m="10">
                          <HStack
                            justify="space-around"
                            fontSize="13px"
                            wrap="wrap"
                          >
                            <VStack>
                              <Heading size="sm">24</Heading>
                              <Text color="#888da8">Likes</Text>
                            </VStack>
                            <VStack>
                              <Heading size="sm">50</Heading>
                              <Text color="#888da8">Comments</Text>
                            </VStack>
                            <VStack>
                              <Heading size="sm">85</Heading>
                              <Text color="#888da8">Shares</Text>
                            </VStack>
                          </HStack>
                        </Box>
                      </Carousel> */}
                  </VStack>
                </GridItem>
              );
            }
          )}
        </SimpleGrid>
        {albumData?.length === 0 && (
          <Box mt={3}>
            <EmptyContentDisplay displayText="No Albums to Display" />
          </Box>
        )}
      </Box>
    );
  else {
    return (
      <>
        <Flex gap={8}>
          <Button
            variant="outline"
            w={{ base: "full", md: "min-content" }}
            onClick={() => setAlbum("general")}
          >
            Back to Albums
          </Button>
          {currentUser && <UpdateAlbumButton gallery_id={album} type={type} />}
        </Flex>
        <HeadingMedium pt={6} pb={1}>
          {galleryData?.gallery_name}
        </HeadingMedium>
        {galleryData?.gallery_desc && (
          <TextHighlight pb={4}>{galleryData?.gallery_desc}</TextHighlight>
        )}
        <Box mt={3}>
          <SimpleGrid columns={4} w="full" gap={2}>
            {albumData?.map(({ gallery_media }, idx) => {
              const gallery_media_data = gallery_media?.filter(
                (media) => media?.gallery_id === album
              );

              return gallery_media_data.map(({ media }) => {
                return (
                  <GridItem
                    key={media.media_id}
                    colSpan={{ base: 4, md: 2, lg: 2, xl: 1 }}
                  >
                    {type === "user" ? (
                      <FileDialog
                        type={media.media_url_meta.resource_type}
                        media={media}
                        currentUser={currentUser}
                      />
                    ) : type === "page" ? (
                      <PageFileDialog
                        type={media.media_url_meta.resource_type}
                        media={media}
                        currentPage={currentUser}
                        currentPageData={pageData}
                      />
                    ) : (
                      <EventFileDialog
                        type={media.media_url_meta.resource_type}
                        media={media}
                        currentEvent={currentUser}
                        eventData={eventData}
                      />
                    )}
                  </GridItem>
                );
              });
            })}
          </SimpleGrid>
        </Box>
      </>
    );
  }
}
export default Album;
