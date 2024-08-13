import { useInfiniteUserTaggedPhotos } from "../../../hooks/media-hooks";
import { useIntersectionObserver } from "../../../hooks/common-hooks";
import {
  Flex,
  Box,
  Text,
  Spacer,
  SimpleGrid,
  GridItem,
  Image,
  Heading,
  HStack,
  VStack,
  Avatar,
  Button,
  AvatarGroup,
  CircularProgress,
  AspectRatio,
} from "@chakra-ui/react";
import { FileDialog } from "./user-photos-file-modal";
import EmptyContentDisplay from "../../common/empty-content/empty-content-display";
import { useRef } from "react";

function UserTaggedPhotos({ userData, currentUser }) {
  const {
    data: userTaggedPhotos = [],
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteUserTaggedPhotos(userData?.["user_id"]);
  const loadMoreRef = useRef();

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });
  return (
    <Box>
      {userTaggedPhotos && isLoading ? (
        "Loading..."
      ) : error ? (
        "An error has occurred: " + error.message
      ) : (
        <>
          <SimpleGrid columns={4} w="full" gap={2}>
            {userTaggedPhotos?.pages?.map((page, idx) => {
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
                      <FileDialog
                        media={media}
                        type={media.media_url_meta.resource_type}
                        currentUser={currentUser}
                        taggedUser={media.user || media.company}
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
      {userTaggedPhotos?.pages &&
        userTaggedPhotos?.pages[0]?.totalCount === 0 && (
          <EmptyContentDisplay displayText="No Tagged Photos to Display" />
        )}
    </Box>
  );
}

export default UserTaggedPhotos;
