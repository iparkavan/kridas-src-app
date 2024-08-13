import { useRef, useCallback, useState, forwardRef } from "react";
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
  Tag,
  SimpleGrid,
  InputGroup,
  InputRightElement,
  useDisclosure,
  Stack,
  Skeleton,
} from "@chakra-ui/react";
import { HeadingSmall, HeadingXtraSmall } from "../../ui/heading/heading";
import { TextMedium, TextSmall } from "../../ui/text/text";
import { useEvents, useEventSearch } from "../../../hooks/event-hook";
import { useSports } from "../../../hooks/sports-hooks";
import { useIntersectionObserver } from "../../../hooks/common-hooks";

import PageEventCard from "../../pages/page-event/page-event-card";
import { useQueryClient } from "react-query";

import { CalendarIcon, SearchBlueIcon, SearchIcon } from "../../ui/icons";

import { CloseIcon } from "@chakra-ui/icons";
import { DateValues } from "../../../helper/constants/event-constants";
import ReactSelect from "react-select";
import { useCategoriesByType } from "../../../hooks/category-hooks";
import { useUser } from "../../../hooks/user-hooks";
import ReactDatePicker from "react-datepicker";
import { addDays, addMonths, addWeeks, addYears } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import ResponsiveFilter from "./responsive-filter";

