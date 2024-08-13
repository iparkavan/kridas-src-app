import { HStack } from "@chakra-ui/react";
import { TextMedium } from "../../ui/text/text";
import UserCard from "../../common/follow-card";
// import PageEventCard from "../../pages/page-event/page-event-card";

const UserFollowingSpecificList = (props) => {
  const { userFollowingData, type } = props;
  return (
    <HStack wrap="wrap" justifyContent={{ base: "center", md: "flex-start" }}>
      {userFollowingData?.length !== 0 ? (
        userFollowingData?.map((following) =>
          type === "event" ? (
            // <PageEventCard
            //   eventStartDate={following["event_startdate"]}
            //   eventEndDate={following["event_enddate"]}
            //   eventName={following["name"]}
            //   eventSportsList={following["sport_details"]}
            //   cardType="followers"
            //   eventBanner={following["banner"]}
            //   eventId={following["id"]}
            //   eventCategoryName={following["category_name"]}
            // />
            <UserCard key={following.id} cardData={following} />
          ) : (
            <UserCard key={following.id} cardData={following} />
          )
        )
      ) : (
        <TextMedium>No Following to display</TextMedium>
      )}
    </HStack>
  );
};

export default UserFollowingSpecificList;
