import { useRouter } from "next/router";
import { useGetArticle } from "../../../hooks/article-hooks";
import { HeadingMedium } from "../../ui/heading/heading";
import {
  Box,
  Image,
  VStack,
  Flex,
  Spacer,
  Skeleton,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import Button from "../../ui/button";
import { EditorState, convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { useState, useEffect } from "react";
// import Editor, { createEditorStateWithText } from "@draft-js-plugins/editor";
import "draft-js/dist/Draft.css";
// import createToolbarPlugin from "@draft-js-plugins/static-toolbar";
// import editorStyles from "./static-toolbar-editor.module.css";
import "@draft-js-plugins/static-toolbar/lib/plugin.css";
import routes from "../../../helper/constants/route-constants";
import { formatDistance } from "date-fns";
import { TextSmall } from "../../ui/text/text";
import SocialMediaShareButtons from "../social-media-share-buttons";
import PostModal from "../../feed/post-modal";
import { useUser } from "../../../hooks/user-hooks";
import CoverImage from "../cover-image";
/* import createImagePlugin from "@draft-js-plugins/image";
import createVideoPlugin from "@draft-js-plugins/video"; */

const ArticleView = () => {
  /*   for the video,image plugin
  const imagePlugin = createImagePlugin();
  const videoPlugin = createVideoPlugin(); */
  const router = useRouter();
  const { articleId } = router.query;
  const {
    isOpen: isSharePostOpen,
    onOpen: onSharePostOpen,
    onClose: onSharePostClose,
  } = useDisclosure();
  const { data: userData = {} } = useUser();
  const { data: articleData = undefined, isLoading } = useGetArticle(
    articleId,
    userData?.["user_id"]
  );
  const isArticleCreator = articleData?.user_id === userData?.user_id;

  const emptyContentState = convertFromRaw({
    entityMap: {},
    blocks: [
      {
        text: "",
        key: "foo",
        type: "unstyled",
        entityRanges: [],
      },
    ],
  });

  const options = {
    entityStyleFn: (entity) => {
      const entityType = entity.get("type");
      if (entityType === "draft-js-video-plugin-video") {
        const data = entity.getData();
        return {
          element: "video",
          attributes: {
            src: data.src,
            controls: true,
            width: "450px",
          },
        };
      }
      if (entityType === "IMAGE") {
        const data = entity.getData();
        return {
          element: "img",
          attributes: {
            src: data.src,
            width: "450px",
          },
        };
      }
    },
  };

  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(emptyContentState)
  );
  const [contentState, setContentState] = useState(null);
  let feedHtml;
  if (contentState) feedHtml = stateToHTML(contentState, options);

  useEffect(() => {
    if (articleData !== undefined) {
      const contentState = convertFromRaw(
        JSON.parse(articleData?.article_content)
      );
      setContentState(contentState);
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [articleData]);

  //Time formatter
  const timeFormatter = (date) =>
    formatDistance(new Date(date), new Date(), {
      addSuffix: true,
    });

  if (isLoading) return <Skeleton minH="100vh">Loading..</Skeleton>;
  else
    return (
      <VStack align="stretch" minHeight="100vh">
        <Box mb={10}>
          <Flex w="full" bg="white" p={6} borderRadius="10px" gap={10}>
            <VStack align="align-start" justify="align-start" w={"full"}>
              <HeadingMedium>{articleData?.article_heading}</HeadingMedium>
              {articleData?.updated_date && (
                <TextSmall>
                  Last updated: {timeFormatter(articleData?.updated_date)}
                </TextSmall>
              )}
            </VStack>
            <Spacer />
            <HStack spacing={4}>
              {isArticleCreator && (
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(routes.userArticleEdit(articleData?.article_id))
                  }
                >
                  Edit
                </Button>
              )}
              {articleData?.["article_publish_status"] === "PUB" && (
                <>
                  <SocialMediaShareButtons
                    content={`Article - ${articleData?.article_heading}`}
                    twitterHashtags={["kridas", "article", "social_media"]}
                    fbHashtag={"#kridas"}
                    twitterMention="kridas_sports"
                    handleShare={onSharePostOpen}
                  />
                  <PostModal
                    isOpen={isSharePostOpen}
                    onClose={onSharePostClose}
                    type="user"
                    id={userData?.["user_id"]}
                    mode="share"
                    feed={articleData?.feed}
                  />
                </>
              )}
            </HStack>
          </Flex>
          {articleData?.cover_image_url_meta?.url && (
            <Box w="full" mt={5}>
              <CoverImage coverimage={articleData?.cover_image_url_meta?.url} />
            </Box>
          )}
        </Box>
        <Box h="min-content" p={8} backgroundColor="white" borderRadius="10px">
          <VStack alignItems="flex-start" spacing={10}>
            <div style={{ width: "100%" }}>
              {articleData && editorState && (
                <Box w="full">
                  {/*  <Editor
                    editorState={editorState}
                    plugins={[imagePlugin, videoPlugin]}
                    readOnly
                  /> */}
                  <Box py={4} dangerouslySetInnerHTML={{ __html: feedHtml }} />
                </Box>
              )}
            </div>
          </VStack>
        </Box>
        <Flex align="flex-start" pt={5} gap={5}>
          <Button
            colorScheme="blue"
            /*     leftIcon={<ArrowBarLeftIcon fontSize="25px" cursor="pointer" />} */
            onClick={() => router.push(routes.userArticles)}
          >
            Go to Articles
          </Button>
          <Button
            colorScheme="blue"
            /*   leftIcon={<ArrowBarLeftIcon fontSize="25px" cursor="pointer" />} */
            onClick={() => router.push(routes.home)}
          >
            Home
          </Button>
        </Flex>
      </VStack>
    );
};

export default ArticleView;
