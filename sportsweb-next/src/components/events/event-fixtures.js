import { Image, Skeleton, Stack } from "@chakra-ui/react";
import { useFixturesByEventId } from "../../hooks/event-fixtures-hooks";
import FixturesView from "./fixtures/fixtures-view";

const EventFixtures = (props) => {
  const { currentEvent, eventData, sports } = props;

  const { data: eventFixturesData, isLoading } = useFixturesByEventId({
    event_id: eventData.eventId,
    image_type: "F",
  });

  const areFixturePhotosPresent = Boolean(eventFixturesData?.length > 0);

  if (isLoading) {
    return <Skeleton h="24px" />;
  }

  if (areFixturePhotosPresent) {
    return (
      <Stack spacing={7} alignItems="flex-start">
        {eventFixturesData.map((fixture, i) => (
          <Image
            key={fixture.event_fixtures_id}
            src={fixture.image_url}
            alt={`Fixture ${i}`}
          />
        ))}
      </Stack>
    );
  }

  return (
    <FixturesView
      currentEvent={currentEvent}
      eventData={eventData}
      sports={sports}
    />
  );
};

export default EventFixtures;
