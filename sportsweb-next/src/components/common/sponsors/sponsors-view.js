import { Box, VStack, Stack, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { HeadingSmall } from "../../ui/heading/heading";
import EmptyContentDisplay from "../../common/empty-content/empty-content-display";

const SponsorsView = (props) => {
  const { sponsors, isCreator, type } = props;

  // const featuredSponsors = sponsors?.filter(
  //   (sponsor) => sponsor[`${type}_sponsor`]["is_featured"]
  // );

  const sponsorTypes = sponsors?.reduce((arr, s) => {
    if (
      !arr.find(
        (val) =>
          val[`${type}_sponsor_type_id`] ===
          s[`${type}_sponsor_type`][`${type}_sponsor_type_id`]
      )
      // && !s[`${type}_sponsor`]["is_featured"]
    ) {
      arr.push(s[`${type}_sponsor_type`]);
    }
    return arr;
  }, []);

  if (Boolean(!sponsors?.length)) {
    return (
      <EmptyContentDisplay
        p={0}
        mt={isCreator && 5}
        displayText="No Sponsors to display"
      />
    );
  }

  return (
    <VStack>
      {/* {featuredSponsors?.length > 0 && (
        <Box>
          <HeadingSmall
            color="gray.500"
            letterSpacing="2px"
            textTransform="uppercase"
            textAlign="center"
            my={7}
          >
            FEATURED SPONSORS
          </HeadingSmall>
          <Stack
            direction={{ base: "column", md: "row" }}
            flexWrap="wrap"
            justifyContent="center"
          >
            {featuredSponsors
              // .sort(
              //   (featuredSponsor1, featuredSponsor2) =>
              //     featuredSponsor1["company_sponsor"]["seq_number"] -
              //     featuredSponsor2["company_sponsor"]["seq_number"]
              // )
              .map((featuredSponsor) => (
                <LinkBox key={featuredSponsor["sponsor"]["sponsor_id"]}>
                  <LinkOverlay
                    href={featuredSponsor["sponsor"]["sponsor_click_url"]}
                    isExternal
                  >
                    <Box
                      w="275px"
                      h="200px"
                      backgroundImage={
                        "url(" +
                        featuredSponsor["sponsor"]["sponsor_media_url"] +
                        ")"
                      }
                      backgroundPosition="center"
                      backgroundRepeat="no-repeat"
                      backgroundSize="100% 100%"
                      cursor="pointer"
                    />
                  </LinkOverlay>
                  <HeadingSmall
                    color="gray.500"
                    letterSpacing="2px"
                    textTransform="uppercase"
                    textAlign="center"
                    mt={3}
                  >
                    {featuredSponsor["sponsor"]["sponsor_name"]}
                  </HeadingSmall>
                </LinkBox>
              ))}
          </Stack>
        </Box>
      )} */}

      {sponsorTypes.map((sponsorType) => (
        <Box key={sponsorType[`${type}_sponsor_type_id`]}>
          <HeadingSmall
            color="gray.500"
            letterSpacing="2px"
            textTransform="uppercase"
            textAlign="center"
            my={7}
          >
            {sponsorType[`${type}_sponsor_type_name`]}
          </HeadingSmall>
          <Stack
            direction={{ base: "column", md: "row" }}
            flexWrap="wrap"
            justifyContent="center"
          >
            {sponsors
              ?.filter(
                (sponsor) =>
                  sponsor[`${type}_sponsor`]["sponsor_type_id"] ===
                  sponsorType[`${type}_sponsor_type_id`]
                // && !sponsor[`${type}_sponsor`]["is_featured"]
              )
              .sort(
                (sponsor1, sponsor2) =>
                  sponsor1[`${type}_sponsor`]["seq_number"] -
                  sponsor2[`${type}_sponsor`]["seq_number"]
              )
              .map((sponsor) => (
                <LinkBox key={sponsor["sponsor"]["sponsor_id"]}>
                  <LinkOverlay
                    href={sponsor["sponsor"]["sponsor_click_url"]}
                    isExternal
                  >
                    <Box
                      w="275px"
                      h="200px"
                      backgroundImage={
                        "url(" + sponsor["sponsor"]["sponsor_media_url"] + ")"
                      }
                      backgroundPosition="center"
                      backgroundRepeat="no-repeat"
                      backgroundSize="100% 100%"
                      cursor="pointer"
                    />
                  </LinkOverlay>
                  <HeadingSmall
                    color="gray.500"
                    letterSpacing="2px"
                    textTransform="uppercase"
                    textAlign="center"
                    mt={3}
                  >
                    {sponsor["sponsor"]["sponsor_name"]}
                  </HeadingSmall>
                </LinkBox>
              ))}
          </Stack>
        </Box>
      ))}
    </VStack>
  );
};

export default SponsorsView;
