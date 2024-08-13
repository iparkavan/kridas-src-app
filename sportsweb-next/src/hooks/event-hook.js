import {
  useMutation,
  useQueryClient,
  useQuery,
  useInfiniteQuery,
} from "react-query";
import eventService from "../services/event-service";
import { useRouter } from "next/router";

const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return eventService.CreateEvent(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["page-event"]);
      },
    }
  );
};

const useCreateVenue = () => {
  // const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return eventService.createVenue(data);
    }
    // {
    //   onSuccess: () => {
    //     queryClient.invalidateQueries(["page-event"]);
    //   },
    // }
  );
};

const useCreateEventNew = () => {
  // const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return eventService.createEventNew(data);
    }
    // {
    //   onSuccess: () => {
    //     queryClient.invalidateQueries(["page-event"]);
    //   },
    // }
  );
};

const useUpdateEventNew = (eventId) => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return eventService.updateEventNew(data, eventId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["event", eventId]);
        queryClient.invalidateQueries(["events", eventId]);
      },
    }
  );
};

const useUpdateVenueNew = (eventid) => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return eventService.updateEventVenueNew(data, eventid);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["event", eventid]);
        queryClient.invalidateQueries(["events", eventid]);
      },
    }
  );
};

const useUpdateTournament = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return eventService.updateEventTournament(data);
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["event", variables.eventId]);
        queryClient.invalidateQueries(["events", variables.eventId]);
      },
    }
  );
};

const useCreateEventFeed = () => {
  return useMutation((data) => eventService.createEventFeed(data));
};

const useEventById = (eventId, userId) => {
  return useQuery(
    ["events", eventId],
    () => eventService.getEventById(eventId, userId),
    {
      enabled: !!eventId,
    }
  );
};

const useEventByIdNew = (eventId) => {
  // console.log(eventId, "eventid from hook");
  return useQuery(
    ["event", eventId],
    () => eventService.getEventByIdNew(eventId),
    {
      enabled: !!eventId,
    }
  );
};

const useEventByIdJava = (eventId, userId) => {
  return useQuery(
    ["event", eventId],
    () => eventService.getEventByIdJava(eventId, userId),
    {
      enabled: !!eventId,
    }
  );
};

const useTablePoint = (categoryId) => {
  return useQuery(
    ["point", categoryId],
    () => eventService.getPointsByCategoryId(categoryId),
    {
      enabled: !!categoryId,
    }
  );
};

const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { eventId } = router.query;
  return useMutation(
    (data) => {
      return eventService.updateEvent(data);
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["events", variables.event_id]);
      },
    }
  );
};

const useEventSearch = (eventFilter) => {
  const { limit } = eventFilter;
  return useInfiniteQuery(
    ["event-search", eventFilter],
    ({ pageParam = 0 }) => eventService.getSearchEvents(pageParam, eventFilter),
    {
      getNextPageParam: (lastPage, pages) => {
        const isNextPagePresent = lastPage.length < limit;
        return isNextPagePresent ? undefined : pages.length;
      },
    }
  );
};

const useEvents = (
  eventName,
  eventType,
  startDate = null,
  endDate = null,
  sportIds,
  isPast
) => {
  return useInfiniteQuery(
    ["all-events", eventName, eventType, startDate, endDate, sportIds, isPast],
    (params) =>
      eventService.getInfiniteEvents({
        ...params,
        eventName,
        eventType,
        startDate,
        endDate,
        sportIds,
        isPast,
      }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
    }
  );
};

const useUserEvents = (
  userId,
  eventName,
  eventType,
  startDate = null,
  endDate = null,
  sportIds,
  isPast
) => {
  return useInfiniteQuery(
    [
      "user-events",
      userId,
      eventName,
      eventType,
      startDate,
      endDate,
      sportIds,
      isPast,
    ],
    (params) =>
      eventService.getInfiniteUserEvents({
        ...params,
        userId,
        eventName,
        eventType,
        startDate,
        endDate,
        sportIds,
        isPast,
      }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
      enabled: !!userId,
    }
  );
};

const useEventsByCompanyId = (company_id, eventName) => {
  return useInfiniteQuery(
    ["page-events", company_id, eventName],
    (params) =>
      eventService.getInfiniteEventsByCompanyId({
        ...params,
        company_id,
        eventName,
      }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
      enabled: !!company_id,
    }
  );
};

const useParticipatedEvents = (data) => {
  return useInfiniteQuery(
    ["participated-events", data.pageId],
    (params) =>
      eventService.getInfiniteParticipatedEvents({
        ...params,
        data,
      }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
      enabled: !!data.pageId,
    }
  );
};

const useEventFollowersData = (eventId) => {
  return useQuery(["event-follower", eventId], () =>
    eventService.getEventFollowerById(eventId)
  );
};

const useEventPrize = (type) => {
  return useQuery(["event-prize", type], () =>
    eventService.getEventPrizeByType(type)
  );
};

const useInfiniteEventPhoto = (eventId, resource_type = "I") => {
  return useInfiniteQuery(
    ["event-photo", eventId],
    (params) =>
      eventService.getInfiniteEventMedia({ ...params, eventId, resource_type }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
      enabled: !!eventId,
    }
  );
};

const useInfiniteEventVideo = (eventId, resource_type = "V") => {
  return useInfiniteQuery(
    ["event-video", eventId],
    (params) =>
      eventService.getInfiniteEventMedia({ ...params, eventId, resource_type }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
      enabled: !!eventId,
    }
  );
};

const useEventSponsors = (eventId) => {
  return useQuery(
    ["event-sponsors", eventId],
    () => eventService.getEventSponsorsById(eventId),
    {
      enabled: !!eventId,
    }
  );
};

const useEventDocumentUpload = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return eventService.uploadDocument(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["event-document"]);
      },
    }
  );
};

const useEventMatches = (tournamentCategoryId) => {
  return useQuery(
    ["event-matches", tournamentCategoryId],
    () => eventService.getEventMatches(tournamentCategoryId),
    {
      enabled: !!tournamentCategoryId,
    }
  );
};

export {
  useCreateEvent,
  useEventById,
  useUpdateEvent,
  useEvents,
  useUserEvents,
  useEventsByCompanyId,
  useParticipatedEvents,
  useEventFollowersData,
  useInfiniteEventVideo,
  useInfiniteEventPhoto,
  useCreateEventFeed,
  useEventSponsors,
  useEventPrize,
  useEventDocumentUpload,
  useCreateEventNew,
  useEventByIdNew,
  useUpdateEventNew,
  useUpdateVenueNew,
  useCreateVenue,
  useUpdateTournament,
  useEventByIdJava,
  useEventMatches,
  useTablePoint,
  useEventSearch,
};
