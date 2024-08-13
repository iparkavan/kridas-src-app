import { Image, Skeleton, Stack } from "@chakra-ui/react";
import { useFixturesByEventId } from "../../hooks/event-fixtures-hooks";
import PointsTableView from "./points-table/points-table-view";

const EventStandings = (props) => {
  const { eventData, sports, currentEvent } = props;

  const { data: eventStandingsData, isLoading } = useFixturesByEventId({
    event_id: eventData.eventId,
    image_type: "S",
  });

  const areStandingsPhotosPresent = Boolean(eventStandingsData?.length > 0);

  if (isLoading) {
    return <Skeleton h="24px" />;
  }

  if (areStandingsPhotosPresent) {
    return (
      <Stack spacing={7} alignItems="flex-start">
        {eventStandingsData.map((standing, i) => (
          <Image
            key={standing.event_fixtures_id}
            src={standing.image_url}
            alt={`Standing ${i}`}
          />
        ))}
      </Stack>
    );
  }

  return (
    <PointsTableView
      currentEvent={currentEvent}
      eventData={eventData}
      sports={sports}
    />
  );
};

export default EventStandings;
