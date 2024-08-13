import {
  Alert,
  AlertDescription,
  AlertIcon,
  Avatar,
  Box,
  ButtonGroup,
  Flex,
  HStack,
  List,
  ListItem,
  Skeleton,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useEventSponsors } from "../../../hooks/event-hook";
import { usePageSponsors } from "../../../hooks/page-sponsor-hooks";
import { useSaveSponsorOrder } from "../../../hooks/sponsor-hooks";
import Button from "../../ui/button";
import { HeadingSmall } from "../../ui/heading/heading";
import IconButton from "../../ui/icon-button";
import { DeleteIcon, EditIcon } from "../../ui/icons";
import { TextMedium } from "../../ui/text/text";
import SponsorsModal from "./sponsors-modal";
import SponsorsDeleteModal from "./sponsors-delete-modal";

const SponsorsDND = (props) => {
  const { type, id, setMode } = props;
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    data: pageSponsorsData,
    isLoading: isPageSponsorsLoading,
    isSuccess: isPageSponsorsSuccess,
    isError: isPageSponsorsError,
  } = usePageSponsors(type === "company" && id);

  const {
    data: eventSponsorsData,
    isLoading: isEventSponsorsLoading,
    isSuccess: isEventSponsorsSuccess,
    isError: isEventSponsorsError,
  } = useEventSponsors(type === "event" && id);

  let sponsorsData, isLoading, isSuccess, isError;
  if (type === "company") {
    sponsorsData = pageSponsorsData;
    isLoading = isPageSponsorsLoading;
    isSuccess = isPageSponsorsSuccess;
    isError = isPageSponsorsError;
  } else if (type === "event") {
    sponsorsData = eventSponsorsData;
    isLoading = isEventSponsorsLoading;
    isSuccess = isEventSponsorsSuccess;
    isError = isEventSponsorsError;
  }

  const [editInitialValues, setEditInitialValues] = useState();
  const { mutate: saveOrderMutate, isLoading: isSaveOrderLoading } =
    useSaveSponsorOrder();

  const [deleteSponsorId, setDeleteSponsorId] = useState();
  const [sponsorsTest, setSponsorsTest] = useState();

  useEffect(() => {
    setSponsorsTest({
      sponsors: sponsorsData?.reduce((obj, s) => {
        obj[s["sponsor"]["sponsor_id"]] = {
          ...s.sponsor,
          is_featured: s[`${type}_sponsor`]["is_featured"],
        };
        return obj;
      }, {}),
      [`${type}_sponsor_type`]: sponsorsData?.reduce((obj, s) => {
        obj[s[`${type}_sponsor_type`][`${type}_sponsor_type_id`]] =
          s[`${type}_sponsor_type`];
        obj[s[`${type}_sponsor_type`][`${type}_sponsor_type_id`]] = {
          ...obj[s[`${type}_sponsor_type`][`${type}_sponsor_type_id`]],
          sponsor_ids: sponsorsData
            ?.filter(
              (sp) =>
                sp[`${type}_sponsor`][`sponsor_type_id`] ===
                s[`${type}_sponsor_type`][`${type}_sponsor_type_id`]
            )
            ?.sort(
              (s1, s2) =>
                s1[`${type}_sponsor`]["seq_number"] -
                s2[`${type}_sponsor`]["seq_number"]
            )
            ?.map((s) => s["sponsor"]["sponsor_id"]),
        };
        return obj;
      }, {}),
      [`${type}_sponsor_type_order`]: sponsorsData?.reduce((arr, s) => {
        if (
          !arr?.includes(s[`${type}_sponsor_type`][`${type}_sponsor_type_id`])
        ) {
          arr.push(s[`${type}_sponsor_type`][`${type}_sponsor_type_id`]);
        }
        return arr;
      }, []),
    });
  }, [sponsorsData, type]);

  const handleOnDragEnd = (result) => {
    const { source, destination, type: resultType } = result;
    if (!destination) return;
    if (resultType === "column") {
      const updatedSponsorsData = { ...sponsorsTest };
      const updatedSponsorsTypeOrder = [
        ...updatedSponsorsData[`${type}_sponsor_type_order`],
      ];
      const [reorderSponsorType] = updatedSponsorsTypeOrder.splice(
        source.index,
        1
      );
      updatedSponsorsTypeOrder.splice(destination.index, 0, reorderSponsorType);
      updatedSponsorsData[`${type}_sponsor_type_order`] =
        updatedSponsorsTypeOrder;
      setSponsorsTest(updatedSponsorsData);
    } else {
      if (source.droppableId !== destination.droppableId) {
        const updatedSponsorsData = { ...sponsorsTest };
        const updatedSourceSponsorIds = [
          ...updatedSponsorsData[`${type}_sponsor_type`][source.droppableId][
            "sponsor_ids"
          ],
        ];
        const [reorderSponsorId] = updatedSourceSponsorIds.splice(
          source.index,
          1
        );
        const updatedDestinationSponsorIds = [
          ...updatedSponsorsData[`${type}_sponsor_type`][
            destination.droppableId
          ]["sponsor_ids"],
        ];
        updatedDestinationSponsorIds.splice(
          destination.index,
          0,
          reorderSponsorId
        );
        updatedSponsorsData[`${type}_sponsor_type`][source.droppableId][
          "sponsor_ids"
        ] = updatedSourceSponsorIds;
        updatedSponsorsData[`${type}_sponsor_type`][destination.droppableId][
          "sponsor_ids"
        ] = updatedDestinationSponsorIds;
        setSponsorsTest(updatedSponsorsData);
      } else {
        const updatedSponsorsData = { ...sponsorsTest };
        const updatedSponsorIds = [
          ...updatedSponsorsData[`${type}_sponsor_type`][
            destination.droppableId
          ]["sponsor_ids"],
        ];
        const [reorderSponsorId] = updatedSponsorIds.splice(source.index, 1);
        updatedSponsorIds.splice(destination.index, 0, reorderSponsorId);
        updatedSponsorsData[`${type}_sponsor_type`][destination.droppableId][
          "sponsor_ids"
        ] = updatedSponsorIds;
        setSponsorsTest(updatedSponsorsData);
      }
    }
  };

  const handleEditSponsor = (sponsor, sponsorTypeId, sponsorTypeName) => {
    const isFeatured = sponsorsData?.find(
      (s) => s[`${type}_sponsor`]["sponsor_id"] === sponsor["sponsor_id"]
    )?.[`${type}_sponsor`]["is_featured"];
    setEditInitialValues({
      sponsor_id: sponsor["sponsor_id"],
      sponsor_name: sponsor["sponsor_name"],
      sponsor_desc: sponsor["sponsor_desc"],
      sponsor_media_url: sponsor["sponsor_media_url_meta"],
      sponsor_click_url: sponsor["sponsor_click_url"],
      [`${type}_sponsor_type_id`]: sponsorTypeId,
      [`${type}_sponsor_type_name`]: sponsorTypeName,
      is_featured: isFeatured,
      [`${type}_id`]: id,
    });
    onEditOpen();
  };

  const handleDelete = (sponsorId) => {
    setDeleteSponsorId(sponsorId);
    onDeleteOpen();
  };

  const handleSave = () => {
    saveOrderMutate(
      { ...sponsorsTest, type, id },
      {
        onSuccess: () => setMode("view"),
      }
    );
  };

  if (isError) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertDescription>Sponsors are not available.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Skeleton isLoaded={!isLoading}>
      {isSuccess && sponsorsTest && (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable
            droppableId="sponsor_type_order"
            direction="horizontal"
            type="column"
          >
            {(topDroppableProvided) => (
              <Flex
                spacing={0}
                gap={5}
                flexWrap="wrap"
                {...topDroppableProvided.droppableProps}
                ref={topDroppableProvided.innerRef}
              >
                {sponsorsTest[`${type}_sponsor_type_order`]?.map(
                  (sponsorTypeId, index) => (
                    <Draggable
                      key={sponsorTypeId}
                      draggableId={sponsorTypeId.toString()}
                      index={index}
                    >
                      {(topDraggableProvided) => (
                        <Box
                          {...topDraggableProvided.draggableProps}
                          {...topDraggableProvided.dragHandleProps}
                          ref={topDraggableProvided.innerRef}
                        >
                          <Droppable
                            // key={sponsorTypeId}
                            droppableId={sponsorTypeId.toString()}
                          >
                            {(droppableProvided) => (
                              <Box
                                p={5}
                                w="250px"
                                bg="gray.100"
                                borderRadius="md"
                                minH="500px"
                                {...droppableProvided.droppableProps}
                                ref={droppableProvided.innerRef}
                              >
                                <HeadingSmall textAlign="center">
                                  {
                                    sponsorsTest[`${type}_sponsor_type`][
                                      sponsorTypeId
                                    ][`${type}_sponsor_type_name`]
                                  }
                                </HeadingSmall>
                                <List mt={5} spacing={3}>
                                  {sponsorsTest[`${type}_sponsor_type`][
                                    sponsorTypeId
                                  ]["sponsor_ids"]?.map((sponsorId, index) => (
                                    <Draggable
                                      key={sponsorId}
                                      draggableId={sponsorId.toString()}
                                      index={index}
                                    >
                                      {(draggableProvided) => (
                                        <ListItem>
                                          <Box
                                            bg="white"
                                            py={6}
                                            px={3}
                                            borderRadius="md"
                                            pos="relative"
                                            // style={{ ...draggableProvided.draggableProps.style }}
                                            {...draggableProvided.draggableProps}
                                            {...draggableProvided.dragHandleProps}
                                            ref={draggableProvided.innerRef}
                                          >
                                            <HStack
                                              pos="absolute"
                                              top="0"
                                              right="0"
                                              spacing={0}
                                            >
                                              <IconButton
                                                icon={<EditIcon />}
                                                size="xs"
                                                onClick={() =>
                                                  handleEditSponsor(
                                                    sponsorsTest["sponsors"][
                                                      sponsorId
                                                    ],
                                                    sponsorTypeId,
                                                    sponsorsTest[
                                                      `${type}_sponsor_type`
                                                    ][sponsorTypeId][
                                                      `${type}_sponsor_type_name`
                                                    ]
                                                  )
                                                }
                                              />
                                              <IconButton
                                                icon={<DeleteIcon />}
                                                size="xs"
                                                onClick={() =>
                                                  handleDelete(sponsorId)
                                                }
                                              />
                                            </HStack>
                                            <HStack>
                                              <Avatar
                                                src={
                                                  sponsorsTest["sponsors"][
                                                    sponsorId
                                                  ]["sponsor_media_url"]
                                                }
                                                name={
                                                  sponsorsTest["sponsors"][
                                                    sponsorId
                                                  ]["sponsor_name"]
                                                }
                                                size="sm"
                                              />
                                              <TextMedium>
                                                {
                                                  sponsorsTest["sponsors"][
                                                    sponsorId
                                                  ]["sponsor_name"]
                                                }
                                              </TextMedium>
                                            </HStack>
                                          </Box>
                                        </ListItem>
                                      )}
                                    </Draggable>
                                  ))}
                                </List>
                                {droppableProvided.placeholder}
                              </Box>
                            )}
                          </Droppable>
                        </Box>
                      )}
                    </Draggable>
                  )
                )}
                <SponsorsModal
                  isOpen={isEditOpen}
                  onClose={onEditClose}
                  mode="edit"
                  type={type}
                  id={id}
                  editInitialValues={editInitialValues}
                  // Need sports here?
                  sports={[]}
                />
                <SponsorsDeleteModal
                  isOpen={isDeleteOpen}
                  onClose={onDeleteClose}
                  sponsorId={deleteSponsorId}
                  type={type}
                  id={id}
                />
                {topDroppableProvided.placeholder}
              </Flex>
            )}
          </Droppable>
          {Boolean(sponsorsData?.length) && (
            <ButtonGroup mt={5} spacing={4}>
              <Button variant="outline" onClick={() => setMode("view")}>
                Cancel
              </Button>
              <Button onClick={handleSave} isLoading={isSaveOrderLoading}>
                Save
              </Button>
            </ButtonGroup>
          )}
        </DragDropContext>
      )}
    </Skeleton>
  );
};

export default SponsorsDND;
