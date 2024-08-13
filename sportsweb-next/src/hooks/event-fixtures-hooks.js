import { useQuery } from "react-query";
import eventFixturesService from "../services/event-fixtures-service";

const useFixturesByEventId = (data) => {
  return useQuery(["event-fixtures", data.event_id], () =>
    eventFixturesService.getFixturesByEventId(data)
  );
};

export { useFixturesByEventId };
