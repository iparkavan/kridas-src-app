import { useEffect, useState } from "react";
import UserLayout from "../layout/user-layout/user-layout";
import { useUser } from "../../hooks/user-hooks";
import { VStack } from "@chakra-ui/react";
import BreadcrumbList from "../ui/breadcrumb/breadcrumb-list";
import routes from "../../helper/constants/route-constants";
import { useEvents, useUserEvents } from "../../hooks/event-hook";
import PublishedEventsList from "./user-events/all-events-list";

const UserEvents = () => {
  const { data: userData = {} } = useUser();
  // const { data: events = [] } = useEvents();

  // const [userEventsCount, setUserEventsCount] = useState();
  // const [allEventsCount, setAllEventsCount] = useState();

  // useEffect(() => {
  //   const initialUserEventsCount =
  //     userEvents?.pages && userEvents?.pages[0]?.totalCount;
  //   setUserEventsCount(initialUserEventsCount);
  // }, [userEvents?.pages]);

  // const selectedTab = {
  //   borderBottom: "solid",
  //   borderColor: "primary.500",
  //   color: "white",
  //   bg: "#3182CE",
  //   borderRadius: "5px",
  // };

  // const allEventsCount = events?.pages && events?.pages[0]?.totalCount;
  // const userEventsCount = userEvents?.pages && userEvents?.pages[0]?.totalCount;

  return (
    <UserLayout>
      <VStack alignItems="flex-start" gap={3}>
        <BreadcrumbList
          rootRoute={routes.profile(userData["user_name"])}
          rootPageName={userData["full_name"]}
          currentPageName="Events"
        />

        {/* <Tabs
          isLazy
          w="full"
          bgColor="white"
          borderRadius={10}
          p={3}
          defaultIndex={1}
        >
          <TabList mb="1em" gap={[2, 6, 12]}>
            <Tab
              w="max-content"
              fontWeight="500"
              color="#515365"
              fontSize="16"
              _selected={selectedTab}
              _focus={{ boxShadow: "none" }}
            >
              My Events {Boolean(userEventsCount) && `(${userEventsCount})`}
            </Tab>
            <Tab
              w="max-content"
              fontWeight="500"
              color="#515365"
              fontSize="16"
              _selected={selectedTab}
              _focus={{ boxShadow: "none" }}
            >
              All Events {Boolean(allEventsCount) && `(${allEventsCount})`}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={2}>
              <UserEventList setUserEventsCount={setUserEventsCount} />
            </TabPanel>
            <TabPanel p={2}>
              <PublishedEventsList setAllEventsCount={setAllEventsCount} />
            </TabPanel>
          </TabPanels>
        </Tabs> */}
      </VStack>
      <PublishedEventsList />
    </UserLayout>
  );
};

export default UserEvents;