function PublishedEventsList(props) {
  const DatePickerInput = forwardRef((props, ref) => {
    return (
      <InputGroup>
        <Input {...props} ref={ref} />
        <InputRightElement color="gray.400">
          <CalendarIcon />
        </InputRightElement>
      </InputGroup>
    );
  });
  DatePickerInput.displayName = "DatePickerInput";

  const queryClient = useQueryClient();
  const [eventCategory, setEventCategory] = useState(null);
  const [eventName, setEventName] = useState(null);
  const [eventType, setEventType] = useState(null);

  const [dateStartAll, setDateStartAll] = useState(null);
  const [dateEndAll, setDateEndAll] = useState(null);

  const [sportIds, setSportIds] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isPast, setIsPast] = useState(false);
  const [userId, setUserId] = useState(null);
  const [participantCategory, setParticipantCategory] = useState(null);

  const { data: userData } = useUser();
  const { data: categories = [], isLoading: isCatLoading } =
    useCategoriesByType("EVT");

  const { data: participantCategories = [] } = useCategoriesByType("PRC");
  // const {
  //   data: events = [],
  //   hasNextPage,
  //   fetchNextPage,
  //   isFetchingNextPage,
  //   isLoading,
  //   error,
  //   refetch,
  // } = useEvents(eventName, eventType, startDate, endDate, sportIds, isPast);

  const {
    data: EventListData,
    isLoading,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    // error,
    refetch,
  } = useEventSearch({
    companyId: null,
    eventCategoryid: eventCategory,

    eventStartdate: startDate || dateStartAll,
    eventEnddate: endDate || dateEndAll,

    eventName: eventName,
    eventType: null,
    featured: false,
    location: null,
    participated: +participantCategory,
    past: isPast,
    sportId: sportIds?.value,
    userId: userData.user_id,
    createdBy: userId,
    // hasNextPage,
    // fetchNextPage,
    // isFetchingNextPage,
    // error,
    // refetch,
    limit: 10,
  });

  const areEventsPresent = isSuccess && EventListData?.pages[0] !== "";

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
            "all-events",
            eventName,
            eventCategory,
            participantCategory,
            startDate,
            endDate,
            sportIds,
            userId,
          ]);
          if (startDate || endDate) {
            setEventType(null);
            setStartDate(null);
            setEndDate(null);
          }
          return true;
        },
      });
    },
    [
      refetch,
      queryClient,
      eventName,
      eventCategory,
      participantCategory,
      startDate,
      endDate,
      sportIds,
      userId,
    ]
  );

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
    return (
      <ReactSelect
        styles={{
          menu: (provided) => ({ ...provided, zIndex: 999 }),
        }}
        {...props}
        options={sportsData}
      />
    );
  };

  return (
    <Box p={0}>
      <Flex
        my={5}
        gap={3}
        alignItems={{ base: "flex-start", md: "center" }}
        bgColor="white"
        px={5}
        py={3}
        flexDirection={{ base: "column", sm: "row" }}
        borderRadius={10}
      >
        <HStack spacing={0} gap={2} wrap="wrap">
          {categories?.map((category, index) => (
            <Tag
              size="md"
              colorScheme="blue"
              borderRadius={15}
              cursor="pointer"
              key={index}
              variant={
                eventCategory === category.category_id ? "solid" : "outline"
              }
              onClick={() => {
                if (eventCategory === category.category_id) {
                  setEventCategory(null);
                } else {
                  setEventCategory(category.category_id);
                }
              }}
            >
              {category.category_name}
            </Tag>
          ))}
        </HStack>
        <Spacer />
        <Select
          onChange={(e) => {
            setDateStartAll(new Date());
            if (e.target.value === "today") {
              setDateEndAll(new Date());
            } else if (e.target.value === "tomorrow") {
              setDateEndAll(addDays(new Date(), 1));
            } else if (e.target.value === "week") {
              setDateEndAll(addWeeks(new Date(), 1));
            } else if (e.target.value === "month") {
              setDateEndAll(addMonths(new Date(), 1));
            } else if (e.target.value === "year") {
              setDateEndAll(addYears(new Date(), 1));
            }
            // setEventType(e.target.value);
          }}
          fontSize="sm"
          placeholder={"Select Date"}
          colorScheme={"primary.600"}
          w="full"
          maxW={{ sm: "2xs" }}
        >
          {DateValues.map(({ value, label }) => (
            <option value={value} key={value}>
              {label}
            </option>
          ))}
        </Select>
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
          w="full"
          maxW={{ sm: "2xs" }}
          display={{ base: "none", md: "initial" }}
        />
      </Flex>
      <HStack
        p={4}
        flexDirection={{ base: "column", md: "row" }}
        align="flex-start"
        minH="100vh"
        bg="white"
        gap={4}
        spacing={0}
      >
        <VStack
          display={{ base: "none", md: "inherit" }}
          align="flex-start"
          spacing={5}
          p={[2, 3, 4]}
        >
          <VStack align="flex-start" spacing={4} w="full">
            <Flex align="flex-start" w="full">
              <HeadingSmall>My Events</HeadingSmall>
              <Spacer />
              <Checkbox
                size="md"
                colorScheme="primary"
                defaultValue={null}
                // value={userData.user_id}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setUserId(isChecked ? userData.user_id : null);
                }}
              />
            </Flex>
            <Flex align="flex-start" w="full">
              <HeadingSmall>Show Past Events</HeadingSmall>
              <Spacer />
              <Checkbox
                size="md"
                colorScheme="primary"
                value={isPast}
                onChange={(e) => setIsPast(e.target.checked)}
              />
            </Flex>
            <Flex align="flex-start" w="full">
              <HeadingSmall>Filters</HeadingSmall>
              <Spacer />
              <Tooltip label={"Clear Filters"}>
                <CloseIcon
                  onClick={() => {
                    setStartDate(null);
                    setEndDate(null);
                    setDateStartAll(null);
                    setDateEndAll(null);
                    setEventType(null);
                    setSportIds(null);
                    setEventCategory(null);
                    setIsPast(null);
                    setEventName(null);
                    setParticipantCategory(null);
                  }}
                  fontSize="10px"
                  style={{ cursor: "pointer", color: "#3182CE" }}
                />
              </Tooltip>
            </Flex>

            <Box w={["120px", "210px"]}>
              {/* <VStack align="flex-start" spacing={2}> */}
              <HeadingXtraSmall mb={2} color="#3182CE">
                Sports
              </HeadingXtraSmall>
              <MultiSelectSports
                fontSize="sm"
                placeholder={"Select Sport"}
                colorScheme={"primary.600"}
                value={sportIds}
                options={sportsData}
                onChange={(value) => {
                  setSportIds(value);
                }}
              />
              {/* </VStack> */}
            </Box>
            <Box w={["120px", "210px"]}>
              <VStack align="flex-start" spacing={2}>
                <HeadingXtraSmall color="#3182CE">
                  Participant Category
                </HeadingXtraSmall>
                <Select
                  onChange={(e) => setParticipantCategory(e.target.value)}
                  fontSize="sm"
                  placeholder={"Select Participant Category"}
                  colorScheme={"primary.600"}
                  maxW="xs"
                  value={participantCategory}
                >
                  {participantCategories?.map((category) => (
                    <option
                      key={category["category_id"]}
                      value={category["category_id"]}
                    >
                      {category["category_name"]}
                    </option>
                  ))}
                </Select>
              </VStack>
            </Box>
          </VStack>

          <VStack align="flex-start" spacing={2}>
            <HeadingXtraSmall color="#3182CE">Custom Date</HeadingXtraSmall>
            <HStack spacing={2} pt={1}>
              <VStack w="70%">
                <ReactDatePicker
                  dateFormat="dd/MM/yyyy"
                  customInput={<DatePickerInput />}
                  placeholderText="Start Date"
                  name="start Date"
                  selected={startDate}
                  onChange={(val) => setStartDate(val)}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
                <ReactDatePicker
                  dateFormat="dd/MM/yyyy"
                  customInput={<DatePickerInput />}
                  placeholderText="End Date"
                  name="end Date"
                  selected={endDate}
                  onChange={(val) => setEndDate(val)}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
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
        </VStack>

        <Stack w="full" spacing={0} gap={5}>
          <VStack display={{ md: "none" }} spacing={5}>
            <HStack spacing={10}>
              <HStack>
                <HeadingSmall>My Events</HeadingSmall>
                <Checkbox
                  size="md"
                  colorScheme="primary"
                  defaultValue={null}
                  // value={userData.user_id}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setUserId(isChecked ? userData.user_id : null);
                  }}
                />
              </HStack>
              <HStack>
                <HeadingSmall>Show Past Events</HeadingSmall>
                <Checkbox
                  size="md"
                  colorScheme="primary"
                  value={isPast}
                  onChange={(e) => setIsPast(e.target.checked)}
                />
              </HStack>
            </HStack>
            <HStack spacing={5}>
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
                w="full"
                maxW={{ sm: "2xs" }}
              />
              <ResponsiveFilter
                sportsData={sportsData}
                setSportIds={setSportIds}
                participantCategories={participantCategories}
                setParticipantCategory={setParticipantCategory}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                DatePickerInput={DatePickerInput}
              />
            </HStack>
          </VStack>

          {isLoading ? (
            <HStack>
              <SearchBlueIcon />
              <TextSmall>Fetching..</TextSmall>
            </HStack>
          ) : null}

          <Skeleton isLoaded={!isLoading}>
            {isSuccess && (
              <SimpleGrid columns={[1, 2, 2, 2, 3]} rowGap={4} columnGap={4}>
                {EventListData?.pages?.map((page) => {
                  if (page) {
                    return page?.map((eventData, index) => {
                      return (
                        <PageEventCard key={index} eventData={eventData} />
                      );
                    });
                  }
                })}
              </SimpleGrid>
            )}

            {!areEventsPresent && <TextMedium>No events to display</TextMedium>}

            <span ref={loadMoreRef} />
            {isFetchingNextPage && (
              <CircularProgress
                alignSelf="center"
                isIndeterminate
                size="28px"
              />
            )}
          </Skeleton>
        </Stack>
      </HStack>
    </Box>
  );
}

export default PublishedEventsList;
