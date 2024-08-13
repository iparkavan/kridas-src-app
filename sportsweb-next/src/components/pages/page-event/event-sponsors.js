import {
  Box,
  Divider,
  Flex,
  HStack,
  Image,
  VStack,
  Link,
} from "@chakra-ui/react";
import { HeadingSmall, HeadingXtraSmall } from "../../ui/heading/heading";
import EmptyContentDisplay from "../../common/empty-content/empty-content-display";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";

const EventSponsors = ({ eventSponsors }) => {
  const featuredSponsors = eventSponsors?.filter(({ is_featured }) => {
    return is_featured;
  });
  const otherSponsors = eventSponsors?.filter(({ is_featured }) => {
    return !is_featured;
  });
  const { data: sponsorTypes = [] } = useLookupTable("SPT");
  return (
    <Flex direction={"column"} gap={5}>
      {!featuredSponsors && !otherSponsors && (
        <EmptyContentDisplay displayText="No Sponsors to Display" />
      )}
      {featuredSponsors && (
        <VStack spacing={3} p={3}>
          <HeadingSmall color="#8c8c8c" letterSpacing={"2px"}>
            {"FEATURED SPONSORS"}
          </HeadingSmall>
          <HStack flexWrap={"wrap"} spacing={6}>
            {featuredSponsors?.map(
              ({
                sponsor_media_url,
                event_sponsor_id,
                sponsor_type,
                sponsor_click_url,
              }) => (
                <Link
                  href={sponsor_click_url}
                  isExternal
                  key={event_sponsor_id}
                >
                  <Box
                    borderTopRightRadius={10}
                    borderTopLeftRadius={10}
                    w="350px"
                    h="220px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    backgroundImage={"url(" + sponsor_media_url + ")"}
                    backgroundPosition="center"
                    backgroundRepeat="no-repeat"
                    backgroundSize="100% 100%"
                    cursor={"pointer"}
                  ></Box>
                </Link>
              )
            )}
          </HStack>
        </VStack>
      )}
      {otherSponsors && (
        <Flex
          align={"flex-start"}
          justify={"center"}
          gap={6}
          w="full"
          flexWrap={"wrap"}
        >
          {otherSponsors?.map(
            ({
              sponsor_type,
              event_sponsor_id,
              sponsor_media_url,
              sponsor_click_url,
            }) => {
              return (
                <HStack key={event_sponsor_id}>
                  <VStack p={3} spacing={3}>
                    <HeadingXtraSmall color="#8c8c8c" letterSpacing={"2px"}>
                      {sponsorTypes
                        ?.find(({ lookup_key }) => lookup_key === sponsor_type)
                        ?.lookup_value.toUpperCase()}
                    </HeadingXtraSmall>
                    <Link href={sponsor_click_url} isExternal>
                      <Box
                        borderTopRightRadius={10}
                        borderTopLeftRadius={10}
                        w="275px"
                        h="200px"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        backgroundImage={"url(" + sponsor_media_url + ")"}
                        backgroundPosition="center"
                        backgroundRepeat="no-repeat"
                        backgroundSize="100% 100%"
                        cursor="pointer"
                      ></Box>
                    </Link>
                  </VStack>
                  <Box
                    style={{
                      borderLeft: "2px solid black",
                      width: "5px",
                      height: "100%",
                    }}
                  ></Box>
                </HStack>
              );
            }
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default EventSponsors;
