import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Circle,
  Flex,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useSteps } from "chakra-ui-steps";
import EmptyCoverImage from "../../common/empty-cover-image";
import { EditIcon } from "../../ui/icons";
import { HeadingMedium } from "../../ui/heading/heading";
import { TextSmall } from "../../ui/text/text";
import IconButton from "../../ui/icon-button";
import { useEventById, useEventByIdNew } from "../../../hooks/event-hook";
import { useRouter } from "next/router";
import Horizontal from "../page-event-forms/stepper";
import { useCategoriesByType } from "../../../hooks/category-hooks";
import CoverImageHandler from "../../common/image-crop-functions/crop-pic-mutate";
import CoverImage from "../../common/cover-image";

function PageEventCreateNew({ type = "create" }) {
  const router = useRouter();
  const { eventId } = router.query;
  // console.log(eventId, "event id");
  const { data: eventData, isLoading: eventLoading } = useEventByIdNew(eventId);
  // console.log(eventData, "eventdata");
  const { data: categories = [], isLoading: isCatLoading } =
    useCategoriesByType("EVT");

  const isTypeEdit = type === "edit";

  const [coverImage, setCoverImage] = useState();
  const [croppedCoverImage, setCroppedCoverImage] = useState();
  const [profileImage, setProfileImage] = useState();
  const profilePicRef = useRef();

  useEffect(() => {
    if (eventData) {
      setCroppedCoverImage(eventData.eventBanner);
      setProfileImage(eventData.eventLogo);
    }
  }, [eventData]);

  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  });

  const isFirstStep = activeStep === 0;

  return (
    <VStack align="stretch" spacing={8}>
      {isTypeEdit ? (
        <HeadingMedium>Edit Event</HeadingMedium>
      ) : (
        <HeadingMedium>Create Event</HeadingMedium>
      )}

      <Box backgroundColor="white" borderTopRadius="10px" position="relative">
        {/* <EmptyCoverImage bgColor={"gray.300"}>Event Banner</EmptyCoverImage> */}

        {/* NEW COMMENT */}
        {!croppedCoverImage ? (
          <EmptyCoverImage bgColor={"gray.300"}>Event Banner</EmptyCoverImage>
        ) : croppedCoverImage instanceof File ? (
          <CoverImage coverimage={URL.createObjectURL(croppedCoverImage)} />
        ) : (
          <CoverImage coverimage={croppedCoverImage} />
        )}

        {/*    <Input
                type="file"
                values={formik.values.event_banner}
                id="event_banner"
                display="none"
                ref={coverPicRef}
                // onChange={formik.handleChange}
                onChange={(e) => {
                  formik.setFieldValue("event_banner", e.target.files[0]);
                  setCoverImage(e.target.files);
                }}
              />
              <IconButton
                aria-label="upload picture"
                variant="solid"
                icon={<EditIcon color="white" fontSize="18px" />}
                tooltipLabel="Edit Event Cover Pic"
                size="sm"
                colorScheme="primary"
                // border="2px solid white"
                position="absolute"
                borderRadius="base"
                top="1px"
                right="0px"
                onClick={() => coverPicRef.current.click()}
              /> */}
        {/* NEW COMMENT */}
        {isFirstStep && (
          <CoverImageHandler
            type="eventCreate"
            coverImage={coverImage}
            setCoverImage={setCoverImage}
            setCroppedCoverImage={setCroppedCoverImage}
          />
        )}
        {/* OLD IMAGE */}
        {/* <IconButton
                  aria-label="upload picture"
                  icon={<EditIcon color="white" />}
                  tooltipLabel
                  isRound
                  size="xs"
                  colorScheme="primary"
                  border="2px solid white"
                  position="absolute"
                  top="10px"
                  right="10px"
                  onClick={() => coverPicRef.current.click()}
                /> */}
        <Flex justifyContent={"flex-start"} mt={-12} py={3} px={8}>
          <HStack>
            {/* <Circle
              size="24"
              name="event_logo"
              bg="gray.600"
              color="white"
              mt={-12}
            >
              <TextSmall>LOGO</TextSmall>
            </Circle> */}
            {/* NEW */}
            {!profileImage ? (
              <Circle
                size="24"
                name="event_logo"
                bg="gray.600"
                color="white"
                mt={-12}
              >
                <TextSmall>LOGO</TextSmall>
              </Circle>
            ) : profileImage instanceof File ? (
              <Avatar
                size={"xl"}
                name="event_logo"
                alt="event profile image"
                src={URL.createObjectURL(profileImage)}
                mt={-12}
              />
            ) : (
              <Avatar
                size={"xl"}
                name="event_logo"
                alt="logo"
                src={profileImage}
                mt={-14}
              />
            )}
            <Input
              type="file"
              id="event_logo"
              display="none"
              ref={profilePicRef}
              onChange={(e) => {
                setProfileImage(e.target.files[0]);
                // formik.setFieldValue("event_logo", e.target.files[0]);
              }}
            />
            {isFirstStep && (
              <IconButton
                aria-label="upload picture"
                icon={<EditIcon color="white" fontSize="18px" />}
                isRound
                variant="solid"
                size="xs"
                tooltipLabel="Edit Event Logo"
                colorScheme="primary"
                // border="2px solid white"
                position="relative"
                bottom="12"
                right="20px"
                _focus={{ boxShadow: "none" }}
                onClick={() => profilePicRef.current.click()}
              />
            )}
            <Box p={4} alignItems={"baseline"}>
              <VStack>
                <Box height="25px"></Box>
                <VStack spacing={0} align={"flex-start"}>
                  <Text color="gray.500" fontWeight="bold">
                    {
                      eventData ? (
                        <Text>{eventData?.eventName}</Text>
                      ) : (
                        <Text>Event Name</Text>
                      )
                      // <Text>{eventData?.eventName}</Text>
                    }
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    {eventData?.eventCategoryId
                      ? categories?.find(
                          (category) =>
                            category["category_id"] ===
                              eventData?.eventCategoryId ||
                            category["category_name"] ===
                              eventData?.eventCategoryId
                        )?.["category_name"]
                      : "Category Name"}
                  </Text>
                </VStack>
              </VStack>
            </Box>
          </HStack>
        </Flex>
      </Box>
      {/* <Form> */}
      <Box w="full" bg="white">
        <Box w="full" p={5}>
          {/* <StepperComponent goSteps={goSteps} /> */}
          {/* <EventCreateFormTwo
            eventData={eventData}
            eventLoading={eventLoading}
          /> */}
          {/* <EventCreateFormThree
            eventData={eventData}
            eventLoading={eventLoading}
          /> */}
          {/* <ChakraProvider theme={theme}>
           
          </ChakraProvider> */}
          <Horizontal
            eventData={eventData}
            nextStep={nextStep}
            prevStep={prevStep}
            activeStep={activeStep}
            isTypeEdit={isTypeEdit}
            profileImage={profileImage}
            coverImage={croppedCoverImage}
          />
        </Box>
      </Box>
      {/* </Form> */}
    </VStack>
  );
}
export default PageEventCreateNew;
