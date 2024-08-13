import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  EditorState,
  convertFromRaw,
  convertToRaw,
  AtomicBlockUtils,
} from "draft-js";
import Editor from "@draft-js-plugins/editor";

import createMentionPlugin, {
  defaultSuggestionsFilter,
  MentionSuggestions,
} from "@draft-js-plugins/mention";
import createImagePlugin from "@draft-js-plugins/image";
import createHashtagPlugin, {
  extractHashtagsWithIndices,
} from "@draft-js-plugins/hashtag";
//   import createVideoPlugin from "@draft-js-plugins/video";

import "@draft-js-plugins/mention/lib/plugin.css";
import "@draft-js-plugins/image/lib/plugin.css";
import "@draft-js-plugins/hashtag/lib/plugin.css";
import {
  Button,
  HStack,
  Box,
  Avatar,
  IconButton,
  Input,
  ButtonGroup,
  Td,
} from "@chakra-ui/react";
import { AddImageIcon, AddVideoIcon, AttachmentIcon } from "../../ui/icons";
import { useRouter } from "next/router";
import routes from "../../../helper/constants/route-constants";
import { useToast } from "@chakra-ui/react";
import {
  useCreateEvent,
  useCreateEventFeed,
  useEventById,
  useUpdateEventNew,
} from "../../../hooks/event-hook";
import editorStyles from "../../common/article/static-toolbar-editor.module.css";
import { useSearchByName } from "../../../hooks/user-hooks";
import { format } from "date-fns";
import { useCategoriesByType } from "../../../hooks/category-hooks";
import { useSports } from "../../../hooks/sports-hooks";
import createVideoPlugin from "@draft-js-plugins/video";
import { useCloudinaryUpload } from "../../../hooks/upload-hooks";
import {
  useCountries,
  useCountryByISOCode,
} from "../../../hooks/country-hooks";
import { useCreateFeed } from "../../../hooks/feed-hooks";
import { usePage } from "../../../hooks/page-hooks";
import { useAddProduct } from "../../../hooks/product-hooks";
import { addProductsForEvent } from "../../../helper/constants/event-constants";
import { useLocation } from "../../../hooks/location-hooks";

