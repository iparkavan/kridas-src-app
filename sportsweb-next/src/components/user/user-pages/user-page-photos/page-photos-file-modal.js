import { useEffect, useState } from "react";
import {
  useDisclosure,
  Modal,
  Button,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Text,
  Heading,
  Divider,
  ModalCloseButton,
  Image,
  Box,
  HStack,
  Avatar,
  VStack,
  Flex,
  AspectRatio,
  Icon,
  Link,
} from "@chakra-ui/react";
import { formatDistance } from "date-fns";
// import MenuOptions from "./page-photos-menu-items";
import styles from "./page-photos.module.css";
// import { useUpdateMedia } from "../../../../hooks/media-hooks";
// import { updateMediaValidationSchema } from "../../../../helper/constants/media-constants";
import { convertFromRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import { stateToHTML } from "draft-js-export-html";
// import { Form, Formik } from "formik";
// import TextBoxWithValidation from "../../../ui/textbox/textbox-with-validation";
import { useFeedByMediaId } from "../../../../hooks/media-hooks";
import { TextMedium, TextSmall } from "../../../ui/text/text";
// import * as yup from "yup";
import ViewLikesModal from "../../../feed/view-likes-modal";
import { CommentIcon, FillLikeIcon } from "../../../ui/icons";
import PostLikesPopover from "../../../feed/post-likes-popover";
import SocialMediaSharePost from "../../../common/social-media-share-post";
import PostModal from "../../../feed/post-modal";
import { useUser } from "../../../../hooks/user-hooks";
import ViewComments from "../../../feed/view-comments";
import CommentEditor from "../../../feed/comment-editor";
import routes from "../../../../helper/constants/route-constants";

function PageFileDialog({
  media,
  type,
  currentPage,
  currentPageData,
  isTagged = false,
}) {
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: currentUserData = {} } = useUser();

  //Time formatter
  const timeFormatter = (date) =>
    formatDistance(new Date(date), new Date(), {
      addSuffix: true,
    });

  const { data: feedMediaData = undefined, isLoading } = useFeedByMediaId(
    media.media_id,
    currentPage ? "C" : "U",
    currentPage ? currentPageData?.company_id : currentUserData?.user_id,
    isModalOpen
  );
  const [feedContent, setFeedContent] = useState(undefined);
  const [mediaData, setMediaData] = useState(undefined);

  /*  const emptyContentState = convertFromRaw({
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
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(emptyContentState)
  ); */
  const [imageCount, setImageCount] = useState(0);
  const [showComments, setShowComments] = useState(true);
  const {
    isOpen: isSharePostOpen,
    onOpen: onSharePostOpen,
    onClose: onSharePostClose,
  } = useDisclosure();
  const [mode, setMode] = useState("share");

  useEffect(() => {
    if (!isLoading && feedMediaData !== undefined) {
      const raw = JSON?.parse(feedMediaData[0]?.feed_content);
      setImageCount(
        +Object.values(
          JSON?.parse(feedMediaData[0]?.feed_content)?.entityMap
        )?.filter(({ type }) => type === "IMAGE")?.length
      );
      /*     console.log(imageCount); */
      for (let key in raw.blocks) {
        if (raw.blocks[key].type === "atomic") {
          /*  console.log("deleted atomic"); */
          raw.blocks.splice(key, 1);
        }
      }
      for (let key in raw.entityMap) {
        if (raw?.entityMap[key]?.type === "IMAGE") {
          /* console.log("deleted entitytype which are images"); */
          delete raw.entityMap[key];
        }
      }
      setFeedContent(raw);
      setMediaData(feedMediaData[0]);
    }
  }, [feedMediaData, isLoading, imageCount]);

  let feedHtml;
  if (feedContent !== undefined) {
    const options = {
      entityStyleFn: (entity) => {
        const entityType = entity.get("type");
        if (entityType === "mention") {
          const data = entity.getData();
          const href =
            data.mention.type === "U"
              ? `/user/profile/${data.mention.id}`
              : `/page/${data.mention.id}`;
          return {
            element: "a",
            attributes: {
              href: href,
            },
            style: {
              color: "var(--chakra-colors-primary-500)",
            },
          };
        }
      },
    };

    feedHtml = stateToHTML(convertFromRaw(feedContent), options);
  }

  // const [edit, setEdit] = useState(false);
  // const { mutate, isLoading: updateMediaLoading } = useUpdateMedia("page");

  /*   const onChange = (value) => {
    setEditorState(value);
  }; */

  let feedContext;
  if (mediaData) {
    if (mediaData.user) {
      feedContext = {
        name: `${mediaData.user.first_name} ${mediaData.user.last_name}`,
        profileImage: mediaData.user.user_profile_img,
        url: routes.profile(mediaData.user.user_name),
      };
    } else if (mediaData.event) {
      feedContext = {
        name: mediaData.event.event_name,
        profileImage: mediaData.event.event_logo,
        url: routes.events(mediaData.event.event_id),
      };
    } else if (mediaData.company) {
      feedContext = {
        name: mediaData.company.company_name,
        profileImage: mediaData.company.company_profile_img,
        url: routes.page(mediaData.company.company_id),
      };
    }
  }

  return (
    <>
      {type === "image" ? (
        <Box className={styles.PhotoContainer} onClick={onModalOpen}>
          <Box className={styles.HoverContainer}>
            {/* {mediaData?.like_count > 0 && (
              <HStack mb={10} fontSize="18px" ml="auto" mr="18px">
                <BiHeart />
                <Text color="darkgray !important">{mediaData?.like_count}</Text>
              </HStack>
            )} */}
          </Box>

          <Image
            boxSize="240"
            w="full"
            objectFit="cover"
            src={media.media_url}
            borderRadius="5px"
            alt="Gallery"
            cursor="pointer"
          />
        </Box>
      ) : (
        <AspectRatio cursor="pointer" maxW="400px" maxH="240px" ratio={1}>
          <>
            <video src={media?.media_url} onClick={onModalOpen} />
          </>
        </AspectRatio>
      )}
      <Modal size="5xl" isOpen={isModalOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton mr={8} mt={2} />
          <ModalBody>
            <Flex direction={{ base: "column", lg: "row" }} align="center">
              {type === "image" ? (
                <Image
                  bg="black"
                  boxSize={{ base: 380, lg: 550 }}
                  w={{ base: "full", lg: "60%" }}
                  objectFit="contain"
                  src={media.media_url}
                  borderRadius="5px"
                  alt="Gallery"
                />
              ) : (
                // <video
                //   src={media.media_url}
                //   className={styles.video}
                //   controls
                // />
                <Box
                  as="video"
                  bg="black"
                  boxSize={{ base: 380, lg: 550 }}
                  w={{ base: "full", lg: "60%" }}
                  objectFit="contain"
                  src={media.media_url}
                  className={styles.video}
                  controls
                />
              )}

              <Box
                w={{ base: "full", lg: type === "image" ? "550px" : "630px" }}
                h={{ base: "full", lg: "550px" }}
                p={17}
                bg="white"
                overflow="auto"
              >
                <HStack justify="space-between">
                  <Flex align="center" justify="center" direction="row">
                    <Avatar
                      name={feedContext?.name}
                      src={feedContext?.profileImage}
                    />
                    <VStack ml={3} align="flex-start" spacing={1}>
                      <Link href={feedContext?.url}>
                        <Heading size="sm">{feedContext?.name}</Heading>
                      </Link>
                      <Text fontSize="14px" color="#888da8">
                        {timeFormatter(media.updated_date)}
                      </Text>
                    </VStack>
                  </Flex>
                  {/*   {currentPage && (
                    <MenuOptions type={media?.media_url_meta?.resource_type} />
                  )} */}
                </HStack>

                {/* {media.media_desc && !isTagged && !edit && (
                  <>
                    <Text textAlign="left" mt={3}>
                      {media.media_desc}
                    </Text>
                  </>
                )} */}

                {/* {edit && (
                  <VStack my={3} w="full" align="flex-start">
                    <Formik
                      initialValues={{
                        media_desc: media.media_desc || "",
                      }}
                      validationSchema={updateMediaValidationSchema(yup)}
                      onSubmit={(values) => {
                        console.log({ ...media, ...values });
                        mutate(
                          { ...media, ...values },
                          {
                            onSuccess: (res) => {
                              console.log(res);
                              setEdit(false);
                            },
                          }
                        );
                      }}
                    >
                      {({ values }) => (
                        <Form>
                          <TextBoxWithValidation
                            width="sm"
                            fontSize="sm"
                            placeholder={"Add a Photo Description"}
                            name="media_desc"
                          />
                          <HStack mt={4}>
                            <Button
                              type="submit"
                              size="sm"
                              isLoading={updateMediaLoading}
                            >
                              Save
                            </Button>
                            <Button size="sm" onClick={() => setEdit(false)}>
                              Cancel
                            </Button>
                          </HStack>
                        </Form>
                      )}
                    </Formik>
                  </VStack>
                )} */}

                {/* {imageCount === 1 || isTagged ? (
                  <Box pt={3} dangerouslySetInnerHTML={{ __html: feedHtml }} />
                ) : (
                  !edit &&
                  imageCount !== 0 &&
                  !isTagged &&
                  currentPage && (
                    <Box my={3}>
                      {media.media_desc ? (
                        <Button size="sm" onClick={() => setEdit(true)}>
                          Edit Description
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => setEdit(true)}>
                          Add Description
                        </Button>
                      )}
                    </Box>
                  )
                )} */}

                <Box pt={3} dangerouslySetInnerHTML={{ __html: feedHtml }} />

                {(mediaData?.like_count ||
                  Boolean(
                    mediaData?.commentcount && Number(mediaData.commentcount)
                  ) ||
                  Boolean(mediaData?.share_count)) && <Divider my={3} />}

                <HStack
                  align="center"
                  justify="space-between"
                  rowGap="10px"
                  wrap="wrap"
                  mb={1}
                >
                  <HStack>
                    {mediaData?.like_count && (
                      <>
                        {isOpen && (
                          <ViewLikesModal
                            isOpen={isOpen}
                            onClose={onClose}
                            feedId={mediaData?.feed_id}
                          />
                        )}
                        <Button
                          variant="link"
                          fontSize="sm"
                          fontWeight="normal"
                          color="gray.500"
                          onClick={onOpen}
                          minW={0}
                        >
                          <Icon
                            as={FillLikeIcon}
                            rounded="full"
                            bg="primary.500"
                            color="white"
                            h={6}
                            w={6}
                            p={1}
                            mb={2}
                          />
                          <TextMedium ml={2} mb={2}>
                            {mediaData?.like_count}
                          </TextMedium>
                        </Button>
                      </>
                    )}
                  </HStack>
                  <HStack>
                    {Boolean(
                      mediaData?.commentcount && Number(mediaData.commentcount)
                    ) && (
                      <Button
                        variant="link"
                        fontSize="sm"
                        fontWeight="normal"
                        color="gray.500"
                        onClick={() => setShowComments(!showComments)}
                      >
                        {mediaData.commentcount} comments
                      </Button>
                    )}
                    {Boolean(mediaData?.share_count) && (
                      <TextSmall color="gray.500">
                        {mediaData.share_count} shares
                      </TextSmall>
                    )}
                  </HStack>
                </HStack>
                <Divider my={2} />
                <HStack my={3}>
                  <PostLikesPopover
                    feedId={mediaData?.feed_id}
                    userLike={mediaData?.like}
                    queryKey={["user-feed-media", media?.media_id]}
                    type={currentPage ? "company" : "user"}
                    id={
                      currentPage
                        ? currentPageData.company_id
                        : currentUserData.user_id
                    }
                  />
                  <Button size="sm" variant="ghost">
                    <Icon as={CommentIcon} h={5} w={5} />
                    <TextSmall ml={2} fontWeight="normal">
                      Comment
                    </TextSmall>
                  </Button>

                  <SocialMediaSharePost
                    content={`${mediaData?.detail?.name}'s Post`}
                    fbHashtag={"#kridas"}
                    twitterHashtags={["kridas", "post", "social_media"]}
                    twitterMention="kridas_sports"
                    redirectPath={`/post/${mediaData?.feed_id}`}
                    handleShare={() => {
                      setMode("share");
                      onSharePostOpen();
                    }}
                  />
                  {mode === "share" && (
                    <PostModal
                      isOpen={isSharePostOpen}
                      onClose={onSharePostClose}
                      type={currentPage ? "company" : "user"}
                      id={
                        currentPage
                          ? currentPageData.company_id
                          : currentUserData.user_id
                      }
                      mode={mode}
                      setMode={setMode}
                      feed={mediaData}
                    />
                  )}
                </HStack>
                {/* <Divider my={3} /> */}

                {Boolean(mediaData?.commentcount) && !showComments && (
                  <Button
                    fontWeight="normal"
                    variant="link"
                    colorScheme="primary"
                    onClick={() => setShowComments(true)}
                  >
                    View comments
                  </Button>
                )}

                {Boolean(mediaData?.commentcount) && showComments && (
                  <ViewComments
                    showComments={showComments}
                    setShowComments={setShowComments}
                    feed={mediaData}
                    type={currentPage ? "company" : "user"}
                    id={
                      currentPage
                        ? currentPageData.company_id
                        : currentUserData.user_id
                    }
                    queryKey={["page-photo", currentPageData.company_id]}
                  />
                )}

                <Divider mt={3} />
                <Box display="flex" alignItems="center" gap={4} mt={3}>
                  <Avatar
                    size="sm"
                    name={
                      currentPage
                        ? currentPageData.company_name
                        : currentUserData.full_name
                    }
                    src={
                      currentPage
                        ? currentPageData.company_profile_img
                        : currentUserData.user_profile_img
                    }
                  />
                  <CommentEditor
                    feedId={mediaData?.feed_id}
                    userLike={mediaData?.like}
                    queryKey={["page-photo", currentPageData.company_id]}
                    type={currentPage ? "company" : "user"}
                    id={
                      currentPage
                        ? currentPageData.company_id
                        : currentUserData.user_id
                    }
                  />
                </Box>

                <Divider mt={3} />
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PageFileDialog;
