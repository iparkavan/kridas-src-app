import { Box, Image } from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useEventSponsors } from "../../hooks/event-hook";
import { HeadingSmall } from "../ui/heading/heading";

const EventSponsorsCarousel = ({ eventId }) => {
  const { data: eventSponsors } = useEventSponsors(eventId);

  const featuredSponsors = eventSponsors?.filter(
    (sponsor) => sponsor["event_sponsor"]["is_featured"]
  );

  if (featuredSponsors?.length > 0) {
    return (
      <Box p={4} bg="white" borderRadius="10px">
        <HeadingSmall mb={2}>Featured Sponsors</HeadingSmall>
        <Carousel
          showStatus={false}
          infiniteLoop={true}
          showThumbs={false}
          autoPlay={true}
          stopOnHover={false}
        >
          {featuredSponsors?.map((sponsor) => (
            <Image
              key={sponsor?.["sponsor"]["sponsor_id"]}
              src={sponsor?.["sponsor"]["sponsor_media_url"]}
              alt={sponsor?.["sponsor"]["sponsor_name"]}
              objectFit="cover"
              maxH="200px !important"
            />
          ))}
        </Carousel>
      </Box>
    );
  }

  return null;
};

export default EventSponsorsCarousel;
