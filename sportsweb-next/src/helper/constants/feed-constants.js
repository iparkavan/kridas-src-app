export const feedOptions = {
  entityStyleFn: (entity) => {
    const entityType = entity.get("type");
    if (entityType === "draft-js-video-plugin-video") {
      const data = entity.getData();
      return {
        element: "video",
        attributes: {
          src: data.src,
          controls: true,
        },
      };
    } else if (entityType === "mention") {
      const data = entity.getData();
      let href;
      if (data.mention.type === "U") {
        href = `/user/profile/${data.mention.id}`;
      } else if (data.mention.type === "C") {
        href = `/page/${data.mention.id}`;
      } else {
        href = `/events/${data.mention.id}`;
      }

      return {
        element: "a",
        attributes: {
          href: href,
        },
        style: {
          color: "var(--chakra-colors-primary-500)",
        },
      };
    } else if (entityType === "LINK") {
      const data = entity.getData();
      return {
        element: "a",
        attributes: {
          href: data.url,
        },
        style: {
          color: "var(--chakra-colors-primary-500)",
        },
      };
    }
  },
};

export const getFeedCaption = (feed) => {
  const { feed_share, feed_type, search_tags } = feed;
  if (feed_share) {
    switch (feed_share["feed_type"]) {
      case "AR":
        return " shared an article";
      case "E":
        return " shared an event";
      default:
        return " shared a post";
    }
  } else {
    switch (feed_type) {
      case "AR":
        return " published an article";
      case "E":
        return " published an event";
      case "EU":
        return " updated an event";
      case "AL":
        const albumName = search_tags?.[0] ? `- ${search_tags[0]}` : "";
        return ` added photos to the album ${albumName}`;
    }
  }
};
