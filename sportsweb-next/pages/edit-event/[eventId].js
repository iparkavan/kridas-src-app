import { Skeleton, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import UserLayout from "../../src/components/layout/user-layout/user-layout";
// import PageEventAboutEdit from "../../src/components/pages/page-event-about/page-event-about-edit";
import PageEventCreateNew from "../../src/components/pages/page-event/page-event-create-new";
import { useEventById } from "../../src/hooks/event-hook";
import { useUser } from "../../src/hooks/user-hooks";

const EventEdit = () => {
  const router = useRouter();
  const { eventId } = router.query;
  const { data: eventData, isLoading } = useEventById(eventId);
  // console.log(eventData, "event data from index render");
  const { data: userData = {} } = useUser();

  const currentEvent = userData["user_id"] === eventData?.created_by;

  return (
    <UserLayout>
      {isLoading ? (
        <Skeleton minH={"100vh"}></Skeleton>
      ) : (
        // <UserPageEdit pageData={pageData} />
        // <PageEventAboutEdit
        //   currentEvent={currentEvent}
        //   eventData={eventData}
        //   // setShowText={setShowText}
        // />
        <PageEventCreateNew type="edit" />
      )}
    </UserLayout>
  );
};

export default EventEdit;
