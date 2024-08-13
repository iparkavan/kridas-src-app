import React, { useState } from "react";
import Modal from "../../ui/modal";
import { useEventsByCompanyId } from "../../../hooks/event-hook";
import { useRouter } from "next/router";
import { Box, HStack, Stack } from "@chakra-ui/react";
import EventDataWithCheckBox from "./event-data-with-checkbox";
import Button from "../../ui/button";
import { useUser } from "../../../hooks/user-hooks";
import { usePostEventProduct } from "../../../hooks/event-product-hooks";

const AddToEventMarketplaceModal = ({
  isOpen,
  onClose,
  selectedVoucher,
  voucherId,
}) => {
  const router = useRouter();
  const { pageId } = router.query;

  console.log("VOUCHER", selectedVoucher, voucherId);

  const { data: userInfo } = useUser();
  const { mutate: eventProductMutate, isLoading } = usePostEventProduct();

  const [selectedEvent, setSelectedEvent] = useState([]);

  const {
    data: pageEvents = [],
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    // isLoading,
    error,
    refetch,
  } = useEventsByCompanyId(pageId);

  const checkBoxHandler = (voucherId, isChecked) => {
    if (isChecked) {
      setSelectedEvent((prevSelected) => [...prevSelected, voucherId]);
    } else {
      setSelectedEvent((prevSelected) =>
        prevSelected.filter((id) => id !== voucherId)
      );
    }
  };

  const onCloseModal = () => {
    setSelectedEvent([]);
    onClose();
  };

  const eventSubmitHandler = () => {
    eventProductMutate(
      {
        listOfeventId: selectedEvent,
        listOfproductId: selectedVoucher ? selectedVoucher : voucherId,
        isSelectedByOrganizer: false,
        createdBy: userInfo.user_id,
        updatedBy: userInfo.user_id,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onCloseModal} title="Events" size="xl">
      <HStack>
        {pageEvents?.pages?.map((page, index) => {
          return page?.content?.map((eventData) => {
            return (
              // eslint-disable-next-line react/jsx-key
              // <Box w={"full"}>
              <EventDataWithCheckBox
                key={eventData.event_id}
                eventData={eventData}
                onCheckBoxHandler={checkBoxHandler}
              />
              // </Box>
            );
          });
        })}
      </HStack>
      <HStack
        mt={6}
        w={"full"}
        alignContent={"center"}
        justifyContent={"flex-end"}
      >
        <Button onClick={eventSubmitHandler}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </HStack>
    </Modal>
  );
};

export default AddToEventMarketplaceModal;
