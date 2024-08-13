import { useRef, useCallback, useState, useEffect } from "react";
import {
  Box,
  Flex,
  CircularProgress,
  VStack,
  Input,
  HStack,
  IconButton,
  Checkbox,
  Spacer,
  Select,
  Tooltip,
} from "@chakra-ui/react";
import Skeleton from "../../ui/skeleton";
import { HeadingSmall, HeadingXtraSmall } from "../../ui/heading/heading";
import { TextMedium, TextSmall } from "../../ui/text/text";
import { useUserEvents } from "../../../hooks/event-hook";
import { useSports } from "../../../hooks/sports-hooks";
import { useIntersectionObserver } from "../../../hooks/common-hooks";
import EmptyContentDisplay from "../../common/empty-content/empty-content-display";
import PageEventCard from "../../pages/page-event/page-event-card";
import { useQueryClient } from "react-query";
import { useUser } from "../../../hooks/user-hooks";
import { Formik, Form } from "formik";
import DatePicker from "../../ui/pickers/date-picker";
import { SearchBlueIcon, SearchIcon } from "../../ui/icons";
import * as yup from "yup";
import { CloseIcon } from "@chakra-ui/icons";
import {
  DateSchema,
  DateValues,
} from "../../../helper/constants/event-constants";
import ReactSelect from "react-select";