function EventFeedEditor(props) {
  const {
    eventId,
    eventData,
    userId,
    coverImageMetaData = null,
    sports,
  } = props;

  const toast = useToast();

  const router = useRouter();

  const { mutate: createMutate, isLoading: isCreateLoading } = useCreateFeed();

  const { data: categories = [] } = useCategoriesByType("EVT");

  const { mutate: updateMutate, isLoading: isUpdateLoading } =
    useUpdateEventNew(eventId);

  let EventPageId = eventData?.eventVenue[0];

  const { data: pageData } = usePage(EventPageId);

  const eventCat = categories?.find(
    (category) =>
      category["category_id"] === eventData?.eventCategoryId ||
      category["category_name"] === eventData?.eventCategoryId
  )?.["category_name"];

  const { mutate: searchMutate } = useSearchByName();
  const ref = useRef(null);

  const formatDate = (date) => format(new Date(date), "dd-MMM-yyyy h:mm aa ");

  const { data: countriesData = [] } = useCountries();

  const { data: locationData } = useLocation();
  const { data: countryData } = useCountryByISOCode(locationData?.countryCode);

  const { mutateAsync: productMutateAsync } = useAddProduct();

  const state_name = countriesData
    ?.find((country) => country["country_code"] === pageData?.address?.country)
    ?.["country_states"]?.find(
      (state) => state["state_code"] === pageData?.address?.state
    )?.["state_name"];

  const { mutate: uploadMutate, isLoading: isUploadLoading } =
    useCloudinaryUpload();

  // const isCoverImageUploaded =
  //   !(coverImage instanceof FileList) && coverImageMetaData;

  // const isCoverImagePresent = coverImageMetaData;
  const isCoverImagePresent = Boolean(eventData.eventBanner);

  const isVirtualEvent = Boolean(eventData.virtualVenueUrl);

  const eventFeedState = {
    entityMap: {
      ...(isCoverImagePresent && {
        0: {
          type: "IMAGE",
          mutability: "IMMUTABLE",
          data: {
            // ...coverImageMetaData,
            src: eventData.eventBanner,
          },
        },
      }),
      1: {
        type: "LINK",
        mutability: "MUTABLE",
        data: {
          url: `/events/${eventId}`,
        },
      },
      ...(isVirtualEvent && {
        2: {
          type: "LINK",
          mutability: "MUTABLE",
          data: {
            url: eventData.virtualVenueUrl,
          },
        },
      }),
    },
    blocks: [
      // Old scenario
      // ...(isCoverImageUploaded
      //   ? [
      //       {
      //         key: "e26a5",
      //         text: " ",
      //         type: "unstyled",
      //         depth: 0,
      //         inlineStyleRanges: [],
      //         entityRanges: [],
      //         data: {},
      //       },
      //     ]
      //   : []),
      // ...(isCoverImagePresent
      //   ? [
      //       {
      //         key: "flk52",
      //         text: " ",
      //         type: "atomic",
      //         depth: 0,
      //         inlineStyleRanges: [],
      //         entityRanges: [
      //           {
      //             offset: 0,
      //             length: 1,
      //             key: 0,
      //           },
      //         ],
      //         data: {},
      //       },
      //     ]
      //   : []),
      // ...(isCoverImageUploaded
      //   ? [
      //       {
      //         key: "e25a2",
      //         text: " ",
      //         type: "unstyled",
      //         depth: 0,
      //         inlineStyleRanges: [],
      //         entityRanges: [],
      //         data: {},
      //       },
      //     ]
      //   : []),
      ...(isCoverImagePresent
        ? [
            {
              key: "flk52",
              text: " ",
              type: "atomic",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [
                {
                  offset: 0,
                  length: 1,
                  key: 0,
                },
              ],
              data: {},
            },
          ]
        : []),
      {
        key: "9gm3s",
        text: `${eventData?.eventName}`,
        type: "header-three",
        depth: 0,
        // inlineStyleRanges: [
        //   {
        //     offset: 0,
        //     length: eventData?.event_name?.length,
        //     style: "BOLD",
        //   },
        // ],
        entityRanges: [
          { offset: 0, length: eventData?.eventName?.length, key: 1 },
        ],
        data: {},
      },
      {
        key: "9gpls",
        text: eventCat,
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "ov3r",
        text: `${formatDate(eventData["eventStartdate"])}  To  ${formatDate(
          eventData["eventEnddate"]
        )}`,
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [
          {
            offset: 0,
            length: `${formatDate(
              eventData["eventStartdate"]
            )}  to  ${formatDate(eventData["eventEnddate"])}`.length,
            style: "CODE",
          },
        ],
        entityRanges: [],
        data: {},
      },
      ...(isVirtualEvent
        ? [
            {
              key: "8pw3s",
              text: `${eventData.virtualVenueUrl}`,
              type: "unstyled",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [
                { offset: 0, length: eventData.virtualVenueUrl.length, key: 2 },
              ],
              data: {},
            },
          ]
        : [
            {
              key: "9pp3s",
              text: `${pageData?.address?.line1}, ${pageData?.address?.city}, ${state_name}`,
              type: "unstyled",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
              data: {},
            },
          ]),
      {
        key: "e23a9",
        text: " ",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
  };

  // if (!coverImageMetaData instanceof FileList) {
  //   delete eventFeedState.entityMap[0];
  //   eventFeedState?.blocks.splice(5);
  // }

  const defaultContentState = convertFromRaw(eventFeedState);

  const [editorState, setEditorState] = useState(
    () => EditorState.createWithContent(defaultContentState)
    // EditorState.createEmpty()
  );

  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      supportWhitespace: true,
    });
    // eslint-disable-next-line no-shadow
    const { MentionSuggestions } = mentionPlugin;
    // eslint-disable-next-line no-shadow
    const plugins = [mentionPlugin];
    return { plugins, MentionSuggestions };
  }, []);

  //for the video,hash,image plugin
  const imagePlugin = createImagePlugin();
  const videoPlugin = createVideoPlugin();
  const hashtagPlugin = createHashtagPlugin();
  const onOpenChange = useCallback((_open) => {
    setOpen(_open);
  }, []);

  const onSearchChange = useCallback(
    ({ value }) => {
      searchMutate(
        { search_text: value },
        {
          onSuccess: (data) => {
            setSuggestions(defaultSuggestionsFilter(value, data));
          },
        }
      );
    },
    [searchMutate]
  );

  // const handleCoverImage = (cover) => {
  //   uploadMutate(
  //     { files: cover },
  //     {
  //       onSuccess: (data) => {
  //         const image = Object.values(data)[0];
  //         const newEditorState = insertImageOrVideo(
  //           { ...image, src: image.url },
  //           "IMAGE"
  //         );
  //         setEditorState(newEditorState);
  //       },
  //     }
  //   );
  // };

  // const handleCoverImage = useCallback(
  //   (cover) => {
  //     uploadMutate(
  //       { files: cover },
  //       {
  //         onSuccess: (data) => {
  //           const image = Object.values(data)[0];
  //           const newEditorState = insertImageOrVideo(
  //             { ...image, src: image.url },
  //             "IMAGE"
  //           );
  //           setEditorState(newEditorState);
  //         },
  //       }
  //     );
  //   },
  //   [insertImageOrVideo, uploadMutate]
  // );

  // useEffect(() => {
  //   if (coverImage instanceof FileList) {
  //     handleCoverImage(coverImage);
  //   }
  // }, [handleCoverImage, coverImage]);

  // const insertImageOrVideo = (data, type) => {
  //   const contentState = editorState.getCurrentContent();
  //   const contentStateWithEntity = contentState.createEntity(
  //     type,
  //     "IMMUTABLE",
  //     { ...data }
  //   );
  //   const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  //   const newEditorState = EditorState.set(editorState, {
  //     currentContent: contentStateWithEntity,
  //   });
  //   return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ");
  // };

  // const insertImageOrVideo = useCallback(
  //   (data, type) => {
  //     const contentState = editorState.getCurrentContent();
  //     const contentStateWithEntity = contentState.createEntity(
  //       type,
  //       "IMMUTABLE",
  //       { ...data }
  //     );
  //     const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  //     const newEditorState = EditorState.set(editorState, {
  //       currentContent: contentStateWithEntity,
  //     });
  //     return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ");
  //   },
  //   [editorState]
  // );

  // Old Scenario
  // const handlePost = () => {
  //   const contentState = editorState.getCurrentContent();
  //   const raw = convertToRaw(contentState);
  //   const mentionedUsersPages = [];
  //   const postPhotos = [];
  //   const postVideos = [];
  //   let hastTags = [];

  //   for (let key in raw.blocks) {
  //     const block = raw.blocks[key];
  //     hastTags = [...hastTags, ...extractHashtagsWithIndices(block.text)];
  //   }

  //   for (let key in raw.entityMap) {
  //     const ent = raw.entityMap[key];
  //     if (ent.type === "mention") {
  //       mentionedUsersPages.push(ent.data.mention);
  //     }

  //     if (ent.type === "IMAGE") {
  //       const { src, ...data } = ent.data;
  //       postPhotos.push(data);
  //     }

  //     if (ent.type === videoPlugin.types.VIDEOTYPE) {
  //       const { src, ...data } = ent.data;
  //       postVideos.push(data);
  //     }
  //   }

  //   if (data) {
  //     /*      console.log("publish mutate"); */
  //     const feed = {
  //       feedData: raw,
  //       mentions: mentionedUsersPages,
  //       pics: postPhotos,
  //       videos: postVideos,
  //       hashTags: hastTags,
  //     };
  //     eventData.pageId = pageId;
  //     eventData.event_id = eventId;
  //     //checking venue address type
  //     if (eventData.venue_type === "VIR") eventData.event_venue_other = null;
  //     else eventData.virtual_venue_url = null;

  //     if (eventData?.event_category?.includes(",")) {
  //       eventData.event_category = eventData?.event_category?.split(",")[0];
  //     }
  //     const descContentState = eventData.event_desc.getCurrentContent();
  //     eventData.event_desc = convertToRaw(descContentState);
  //     const rulesContentState = eventData.event_rules.getCurrentContent();
  //     eventData.event_rules = convertToRaw(rulesContentState);
  //     createFeedMutate(
  //       { ...feed, type, id, eventData, coverImage },
  //       {
  //         onSuccess: () => {
  //           onClosed();
  //           toast({
  //             title: `Your event "${eventData.event_name}" has been published successfully`,
  //             position: "top",
  //             status: "success",
  //             duration: 8000,
  //             isClosable: true,
  //           });
  //           router.push(`/page/${pageId}?tab=home`);
  //         },
  //       }
  //     );
  //   } else {
  //     eventData.company_id = pageId;
  //     if (eventData?.event_category?.includes(",")) {
  //       eventData.event_category = eventData?.event_category?.split(",")[0];
  //     }
  //     let event_venue_other, virtual_venue_url;

  //     if (eventData.venue_type === "VEN") {
  //       event_venue_other = eventData.event_venue_other;
  //       virtual_venue_url = null;
  //     } else {
  //       virtual_venue_url = eventData.virtual_venue_url;
  //       event_venue_other = null;
  //     }
  //     // eventData.event_venue_other = "{}";
  //     const descContentState = eventData.event_desc.getCurrentContent();
  //     eventData.event_desc = convertToRaw(descContentState);
  //     const rulesContentState = eventData.event_rules.getCurrentContent();
  //     eventData.event_rules = convertToRaw(rulesContentState);

  //     const feed = {
  //       feedData: raw,
  //       mentions: mentionedUsersPages,
  //       pics: postPhotos,
  //       videos: postVideos,
  //       hashTags: hastTags,
  //     };
  //     eventData.pageId = pageId;

  //     createFeedMutate(
  //       { ...feed, type, eventData, coverImage },
  //       {
  //         onSuccess: () => {
  //           onClosed();
  //           toast({
  //             title: `Your event "${eventData.event_name}" has been published successfully`,
  //             position: "top",
  //             status: "success",
  //             duration: 8000,
  //             isClosable: true,
  //           });
  //           router.push(`/page/${pageId}?tab=home`);
  //         },
  //       }
  //     );
  //   }
  // };
  // const [cover, setCover] = useState(true);

  const handlePost = () => {
    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    updateMutate(
      {
        // ...eventData,
        eventStatus: "PUB",
        eventContacts: JSON.parse(eventData.eventContacts),
        eventId: eventData.eventId,
        userId: userId,
      },
      {
        onSuccess: async () => {
          // Need to add conditional check for event and registration fee?
          if (eventData.collectPymtOnline === "Y") {
            try {
              await addProductsForEvent(
                productMutateAsync,
                userId,
                eventData.eventName,
                eventData.tournaments,
                sports,
                eventData?.eventOrganizers?.[0]?.companyId,
                countryData,
                toast
              );
            } catch (e) {
              console.log(e);
              return;
            }
          }

          createMutate(
            {
              feedData: raw,
              mentions: [],
              pics: [],
              videos: [],
              hashTags: [],
              type: "company",
              id: eventData?.eventOrganizers?.[0]?.companyId,
              feedType: "E",
            },
            {
              onSuccess: () => {
                toast({
                  title: `Your event "${eventData.eventName}" has been successfully published`,
                  position: "bottom",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
                router.push(`/events/${eventData?.eventId}`);
              },
            }
          );
        },
      }
    );
  };

  return (
    <Box w="full" h="min-content" bg="white" p={6} borderRadius="10px">
      <HStack align="flex-start">
        <Avatar
          size="sm"
          name={eventData.eventName}
          src={eventData.eventLogo}
        />
        <Box
          className={editorStyles.feed_editor}
          onClick={() => {
            ref.current.focus();
          }}
          w="100%"
          h="36"
          overflow="scroll"
        >
          <Editor
            editorKey={"editor"}
            editorState={editorState}
            onChange={setEditorState}
            plugins={[...plugins, imagePlugin, hashtagPlugin]}
            ref={ref}
          />
          <MentionSuggestions
            open={open}
            onOpenChange={onOpenChange}
            suggestions={suggestions}
            onSearchChange={onSearchChange}
            onAddMention={() => {
              // get the mention object selected
            }}
          />
        </Box>
      </HStack>
      <HStack mt={2} ml={10} spacing={2}>
        {/*   <IconButton
          icon={<AddImageIcon fontSize="22px" />}
          bg="none"
          color="primary.500"
          onClick={() => imageRef.current.click()}
        />
        <IconButton
          icon={<AddVideoIcon fontSize="22px" />}
          bg="none"
          color="primary.500"
          onClick={() => videoRef.current.click()}
        /> */}
        {/* {coverImage instanceof FileList && cover && (
          <>
            <Button
              leftIcon={<AddImageIcon fontSize="22px" />}
              bg="none"
              color="primary.500"
              fontSize="sm"
              onClick={() => {
                handleCoverImage(coverImage);
                setCover(false);
              }}
            >
              Add Cover Image
            </Button>
          </>
        )} */}
      </HStack>

      <Button
        width="full"
        variant="solid"
        colorScheme="primary"
        onClick={handlePost}
        isLoading={isUpdateLoading}
        // isLoading={
        //   formik.values.event_status === "PUB" &&
        //   (createLoading || updateLoading)
        // }
        // disabled={!formik?.values?.sports_list?.length > 0 && true}
      >
        Save & Publish
      </Button>
    </Box>
  );
}

export default EventFeedEditor;
