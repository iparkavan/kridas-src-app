import axios, { axiosEvents } from "../utils/axios";
import { objToFormData, objToFormDataSet } from "../helper/form-data";
import helper from "../helper/helper";

class EventService {
  async CreateEvent(data) {
    const { pageId, ...values } = data;
    let formData = new FormData();
    formData = objToFormData(values, formData);

    const res = await axios.post("/events", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }

  async createVenue(data) {
    // let formData = new FormData();
    // formData = objToFormData({ data }, formData);
    const res = await axios.post("/teams/createVenue", data);
    return res.data;
  }

  async createEventNew({ coverImage, profileImage, ...data }) {
    let formData = new FormData();
    formData = objToFormData({ events: data }, formData);
    if (coverImage instanceof File) {
      formData.append("imageBanner", coverImage);
    }
    if (profileImage instanceof File) {
      formData.append("imageLogo", profileImage);
    }

    const res = await axiosEvents.post("/events/addEvent", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  }

  async createEventFeed(values) {
    let formData = new FormData();
    const { eventData, hashTags, mentions, type, id, pics, videos, feedData } =
      values;

    if (eventData?.event_id) {
      formData.append("event_id", eventData.event_id);
    }
    if (eventData?.event_banner) {
      formData.append("event_banner", eventData.event_banner);
    }
    if (eventData?.event_logo) {
      formData.append("event_logo", eventData.event_logo);
    }

    formData.append("event_name", eventData?.event_name);
    formData.append("event_desc", JSON.stringify(eventData?.event_desc));
    formData.append("event_rules", JSON.stringify(eventData?.event_rules));
    formData.append(
      "event_startdate",
      JSON.stringify(eventData?.event_startdate)
      // helper.getJSDateObject(eventData?.event_startdate)
    );
    formData.append(
      "event_enddate",
      JSON.stringify(eventData?.event_enddate)
      // helper.getJSDateObject(eventData?.event_enddate)
    );
    formData.append(
      "event_reg_startdate",
      JSON.stringify(eventData?.event_reg_startdate)
      // helper.getJSDateObject(eventData?.event_startdate)
    );
    formData.append(
      "event_reg_lastdate",
      JSON.stringify(eventData?.event_reg_lastdate)
      // helper.getJSDateObject(eventData?.event_enddate)
    );
    formData.append("sports_list", JSON.stringify(eventData?.sports_list));
    formData.append("event_doc", JSON.stringify(eventData?.event_doc));
    formData.append(
      "event_contacts",
      JSON.stringify(eventData?.event_contacts)
    );
    formData.append("event_status", "PUB");
    formData.append("company_id", eventData?.pageId);
    if (eventData?.event_venue_other) {
      formData.append(
        "event_venue_other",
        JSON.stringify(eventData?.event_venue_other)
      );
    }
    if (eventData?.virtual_venue_url) {
      formData.append("virtual_venue_url", eventData?.virtual_venue_url);
    }
    formData.append("event_category", eventData?.event_category);

    let feedObj = {};
    const feed = {};
    feed["feed_content"] = feedData;
    feed[`feed_creator_${type}_id`] = eventData.pageId;
    feed["share_count"] = 0;
    feed["like_count"] = 0;
    feed["feed_type"] = "E";
    feedObj["hashTags"] = hashTags?.map((hash) => hash.hashtag);
    feedObj["tags"] = mentions;
    feedObj["image"] = pics;
    feedObj["video"] = videos;
    feedObj = { feed, ...feedObj };
    formData.append("feed", JSON.stringify(feedObj));

    const res = await axios.post("/events/publishEvent", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }

  async getEventById(eventId, userId) {
    let url = `/events/get/${eventId}`;
    if (userId) {
      url += `?user_id=${userId}`;
    }
    const res = await axios.get(url);
    return res.data.data;
  }

  async getEventByIdNew(eventId) {
    // console.log(eventId, "eventid from service");
    const res = await axiosEvents.get(`/events/${eventId}`);
    return res.data;
  }

  async getEventByIdJava(eventId, userId) {
    let url = `/events/${eventId}`;
    if (userId) {
      url += `?user_id=${userId}`;
    }
    const res = await axiosEvents.get(url);
    return res.data;
  }

  async updateEvent(data) {
    let formData = new FormData();
    formData = objToFormData({ ...data }, formData);
    return axios.put(`/events`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async updateEventNew({ coverImage, profileImage, ...data }, eventId) {
    let formData = new FormData();
    formData = objToFormData({ events: data }, formData);
    if (coverImage instanceof File) {
      formData.append("imageBanner", coverImage);
    }
    if (profileImage instanceof File) {
      formData.append("imageLogo", profileImage);
    }
    return axiosEvents.put(`/events/updateEvent/${eventId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async updateEventVenueNew(data, eventid) {
    return axiosEvents.put(`/events/updateEventVenues/${eventid}`, data);
  }

  async updateEventTournament(data) {
    return axiosEvents.put(
      `/events/updateEventCategories/${data.eventId}`,
      data
    );
  }

  async getInfiniteEvents({
    pageParam = 0,
    eventName,
    eventType,
    startDate,
    endDate,
    sportIds,
    isPast,
  }) {
    const size = 8;
    const res = await axios.post("/events/search", {
      page: pageParam,
      size,
      sort: "asc",
      event_name: eventName,
      type: eventType,
      start_date: startDate,
      end_date: endDate,
      sport_ids: sportIds,
      is_past: isPast,
    });
    return res.data;
  }

  async getInfiniteUserEvents({
    pageParam = 0,
    userId,
    eventName,
    eventType,
    startDate,
    endDate,
    sportIds,
    isPast,
  }) {
    const size = 8;
    const res = await axios.post("/events/customSearch", {
      page: pageParam,
      size,
      event_status: "PUB",
      user_id: userId,
      event_name: eventName,
      type: eventType,
      start_date: startDate,
      end_date: endDate,
      sort: "asc",
      is_past: isPast,
      sport_ids: sportIds,
    });
    return res.data;
  }

  async getInfiniteEventsByCompanyId({
    pageParam = 0,
    company_id,
    eventName = "",
  }) {
    const size = 5;
    const res = await axios.post("/events/searchCompany", {
      page: pageParam,
      size,
      company_id,
      event_name: eventName,
      sort: "asc",
    });
    return res.data;
  }

  async getInfiniteParticipatedEvents({ pageParam = 0, data }) {
    const size = 5;
    const res = await axios.post("/events/searchParticipated", {
      page: pageParam,
      size,
      company_id: data.pageId,
      type: data.pageType,
      sort: "ASC",
    });
    return res.data;
  }

  async getEventFollowerById(eventId) {
    const response = await axios.get(`/events/getEventData/${eventId}`);
    return response.data;
  }

  async getInfiniteEventMedia({ pageParam = 0, eventId, resource_type }) {
    const size = 5;
    const res = await axios.post("/media/getByEventId", {
      page: pageParam,
      size,
      event_id: eventId,
      type: resource_type,
    });
    return res.data;
  }

  async getSearchEvents(pageParams, eventFilter) {
    const { limit } = eventFilter;
    const offSet = pageParams * limit;
    const res = await axiosEvents.post("events/searchEvents", {
      ...pageParams,
      ...eventFilter,
      offSet,
      limit,
    });
    return res.data;
  }

  async getEventSponsorsById(eventId) {
    const res = await axios.get(`/event-sponsor/getByEventId/${eventId}`);
    return res.data.data;
  }

  async getPointsByCategoryId(categoryId) {
    const res = await axiosEvents.get(`/tournament/groups/${categoryId}`);
    return res.data;
  }

  async getEventPrizeByType(type) {
    const res = await axios.get(`/category/getByParentType/${type}`);
    return res.data.data;
  }

  async uploadDocument(data) {
    const res = await axios.post("/cloudinary/docs", data);
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }

  async getEventMatches(tournamentCategoryId) {
    const res = await axiosEvents.get(
      `/tournament/matches/${tournamentCategoryId}`
    );
    return res.data;
  }
}

export default new EventService();