function UserEventList(props) {
  const { setUserEventsCount } = props;
  const queryClient = useQueryClient();
  const { data: userData = {} } = useUser();
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState(null);
  const [sportIds, setSportIds] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view, setView] = useState(false);
  const [isPast, setIsPast] = useState(false);

  const {
    data: userEvents = [],
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useUserEvents(
    userData?.user_id,
    eventName,
    eventType,
    startDate,
    endDate,
    sportIds,
    isPast
  );

  const loadMoreRef = useRef();

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });

  const handleSearchChange = useCallback(
    (e) => {
      setEventName(e.target.value);
      refetch({
        refetchPage: () => {
          queryClient.invalidateQueries([
            "user-events",
            userData?.user_id,
            eventName,
            eventType,
            startDate,
            endDate,
            sportIds,
            isPast,
          ]);

          return true;
        },
      });
    },
    [
      refetch,
      userData?.user_id,
      queryClient,
      eventName,
      eventType,
      startDate,
      endDate,
      sportIds,
      isPast,
    ]
  );

  const eventsCount = userEvents?.pages && userEvents?.pages[0]?.totalCount;

  useEffect(() => {
    setUserEventsCount(eventsCount);
  }, [eventsCount, setUserEventsCount]);

  const { data: sportsData = [] } = useSports({
    select: (data) => {
      return data?.map((sport) => ({
        ...sport,
        value: sport["sports_id"],
        label: sport["sports_name"],
      }));
    },
  });

  const MultiSelectSports = (props) => {
    return <ReactSelect {...props} options={sportsData} />;
  };

  const sportSelectValues = sportIds
    ?.map((sportId) =>
      sportsData?.find(({ sports_id }) => sportId === sports_id)
    )
    ?.map(({ value, label }) => {
      return {
        value,
        label,
      };
    });

  return (
    <HStack align="flex-start" minH="100vh">
      <Formik
        initialValues={{ start_date: startDate, end_date: endDate }}
        validationSchema={DateSchema(yup)}
        onSubmit={(values, { resetForm }) => {
          setEventType("custom");
          setStartDate(values.start_date);
          setEndDate(values.end_date);
          /*    resetForm(); */
        }}
        validateOnBlur={false}
      >
        {({ setFieldValue }) => (
          <Form>
            <VStack align="flex-start" spacing={5} p={[2, 3, 4]}>
              <VStack align="flex-start" spacing={4}>
                <Flex align="flex-start" w="full">
                  <HeadingSmall>FILTERS</HeadingSmall>
                  <Spacer />
                  <Tooltip label={"Clear Filters"}>
                    <CloseIcon
                      onClick={() => {
                        setStartDate(null);
                        setEndDate(null);
                        setEventType(null);
                        setFieldValue("end_date", null);
                        setFieldValue("start_date", null);
                        setSportIds([]);
                      }}
                      fontSize="10px"
                      style={{ cursor: "pointer", color: "#3182CE" }}
                    />
                  </Tooltip>
                </Flex>
                <Box h="min-content">
                  <Input
                    type="search"
                    placeholder="Search Events"
                    bg="#f9f9f9"
                    transition="0.5s ease-out"
                    borderRadius={"5px"}
                    variant="outline"
                    _focus={{ boxShadow: "none" }}
                    color="black"
                    onInput={(e) => handleSearchChange(e)}
                  ></Input>
                </Box>
              </VStack>

              <VStack spacing={1} align="flex-start" w="full">
                <HeadingXtraSmall color="#3182CE">Date</HeadingXtraSmall>
                <Select
                  onChange={(e) => {
                    if (startDate || endDate) {
                      setEventType(e.target.value);
                      setStartDate(null);
                      setEndDate(null);
                      setFieldValue("end_date", null);
                      setFieldValue("start_date", null);
                    }
                    setEventType(e.target.value);
                  }}
                  value={eventType ? eventType : false}
                  fontSize="sm"
                  placeholder={"Select Date"}
                  variant={"flushed"}
                  colorScheme={"primary.600"}
                  borderColor={"primary.600"}
                >
                  {DateValues.map(({ value, label }) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </VStack>
              <Checkbox value={isPast} onChange={() => setIsPast(!isPast)}>
                <TextSmall>Show Past Events</TextSmall>
              </Checkbox>
              <VStack align="flex-start" spacing={0}>
                <HeadingXtraSmall color="#3182CE">Custom Date</HeadingXtraSmall>
                <HStack spacing={2}>
                  <VStack w="70%">
                    <DatePicker
                      name="start_date"
                      placeholderText="Start Date"
                    />
                    <DatePicker name="end_date" placeholderText="End Date" />
                  </VStack>
                  <IconButton
                    icon={<SearchIcon style={{ cursor: "pointer" }} />}
                    _focus={{ boxShadow: "none" }}
                    w={"15px"}
                    h={"25px"}
                    type="submit"
                  ></IconButton>
                </HStack>
              </VStack>

              <VStack align={"flex-start"} w="full">
                <HeadingXtraSmall color="#3182CE">Sports</HeadingXtraSmall>
                {/* <CheckboxGroup
                    colorScheme={"blue"}
                    defaultValue={[]}
                    onChange={(values) => {
                      setSportIds(values);
                    }}
                  >
                    <Stack spacing={1} direction={"column"}>
                      {sportsData?.map(({ sports_id, sports_name }, index) => {
                        if (index < 6)
                          return (
                            <Checkbox
                              key={sports_id}
                              value={sports_id.toString()}
                            >
                              <TextSmall>{sports_name}</TextSmall>
                            </Checkbox>
                          );
                      })}
                      {view || (
                        <TextSmall
                          color="#3182CE"
                          cursor="pointer"
                          onClick={() => setView(!view)}
                        >
                          {!view && "View More"}
                        </TextSmall>
                      )}
                      {view &&
                        sportsData?.map(({ sports_id, sports_name }, index) => {
                          if (index >= 6)
                            return (
                              <Checkbox
                                key={sports_id}
                                value={sports_id.toString()}
                              >
                                <TextSmall>{sports_name}</TextSmall>
                              </Checkbox>
                            );
                        })}
                      <TextSmall
                        color="#3182CE"
                        cursor="pointer"
                        onClick={() => setView(!view)}
                      >
                        {view && "View Less"}
                      </TextSmall>
                    </Stack>
                  </CheckboxGroup> */}
                <Box w={["120px", "210px"]}>
                  <MultiSelectSports
                    isMulti
                    placeholder={"Select Sports"}
                    onChange={(values, { action, option, removedValue }) => {
                      if (action === "select-option") {
                        let sportId;
                        sportId = option.sports_id;
                        let sportValues = [...sportIds, sportId];
                        setSportIds(sportValues);
                      } else if (action === "clear") setSportIds([]);
                      else if (action === "remove-value") {
                        setSportIds(
                          sportIds?.filter((id) => id !== removedValue.value)
                        );
                      }
                    }}
                    value={sportSelectValues}
                  />
                </Box>
              </VStack>
            </VStack>
          </Form>
        )}
      </Formik>
      <VStack w={"full"}>
        <Box>
          {" "}
          {isLoading ? (
            <HStack>
              <SearchBlueIcon />
              <TextSmall>Fetching..</TextSmall>
            </HStack>
          ) : (
            eventsCount > 0 &&
            (eventName ||
              sportIds?.length > 0 ||
              eventType ||
              startDate ||
              endDate) && (
              <HStack>
                <SearchBlueIcon />
                <TextMedium>
                  <b>{eventsCount}</b> results found
                </TextMedium>
              </HStack>
            )
          )}
        </Box>

        {userEvents && isLoading ? (
          <Skeleton></Skeleton>
        ) : error ? (
          "An error has occurred: " + error.message
        ) : (
          <VStack align="flex-start" justify={"flex-start"} w="full">
            {eventsCount > 0 ? (
              <HStack flexWrap={"wrap"} w="full" px={[0, 3, 8]}>
                {userEvents?.pages?.map((page, idx) => {
                  return page?.content?.map((eventData) => {
                    return (
                      <>
                        <PageEventCard
                          eventStartDate={eventData["event_startdate"]}
                          eventEndDate={eventData["event_enddate"]}
                          eventName={eventData["event_name"]}
                          eventSportsList={eventData["array_agg"]}
                          cardType="events"
                          eventBanner={eventData["event_banner"]}
                          eventId={eventData["event_id"]}
                          eventCategoryName={eventData["category_name"]}
                        />
                      </>
                    );
                  });
                })}
              </HStack>
            ) : (
              <EmptyContentDisplay displayText="No Events to Display" />
            )}

            <span ref={loadMoreRef} />
            {isFetchingNextPage && (
              <CircularProgress
                alignSelf="center"
                isIndeterminate
                size="28px"
              />
            )}
          </VStack>
        )}
      </VStack>
    </HStack>
  );
}
export default UserEventList;
