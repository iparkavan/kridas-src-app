import { Button, CircularProgress, List, ListItem } from "@chakra-ui/react";

import { useInfiniteComments } from "../../hooks/comment-hooks";
import FeedComment from "./feed-comment";

const ViewComments = ({ feed, type, id, queryKey }) => {
  const {
    data: commentsData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
    isLoading,
  } = useInfiniteComments(feed["feed_id"]);

  return (
    <>
      <List spacing={3}>
        {isLoading ? (
          <CircularProgress isIndeterminate size="24px" />
        ) : error ? (
          "An error has occurred: " + error.message
        ) : (
          commentsData?.pages?.map((page) => {
            return page?.content?.map((comment) => (
              <ListItem key={comment["comment_id"]}>
                <FeedComment
                  comment={comment}
                  feed={feed}
                  type={type}
                  id={id}
                  queryKey={queryKey}
                />
              </ListItem>
            ));
          })
        )}
      </List>
      {hasNextPage && (
        <Button
          fontWeight="normal"
          variant="link"
          colorScheme="primary"
          onClick={fetchNextPage}
          isLoading={isFetchingNextPage}
          loadingText="Loading"
          mt={5}
        >
          Show more comments
        </Button>
      )}
    </>
  );
};

export default ViewComments;
